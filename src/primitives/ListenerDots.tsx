import React from 'react';
import { COLORS } from '../lib/tokens';

export type ListenerDotsProps = {
  rows: number;
  cols: number;
  x?: number;
  y?: number;
  gapX?: number;
  gapY?: number;
  litAt?: (row: number, col: number) => number; // 0 to 1
  jumpAt?: (row: number, col: number) => number; // px displacement (e.g. -12px)
  colorLit?: string;
  colorUnlit?: string;
  style?: React.CSSProperties;
};

// Color lerp helper for smooth dot illumination
function parseHex(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

function lerpColor(c1: string, c2: string, t: number): string {
  const [r1, g1, b1] = parseHex(c1);
  const [r2, g2, b2] = parseHex(c2);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * ListenerDots primitive per AGENTS.md Section 7:
 * Grid of 14 px circles, unlit grey-blue, lit teal (or warm white in S09).
 * Key props: rows, cols, litAt(row, col) -> 0..1, jumpAt(row, col) -> px.
 */
export const ListenerDots: React.FC<ListenerDotsProps> = ({
  rows,
  cols,
  x = 0,
  y = 0,
  gapX = 24,
  gapY = 24,
  litAt = () => 0,
  jumpAt = () => 0,
  colorLit = COLORS.teal,
  colorUnlit = COLORS.unlit,
  style,
}) => {
  const dotSize = 14;

  const dots: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const lit = Math.max(0, Math.min(1, litAt(r, c)));
      const jump = jumpAt(r, c);
      const left = c * (dotSize + gapX);
      const top = r * (dotSize + gapY) + jump;

      const dotColor = lit > 0 ? lerpColor(colorUnlit, colorLit, lit) : colorUnlit;
      const glowOpacity = Math.round(lit * 90)
        .toString(16)
        .padStart(2, '0');

      dots.push(
        <div
          key={`${r}-${c}`}
          style={{
            position: 'absolute',
            left: Math.round(left),
            top: Math.round(top),
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            backgroundColor: dotColor,
            boxShadow:
              lit > 0.05
                ? `0 0 ${Math.round(8 * lit)}px ${colorLit}${glowOpacity}`
                : undefined,
          }}
        />
      );
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: Math.round(x),
        top: Math.round(y),
        pointerEvents: 'none',
        ...style,
      }}
    >
      {dots}
    </div>
  );
};
