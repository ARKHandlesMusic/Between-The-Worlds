import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { parseLrc } from '../src/lib/lrc';

describe('parseLrc', () => {
  const lrcPath = path.resolve(__dirname, '../public/song.lrc');
  const src = fs.readFileSync(lrcPath, 'utf-8');
  const cues = parseLrc(src);

  it('first cue is 7.75 with text (Can you hear it?)', () => {
    expect(cues[0]).toBeDefined();
    expect(cues[0].sec).toBeCloseTo(7.75, 2);
    expect(cues[0].text).toBe('(Can you hear it?)');
  });

  it('last cue is 228.52 with text (You heard it.)', () => {
    const last = cues[cues.length - 1];
    expect(last).toBeDefined();
    expect(last.sec).toBeCloseTo(228.52, 2);
    expect(last.text).toBe('(You heard it.)');
  });

  it('times are strictly increasing', () => {
    for (let i = 1; i < cues.length; i++) {
      expect(cues[i].sec).toBeGreaterThan(cues[i - 1].sec);
    }
  });
});
