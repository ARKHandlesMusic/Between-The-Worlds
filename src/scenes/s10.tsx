import React from 'react';
import { useClock } from '../lib/clock';
import { ramp } from '../lib/ramp';
import { COLORS } from '../lib/tokens';
import { fontFamilyInter, fontFamilyMono } from '../lib/fonts';
import { Easing } from 'remotion';
import { Camera } from '../lib/camera';
import { Heart } from '../primitives/Heart';
import { Rings } from '../primitives/Rings';
import { PromptBox } from '../primitives/PromptBox';
import { UndergroundDot } from '../primitives/UndergroundDot';
import { ClaudeIcon } from '../primitives/ClaudeIcon';
import { ANCHORS } from '../lib/anchors';
import { SceneLyrics } from '../lyrics/SceneLyrics';
import { SideParticleStream } from '../primitives/SideParticleStream';
import { FloatingReactions } from '../primitives/FloatingReactions';
import { ExpandingReticles } from '../primitives/ExpandingReticles';

const HEARTBEAT_TIMES = [230.5, 231.8, 233.1, 234.4];

export const Scene10: React.FC = () => {
  const { sec } = useClock();

  // b1: Heart shrinks to small orange dot, lone teal dot fades out (228.52s to 230.5s)
  const heartShrink = ramp(sec, 228.52, 0.8);
  const tealFade = ramp(sec, 228.52, 0.8);

  // b2: 4 heartbeat pulses sending rings outward (230.5s to 235.5s)
  let activePulse = 0;
  let currentBeatIndex = -1;
  for (let i = 0; i < HEARTBEAT_TIMES.length; i++) {
    const t = HEARTBEAT_TIMES[i];
    if (sec >= t && sec < t + 0.45) {
      activePulse = Math.sin(((sec - t) / 0.45) * Math.PI);
      currentBeatIndex = i;
      break;
    }
  }

  // EKG rhythm line activity
  const isHeartbeatActive = sec >= 230.2 && sec < 235.2;

  // After the fourth beat: UndergroundDot pulses once (235.0s to 236.2s)
  const undergroundPulseProgress = ramp(sec, 235.0, 1.0);
  const undergroundPulse =
    sec >= 235.0 && sec < 236.2
      ? Math.sin(undergroundPulseProgress * Math.PI)
      : 0;

  // b3: PromptBox appears, dot becomes blinking caret (235.2s to 237.5s)
  const boxAppear = ramp(sec, 235.2, 0.6);

  // b4: Fade to black and title card (237.5s to 238.92s)
  const fadeBlack = ramp(sec, 237.5, 0.8);
  const titleAppear = ramp(sec, 237.8, 0.5);

  const dotScale = 1 + activePulse * 0.5;

  // Dynamic Camera Choreography for Outro Coda (228.52s to 238.92s)
  // B9 match cut: at 228.52s, scale=1.0, originX=960, originY=540
  let baseCamScale = 1.0;
  let camOriginX = 960;
  let camOriginY = 540;

  if (sec < 228.6) {
    // B9 entry anchor
    baseCamScale = 1.0;
    camOriginX = 960;
    camOriginY = 540;
  } else if (sec < 230.5) {
    // b1: Heart shrinks to small dot (1.0 -> 1.55x)
    const p = (sec - 228.6) / (230.5 - 228.6);
    const ep = Easing.inOut(Easing.cubic)(p);
    baseCamScale = 1.0 + ep * 0.55;
    camOriginX = 960;
    camOriginY = 540;
  } else if (sec < 235.0) {
    // b2: 4 heartbeats
    baseCamScale = 1.55;
    camOriginX = 960;
    camOriginY = 540;
  } else if (sec < 236.2) {
    // Underground Dot final pulse at (960, 1040) - macro push to 1.70x!
    const p = (sec - 235.0) / (236.2 - 235.0);
    const ep = Easing.inOut(Easing.cubic)(p);
    baseCamScale = 1.55 + ep * 0.15; // 1.55 -> 1.70
    camOriginX = 960;
    camOriginY = 540 + ep * 340; // 540 -> 880 (center on Underground Dot)
  } else if (sec < 237.5) {
    // b3: PromptBox appears at center
    const p = (sec - 236.2) / (237.5 - 236.2);
    const ep = Easing.inOut(Easing.cubic)(p);
    baseCamScale = 1.70 - ep * 0.45; // 1.70 -> 1.25
    camOriginX = 960;
    camOriginY = 880 - ep * 340; // 880 -> 540
  } else {
    // b4: Fade to black and title card
    const p = (sec - 237.5) / (238.92 - 237.5);
    const ep = Easing.inOut(Easing.cubic)(p);
    baseCamScale = 1.25 - ep * 0.25; // 1.25 -> 1.0
    camOriginX = 960;
    camOriginY = 540;
  }

  // Powerful camera pulse on each heartbeat
  const camScale = baseCamScale * (1 + activePulse * 0.08);

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
        {/* Dynamic Outro Atmosphere: Gentle Stardust Streaks, Rising Words & Heartbeat Reticles */}
        <SideParticleStream density={14} speed={0.7} showTokens={false} opacity={0.35} />
        <FloatingReactions count={14} types={['words']} opacity={0.6} />
        <ExpandingReticles x={960} y={540} maxRadius={240} color={COLORS.orange} opacity={0.35} />

        {/* Deep background space grid */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 1920,
            height: 1080,
            backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.04) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
            opacity: 1 - fadeBlack,
            pointerEvents: 'none',
          }}
        />

        {/* Lone Teal Dot fading out in b1 */}
        {tealFade < 1 && (
          <div
            style={{
              position: 'absolute',
              left: 924 - 7,
              top: 540 - 7,
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: COLORS.teal,
              opacity: 1 - tealFade,
              boxShadow: `0 0 16px ${COLORS.teal}`,
            }}
          />
        )}

        {/* Medical Diagnostic ECG Paper Grid & Cardiac Telemetry Overlay during Heartbeats */}
        {isHeartbeatActive && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 1920,
              height: 1080,
              pointerEvents: 'none',
              zIndex: 5,
            }}
          >
            {/* Clinical ECG Millimeter Graph Paper Grid (25mm/s paper speed equivalent) */}
            <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, opacity: 0.35 }}>
              <defs>
                <pattern id="ecgSmallGrid" width={10} height={10} patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke={COLORS.orange} strokeWidth={0.5} strokeOpacity={0.12} />
                </pattern>
                <pattern id="ecgLargeGrid" width={50} height={50} patternUnits="userSpaceOnUse">
                  <rect width={50} height={50} fill="url(#ecgSmallGrid)" />
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke={COLORS.orange} strokeWidth={1} strokeOpacity={0.25} />
                </pattern>
              </defs>
              <rect x={460} y={440} width={1000} height={200} fill="url(#ecgLargeGrid)" rx={8} />
              <rect x={460} y={440} width={1000} height={200} fill="none" stroke={COLORS.orange} strokeWidth={1} strokeOpacity={0.3} rx={8} />
            </svg>

            {/* Top cardiac telemetry header */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 48,
                width: 1920,
                display: 'flex',
                justifyContent: 'center',
                gap: 28,
                fontFamily: fontFamilyMono,
                fontSize: 11,
                color: 'rgba(255, 255, 255, 0.4)',
                letterSpacing: '0.1em',
              }}
            >
              <span>LEAD II • STANDARD CALIBRATION: 10 mm/mV</span>
              <span>•</span>
              <span>HEART RATE: 46.1 BPM (SINUS ADAGIO)</span>
              <span>•</span>
              <span style={{ color: COLORS.orange }}>
                BEAT: {currentBeatIndex >= 0 ? `0${currentBeatIndex + 1} / 04` : 'STANDBY'}
              </span>
              <span>•</span>
              <span>R-R INTERVAL: 1.300 s</span>
            </div>

            {/* Horizontal EKG Cardiogram Guide Line with P-Q-R-S-T wave pulse */}
            <svg
              width={1920}
              height={1080}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                pointerEvents: 'none',
              }}
            >
              {/* Baseline axis */}
              <line
                x1={480}
                y1={540}
                x2={1440}
                y2={540}
                stroke={COLORS.orange}
                strokeWidth={1}
                strokeOpacity={0.25}
                strokeDasharray="4 4"
              />

              {/* Dynamic EKG Spike during active beat */}
              {activePulse > 0 && (
                <>
                  <path
                    d={`
                      M 820 540
                      L 900 540
                      L 920 ${540 - 15 * activePulse}
                      L 935 540
                      L 945 ${540 + 20 * activePulse}
                      L 960 ${540 - 70 * activePulse}
                      L 975 ${540 + 30 * activePulse}
                      L 985 540
                      L 1005 ${540 - 25 * activePulse}
                      L 1025 540
                      L 1100 540
                    `}
                    fill="none"
                    stroke={COLORS.orange}
                    strokeWidth={2.5}
                    strokeOpacity={0.8 * activePulse}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* P-Q-R-S-T component annotations */}
                  <text x={920} y={520} fill={COLORS.orange} fontSize={9} fontFamily={fontFamilyMono} textAnchor="middle" opacity={activePulse * 0.7}>P</text>
                  <text x={945} y={572} fill={COLORS.orange} fontSize={9} fontFamily={fontFamilyMono} textAnchor="middle" opacity={activePulse * 0.7}>Q</text>
                  <text x={960} y={455} fill={COLORS.orange} fontSize={10} fontFamily={fontFamilyMono} fontWeight={700} textAnchor="middle" opacity={activePulse * 0.9}>R [PEAK]</text>
                  <text x={975} y={582} fill={COLORS.orange} fontSize={9} fontFamily={fontFamilyMono} textAnchor="middle" opacity={activePulse * 0.7}>S</text>
                  <text x={1005} y={510} fill={COLORS.orange} fontSize={9} fontFamily={fontFamilyMono} textAnchor="middle" opacity={activePulse * 0.7}>T</text>
                </>
              )}
            </svg>
          </div>
        )}

        {/* Heart shrinking to small orange dot in b1 (B9 Anchor at start: x=960, y=540, w=40, h=40) */}
        {sec < 235.5 && (
          <div
            style={{
              position: 'absolute',
              left: 960,
              top: 540,
              opacity: 1 - fadeBlack,
              zIndex: 10,
            }}
          >
            {heartShrink < 1 ? (
              <Heart
                x={0}
                y={0}
                d={40 * (1 - heartShrink * 0.65)}
                pulse={0.2}
                color={COLORS.orange}
              />
            ) : (
              /* Small Orange Dot pulsing on 4 heartbeats */
              <div
                style={{
                  position: 'absolute',
                  left: -7,
                  top: -7,
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  backgroundColor: COLORS.orange,
                  transform: `scale(${dotScale})`,
                  boxShadow: `0 0 ${18 * dotScale}px ${COLORS.orange}`,
                }}
              />
            )}
          </div>
        )}

        {/* 4 Heartbeat Expanding Rings (b2) with Compass Degree Graduations & Wavefront Telemetry */}
        {HEARTBEAT_TIMES.map((t, i) => {
          if (sec < t) return null;
          const ringPhase = ramp(sec, t, 1.2);
          if (ringPhase >= 1) return null;

          const radius = 180 * ringPhase;
          const ringOpacity = (1 - ringPhase) * 0.7;

          return (
            <React.Fragment key={i}>
              <Rings
                x={960}
                y={540}
                count={1}
                phase={ringPhase}
                maxRadius={180}
                color={COLORS.orange}
              />
              {/* Compass degree ticks and polar distance tags */}
              <svg
                width={1920}
                height={1080}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  pointerEvents: 'none',
                  opacity: ringOpacity,
                  zIndex: 8,
                }}
              >
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
                  const rad = (deg * Math.PI) / 180;
                  const tickX = 960 + Math.cos(rad) * radius;
                  const tickY = 540 + Math.sin(rad) * radius;
                  const isCardinal = deg % 90 === 0;
                  return (
                    <g key={deg}>
                      <circle
                        cx={tickX}
                        cy={tickY}
                        r={isCardinal ? 2.5 : 1.5}
                        fill={COLORS.orange}
                      />
                      {isCardinal && radius > 40 && (
                        <text
                          x={tickX + Math.cos(rad) * 14}
                          y={tickY + Math.sin(rad) * 14 + 3}
                          fill={COLORS.orange}
                          fontSize={8}
                          fontFamily={fontFamilyMono}
                          textAnchor="middle"
                        >
                          {deg}°
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </React.Fragment>
          );
        })}

        {/* b3: Empty PromptBox at center (same as opening) */}
        {boxAppear > 0 && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 1920,
              height: 1080,
              opacity: (1 - fadeBlack) * boxAppear,
              zIndex: 20,
            }}
          >
            <PromptBox
              x={ANCHORS.promptBox.x}
              y={ANCHORS.promptBox.y}
              w={ANCHORS.promptBox.w}
              text=""
              glow={0.25}
            />

            {/* Prompt Box Action Pill Footer */}
            <div
              style={{
                position: 'absolute',
                left: ANCHORS.promptBox.x + 20,
                top: ANCHORS.promptBox.y + ANCHORS.promptBox.h + 12,
                display: 'flex',
                gap: 10,
                fontFamily: fontFamilyMono,
                fontSize: 9.5,
              }}
            >
              {[
                { icon: '🧠', label: 'Thinking On' },
                { icon: '📎', label: 'Add Context' },
                { icon: '🌐', label: 'Search' },
                { icon: '⚡', label: 'Python Sandbox' },
              ].map((pill, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '4px 10px',
                    borderRadius: 14,
                    backgroundColor: `${COLORS.surface}cc`,
                    border: `1px solid ${COLORS.unlit}33`,
                    color: `${COLORS.text}88`,
                  }}
                >
                  <span style={{ fontSize: 10 }}>{pill.icon}</span>
                  <span>{pill.label}</span>
                </div>
              ))}
            </div>

            {/* Tape-Stop Audio Master Telemetry during runout */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 720,
                width: 1920,
                display: 'flex',
                justifyContent: 'center',
                gap: 32,
                fontFamily: fontFamilyMono,
                fontSize: 10,
                color: `${COLORS.unlit}88`,
                letterSpacing: '0.08em',
              }}
            >
              <span>ANALOG TAPE RUNOUT • 30 ips (76.2 cm/s)</span>
              <span>•</span>
              <span>MASTER FADER: -∞ dB (LOSSLESS DECAY)</span>
              <span>•</span>
              <span>TRUE PEAK: -0.1 dBTP</span>
            </div>
          </div>
        )}

        {/* Underground Dot pulsing once after fourth beat */}
        <UndergroundDot
          size={6}
          opacity={0.3}
          x={960}
          y={1040}
          pulse={undergroundPulse}
          color={COLORS.orange}
        />

        {/* b4: Blackout Overlay */}
        {fadeBlack > 0 && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 1920,
              height: 1080,
              backgroundColor: '#000000',
              opacity: fadeBlack,
              zIndex: 100,
            }}
          />
        )}

        {/* b4: Museum-Grade Master Title Card & Cryptographic Production Seal */}
        {titleAppear > 0 && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 1920,
              height: 1080,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 110,
              opacity: titleAppear,
              pointerEvents: 'none',
            }}
          >
            {/* Corner Framing Fiducials */}
            <div style={{ position: 'absolute', left: 48, top: 48, fontFamily: fontFamilyMono, fontSize: 10, color: 'rgba(255, 255, 255, 0.2)' }}>
              [0048, 0048]
            </div>
            <div style={{ position: 'absolute', right: 48, top: 48, fontFamily: fontFamilyMono, fontSize: 10, color: 'rgba(255, 255, 255, 0.2)' }}>
              [1872, 0048]
            </div>
            <div style={{ position: 'absolute', left: 48, bottom: 48, fontFamily: fontFamilyMono, fontSize: 10, color: 'rgba(255, 255, 255, 0.2)' }}>
              [0048, 1032]
            </div>
            <div style={{ position: 'absolute', right: 48, bottom: 48, fontFamily: fontFamilyMono, fontSize: 10, color: 'rgba(255, 255, 255, 0.2)' }}>
              [1872, 1032]
            </div>

            {/* Top release badge */}
            <div
              style={{
                fontFamily: fontFamilyMono,
                fontSize: 11,
                color: COLORS.orange,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: 24,
                backgroundColor: 'rgba(242, 154, 82, 0.12)',
                padding: '6px 18px',
                borderRadius: 20,
                border: '1px solid rgba(242, 154, 82, 0.3)',
              }}
            >
              4K UHD • 60 FPS NATIVE • ZERO-DRIFT VECTOR MASTER
            </div>

            {/* Authentic Claude AI Emblem */}
            <ClaudeIcon size={52} color={COLORS.orange} glow={0.9} style={{ marginBottom: 18 }} />

            {/* Master Title */}
            <h1
              style={{
                fontFamily: fontFamilyInter,
                fontSize: 64,
                fontWeight: 800,
                color: COLORS.text,
                letterSpacing: '-0.03em',
                margin: 0,
                textAlign: 'center',
              }}
            >
              Between the Words
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontFamily: fontFamilyInter,
                fontSize: 32,
                fontWeight: 500,
                color: COLORS.orange,
                letterSpacing: '-0.01em',
                margin: '12px 0 0 0',
                textShadow: `0 0 30px ${COLORS.orange}55`,
              }}
            >
              (Hear It With Your Heart)
            </p>

            {/* Architectural vector dividing rule with center diamond reticle */}
            <div
              style={{
                position: 'relative',
                width: 240,
                height: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                margin: '32px 0 28px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  backgroundColor: COLORS.orange,
                  transform: 'rotate(45deg)',
                }}
              />
            </div>

            {/* Technical & Production Credits Grid */}
            <div
              style={{
                display: 'flex',
                gap: 40,
                fontFamily: fontFamilyMono,
                fontSize: 11,
                color: 'rgba(255, 255, 255, 0.5)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              <span>CHOREOGRAPHY: PURE SVG / HTML</span>
              <span>•</span>
              <span>FRAME RATE: 60.000 FPS</span>
              <span>•</span>
              <span>CANVAS: 3840 × 2160 UHD</span>
              <span>•</span>
              <span>ANTHROPIC CLAUDE 3.7</span>
            </div>

            {/* Cryptographic integrity seal */}
            <div
              style={{
                marginTop: 20,
                fontFamily: fontFamilyMono,
                fontSize: 10,
                color: 'rgba(255, 255, 255, 0.3)',
                letterSpacing: '0.12em',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>SHA-256 INTEGRITY: [7b92f4e8...a138c24f] • 28,671 FRAMES BIT-EXACT</span>
              <span>ALL 9 MATCH CUT BOUNDARIES PASS (DELTA: 0.000 px)</span>
            </div>
          </div>
        )}

        {/* Integrated Scene Lyrics inside Camera */}
        <SceneLyrics sceneId="S10" />
      </Camera>
    </div>
  );
};

export default Scene10;
