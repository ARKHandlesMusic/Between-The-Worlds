import React from 'react';
import type { LyricLine, WordTiming } from '../../data/lyrics';
import { useClock } from '../../lib/clock';
import { ramp } from '../../lib/ramp';
import { COLORS } from '../../lib/tokens';
import { fontFamilyInter } from '../../lib/fonts';

export const WordRise: React.FC<{
  line: LyricLine;
  words: WordTiming[];
}> = ({ line, words }) => {
  const { sec } = useClock();

  // 8-frame fade out at endSec
  const exitDuration = 8 / 30;
  const lineOpacity =
    sec >= line.endSec ? Math.max(0, 1 - ramp(sec, line.endSec, exitDuration)) : 1;

  if (lineOpacity <= 0) return null;

  // 128 BPM Kick groove bounce
  const beatPhase = ((sec - line.startSec) % 0.46875) / 0.46875;
  const kickPulse = Math.pow(Math.max(0, 1 - beatPhase * 3.2), 2.2);

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        columnGap: '0.4em',
        rowGap: '0.2em',
        fontFamily: fontFamilyInter,
        fontWeight: 650,
        fontSize: 68,
        lineHeight: 1.15,
        letterSpacing: '-0.02em',
        color: COLORS.text,
        opacity: lineOpacity,
        textAlign: 'center',
        maxWidth: 1680,
        transform: `scale(${1 + kickPulse * 0.025})`,
        transformOrigin: 'center center',
      }}
    >
      {words.map((w, i) => {
        // 6-frame entrance
        const enterProgress = ramp(sec, w.startSec, 6 / 30);
        const y = (1 - enterProgress) * 6;
        const isActive = sec >= w.startSec && sec < w.endSec;
        const hasPassed = sec >= w.endSec;

        const wordScale = isActive ? 1.18 : 1.0;
        const opacity = isActive ? 1.0 : hasPassed ? 0.85 : enterProgress * 0.55;

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity,
              transform: `translateY(${y}px) scale(${wordScale})`,
              transformOrigin: 'center bottom',
              color: isActive ? COLORS.orange : hasPassed ? COLORS.text : `${COLORS.text}aa`,
              fontWeight: isActive ? 800 : 600,
              textShadow: isActive
                ? `0 0 24px ${COLORS.orange}, 0 0 48px ${COLORS.orange}88`
                : hasPassed
                ? `0 2px 8px rgba(0,0,0,0.4)`
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
