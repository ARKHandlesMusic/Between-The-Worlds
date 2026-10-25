import React from 'react';
import { useClock } from '../lib/clock';
import { ramp } from '../lib/ramp';
import { COLORS } from '../lib/tokens';
import { fontFamilyMono } from '../lib/fonts';
import { Easing } from 'remotion';
import { Camera } from '../lib/camera';
import { Window } from '../primitives/Window';
import { UndergroundDot } from '../primitives/UndergroundDot';
import { Whisper } from '../primitives/Whisper';
import { ANCHORS } from '../lib/anchors';

// Claps from 4.0s to 12.5s (measured tempo ~128 BPM, clap on 2 & 4, ~0.94s intervals)
const CLAP_TIMES = [4.2, 5.14, 6.08, 7.02, 7.96, 8.9, 9.84, 10.78, 11.72, 12.66];

export const Scene01: React.FC = () => {
  const { sec } = useClock();

  // Underground dot fades in at 2.0s, pulses once per bar (~1.875s)
  const dotFade = ramp(sec, 2.0, 1.0);
  const barProgress = (sec % 1.875) / 1.875;
  const dotPulse = Math.max(0, Math.sin(barProgress * Math.PI));

  // Whisper "Can you hear it?" from 7.7s to 13.0s
  const whisperReveal = ramp(sec, 7.7, 4.3);
  const whisperFade = sec >= 12.6 ? Math.max(0, 1 - ramp(sec, 12.6, 0.4)) : 1;

  // b4: thin orange line from 13.0 to 17.0
  const lineProgress = ramp(sec, 13.0, 4.0);
  const lineFade = sec >= 17.5 ? Math.max(0, 1 - ramp(sec, 17.5, 0.3)) : 1;

  // b5: Window expansion from 17.5 to 18.55
  const windowDraw = ramp(sec, 17.5, 0.5);

  // Last 0.5s (18.05 to 18.55): scale-through match cut to full-bleed
  const fullBleedProgress = ramp(sec, 18.05, 0.5);

  const baseWin = ANCHORS.window;
  const currentWin = {
    x: baseWin.x * (1 - fullBleedProgress),
    y: baseWin.y * (1 - fullBleedProgress),
    w: baseWin.w + (1920 - baseWin.w) * fullBleedProgress,
    h: baseWin.h + (1080 - baseWin.h) * fullBleedProgress,
    radius: 16 * (1 - fullBleedProgress),
  };

  // Active clap index & pulse
  const activeClapIndex = CLAP_TIMES.findIndex((t) => sec >= t && sec < t + 0.35);
  let clapPulse = 0;
  for (const t of CLAP_TIMES) {
    if (sec >= t && sec < t + 0.35) {
      const p = (sec - t) / 0.35;
      clapPulse = Math.pow(Math.max(0, 1 - p * 2.8), 2.0);
      break;
    }
  }

  // Dynamic Camera Choreography for Intro (0.0s to 18.55s)
  // B1 Match cut requires scale=1.0, originX=960, originY=540 at 18.55s
  let baseCamScale = 1.0;
  let camOriginX = 960;
  let camOriginY = 540;

  if (sec < 4.0) {
    // 0.0s - 4.0s: Macro zoom on Underground Dot fading in at (960, 1040)
    const p = Math.min(1, sec / 4.0);
    const ep = Easing.inOut(Easing.cubic)(p);
    baseCamScale = 1.65 - ep * 0.15; // 1.65 -> 1.50
    camOriginX = 960;
    camOriginY = 880 - ep * 80;
  } else if (sec < 7.7) {
    // 4.0s - 7.7s: Pull back and sweep diagonally to claps row
    const p = (sec - 4.0) / (7.7 - 4.0);
    const ep = Easing.inOut(Easing.cubic)(p);
    baseCamScale = 1.50 - ep * 0.22; // 1.50 -> 1.28
    camOriginX = 960 - ep * 240; // 960 -> 720
    camOriginY = 800 - ep * 260; // 800 -> 540
  } else if (sec < 13.0) {
    // 7.7s - 13.0s: Whisper reveal across center
    const p = (sec - 7.7) / (13.0 - 7.7);
    const ep = Easing.inOut(Easing.cubic)(p);
    baseCamScale = 1.28 - ep * 0.08; // 1.28 -> 1.20
    camOriginX = 720 + ep * 240; // 720 -> 960
    camOriginY = 540;
  } else if (sec < 17.5) {
    // 13.0s - 17.5s: Thin orange line draws itself - macro push!
    const p = (sec - 13.0) / (17.5 - 13.0);
    const ep = Easing.inOut(Easing.cubic)(p);
    baseCamScale = 1.20 + ep * 0.35; // 1.20 -> 1.55
    camOriginX = 960;
    camOriginY = 540;
  } else if (sec < 18.05) {
    // 17.5s - 18.05s: Window expands from line
    const p = (sec - 17.5) / (18.05 - 17.5);
    const ep = Easing.inOut(Easing.cubic)(p);
    baseCamScale = 1.55 - ep * 0.47; // 1.55 -> 1.08
    camOriginX = 960;
    camOriginY = 540;
  } else {
    // 18.05s - 18.55s: Scale-through match cut to full bleed for B1!
    const p = (sec - 18.05) / (18.55 - 18.05);
    const ep = Easing.inOut(Easing.cubic)(p);
    baseCamScale = 1.08 - ep * 0.08; // 1.08 -> 1.0
    camOriginX = 960;
    camOriginY = 540;
  }

  const camScale = baseCamScale * (1 + clapPulse * 0.045);

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 1920,
        height: 1080,
        backgroundColor: COLORS.navy,
        overflow: 'hidden',
      }}
    >
      <Camera scale={camScale} originX={camOriginX} originY={camOriginY}>
      {/* Background Micro Blueprint Grid (Subtle 120fps Vector Aesthetics) */}
      <svg
        width={1920}
        height={1080}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          opacity: 0.12,
          pointerEvents: 'none',
        }}
      >
        <defs>
          <pattern id="s01-grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke={COLORS.unlit} strokeWidth="1" strokeDasharray="2 4" />
            <circle cx="80" cy="80" r="1" fill={COLORS.text} opacity="0.3" />
          </pattern>
        </defs>
        <rect width="1920" height="1080" fill="url(#s01-grid)" />
      </svg>

      {/* 4 Corner Precision CAD Registration Fiducials */}
      <svg
        width={1920}
        height={1080}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          pointerEvents: 'none',
          opacity: 0.45,
        }}
      >
        {[
          { x: 48, y: 48, label: '0048, 0048' },
          { x: 1872, y: 48, label: '1872, 0048' },
          { x: 48, y: 1032, label: '0048, 1032' },
          { x: 1872, y: 1032, label: '1872, 1032' },
        ].map((pt, pIdx) => (
          <g key={pIdx}>
            {/* Crosshair */}
            <line x1={pt.x - 8} y1={pt.y} x2={pt.x + 8} y2={pt.y} stroke={COLORS.unlit} strokeWidth={1} />
            <line x1={pt.x} y1={pt.y - 8} x2={pt.x} y2={pt.y + 8} stroke={COLORS.unlit} strokeWidth={1} />
            <circle cx={pt.x} cy={pt.y} r={3} fill="none" stroke={COLORS.unlit} strokeWidth={1} />
            <text
              x={pt.x > 960 ? pt.x - 14 : pt.x + 14}
              y={pt.y > 540 ? pt.y - 8 : pt.y + 14}
              fill={COLORS.unlit}
              fontFamily={fontFamilyMono}
              fontSize={8}
              textAnchor={pt.x > 960 ? 'end' : 'start'}
            >
              [{pt.label}]
            </text>
          </g>
        ))}
      </svg>

      {/* Top Header Status Telemetry */}
      {sec < 17.5 && (
        <div
          style={{
            position: 'absolute',
            top: 28,
            left: 48,
            right: 48,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: fontFamilyMono,
            fontSize: 11,
            color: COLORS.unlit,
            letterSpacing: '0.08em',
            pointerEvents: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: COLORS.orange, fontWeight: 700 }}>BETWEEN THE WORDS</span>
            <span style={{ opacity: 0.4 }}>•</span>
            <span>4K UHD 60 FPS</span>
            <span style={{ opacity: 0.4 }}>•</span>
            <span>TEMPO: 128.00 BPM</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span>TC 00:00:{Math.floor(sec).toString().padStart(2, '0')}:{Math.floor((sec % 1) * 60).toString().padStart(2, '0')}</span>
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: activeClapIndex >= 0 ? COLORS.orange : COLORS.unlit,
                boxShadow: activeClapIndex >= 0 ? `0 0 8px ${COLORS.orange}` : 'none',
              }}
            />
          </div>
        </div>
      )}

      {/* b2: Tick marks row at center with precision DAW transport scale */}
      {sec >= 4.0 && sec < 13.0 && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 1920,
            height: 1080,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          {/* Baseline Ruler with Micro Subdivisions */}
          <div
            style={{
              position: 'relative',
              width: 960,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Horizontal baseline */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 36,
                height: 1,
                backgroundColor: `${COLORS.unlit}55`,
              }}
            />

            {/* Clap Ticks and Labels */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'flex-end',
                height: 72,
              }}
            >
              {CLAP_TIMES.map((time, idx) => {
                const isPast = sec >= time;
                const tickProg = isPast ? Math.min(1, ramp(sec, time, 0.12)) : 0;
                const isCurrent = sec >= time && sec < time + 0.35;
                const pulseScale = isCurrent ? 1 + (1 - ramp(sec, time, 0.35)) * 0.4 : 1;

                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6,
                      opacity: isPast ? 1 : 0.25,
                      transform: `scale(${pulseScale})`,
                      transformOrigin: 'bottom center',
                    }}
                  >
                    {/* Clap index pill */}
                    <span
                      style={{
                        fontFamily: fontFamilyMono,
                        fontSize: 9,
                        color: isCurrent ? COLORS.orange : COLORS.unlit,
                        fontWeight: isCurrent ? 700 : 400,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </span>

                    {/* Radial ripple on hit */}
                    {isCurrent && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 18,
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          border: `1px solid ${COLORS.orange}`,
                          opacity: 1 - ramp(sec, time, 0.35),
                          transform: `scale(${1 + ramp(sec, time, 0.35) * 1.5})`,
                        }}
                      />
                    )}

                    {/* Tick vertical bar */}
                    <div
                      style={{
                        width: 2,
                        height: 24 * tickProg,
                        backgroundColor: isCurrent ? COLORS.orange : COLORS.text,
                        borderRadius: 1,
                        boxShadow: isCurrent ? `0 0 10px ${COLORS.orange}` : 'none',
                      }}
                    />

                    {/* Timing badge below baseline */}
                    <span
                      style={{
                        fontFamily: fontFamilyMono,
                        fontSize: 8,
                        color: `${COLORS.text}66`,
                        marginTop: 4,
                      }}
                    >
                      {time.toFixed(1)}s
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lower DAW Beat Ribbon & Real-time 8-Band Frequency Analyzer */}
          <div
            style={{
              position: 'absolute',
              bottom: 120,
              display: 'flex',
              gap: 32,
              alignItems: 'center',
              padding: '10px 24px',
              backgroundColor: `${COLORS.surface}aa`,
              borderRadius: 20,
              border: `1px solid ${COLORS.unlit}55`,
            }}
          >
            {/* Beat 1, 2 (clap), 3, 4 (clap) */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {[1, 2, 3, 4].map((beat) => {
                const isClapBeat = beat === 2 || beat === 4;
                const currentBeatInBar = 1 + Math.floor((sec % 1.875) / 0.46875);
                const isThisBeat = currentBeatInBar === beat;

                return (
                  <div
                    key={beat}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '4px 8px',
                      borderRadius: 10,
                      backgroundColor: isThisBeat ? (isClapBeat ? `${COLORS.orange}33` : `${COLORS.teal}22`) : 'transparent',
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: isThisBeat ? (isClapBeat ? COLORS.orange : COLORS.teal) : COLORS.unlit,
                        boxShadow: isThisBeat && isClapBeat ? `0 0 8px ${COLORS.orange}` : 'none',
                      }}
                    />
                    <span
                      style={{
                        fontFamily: fontFamilyMono,
                        fontSize: 10,
                        color: isThisBeat ? COLORS.text : COLORS.unlit,
                        fontWeight: isThisBeat ? 600 : 400,
                      }}
                    >
                      {beat}{isClapBeat ? '•CLAP' : ''}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{ width: 1, height: 18, backgroundColor: `${COLORS.unlit}44` }} />

            {/* 8-Band Frequency Spectrum Analyzer */}
            <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 20 }}>
              {['60', '120', '250', '500', '1k', '2.5k', '5k', '10k'].map((band, bIdx) => {
                const isHighBand = bIdx >= 4;
                const barHeight = activeClapIndex >= 0
                  ? (isHighBand ? 16 + (bIdx % 3) * 2 : 8 + (bIdx % 2) * 4)
                  : (bIdx === 0 ? 12 : 4 + (bIdx % 3) * 2);

                return (
                  <div key={band} title={`${band}Hz`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <div
                      style={{
                        width: 4,
                        height: barHeight,
                        backgroundColor: activeClapIndex >= 0 && isHighBand ? COLORS.orange : COLORS.teal,
                        borderRadius: 1,
                      }}
                    />
                  </div>
                );
              })}
            </div>

            <div style={{ width: 1, height: 18, backgroundColor: `${COLORS.unlit}44` }} />

            {/* Stereo Peak VU Meters */}
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ fontFamily: fontFamilyMono, fontSize: 9, color: COLORS.unlit }}>VU</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {[0, 1].map((ch) => {
                  const level = activeClapIndex >= 0 ? 0.88 + ch * 0.08 : 0.28;
                  return (
                    <div
                      key={ch}
                      style={{
                        width: 48,
                        height: 4,
                        backgroundColor: `${COLORS.unlit}44`,
                        borderRadius: 2,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${level * 100}%`,
                          height: '100%',
                          backgroundColor: activeClapIndex >= 0 ? COLORS.orange : COLORS.teal,
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* b4: Thin orange line across center (y: 540) with Collimator Laser Head & Target Reticle */}
      {sec >= 13.0 && sec < 18.0 && (
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, pointerEvents: 'none' }}>
          {/* Target Reticle at far right destination (x: 1824, y: 540) */}
          {lineProgress < 0.92 && (
            <div
              style={{
                position: 'absolute',
                left: 1824,
                top: 540,
                transform: 'translate(-50%, -50%)',
                opacity: lineFade * (1 - lineProgress),
              }}
            >
              <div style={{ width: 16, height: 16, border: `1px dashed ${COLORS.orange}88`, borderRadius: '50%' }} />
              <div style={{ position: 'absolute', left: 7, top: -4, width: 2, height: 24, backgroundColor: `${COLORS.orange}66` }} />
              <div style={{ position: 'absolute', left: -4, top: 7, width: 24, height: 2, backgroundColor: `${COLORS.orange}66` }} />
              <span style={{ position: 'absolute', left: 20, top: -6, fontFamily: fontFamilyMono, fontSize: 8, color: COLORS.orange, whiteSpace: 'nowrap' }}>
                TARGET: [1824, 0540]
              </span>
            </div>
          )}

          {/* Main Drawing Line with Coherent White Core */}
          <div
            style={{
              position: 'absolute',
              left: 96,
              top: 539,
              width: 1728 * lineProgress,
              height: 2,
              backgroundColor: COLORS.orange,
              opacity: lineFade,
              boxShadow: `0 0 12px ${COLORS.orange}aa`,
            }}
          >
            {/* White optical core */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: 1,
                backgroundColor: COLORS.text,
                opacity: 0.8,
              }}
            />
          </div>

          {/* Tracer Collimator Head at line tip */}
          {lineProgress > 0 && lineProgress < 1 && (
            <div
              style={{
                position: 'absolute',
                left: 96 + 1728 * lineProgress,
                top: 540,
                transform: 'translate(-50%, -50%)',
                opacity: lineFade,
              }}
            >
              {/* Center Crosshair diamond */}
              <div
                style={{
                  width: 8,
                  height: 8,
                  transform: 'rotate(45deg)',
                  backgroundColor: COLORS.orange,
                  boxShadow: `0 0 10px ${COLORS.orange}`,
                }}
              />
              {/* Outer collimator ring with degree graduation marks */}
              <div
                style={{
                  position: 'absolute',
                  left: -12,
                  top: -12,
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  border: `1px solid ${COLORS.orange}88`,
                }}
              />
              {/* Floating coordinate pill */}
              <div
                style={{
                  position: 'absolute',
                  left: 20,
                  top: -24,
                  padding: '3px 8px',
                  backgroundColor: `${COLORS.surface}ee`,
                  border: `1px solid ${COLORS.orange}88`,
                  borderRadius: 4,
                  fontFamily: fontFamilyMono,
                  fontSize: 10,
                  color: COLORS.text,
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  gap: 6,
                  alignItems: 'center',
                }}
              >
                <span style={{ color: COLORS.orange }}>X: {(96 + 1728 * lineProgress).toFixed(0)}</span>
                <span style={{ opacity: 0.4 }}>|</span>
                <span>{Math.round(lineProgress * 100)}%</span>
                <span style={{ opacity: 0.4 }}>|</span>
                <span style={{ color: COLORS.teal, fontSize: 8 }}>432 px/s</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* b5: Window growing into outline and full-bleed */}
      {sec >= 17.5 && (
        <div style={{ position: 'relative' }}>
          {/* Snap Dimension Guides in S01 */}
          {fullBleedProgress < 0.8 && (
            <div
              style={{
                position: 'absolute',
                left: currentWin.x,
                top: currentWin.y - 18,
                fontFamily: fontFamilyMono,
                fontSize: 9,
                color: COLORS.teal,
                letterSpacing: '0.05em',
                pointerEvents: 'none',
              }}
            >
              FRAME: {Math.round(currentWin.w)} × {Math.round(currentWin.h)} px • R: {currentWin.radius.toFixed(1)}px
            </div>
          )}
          <Window
            x={currentWin.x}
            y={currentWin.y}
            w={currentWin.w}
            h={currentWin.h}
            draw={windowDraw}
            title="Between the Words"
            icon="chat"
            style={{ borderRadius: currentWin.radius }}
          />
        </div>
      )}


      {/* Whisper: "Can you hear it?" (bottom-left from 7.7s to 13.0s) */}
      {sec >= 7.7 && sec < 13.0 && (
        <Whisper
          text="Can you hear it?"
          reveal={whisperReveal}
          x={48}
          y={1028}
          opacity={0.35 * whisperFade}
        />
      )}

      {/* The Underground Dot: 6 px orange circle at bottom centre (960, 1040), 20% opacity */}
      {dotFade > 0 && (
        <UndergroundDot
          x={960}
          y={1040}
          size={6}
          opacity={0.2 * dotFade}
          pulse={dotPulse}
          color={COLORS.orange}
        />
      )}
      </Camera>
    </div>
  );
};

export default Scene01;
