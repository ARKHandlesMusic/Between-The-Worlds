import React from 'react';
import type { LyricLine, WordTiming } from '../../data/lyrics';
import { useClock } from '../../lib/clock';
import { ramp } from '../../lib/ramp';
import { COLORS } from '../../lib/tokens';
import { fontFamilyInter } from '../../lib/fonts';

export const Pulse: React.FC<{
  line: LyricLine;
  words: WordTiming[];
}> = ({ line, words }) => {
  const { sec } = useClock();

  const enterProgress = ramp(sec, line.startSec, 6 / 30);
  const exitDuration = 8 / 30;
  const exitProgress =
    sec >= line.endSec ? ramp(sec, line.endSec, exitDuration) : 0;
  const lineOpacity = Math.max(0, enterProgress - exitProgress);

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
        fontWeight: 700,
        fontSize: 88,
        lineHeight: 1.15,
        letterSpacing: '-0.02em',
        color: COLORS.text,
        opacity: lineOpacity,
        textAlign: 'center',
        maxWidth: 1680,
        transform: `scale(${1 + kickPulse * 0.032})`,
        transformOrigin: 'center center',
      }}
    >
      {words.map((w, i) => {
        const isHeart = /heart/i.test(w.text);
        const isQuietOrUnderground = /quiet|underground/i.test(w.text);
        const isActive = sec >= w.startSec && sec < w.endSec;
        const hasPassed = sec >= w.endSec;

        let scale = 1;
        let color: string = hasPassed ? COLORS.text : `${COLORS.text}cc`;
        let y = 0;
        let wordOpacity = 1;
        let textGlow = undefined;

        if (isHeart) {
          color = COLORS.orange;
          if (isActive) {
            scale = 1.32;
            textGlow = `0 0 32px ${COLORS.orange}, 0 0 72px ${COLORS.orange}`;
          } else {
            scale = 1.1;
            textGlow = `0 0 16px ${COLORS.orange}88`;
          }
        } else if (isQuietOrUnderground) {
          if (isActive || hasPassed) {
            y = 10;
            wordOpacity = 0.75;
          }
          if (isActive) {
            color = COLORS.orange;
            scale = 1.2;
            textGlow = `0 0 24px ${COLORS.orange}`;
          }
        } else if (isActive) {
          color = COLORS.orange;
          scale = 1.22;
          textGlow = `0 0 24px ${COLORS.orange}, 0 0 48px ${COLORS.orange}88`;
        }

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              transform: `translateY(${y}px) scale(${scale})`,
              transformOrigin: 'center center',
              color,
              opacity: wordOpacity,
              textShadow: textGlow,
              fontWeight: isActive ? 850 : 700,
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
