import React, { useId } from 'react';
import { COLORS } from '../lib/tokens';

export type GapProps = {
  x: number; // center x of the gap
  y: number; // center y of the gap
  w?: number; // total container width if used
  h?: number; // height of the gap band
  gapWidth: number; // width of the open gap
  warm?: number; // 0 to 1 warmth / glow
  opacity?: number;
  style?: React.CSSProperties;
};

/**
 * Gap primitive per AGENTS.md Section 7:
 * Vertical band, orange at 25% opacity, 2 px edges, soft glow.
 * Key props: x, y, w, h, gapWidth, warm (0 to 1).
 */
export const Gap: React.FC<GapProps> = ({
  x,
  y,
  h = 600,
  gapWidth,
  warm = 0,
  opacity = 1,
  style,
}) => {
  const gradId = useId();
  const left = x - gapWidth / 2;
  const top = y - h / 2;
  const clampedWarm = Math.max(0, Math.min(1, warm));
  // Exactly 25% base opacity per Section 7, plus warm expansion
  const baseAlpha = 0.25 + clampedWarm * 0.25;

  return (
    <div
      style={{
        position: 'absolute',
        left: Math.round(left),
        top: Math.round(top),
        width: Math.round(gapWidth),
        height: Math.round(h),
        backgroundColor: `${COLORS.orange}${Math.round(baseAlpha * 255)
          .toString(16)
          .padStart(2, '0')}`,
        borderLeft: `2px solid ${COLORS.orange}`,
        borderRight: `2px solid ${COLORS.orange}`,
        boxSizing: 'border-box',
        pointerEvents: 'none',
        opacity,
        ...style,
      }}
    >
      {/* Soft radial glow allowed per Section 7 */}
      {clampedWarm > 0 && (
        <svg
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            overflow: 'visible',
            pointerEvents: 'none',
          }}
          width={Math.max(1, gapWidth * 3)}
          height={h}
        >
          <defs>
            <radialGradient id={`gap-glow-${gradId}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={COLORS.orange} stopOpacity={0.6 * clampedWarm} />
              <stop offset="50%" stopColor={COLORS.orange} stopOpacity={0.2 * clampedWarm} />
              <stop offset="100%" stopColor={COLORS.orange} stopOpacity={0} />
            </radialGradient>
          </defs>
          <ellipse
            cx={(gapWidth * 3) / 2}
            cy={h / 2}
            rx={Math.max(1, (gapWidth * 3) / 2)}
            ry={h / 2}
            fill={`url(#gap-glow-${gradId})`}
          />
        </svg>
      )}
    </div>
  );
};
