import React from 'react';
import { useClock } from '../lib/clock';
import { COLORS } from '../lib/tokens';
import { useBands } from '../lib/audio';
import { fontFamilyMono } from '../lib/fonts';

export interface ExpandingReticlesProps {
  x: number;
  y: number;
  maxRadius?: number;
  color?: string;
  count?: number;
  showCoordinates?: boolean;
  opacity?: number;
  style?: React.CSSProperties;
}

export const ExpandingReticles: React.FC<ExpandingReticlesProps> = ({
  x,
  y,
  maxRadius = 160,
  color = COLORS.teal,
  count = 3,
  showCoordinates = true,
  opacity = 0.6,
  style,
}) => {
  const { sec } = useClock();
  const { bass } = useBands();

  const rot = (sec * 24) % 360;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        pointerEvents: 'none',
        zIndex: 8,
        opacity,
        ...style,
      }}
    >
      {/* Concentric Expanding Radar Rings */}
      {Array.from({ length: count }).map((_, i) => {
        const speed = 0.8;
        const offset = (i / count);
        const progress = ((sec * speed + offset) % 1.0);
        const r = progress * maxRadius * (1 + bass * 0.25);
        const ringOpacity = Math.max(0, 1 - progress);

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: -r,
              top: -r,
              width: r * 2,
              height: r * 2,
              borderRadius: '50%',
              border: `1px solid ${color}`,
              opacity: ringOpacity * 0.7,
              boxShadow: `0 0 10px ${color}44`,
            }}
          />
        );
      })}

      {/* Rotating Technical Crosshair */}
      <div
        style={{
          position: 'absolute',
          left: -20,
          top: -20,
          width: 40,
          height: 40,
          transform: `rotate(${rot}deg)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 19,
            top: 0,
            width: 2,
            height: 40,
            backgroundColor: `${color}88`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 19,
            width: 40,
            height: 2,
            backgroundColor: `${color}88`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 14,
            top: 14,
            width: 12,
            height: 12,
            borderRadius: '50%',
            border: `1px dashed ${color}`,
          }}
        />
      </div>

      {/* Coordinate & Telemetry Label */}
      {showCoordinates && (
        <div
          style={{
            position: 'absolute',
            left: 28,
            top: -12,
            fontFamily: fontFamilyMono,
            fontSize: 9,
            color: `${color}cc`,
            letterSpacing: '0.05em',
            whiteSpace: 'nowrap',
          }}
        >
          LOC: ({Math.round(x)}, {Math.round(y)}) • RAD: {maxRadius}px
        </div>
      )}
    </div>
  );
};
