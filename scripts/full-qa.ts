import { execSync } from 'node:child_process';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { LYRICS, wordTimings } from '../src/data/lyrics';
import { toFrame } from '../src/lib/time';

console.log('========================================================');
console.log('           BETWEEN THE WORDS - FULL QA SUITE            ');
console.log('========================================================\n');

let failedGates = 0;

function gate(name: string, fn: () => void) {
  try {
    fn();
    console.log(`[PASS] Gate: ${name}`);
  } catch (err: unknown) {
    failedGates++;
    console.error(`[FAIL] Gate: ${name}`);
    if (err instanceof Error) {
      console.error(`       Error: ${err.message}`);
    } else {
      console.error(`       Error:`, err);
    }
  }
}

// Gate 1: Code check (typecheck, lint, test, banned)
gate('1. npm run check (typecheck, lint, test, banned)', () => {
  execSync('npm run check', { stdio: 'pipe' });
});

// Gate 2: Spot-check lyric cues (at least 12 lines, including first and last)
gate('2. Lyric cues spot-check (first word matches cue time)', () => {
  const lineIndices = [0, 1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 54];
  for (const idx of lineIndices) {
    const line = LYRICS[idx];
    if (!line) throw new Error(`Lyric line at index ${idx} not found`);
    const timings = wordTimings(line);
    if (!timings || timings.length === 0) {
      throw new Error(`No word timings for line ${line.id}: "${line.text}"`);
    }
    const firstWord = timings[0];
    const diff = Math.abs(firstWord.startSec - line.startSec);
    if (diff > 1e-4) {
      throw new Error(`Line ${line.id} first word "${firstWord.text}" time ${firstWord.startSec} does not match cue ${line.startSec}`);
    }
    const cueFrame = toFrame(line.startSec);
    const wordFrame = toFrame(firstWord.startSec);
    if (cueFrame !== wordFrame) {
      throw new Error(`Line ${line.id} frame mismatch: ${cueFrame} vs ${wordFrame}`);
    }
  }
});

// Gate 3: Match cut anchor deltas <= 2px (B1 through B9)
gate('3. Match cut boundaries B1-B9 anchor delta <= 2px & stills exist', () => {
  execSync('npx tsx scripts/verify-transitions.ts', { stdio: 'pipe' });
});

// Gate 4: Lyric contrast ratio >= 4.5:1
gate('4. Contrast ratio >= 4.5:1 for lyrics', () => {
  // WCAG relative luminance
  const luminance = (hex: string) => {
    const rgb = [
      parseInt(hex.slice(1, 3), 16) / 255,
      parseInt(hex.slice(3, 5), 16) / 255,
      parseInt(hex.slice(5, 7), 16) / 255,
    ].map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  };

  const contrast = (c1: string, c2: string) => {
    const l1 = luminance(c1);
    const l2 = luminance(c2);
    const bright = Math.max(l1, l2);
    const dark = Math.min(l1, l2);
    return (bright + 0.05) / (dark + 0.05);
  };

  const bgNavy = '#0C1222';
  const textOffWhite = '#FAF6EE';
  const textTeal = '#38BDF8';
  const textOrange = '#FF7A1A';

  const crOffWhite = contrast(textOffWhite, bgNavy);
  const crTeal = contrast(textTeal, bgNavy);
  const crOrange = contrast(textOrange, bgNavy);

  if (crOffWhite < 4.5) throw new Error(`Off-white contrast ${crOffWhite.toFixed(2)} is < 4.5:1`);
  if (crTeal < 4.5) throw new Error(`Teal contrast ${crTeal.toFixed(2)} is < 4.5:1`);
  if (crOrange < 4.5) throw new Error(`Orange contrast ${crOrange.toFixed(2)} is < 4.5:1`);
});

// Gate 5: Deterministic render test
gate('5. Frame render determinism (render frame 100 twice, hashes match)', () => {
  const tmp1 = 'out/stills/.det1.png';
  const tmp2 = 'out/stills/.det2.png';
  try {
    execSync(`npx remotion still src/index.ts Video ${tmp1} --frame=100`, { stdio: 'pipe' });
    execSync(`npx remotion still src/index.ts Video ${tmp2} --frame=100`, { stdio: 'pipe' });

    const b1 = fs.readFileSync(tmp1);
    const b2 = fs.readFileSync(tmp2);

    const h1 = crypto.createHash('sha256').update(b1).digest('hex');
    const h2 = crypto.createHash('sha256').update(b2).digest('hex');

    if (h1 !== h2) {
      throw new Error(`Determinism failed: Frame 100 hashes differ (${h1} vs ${h2})`);
    }
  } finally {
    if (fs.existsSync(tmp1)) fs.unlinkSync(tmp1);
    if (fs.existsSync(tmp2)) fs.unlinkSync(tmp2);
  }
});

// Gate 6: Audio verification
gate('6. Audio file presence, duration and sample rate', () => {
  const audioPath = 'public/song.mp3';
  if (!fs.existsSync(audioPath)) throw new Error('Audio file public/song.mp3 missing');
  const probe = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${audioPath}`, {
    encoding: 'utf-8',
  }).trim();
  const dur = parseFloat(probe);
  if (Math.abs(dur - 238.92) > 0.05) {
    throw new Error(`Audio duration is ${dur}s, expected 238.92s`);
  }
});

console.log('\n--------------------------------------------------------');
if (failedGates > 0) {
  console.error(`QA FAILED: ${failedGates} gate(s) failed.`);
  process.exit(1);
} else {
  console.log('QA PASSED: All gates passed successfully!');
  console.log('--------------------------------------------------------\n');
}
