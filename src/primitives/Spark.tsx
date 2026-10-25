import React, { useId } from 'react';
import { COLORS } from '../lib/tokens';

export type SparkProps = {
  x: number;
  y: number;
  burst?: number; // 0 to 1
  ring?: number; // 0 to 1
  scale?: number;
  color?: string;
  opacity?: number;
  glow?: number;
  style?: React.CSSProperties;
};

/**
 * Spark primitive per AGENTS.md Section 7:
 * Orange circle r=24; eight rays of length 28 starting at r+8.
 * Key props: x, y, burst (0 to 1), ring (0 to 1 for outgoing rings).
 */
export const Spark: React.FC<SparkProps> = ({
  x,
  y,
  burst = 0,
  ring = 0,
  scale = 1,
  color = COLORS.orange,
  opacity = 1,
  glow = 0.5,
  style,
}) => {
  const gradId = useId();
  const r = 24;
  const rayStart = r + 8; // 32
  const maxRayLen = 28;
  const rayLen = maxRayLen * Math.min(1, burst * 1.5);
  const rayOpacity = burst > 0 ? Math.max(0, 1 - Math.max(0, burst - 0.35) / 0.65) : 0;

  const angles = [0, 45, 90, 135, 180, 225, 270, 315];

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
          overflow: 'visible',
          position: 'absolute',
          left: -140,
          top: -140,
          width: 280,
          height: 280,
        }}
        viewBox="0 0 280 280"
      >
        <defs>
          <radialGradient id={`spark-glow-${gradId}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity={0.7 * glow} />
            <stop offset="45%" stopColor={color} stopOpacity={0.25 * glow} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* Ambient soft glow aura */}
        {glow > 0 && (
          <circle cx={140} cy={140} r={r * 2.8} fill={`url(#spark-glow-${gradId})`} />
        )}

        {/* Outgoing ring */}
        {ring > 0 && (
          <circle
            cx={140}
            cy={140}
            r={r + ring * 90}
            fill="none"
            stroke={color}
            strokeWidth={Math.max(1, 2.5 * (1 - ring * 0.5))}
            opacity={Math.pow(Math.max(0, 1 - ring), 1.2)}
          />
        )}

        {/* Eight rays */}
        {burst > 0 &&
          angles.map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);
            const x1 = 140 + rayStart * cos;
            const y1 = 140 + rayStart * sin;
            const x2 = 140 + (rayStart + rayLen) * cos;
            const y2 = 140 + (rayStart + rayLen) * sin;
            return (
              <line
                key={deg}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={color}
                strokeWidth={3}
                strokeLinecap="round"
                opacity={rayOpacity}
              />
            );
          })}

        {/* Central spark circle */}
        <circle cx={140} cy={140} r={r} fill={color} />

        {/* Authentic Claude AI Starburst emblem in Spark core */}
        <g transform="translate(126, 126) scale(0.28)">
          <path
            d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z"
            fill="#FFFFFF"
            opacity={0.88}
          />
        </g>
      </svg>
    </div>
  );
};
