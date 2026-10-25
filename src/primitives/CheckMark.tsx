import React from 'react';
import { evolvePath } from '@remotion/paths';
import { COLORS } from '../lib/tokens';

export type CheckMarkProps = {
  x: number;
  y: number;
  progress?: number; // 0 to 1
  size?: number;
  color?: string;
  strokeWidth?: number;
  snapRipple?: number; // 0 to 1 ripple on completion
  style?: React.CSSProperties;
};

const BASE_PATH = 'M 6 22 L 16 32 L 34 8';

/**
 * CheckMark primitive per AGENTS.md Section 7:
 * Two-segment path drawn with evolvePath.
 * Key props: x, y, progress.
 * At progress <= 0 opacity is strictly 0 to prevent ghost dots.
 */
export const CheckMark: React.FC<CheckMarkProps> = ({
  x,
  y,
  progress = 1,
  size = 40,
  color = COLORS.teal,
  strokeWidth = 3,
  snapRipple = 0,
  style,
}) => {
  const clampedProg = Math.min(1, Math.max(0, progress));
  if (clampedProg <= 0.001) return null;

  const evolved = evolvePath(clampedProg, BASE_PATH);

  return (
    <div
      style={{
        position: 'absolute',
        left: Math.round(x),
        top: Math.round(y),
        width: size,
        height: size,
        pointerEvents: 'none',
        opacity: clampedProg <= 0.005 ? 0 : 1,
        ...style,
      }}
    >
      {/* Optional snap ripple ring on completion */}
      {snapRipple > 0 && snapRipple < 1 && (
        <svg
          style={{
            position: 'absolute',
            left: -size * 0.5,
            top: -size * 0.5,
            width: size * 2,
            height: size * 2,
            overflow: 'visible',
          }}
        >
          <circle
            cx={size}
            cy={size}
            r={size * 0.4 + snapRipple * size * 0.6}
            fill="none"
            stroke={color}
            strokeWidth={1.5}
            opacity={Math.max(0, 1 - snapRipple)}
          />
        </svg>
      )}

      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        style={{ overflow: 'visible' }}
      >
        <path
          d={BASE_PATH}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={evolved.strokeDasharray}
          strokeDashoffset={evolved.strokeDashoffset}
        />
      </svg>
    </div>
  );
};
