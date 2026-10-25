import { describe, it, expect } from 'vitest';
import { toFrame, toSec, FPS } from '../src/lib/time';

describe('time conversions', () => {
  it('round trips toFrame and toSec within half a frame', () => {
    for (let sec = 0; sec <= 240; sec += 0.25) {
      const frame = toFrame(sec);
      const convertedSec = toSec(frame);
      expect(Math.abs(convertedSec - sec)).toBeLessThanOrEqual(0.5 / FPS + 1e-6);
    }
  });
});
