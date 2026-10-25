import React from 'react';
import { COLORS } from '../lib/tokens';

export type UndergroundDotProps = {
  size?: number;
  opacity?: number;
  x?: number;
  y?: number;
  pulse?: number; // 0 to 1
  color?: string;
  style?: React.CSSProperties;
};

/**
 * UndergroundDot primitive per AGENTS.md Section 7:
 * 6 px orange circle at bottom centre (960, 1040), 20% opacity;
 * pulses once per bar using bass.
 * Pulses never exceed scale 1.04 per Section 8.
 * Key props: size, opacity.
 */
export const UndergroundDot: React.FC<UndergroundDotProps> = ({
  size = 6,
  opacity = 0.2,
  x = 960,
  y = 1040,
  pulse = 0,
  color = COLORS.orange,
  style,
}) => {
  const clampedPulse = Math.max(0, Math.min(1, pulse));
  // Strictly capped at 1.04 maximum scale per Section 8
  const scale = 1 + 0.04 * clampedPulse;
  const radius = size / 2;

  return (
    <div
      style={{
        position: 'absolute',
        left: Math.round(x - radius),
        top: Math.round(y - radius),
        width: Math.round(size),
        height: Math.round(size),
        borderRadius: '50%',
        backgroundColor: color,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        boxShadow:
          clampedPulse > 0.05
            ? `0 0 ${Math.round(8 * clampedPulse)}px ${color}`
            : undefined,
        pointerEvents: 'none',
        zIndex: 50,
        ...style,
      }}
    />
  );
};
