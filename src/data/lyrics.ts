import type { Cue } from '../lib/lrc';
import { CUES } from './cues.generated';
import { TOTAL_DURATION_SEC } from './timeline';
import { getWordOverride } from './wordOverrides';

export type LyricLine = {
  id: string;
  text: string;
  startSec: number;
  endSec: number;
  kind: 'sung' | 'whisper';
};

export function toLyricLines(cues: Cue[], endOfAudioSec: number): LyricLine[] {
  const out: LyricLine[] = [];
  cues.forEach((c, i) => {
    if (c.text === '') return;
    const next = cues[i + 1];
    out.push({
      id: `L${String(out.length + 1).padStart(2, '0')}`,
      text: c.text,
      startSec: c.sec,
      endSec: next ? next.sec : endOfAudioSec,
      kind: /^\(.*\)$/.test(c.text) ? 'whisper' : 'sung',
    });
  });
  return out;
}

export type WordTiming = { text: string; startSec: number; endSec: number };

export function wordTimings(line: LyricLine): WordTiming[] {
  const override = getWordOverride(line.text, line.startSec);
  if (override) return override;

  const words = line.text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const len = line.endSec - line.startSec;
  // Long held lines: spread the words over the first 3 s, then hold.
  const usable = Math.min(Math.max(0.3, Math.min(len * 0.85, len - 0.15)), 3.0);
  const weights = words.map((w) => Math.max(2, w.replace(/[^\p{L}\p{N}]/gu, '').length));
  const total = weights.reduce((a, b) => a + b, 0);
  let t = line.startSec;
  return words.map((w, i) => {
    const dur = total > 0 ? (usable * weights[i]) / total : usable / words.length;
    const start = t;
    t += dur;
    return { text: w, startSec: start, endSec: t };
  });
}

export const LYRICS: LyricLine[] = toLyricLines(CUES, TOTAL_DURATION_SEC);
