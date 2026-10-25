import React from 'react';
import { COLORS } from '../lib/tokens';
import { fontFamilyInter } from '../lib/fonts';

export type WhisperProps = {
  text: string;
  reveal?: number; // 0 to 1 by word
  x?: number;
  y?: number;
  opacity?: number;
  style?: React.CSSProperties;
};

/**
 * Whisper primitive per AGENTS.md Section 7:
 * Inter 14 px, off-white, 30% opacity, bottom left (x 48, y 1032).
 * Key props: text, reveal (0 to 1 by word).
 */
export const Whisper: React.FC<WhisperProps> = ({
  text,
  reveal = 1,
  x = 48,
  y = 1032,
  opacity = 0.3,
  style,
}) => {
  if (!text || reveal <= 0) return null;

  const words = text.split(/\s+/).filter(Boolean);
  const totalWords = words.length;

  return (
    <div
      style={{
        position: 'absolute',
        left: Math.round(x),
        top: Math.round(y),
        fontFamily: fontFamilyInter,
        fontSize: 14,
        color: COLORS.text,
        pointerEvents: 'none',
        zIndex: 600,
        whiteSpace: 'nowrap',
        display: 'flex',
        gap: 6,
        letterSpacing: '0.02em',
        ...style,
      }}
    >
      {words.map((word, i) => {
        // Continuous smooth word reveal
        const wordStart = i / totalWords;
        const wordDur = 1 / totalWords;
        const wordProg = Math.max(0, Math.min(1, (reveal - wordStart) / wordDur));
        if (wordProg <= 0) return null;

        return (
          <span
            key={i}
            style={{
              opacity: opacity * wordProg,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
