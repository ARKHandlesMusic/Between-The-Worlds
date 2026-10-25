import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { TIMELINE } from '../src/data/timeline';

const sceneId = process.argv[2]?.toUpperCase();
if (!sceneId) {
  console.error('Usage: tsx scripts/wip-add-scene.ts <sceneId> (e.g. S03)');
  process.exit(1);
}

const sceneIndex = TIMELINE.findIndex((s) => s.id.toUpperCase() === sceneId);
if (sceneIndex === -1) {
  console.error(`Scene ${sceneId} not found in timeline`);
  process.exit(1);
}
const scene = TIMELINE[sceneIndex];

const beatsFile = path.resolve(__dirname, `../src/scenes/${sceneId.toLowerCase()}.beats.ts`);
let beatsDesc = '';
let beatsList: { id: string; at: number; desc: string }[] = [];
if (fs.existsSync(beatsFile)) {
  const mod = require(beatsFile);
  const obj = mod[sceneId] || mod.default;
  if (obj && obj.beats) {
    beatsList = obj.beats;
    beatsDesc = beatsList.map((b) => `- **${b.at.toFixed(2)}s (${b.id})**: ${b.desc}`).join('\n');
  }
}

// Find stills
const stillsDir = path.resolve(__dirname, '../out/stills');
const allStills = fs.existsSync(stillsDir) ? fs.readdirSync(stillsDir) : [];
const sceneStills = allStills
  .filter((f) => f.startsWith(`${sceneId}-`) && f.endsWith('.png'))
  .sort();

// Find preview video
const previewFile = path.resolve(__dirname, `../out/previews/${sceneId.toLowerCase()}.mp4`);
const hasPreview = fs.existsSync(previewFile);

const media: any[] = [];
const posterStill = sceneStills.find((s) => s.includes('-start-') || s.includes('-b1-at-')) || sceneStills[0];

if (hasPreview) {
  media.push({
    type: 'video',
    src: `/media/claude/out/previews/${sceneId.toLowerCase()}.mp4`,
    title: `${scene.name} Preview`,
    poster: posterStill ? `/media/claude/out/stills/${posterStill}` : undefined,
    songClock: true,
    offset: scene.start,
    fps: 30,
  });
}

// Attach up to 4 representative stills
const selectStills = sceneStills.filter((s) => !s.includes('plus-6')).slice(0, 4);
for (const s of selectStills) {
  media.push({
    type: 'image',
    src: `/media/claude/out/stills/${s}`,
    title: `${sceneId} Still (${s.replace(`${sceneId}-`, '').replace('.png', '')})`,
  });
}

const entryId = `${sceneId.toLowerCase()}-${scene.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;

const entry = {
  id: entryId,
  title: `${sceneId}: ${scene.name} (${scene.start.toFixed(2)}s – ${scene.end.toFixed(2)}s)`,
  summary: `Scene ${sceneIndex + 1} (${scene.name}) spanning ${scene.start.toFixed(2)}s to ${scene.end.toFixed(2)}s.`,
  tags: ['renders', sceneId.toLowerCase()],
  format: 'markdown',
  body: `## ${scene.name} Implementation Notes\n\n- **Timeline**: ${scene.start.toFixed(2)}s to ${scene.end.toFixed(2)}s (duration ${(scene.end - scene.start).toFixed(2)}s).\n\n### Key Beats\n\n${beatsDesc || 'Per-beat breakdown aligned with song cues.'}`,
  updatedAt: new Date().toISOString(),
  order: sceneIndex + 2, // after gallery & lyrics
  media,
};

const tmpPath = `/tmp/wip-${entryId}.json`;
fs.writeFileSync(tmpPath, JSON.stringify(entry, null, 2) + '\n');

// Check existing revision
const wipDir = path.resolve(__dirname, '../../wip');
let expectedArg = '';
try {
  const getOutput = execSync(`node bin/wip.mjs get --project between-the-words --id ${entryId}`, {
    cwd: wipDir,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'ignore'],
  });
  const existing = JSON.parse(getOutput);
  if (existing && existing.revision != null) {
    expectedArg = `--expected ${existing.revision}`;
  }
} catch {
  // Not found, new entry
}

console.log(`Putting entry ${entryId} into WIP...`);
execSync(`node bin/wip.mjs put --project between-the-words --file ${tmpPath} ${expectedArg}`, {
  cwd: wipDir,
  stdio: 'inherit',
});

console.log('Validating WIP catalog...');
execSync(`node bin/wip.mjs validate`, {
  cwd: wipDir,
  stdio: 'inherit',
});

console.log(`Successfully added/updated ${entryId} in WIP!`);
