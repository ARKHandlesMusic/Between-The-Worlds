import React from 'react';
import { COLORS } from '../lib/tokens';

export type BracketsProps = {
  x: number;
  y: number;
  rotation?: number; // degrees
  spread?: number; // distance between brackets
  size?: number; // arm length of L-shape
  strokeWidth?: number;
  color?: string;
  opacity?: number;
  style?: React.CSSProperties;
};

/**
 * Brackets primitive per AGENTS.md Section 7:
 * L-shaped corner brackets (the "hands").
 * Key props: x, y, rotation, spread.
 */
export const Brackets: React.FC<BracketsProps> = ({
  x,
  y,
  rotation = 0,
  spread = 40,
  size = 28,
  strokeWidth = 3,
  color = COLORS.unlit,
  opacity = 1,
  style,
}) => {
  const halfSpread = spread / 2;

  return (
    <div
      style={{
        position: 'absolute',
        left: Math.round(x),
        top: Math.round(y),
        pointerEvents: 'none',
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center center',
        opacity,
        ...style,
      }}
    >
      {/* Left L-bracket (corner pointing bottom-left) */}
      <svg
        style={{
          position: 'absolute',
          left: -halfSpread - size,
          top: -size / 2,
          width: size,
          height: size,
          overflow: 'visible',
        }}
      >
        <path
          d={`M 0 0 L 0 ${size} L ${size} ${size}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Right L-bracket (corner pointing bottom-right) */}
      <svg
        style={{
          position: 'absolute',
          left: halfSpread,
          top: -size / 2,
          width: size,
          height: size,
          overflow: 'visible',
        }}
      >
        <path
          d={`M ${size} 0 L ${size} ${size} L 0 ${size}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
