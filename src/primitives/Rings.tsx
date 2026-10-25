import React from 'react';
import { COLORS } from '../lib/tokens';

export type RingsProps = {
  x: number;
  y: number;
  phase?: number; // 0 to 1
  count?: number;
  maxRadius?: number;
  strokeWidth?: number;
  color?: string;
  opacity?: number;
  style?: React.CSSProperties;
};

/**
 * Rings primitive per AGENTS.md Section 7:
 * Concentric circle outlines expanding from a point.
 * Key props: x, y, phase.
 */
export const Rings: React.FC<RingsProps> = ({
  x,
  y,
  phase = 0,
  count = 3,
  maxRadius = 160,
  strokeWidth = 2,
  color = COLORS.orange,
  opacity = 1,
  style,
}) => {
  const circles: React.ReactNode[] = [];

  for (let i = 0; i < count; i++) {
    const p = (phase + i / count) % 1;
    const r = p * maxRadius;
    // Eased natural wave dissipation
    const ringOpacity = Math.pow(Math.max(0, 1 - p), 1.25);
    const ringStroke = Math.max(1, strokeWidth * (1 - p * 0.4));

    if (r > 1) {
      circles.push(
        <circle
          key={i}
          cx={maxRadius}
          cy={maxRadius}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={ringStroke}
          opacity={ringOpacity}
        />
      );
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: Math.round(x - maxRadius),
        top: Math.round(y - maxRadius),
        width: maxRadius * 2,
        height: maxRadius * 2,
        pointerEvents: 'none',
        opacity,
        ...style,
      }}
    >
      <svg
        width={maxRadius * 2}
        height={maxRadius * 2}
        viewBox={`0 0 ${maxRadius * 2} ${maxRadius * 2}`}
        style={{ overflow: 'visible' }}
      >
        {circles}
      </svg>
    </div>
  );
};
