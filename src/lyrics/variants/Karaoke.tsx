import React from 'react';
import { spring, useVideoConfig } from 'remotion';
import type { LyricLine, WordTiming } from '../../data/lyrics';
import { useClock } from '../../lib/clock';
import { ramp } from '../../lib/ramp';
import { toFrame } from '../../lib/time';
import { COLORS_FINAL, COLORS } from '../../lib/tokens';
import { fontFamilyInter } from '../../lib/fonts';

export const Karaoke: React.FC<{
  line: LyricLine;
  words: WordTiming[];
}> = ({ line, words }) => {
  const { sec, abs } = useClock();
  const { fps } = useVideoConfig();

  const exitDuration = 8 / 30;
  const lineExit =
    sec >= line.endSec ? ramp(sec, line.endSec, exitDuration) : 0;
  const lineOpacity = Math.max(0, 1 - lineExit);

  if (lineOpacity <= 0) return null;

  // 128 BPM Kick groove pulse
  const beatPhase = ((sec - line.startSec) % 0.46875) / 0.46875;
  const kickPulse = Math.pow(Math.max(0, 1 - beatPhase * 3.2), 2.2);

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        columnGap: '0.42em',
        rowGap: '0.2em',
        fontFamily: fontFamilyInter,
        fontWeight: 800,
        fontSize: 92,
        lineHeight: 1.15,
        letterSpacing: '-0.025em',
        color: COLORS.text,
        opacity: lineOpacity,
        textAlign: 'center',
        maxWidth: 1680,
        transform: `scale(${1 + kickPulse * 0.04})`,
        transformOrigin: 'center center',
      }}
    >
      {words.map((w, i) => {
        const hasStarted = sec >= w.startSec;
        const isActive = sec >= w.startSec && sec < w.endSec;
        const delayFrames = toFrame(w.startSec);
        const frameDiff = abs - delayFrames;

        let scale = 1;
        if (hasStarted && frameDiff >= 0 && frameDiff < 40) {
          const spr = spring({
            frame: frameDiff,
            fps,
            config: { damping: 10, stiffness: 140 },
          });
          scale = 1 + 0.22 * spr;
        } else if (isActive) {
          scale = 1.15;
        }

        const opacity = hasStarted ? 1 : 0.35;
        const color = hasStarted ? COLORS_FINAL.orange : COLORS.text;

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
              color,
              opacity,
              textShadow: hasStarted
                ? `0 0 28px ${COLORS_FINAL.orange}, 0 0 60px ${COLORS_FINAL.orange}88`
                : undefined,
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
