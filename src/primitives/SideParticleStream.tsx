import React from 'react';
import { useClock } from '../lib/clock';
import { COLORS } from '../lib/tokens';
import { fontFamilyMono } from '../lib/fonts';
import { useBands } from '../lib/audio';

export interface SideParticleStreamProps {
  density?: number;
  direction?: 'left-to-right' | 'right-to-left' | 'both';
  speed?: number;
  showTokens?: boolean;
  opacity?: number;
  style?: React.CSSProperties;
}

const TOKEN_LABELS = [
  '[tok:1024]',
  '0x7FF',
  'λ.eval()',
  'vec3',
  '200 OK',
  '+128ms',
  'JSON',
  'float32',
  'STREAM',
  'RES:46BPM',
  'LATENCY:1.2ms',
  'PROMPT_BLOCK',
  'SYNTHESIS',
  '96kHz',
  '32-BIT',
  'AST:NODE',
  'EMBED:4096',
  '010110',
  'ctx.listen()',
  'HEARTBEAT',
];

const STREAM_COLORS = [
  COLORS.teal,
  COLORS.orange,
  COLORS.text,
  '#67e8f9',
  '#f59e0b',
  '#a78bfa',
];

export const SideParticleStream: React.FC<SideParticleStreamProps> = ({
  density = 22,
  direction = 'both',
  speed = 1.0,
  showTokens = true,
  opacity = 0.55,
  style,
}) => {
  const { sec } = useClock();
  const { bass } = useBands();

  const kickBoost = 1 + bass * 0.45;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 1920,
        height: 1080,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 5,
        opacity,
        ...style,
      }}
    >
      {Array.from({ length: density }).map((_, i) => {
        // Deterministic pseudo-random parameters based on index
        const dir =
          direction === 'left-to-right'
            ? 1
            : direction === 'right-to-left'
            ? -1
            : i % 2 === 0
            ? 1
            : -1;

        const baseSpeed = 420 + ((i * 157) % 520);
        const currentSpeed = baseSpeed * speed * kickBoost;

        // Position calculations
        const yBase = ((i * (1080 / density) + ((i * 47) % 60)) % 1040) + 20;
        const yWobble = Math.sin(sec * 2.2 + i * 1.7) * 8;
        const y = yBase + yWobble;

        const totalSpan = 2400;
        const offset = (i * 263.7) % totalSpan;
        const progress = ((sec * currentSpeed + offset) % totalSpan) / totalSpan;

        // X coordinate: sweeps from -240 to 2160 (or reversed)
        const x = dir === 1 ? -240 + progress * totalSpan : 2160 - progress * totalSpan;

        const streakWidth = 80 + ((i * 73) % 180) * (1 + bass * 0.5);
        const color = STREAM_COLORS[i % STREAM_COLORS.length];
        const isToken = showTokens && i % 3 === 0;
        const tokenLabel = TOKEN_LABELS[i % TOKEN_LABELS.length];

        const particleOpacity =
          Math.sin(progress * Math.PI) * (0.35 + ((i * 31) % 40) / 100);

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              display: 'flex',
              alignItems: 'center',
              opacity: particleOpacity,
            }}
          >
            {/* Horizontal Light Streak with Gradient Tail */}
            <div
              style={{
                width: streakWidth,
                height: 2,
                background:
                  dir === 1
                    ? `linear-gradient(to right, transparent, ${color})`
                    : `linear-gradient(to left, transparent, ${color})`,
                borderRadius: 1,
              }}
            />

            {/* Glowing Leading Head Dot */}
            <div
              style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                backgroundColor: color,
                boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
                order: dir === 1 ? 1 : 0,
              }}
            />

            {/* Cybernetic Token Badge */}
            {isToken && (
              <div
                style={{
                  fontFamily: fontFamilyMono,
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  color: color,
                  backgroundColor: `${COLORS.navy}e6`,
                  border: `1px solid ${color}66`,
                  padding: '1px 6px',
                  borderRadius: 3,
                  marginLeft: dir === 1 ? 8 : -8,
                  whiteSpace: 'nowrap',
                  boxShadow: `0 0 8px ${color}44`,
                  order: dir === 1 ? 2 : -1,
                  transform: `scale(${1 + bass * 0.15})`,
                }}
              >
                {tokenLabel}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
