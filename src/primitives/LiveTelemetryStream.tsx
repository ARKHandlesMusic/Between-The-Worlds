import React from 'react';
import { useClock } from '../lib/clock';
import { COLORS } from '../lib/tokens';
import { fontFamilyMono } from '../lib/fonts';
import { useBands } from '../lib/audio';

export interface LiveTelemetryStreamProps {
  variant?: 'hud' | 'terminal' | 'oscilloscope' | 'compact';
  style?: React.CSSProperties;
}

const LOG_MESSAGES = [
  '[CLAUDE-3.7-SONNET] Token stream chunk #4096 decoded (11.8ms)',
  '[DSP] Dual audio pipeline 96.0 kHz • 32-bit float synchronized',
  '[SYS] Context window: 194,560 / 200,000 tokens active',
  '[BILLING] Rate meter: tier 4 enterprise • $0.0032/token/sec',
  '[TELEMETRY] Latent resonance lock: 0.998 [CONVERGED]',
  '[ENGINE] 60.000 FPS • Frame jitter 0.000ms • Zero drop',
  '[SYNTHESIS] Human intent translated: 1.000 fidelity',
  '[HEARTBEAT] Resonance verified: 46 BPM pulse locked',
  '[PROMPT] "Between the words" vector space manifold aligned',
  '[NETWORK] Multi-region gateway latency: 1.2ms [OPTIMAL]',
  '[AST] Tree-sitter token stream parsed 42 expressions',
  '[CACHE] KV-Cache hit ratio 99.4% (speedup 4.2x)',
];

export const LiveTelemetryStream: React.FC<LiveTelemetryStreamProps> = ({
  variant = 'hud',
  style,
}) => {
  const { sec } = useClock();
  const { bass, high } = useBands();

  // Continuous micro-cent billing ticker
  const costNumber = 0.0418 + sec * 0.00287;
  const costString = `$${costNumber.toFixed(4)}`;

  // Live token speed calculation (wobbles with beat)
  const tokSpeed = Math.floor(78 + Math.sin(sec * 4.2) * 22 + bass * 48);

  // Equalizer / spectrum bar heights (deterministic + audio driven)
  const barCount = 18;
  const bars = Array.from({ length: barCount }).map((_, i) => {
    const wave = Math.abs(Math.sin(sec * 7 + i * 0.65));
    const h = 4 + wave * 22 * (1 + bass * 1.8);
    return Math.min(32, h);
  });

  // Active terminal logs (scrolls smoothly up based on time)
  const logStep = Math.floor(sec * 1.8);
  const visibleLogs = Array.from({ length: 4 }).map((_, i) => {
    const index = (logStep + i) % LOG_MESSAGES.length;
    return LOG_MESSAGES[index];
  });

  if (variant === 'oscilloscope') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 3,
          height: 36,
          padding: '4px 8px',
          backgroundColor: `${COLORS.surface}bb`,
          border: `1px solid ${COLORS.teal}44`,
          borderRadius: 4,
          ...style,
        }}
      >
        {bars.map((h, i) => (
          <div
            key={i}
            style={{
              width: 3,
              height: h,
              backgroundColor: i % 4 === 0 ? COLORS.orange : COLORS.teal,
              borderRadius: 1,
              boxShadow: `0 0 4px ${i % 4 === 0 ? COLORS.orange : COLORS.teal}`,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'terminal') {
    return (
      <div
        style={{
          fontFamily: fontFamilyMono,
          fontSize: 9,
          color: `${COLORS.text}b3`,
          lineHeight: 1.45,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          ...style,
        }}
      >
        {visibleLogs.map((log, i) => (
          <div
            key={i}
            style={{
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              opacity: 0.4 + i * 0.2,
              color: i === 3 ? COLORS.teal : `${COLORS.text}cc`,
            }}
          >
            <span style={{ color: COLORS.orange, marginRight: 4 }}>❯</span>
            {log}
          </div>
        ))}
      </div>
    );
  }

  // Full HUD Banner
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '6px 14px',
        backgroundColor: `${COLORS.navy}e6`,
        border: `1px solid ${COLORS.unlit}88`,
        borderRadius: 6,
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        fontFamily: fontFamilyMono,
        fontSize: 10,
        color: COLORS.text,
        pointerEvents: 'none',
        ...style,
      }}
    >
      {/* Live Mini Spectrum Bars */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 20 }}>
        {bars.slice(0, 10).map((h, i) => (
          <div
            key={i}
            style={{
              width: 2.5,
              height: h * 0.6,
              backgroundColor: i % 3 === 0 ? COLORS.orange : COLORS.teal,
              borderRadius: 1,
            }}
          />
        ))}
      </div>

      {/* Token throughput */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: `${COLORS.text}66` }}>STREAM:</span>
        <span style={{ color: COLORS.teal, fontWeight: 700 }}>{tokSpeed} tok/s</span>
      </div>

      <span style={{ color: `${COLORS.unlit}88` }}>•</span>

      {/* Live Billing Odometer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: `${COLORS.text}66` }}>COST:</span>
        <span style={{ color: COLORS.orange, fontWeight: 700 }}>{costString}</span>
      </div>

      <span style={{ color: `${COLORS.unlit}88` }}>•</span>

      {/* High-frequency pulse / Latency indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: high > 0.4 ? COLORS.orange : COLORS.teal,
            boxShadow: `0 0 8px ${high > 0.4 ? COLORS.orange : COLORS.teal}`,
          }}
        />
        <span style={{ color: `${COLORS.text}99` }}>LATENCY: 1.2ms</span>
      </div>
    </div>
  );
};
