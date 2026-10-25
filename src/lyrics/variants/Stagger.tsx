import React from 'react';
import type { LyricLine, WordTiming } from '../../data/lyrics';
import { useClock } from '../../lib/clock';
import { ramp } from '../../lib/ramp';
import { COLORS } from '../../lib/tokens';
import { fontFamilyInter } from '../../lib/fonts';

export const Stagger: React.FC<{
  line: LyricLine;
  words: WordTiming[];
}> = ({ line, words }) => {
  const { sec } = useClock();

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
        columnGap: '0.42em',
        rowGap: '0.2em',
        fontFamily: fontFamilyInter,
        fontWeight: 700,
        fontSize: 74,
        lineHeight: 1.15,
        letterSpacing: '-0.02em',
        color: COLORS.text,
        opacity: lineOpacity,
        textAlign: 'center',
        maxWidth: 1680,
        transform: `scale(${1 + kickPulse * 0.035})`,
        transformOrigin: 'center center',
      }}
    >
      {words.map((w, i) => {
        const wordStart = line.startSec + i * (3 / 30);
        const enterProgress = ramp(sec, wordStart, 8 / 30);
        const y = (1 - enterProgress) * 14;
        const isActive = sec >= w.startSec && sec < w.endSec;
        const hasPassed = sec >= w.endSec;

        const isMaking = /making/i.test(w.text);
        let scale = isActive ? 1.24 : 1.0;
        if (isMaking && isActive) {
          scale = 1.32;
        }

        const opacity = isActive ? 1.0 : hasPassed ? 0.9 : enterProgress * 0.5;

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity,
              transform: `translateY(${y}px) scale(${scale})`,
              transformOrigin: 'center center',
              color: isActive ? COLORS.orange : hasPassed ? COLORS.text : `${COLORS.text}99`,
              fontWeight: isActive ? 850 : 700,
              textShadow: isActive
                ? `0 0 28px ${COLORS.orange}, 0 0 56px ${COLORS.orange}88`
                : hasPassed
                ? `0 2px 10px rgba(0,0,0,0.5)`
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
