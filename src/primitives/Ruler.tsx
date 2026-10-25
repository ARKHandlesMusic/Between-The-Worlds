import React from 'react';
import { COLORS } from '../lib/tokens';
import { fontFamilyMono } from '../lib/fonts';

export type RulerProps = {
  x?: number;
  y?: number;
  w?: number;
  progress?: number; // 0 to 1
  jitter?: number; // vertical pixel offset for ticks per SCRIPT.md
  tickSpacing?: number;
  color?: string;
  opacity?: number;
  showNumbers?: boolean;
  style?: React.CSSProperties;
};

/**
 * Ruler primitive per AGENTS.md Section 7 and SCRIPT.md:
 * Horizontal line (1 px line with tick marks every 30 px) drawing left to right.
 * When the ruler meets the gap, ticks jitter vertically by 1 px.
 * Enriched with precision CAD / design tool measurement labels and sub-ticks.
 */
export const Ruler: React.FC<RulerProps> = ({
  x = 360,
  y = 540,
  w = 1200,
  progress = 1,
  jitter = 0,
  tickSpacing = 30,
  color = COLORS.unlit,
  opacity = 1,
  showNumbers = true,
  style,
}) => {
  if (progress <= 0) return null;

  const currentW = w * Math.max(0, Math.min(1, progress));
  const numTicks = Math.floor(currentW / tickSpacing);

  const ticks: React.ReactNode[] = [];
  for (let i = 0; i <= numTicks; i++) {
    const isMajor = i % 5 === 0;
    const isMedium = i % 5 === 0 ? false : i % 2 === 0;
    const tickHalf = isMajor ? 10 : isMedium ? 6 : 4;
    // Ticks jitter vertically per SCRIPT.md specification
    const jitterOffset = jitter !== 0 ? (i % 2 === 0 ? jitter : -jitter) : 0;
    const tickX = i * tickSpacing;

    ticks.push(
      <g key={i}>
        <line
          x1={tickX}
          y1={-tickHalf + jitterOffset}
          x2={tickX}
          y2={tickHalf + jitterOffset}
          stroke={isMajor ? color : `${color}aa`}
          strokeWidth={isMajor ? 1.5 : 1}
        />
        {showNumbers && isMajor && (
          <text
            x={tickX}
            y={-14 + jitterOffset}
            textAnchor="middle"
            fill={color}
            fontFamily={fontFamilyMono}
            fontSize={9}
            opacity={0.65}
          >
            {i * tickSpacing}
          </text>
        )}
      </g>
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: Math.round(x),
        top: Math.round(y),
        pointerEvents: 'none',
        opacity,
        ...style,
      }}
    >
      <svg
        width={w + 40}
        height={60}
        style={{ overflow: 'visible', position: 'absolute', top: -30, left: 0 }}
      >
        {/* Main horizontal line */}
        <line
          x1={0}
          y1={0}
          x2={currentW}
          y2={0}
          stroke={color}
          strokeWidth={1}
        />
        {/* Ticks & Numbers */}
        {ticks}
      </svg>
    </div>
  );
};

