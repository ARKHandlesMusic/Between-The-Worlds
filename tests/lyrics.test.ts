import { describe, it, expect } from 'vitest';
import { LYRICS, wordTimings } from '../src/data/lyrics';
import { CUES } from '../src/data/cues.generated';

describe('toLyricLines', () => {
  it('count equals the number of non-blank cues', () => {
    const nonBlankCount = CUES.filter((c) => c.text.trim() !== '').length;
    expect(LYRICS.length).toBe(nonBlankCount);
  });

  it('every line has endSec > startSec', () => {
    for (const line of LYRICS) {
      expect(line.endSec).toBeGreaterThan(line.startSec);
    }
  });

  it('whisper lines are exactly those enclosed in parentheses', () => {
    for (const line of LYRICS) {
      const isParen = /^\(.*\)$/.test(line.text.trim());
      if (isParen) {
        expect(line.kind).toBe('whisper');
      } else {
        expect(line.kind).toBe('sung');
      }
    }
  });
});

describe('wordTimings', () => {
  it('every line has at least one word and times strictly increasing inside [startSec, endSec]', () => {
    for (const line of LYRICS) {
      const words = wordTimings(line);
      expect(words.length).toBeGreaterThan(0);

      for (let i = 0; i < words.length; i++) {
        expect(words[i].startSec).toBeGreaterThanOrEqual(line.startSec - 1e-6);
        expect(words[i].endSec).toBeLessThanOrEqual(line.endSec + 1e-6);
        expect(words[i].endSec).toBeGreaterThan(words[i].startSec);

        if (i > 0) {
          expect(words[i].startSec).toBeGreaterThanOrEqual(words[i - 1].endSec - 1e-6);
        }
      }
    }
  });
});
