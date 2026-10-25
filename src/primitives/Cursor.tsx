import React from 'react';
import { COLORS } from '../lib/tokens';

export type CursorProps = {
  x: number;
  y: number;
  press?: number; // 0 to 1
  opacity?: number;
  style?: React.CSSProperties;
};

/**
 * Cursor primitive per AGENTS.md Section 7:
 * Arrow path `M0 0 L0 24 L6 18 L10 28 L14 26 L10 16 L18 16 Z`, off-white fill, orange stroke.
 * Key props: x, y, press (0 to 1).
 */
export const Cursor: React.FC<CursorProps> = ({
  x,
  y,
  press = 0,
  opacity = 1,
  style,
}) => {
  const clampedPress = Math.max(0, Math.min(1, press));
  // Scale down slightly on press
  const scale = 1 - 0.12 * clampedPress;

  return (
    <div
      style={{
        position: 'absolute',
        left: Math.round(x),
        top: Math.round(y),
        width: 0,
        height: 0,
        pointerEvents: 'none',
        zIndex: 500,
        opacity,
        ...style,
      }}
    >
      {/* Click ripple circle expanding from tip (0, 0) when press > 0 */}
      {clampedPress > 0 && (
        <svg
          style={{
            position: 'absolute',
            left: -30,
            top: -30,
            width: 60,
            height: 60,
            pointerEvents: 'none',
          }}
        >
          <circle
            cx={30}
            cy={30}
            r={clampedPress * 24}
            fill="none"
            stroke={COLORS.orange}
            strokeWidth={2}
            opacity={Math.max(0, 1 - clampedPress)}
          />
        </svg>
      )}

      {/* Main Cursor Arrow */}
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: '0 0',
          filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4))',
        }}
      >
        <svg width={36} height={40} viewBox="0 0 36 40" fill="none">
          <path
            d="M0 0 L0 24 L6 18 L10 28 L14 26 L10 16 L18 16 Z"
            fill={COLORS.text}
            stroke={COLORS.orange}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};
