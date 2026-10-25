import React from 'react';
import type { LyricLine, WordTiming } from '../../data/lyrics';
import { useClock } from '../../lib/clock';
import { ramp } from '../../lib/ramp';
import { COLORS } from '../../lib/tokens';
import { fontFamilyInter } from '../../lib/fonts';

export const SlowFade: React.FC<{
  line: LyricLine;
  words: WordTiming[];
}> = ({ line, words }) => {
  const { sec } = useClock();

  // 0.8s fade in, 0.8s fade out
  const enterProgress = ramp(sec, line.startSec, 0.8);
  const exitProgress = sec >= line.endSec ? ramp(sec, line.endSec, 0.8) : 0;
  const lineOpacity = Math.max(0, enterProgress - exitProgress);

  if (lineOpacity <= 0) return null;

  // Gentle floating piano drift
  const driftY = Math.sin((sec - line.startSec) * 1.5) * 4;

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
        fontWeight: 650,
        fontSize: 70,
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
        color: COLORS.text,
        opacity: lineOpacity,
        textAlign: 'center',
        maxWidth: 1680,
        transform: `translateY(${driftY}px)`,
      }}
    >
      {words.map((w, i) => {
        const isActive = sec >= w.startSec && sec < w.endSec;
        const hasPassed = sec >= w.endSec;
        const wordScale = isActive ? 1.18 : 1.0;
        const opacity = isActive ? 1.0 : hasPassed ? 0.85 : 0.65;

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              transform: `scale(${wordScale})`,
              transformOrigin: 'center center',
              color: isActive ? COLORS.orange : hasPassed ? COLORS.text : `${COLORS.text}bb`,
              opacity,
              textShadow: isActive
                ? `0 0 28px ${COLORS.orange}, 0 0 54px ${COLORS.orange}88`
                : `0 2px 12px rgba(0,0,0,0.5)`,
              fontWeight: isActive ? 800 : 650,
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
