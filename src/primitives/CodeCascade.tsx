import React from 'react';
import { useClock } from '../lib/clock';
import { COLORS } from '../lib/tokens';
import { fontFamilyMono } from '../lib/fonts';

export interface CodeCascadeProps {
  columns?: number;
  opacity?: number;
  speed?: number;
  style?: React.CSSProperties;
}

const CODE_FRAGMENTS = [
  'const intent = await listen(heart);',
  'function synthesize(v: Vector4): Resonance {',
  '  const latent = gap.bridge(0.998);',
  '  return new QuantumMatrix(latent);',
  '}',
  'export type Resonance = State & Intent;',
  'const [tokens, cost] = stream.accumulate();',
  '0x4F8A 0x129B 0x7E3C 0x00A1 0xFEED',
  'import { soul } from "@anthropic/claude";',
  'while (alive) { render(beauty); }',
  'λ(x, y) => Math.sqrt(x*x + y*y);',
  '{"role": "assistant", "intent": 1.0}',
  'vec3 glow = pow(color, vec3(2.2));',
  'audioPipeline.synchronize(96000, 32);',
];

export const CodeCascade: React.FC<CodeCascadeProps> = ({
  columns = 8,
  opacity = 0.22,
  speed = 1.0,
  style,
}) => {
  const { sec } = useClock();

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
        zIndex: 2,
        opacity,
        fontFamily: fontFamilyMono,
        fontSize: 10,
        lineHeight: 1.5,
        ...style,
      }}
    >
      {Array.from({ length: columns }).map((_, col) => {
        const x = (col * (1920 / columns) + 30) % 1900;
        const colSpeed = (45 + ((col * 31) % 40)) * speed;
        const offset = (col * 240) % 1200;
        const yRaw = (sec * colSpeed + offset) % 1400;
        const y = yRaw - 300;

        const fragment = CODE_FRAGMENTS[col % CODE_FRAGMENTS.length];
        const isTeal = col % 2 === 0;
        const leadColor = isTeal ? COLORS.teal : COLORS.orange;

        return (
          <div
            key={col}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              display: 'flex',
              flexDirection: 'column',
              width: 220,
              color: `${COLORS.text}66`,
              textShadow: `0 0 6px ${leadColor}44`,
            }}
          >
            <div style={{ color: leadColor, fontWeight: 700, marginBottom: 2 }}>
              ▶ {fragment}
            </div>
            <div style={{ opacity: 0.7 }}>01010010 01000101 01010011</div>
            <div style={{ opacity: 0.5 }}>ctx.latent_space(4096)</div>
            <div style={{ opacity: 0.3 }}>stream: 200 OK</div>
          </div>
        );
      })}
    </div>
  );
};
