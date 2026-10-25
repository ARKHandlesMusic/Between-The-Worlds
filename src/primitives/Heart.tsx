import React, { useId } from 'react';
import { COLORS } from '../lib/tokens';

export type HeartProps = {
  x: number;
  y: number;
  d: number; // half diagonal
  pulse?: number; // 0 to 1
  glow?: number; // 0 to 1 soft warmth glow
  color?: string;
  opacity?: number;
  style?: React.CSSProperties;
};

/**
 * Heart primitive per AGENTS.md Section 7:
 * Square rotated 45 degrees with half-diagonal d (corner pointing down),
 * plus two circles of radius d/sqrt(2) centred at (-d/2, -d/2) and (d/2, -d/2); single orange fill.
 * Max pulse scale 1.04 per Section 8.
 */
export const Heart: React.FC<HeartProps> = ({
  x,
  y,
  d,
  pulse = 0,
  glow = 0,
  color = COLORS.orange,
  opacity = 1,
  style,
}) => {
  const gradId = useId();
  // Strictly capped at 1.04 per Section 8 pulse standard
  const scale = 1 + 0.04 * Math.max(0, Math.min(1, pulse));
  const r = d / Math.SQRT2;
  const viewSize = Math.ceil(d * 4);
  const halfView = viewSize / 2;

  // Outer glow radius
  const glowRadius = d * 2.2;

  return (
    <div
      style={{
        position: 'absolute',
        left: Math.round(x),
        top: Math.round(y),
        width: 0,
        height: 0,
        transform: `scale(${scale})`,
        transformOrigin: '0 0',
        opacity,
        pointerEvents: 'none',
        ...style,
      }}
    >
      <svg
        style={{
          position: 'absolute',
          left: -halfView,
          top: -halfView,
          width: viewSize,
          height: viewSize,
          overflow: 'visible',
        }}
        viewBox={`${-halfView} ${-halfView} ${viewSize} ${viewSize}`}
      >
        <defs>
          <radialGradient id={`heart-glow-${gradId}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity={0.65 * glow} />
            <stop offset="50%" stopColor={color} stopOpacity={0.25 * glow} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* Soft warmth radial glow when glow > 0 */}
        {glow > 0 && (
          <circle
            cx={0}
            cy={-d * 0.2}
            r={glowRadius}
            fill={`url(#heart-glow-${gradId})`}
          />
        )}

        {/* Two upper lobe circles centered at (-d/2, -d/2) and (d/2, -d/2) */}
        <circle cx={-d / 2} cy={-d / 2} r={r} fill={color} />
        <circle cx={d / 2} cy={-d / 2} r={r} fill={color} />

        {/* Lower diamond / rotated square with corner pointing down at (0, d) */}
        <polygon
          points={`0,${d} ${-d},0 0,${-d} ${d},0`}
          fill={color}
        />
      </svg>
    </div>
  );
};
