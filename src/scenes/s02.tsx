import React from 'react';
import { Easing, interpolate } from 'remotion';
import { useClock } from '../lib/clock';
import { ramp } from '../lib/ramp';
import { COLORS } from '../lib/tokens';
import { fontFamilyInter, fontFamilyMono } from '../lib/fonts';
import { Camera } from '../lib/camera';
import { PromptBox } from '../primitives/PromptBox';
import { Spark } from '../primitives/Spark';
import { Rings } from '../primitives/Rings';
import { Gap } from '../primitives/Gap';
import { UndergroundDot } from '../primitives/UndergroundDot';
import { evolvePath } from '@remotion/paths';
import { SceneLyrics } from '../lyrics/SceneLyrics';
import { SideParticleStream } from '../primitives/SideParticleStream';
import { FloatingReactions } from '../primitives/FloatingReactions';
import { LiveTelemetryStream } from '../primitives/LiveTelemetryStream';
import { CodeCascade } from '../primitives/CodeCascade';
import { ExpandingReticles } from '../primitives/ExpandingReticles';

export const Scene02: React.FC = () => {
  const { sec } = useClock();

  // Underground dot pulses once per bar (~1.875s)
  const barProgress = (sec % 1.875) / 1.875;
  const dotPulse = Math.max(0, Math.sin(barProgress * Math.PI));

  // Dynamic Multi-Waypoint Virtual Camera Choreography for Verse 1:
  let camScale = 1.0;
  let camOriginX = 960;
  let camOriginY = 540;

  const gapPush = ramp(sec, 43.51, 3.58, Easing.inOut(Easing.cubic));

  // 128 BPM Kick groove bounce on Camera
  const beatPeriod = 60 / 128; // 0.46875s
  const beatPhase = ((sec - 18.55) % beatPeriod) / beatPeriod;
  const kickPulse = Math.pow(Math.max(0, 1 - beatPhase * 3.2), 2.2);

  if (sec < 21.16) {
    // b1: Macro push right into Prompt Box typing (scale up to 1.82, origin down to 920)
    const p = ramp(sec, 18.55, 1.4, Easing.out(Easing.cubic));
    camScale = interpolate(p, [0, 1], [1.0, 1.82]);
    camOriginX = 960;
    camOriginY = interpolate(p, [0, 1], [540, 920]);
  } else if (sec < 25.44) {
    // b2: Sweep up-right to Canvas (scale 1.76, pan to x=1420, y=260)
    const p = ramp(sec, 21.16, 1.4, Easing.inOut(Easing.cubic));
    camScale = interpolate(p, [0, 1], [1.82, 1.76]);
    camOriginX = interpolate(p, [0, 1], [960, 1420]);
    camOriginY = interpolate(p, [0, 1], [920, 260]);
  } else if (sec < 28.77) {
    // b3: Sweep across to Spark at center (scale 1.62, originX=960, originY=440)
    const p = ramp(sec, 25.44, 1.2, Easing.inOut(Easing.cubic));
    camScale = interpolate(p, [0, 1], [1.76, 1.62]);
    camOriginX = interpolate(p, [0, 1], [1420, 960]);
    camOriginY = interpolate(p, [0, 1], [260, 440]);
  } else if (sec < 32.7) {
    // b4: Deep macro zoom into 3 forks locking onto "feels" (scale 1.76, originX=680, originY=820)
    const p = ramp(sec, 28.77, 1.2, Easing.inOut(Easing.cubic));
    camScale = interpolate(p, [0, 1], [1.62, 1.76]);
    camOriginX = interpolate(p, [0, 1], [960, 680]);
    camOriginY = interpolate(p, [0, 1], [440, 820]);
  } else if (sec < 40.11) {
    // b5 & b6: Center on "everything you dream" radar dial (scale 1.60, originX=960, originY=440)
    const p = ramp(sec, 32.7, 1.4, Easing.inOut(Easing.cubic));
    camScale = interpolate(p, [0, 1], [1.76, 1.60]);
    camOriginX = interpolate(p, [0, 1], [680, 960]);
    camOriginY = interpolate(p, [0, 1], [820, 440]);
  } else if (sec < 43.51) {
    // b7: Rings pulse outward through typed text (pull back to 1.35)
    const p = ramp(sec, 40.11, 1.2, Easing.inOut(Easing.cubic));
    camScale = interpolate(p, [0, 1], [1.60, 1.35]);
    camOriginX = 960;
    camOriginY = interpolate(p, [0, 1], [440, 540]);
  } else if (sec < 46.5) {
    // b8: Push deeply into space between words / The Gap (scale up to 1.85!)
    const p = (sec - 43.51) / (46.5 - 43.51);
    const ep = Easing.inOut(Easing.cubic)(p);
    camScale = 1.35 + ep * 0.50; // 1.35 -> 1.85
    camOriginX = 960;
    camOriginY = 540;
  } else {
    // 46.5s to 47.09s: Safe resolution to 1.0, 960, 540 for B2 match cut!
    const p = (sec - 46.5) / (47.09 - 46.5);
    const ep = Easing.inOut(Easing.cubic)(p);
    camScale = 1.85 - ep * 0.85; // 1.85 -> 1.0
    camOriginX = 960;
    camOriginY = 540;
  }

  // Groove kick pulse
  const kickAmount = sec >= 18.8 && sec < 46.5 ? kickPulse * 0.065 : 0;
  camScale = camScale * (1 + kickAmount);

  // Subtle multi-frequency organic camera drift (smoothly zeroes before B2 boundary)
  if (sec < 46.0) {
    const driftP = ramp(sec, 18.55, 1.0) * (1 - ramp(sec, 45.0, 1.0));
    const driftX = (Math.sin(sec * 1.1) * 14 + Math.cos(sec * 0.7) * 9) * driftP;
    const driftY = (Math.cos(sec * 0.9) * 10 + Math.sin(sec * 1.3) * 7) * driftP;
    camOriginX += driftX;
    camOriginY += driftY;
  }

  // Prompt Box typing
  const promptText = 'make me something that feels like';
  const typedCount = Math.min(
    promptText.length,
    Math.floor(14 * Math.max(0, sec - 18.55))
  );
  const promptGlow = Math.min(1, ramp(sec, 18.55, 0.4));

  // b2: Half picture & half lock (21.16 - 25.44)
  const drawProg = Math.min(0.5, ramp(sec, 21.16, 4.0) * 0.5);
  const framePath = 'M 0 0 L 160 0 L 160 120 L 0 120 Z';
  const lockBodyPath = 'M 0 40 L 100 40 L 100 120 L 0 120 Z';
  const lockShacklePath = 'M 25 40 A 25 25 0 0 1 75 40';

  const evolvedFrame = evolvePath(drawProg, framePath);
  const evolvedLockBody = evolvePath(drawProg, lockBodyPath);
  const evolvedShackle = evolvePath(drawProg, lockShacklePath);

  // b3 & b4: Spark and pointer line
  const showSpark = sec >= 25.44 && sec < 32.7;
  const lineSlide = ramp(sec, 25.44, 2.5);

  // b4: Three forks
  const forkProgress = ramp(sec, 28.77, 1.5);
  const forkFade = ramp(sec, 30.5, 1.5);
  const flicker = sec >= 30.5 ? Math.floor(sec * 10) % 2 === 0 : true;

  // b5 & b6: Circle dream & stall at 60%
  const showCircle = sec >= 32.7 && sec < 40.11;
  const pieFill = Math.min(0.6, ramp(sec, 32.7, 3.2) * 0.6);
  const showMean = sec >= 36.63 && sec < 40.11;
  const meanOpacity = ramp(sec, 36.63, 0.5);

  // b7: Rings pulse
  const showRings = sec >= 40.11;
  const ringPhase = ((sec - 40.11) * 2.1) % 1; // ~128 BPM pulse

  // b8: Spaces widen
  const gapWidth = ramp(sec, 43.51, 3.5) * 64;

  // Rotating radar sweep angle
  const radarSweepAngle = ((sec * 72) % 360);

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 1920,
        height: 1080,
        backgroundColor: COLORS.surface,
        overflow: 'hidden',
      }}
    >
      <Camera scale={camScale} originX={camOriginX} originY={camOriginY}>
        {/* Dynamic Background Atmosphere: Cascading Code, Sideways Particle Streams, Floating Reactions & Reticles */}
        <CodeCascade columns={7} opacity={0.18} />
        <SideParticleStream density={18} speed={1.2} showTokens={true} opacity={0.5} />
        <FloatingReactions count={18} types={['reaction', 'billing', 'words']} opacity={0.7} />
        <ExpandingReticles x={960} y={940} maxRadius={240} color={COLORS.orange} opacity={0.4} />
        <ExpandingReticles x={1420} y={260} maxRadius={180} color={COLORS.teal} opacity={0.35} />

        {/* Live Active Telemetry HUD at Top-Right */}
        <LiveTelemetryStream
          variant="hud"
          style={{
            position: 'absolute',
            right: 28,
            top: 48,
            zIndex: 35,
          }}
        />

        {/* Top Desktop Chrome Bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1920,
            height: 40,
            backgroundColor: `${COLORS.navy}f2`,
            borderBottom: `1px solid ${COLORS.unlit}44`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: 18,
            paddingRight: 24,
            boxSizing: 'border-box',
            zIndex: 30,
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          }}
        >
          {/* macOS Traffic Lights with Micro Symbols */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#FF5F56',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4C0000',
                fontSize: 8,
                fontWeight: 800,
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4)',
              }}
            >
              ×
            </div>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#FFBD2E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#5B3F00',
                fontSize: 8,
                fontWeight: 800,
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4)',
              }}
            >
              –
            </div>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#27C93F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0D4715',
                fontSize: 8,
                fontWeight: 800,
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4)',
              }}
            >
              +
            </div>
          </div>

          {/* Center Window Title Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              backgroundColor: `${COLORS.surface}88`,
              padding: '3px 12px',
              borderRadius: 16,
              border: `1px solid ${COLORS.unlit}33`,
            }}
          >
            {/* Claude Spark Icon */}
            <svg width={14} height={14} viewBox="0 0 24 24" fill={COLORS.orange}>
              <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6Z" />
            </svg>
            <span
              style={{
                fontFamily: fontFamilyInter,
                fontSize: 12,
                fontWeight: 600,
                color: COLORS.text,
                letterSpacing: '-0.01em',
              }}
            >
              Claude Desktop &middot; Verse 1
            </span>
            <span style={{ color: `${COLORS.unlit}66` }}>|</span>
            <span
              style={{
                fontFamily: fontFamilyMono,
                fontSize: 10,
                color: COLORS.orange,
                padding: '1px 6px',
                borderRadius: 4,
                backgroundColor: `${COLORS.orange}22`,
                border: `1px solid ${COLORS.orange}44`,
                fontWeight: 600,
              }}
            >
              3.7 Sonnet (Thinking)
            </span>
          </div>

          {/* Right Status Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontFamily: fontFamilyMono, fontSize: 10, color: COLORS.unlit }}>
              60 FPS &bull; 16.67ms
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  backgroundColor: COLORS.teal,
                  boxShadow: `0 0 6px ${COLORS.teal}`,
                }}
              />
              <span style={{ fontFamily: fontFamilyMono, fontSize: 10, color: COLORS.teal, fontWeight: 600 }}>
                ONLINE
              </span>
            </div>
          </div>
        </div>

        {/* High-Fidelity Sidebar */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 40,
            width: 290,
            height: 1040,
            backgroundColor: `${COLORS.navy}cc`,
            borderRight: `1px solid ${COLORS.unlit}33`,
            padding: 16,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            zIndex: 20,
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Top New Chat & Recents */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* New Chat Button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: 8,
                backgroundColor: `${COLORS.unlit}22`,
                border: `1px solid ${COLORS.unlit}44`,
                color: COLORS.text,
                fontFamily: fontFamilyInter,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14, color: COLORS.orange, fontWeight: 700 }}>+</span>
                <span>New Chat</span>
              </div>
              <span
                style={{
                  fontFamily: fontFamilyMono,
                  fontSize: 10,
                  color: COLORS.unlit,
                  padding: '1px 5px',
                  borderRadius: 4,
                  backgroundColor: `${COLORS.unlit}33`,
                }}
              >
                ⌘K
              </span>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: 6 }}>
              {['All', 'DSP', 'Tokens', 'Prod'].map((tag, idx) => (
                <div
                  key={tag}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '3px 0',
                    borderRadius: 4,
                    backgroundColor: idx === 0 ? `${COLORS.orange}22` : `${COLORS.unlit}15`,
                    border: `1px solid ${idx === 0 ? COLORS.orange : 'transparent'}`,
                    fontFamily: fontFamilyMono,
                    fontSize: 9,
                    color: idx === 0 ? COLORS.orange : COLORS.unlit,
                    fontWeight: idx === 0 ? 700 : 500,
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>

            {/* Recents Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontFamily: fontFamilyMono,
                    fontSize: 9.5,
                    color: COLORS.unlit,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                  }}
                >
                  Recent Sessions
                </span>
                <span style={{ fontFamily: fontFamilyMono, fontSize: 9, color: `${COLORS.unlit}66` }}>
                  4 ACTIVE
                </span>
              </div>

              {/* Active Conversation */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                  padding: '8px 10px',
                  borderRadius: 6,
                  backgroundColor: `${COLORS.orange}18`,
                  borderLeft: `3px solid ${COLORS.orange}`,
                  borderTop: `1px solid ${COLORS.orange}33`,
                  borderRight: `1px solid ${COLORS.orange}22`,
                  borderBottom: `1px solid ${COLORS.orange}22`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: COLORS.orange }} />
                    <span
                      style={{
                        fontFamily: fontFamilyInter,
                        fontSize: 12,
                        fontWeight: 600,
                        color: COLORS.text,
                      }}
                    >
                      Between the Words
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: fontFamilyMono,
                      fontSize: 8.5,
                      color: COLORS.orange,
                      padding: '1px 4px',
                      borderRadius: 3,
                      backgroundColor: `${COLORS.orange}22`,
                    }}
                  >
                    SONG
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: fontFamilyMono,
                    fontSize: 9.5,
                    color: `${COLORS.text}66`,
                    paddingLeft: 14,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  &gt; {promptText.slice(0, typedCount) || 'waiting for input...'}
                </span>
              </div>

              {/* Other Chat Items */}
              {[
                { title: 'Audio Engine Waveform', tag: 'DSP', icon: '⚡' },
                { title: 'Design System & Tokens', tag: 'UI', icon: '🎨' },
                { title: 'Deterministic Animation', tag: 'MATH', icon: '📐' },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    borderRadius: 6,
                    color: COLORS.unlit,
                    backgroundColor: `${COLORS.surface}44`,
                    border: `1px solid ${COLORS.unlit}18`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 10, opacity: 0.7 }}>{item.icon}</span>
                    <span
                      style={{
                        fontFamily: fontFamilyInter,
                        fontSize: 11.5,
                        color: `${COLORS.text}aa`,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: 160,
                      }}
                    >
                      {item.title}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: fontFamilyMono,
                      fontSize: 8.5,
                      color: COLORS.unlit,
                      padding: '1px 4px',
                      borderRadius: 3,
                      backgroundColor: `${COLORS.unlit}22`,
                    }}
                  >
                    {item.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* User Account & Context Window Telemetry */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Context Window Usage Gauge */}
            <div
              style={{
                padding: '8px 10px',
                borderRadius: 6,
                backgroundColor: `${COLORS.surface}66`,
                border: `1px solid ${COLORS.unlit}22`,
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: fontFamilyMono, fontSize: 9, color: COLORS.unlit }}>
                  CONTEXT TOKENS
                </span>
                <span style={{ fontFamily: fontFamilyMono, fontSize: 9, color: COLORS.teal, fontWeight: 600 }}>
                  {typedCount * 4 + 128} / 200,000
                </span>
              </div>
              <div style={{ width: '100%', height: 3, backgroundColor: `${COLORS.unlit}33`, borderRadius: 2, overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${Math.max(2, (typedCount / promptText.length) * 12)}%`,
                    height: '100%',
                    backgroundColor: COLORS.teal,
                  }}
                />
              </div>
            </div>

            {/* User Profile Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: 8,
                backgroundColor: `${COLORS.unlit}15`,
                border: `1px solid ${COLORS.unlit}25`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    backgroundColor: COLORS.teal,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: COLORS.navy,
                    fontFamily: fontFamilyInter,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  A
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontFamily: fontFamilyInter, fontSize: 12, color: COLORS.text, fontWeight: 600 }}>
                    Aarav
                  </span>
                  <span style={{ fontFamily: fontFamilyMono, fontSize: 8.5, color: `${COLORS.text}66` }}>
                    aarav@remotion.local
                  </span>
                </div>
              </div>
              <span
                style={{
                  fontFamily: fontFamilyMono,
                  fontSize: 9,
                  color: COLORS.teal,
                  padding: '2px 6px',
                  borderRadius: 4,
                  backgroundColor: `${COLORS.teal}22`,
                  fontWeight: 700,
                  border: `1px solid ${COLORS.teal}44`,
                }}
              >
                PRO
              </span>
            </div>
          </div>
        </div>

        {/* Main Chat Workspace Header */}
        <div
          style={{
            position: 'absolute',
            left: 310,
            top: 54,
            right: 48,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `1px solid ${COLORS.unlit}22`,
            paddingBottom: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontFamily: fontFamilyInter, fontSize: 17, fontWeight: 600, color: COLORS.text }}>
              Verse 1 &middot; Creative Dialogue
            </span>
            <span
              style={{
                fontFamily: fontFamilyMono,
                fontSize: 10,
                color: COLORS.unlit,
                padding: '2px 8px',
                borderRadius: 10,
                backgroundColor: `${COLORS.unlit}22`,
                border: `1px solid ${COLORS.unlit}33`,
              }}
            >
              ID: C-3701
            </span>
            <span
              style={{
                fontFamily: fontFamilyMono,
                fontSize: 10,
                color: COLORS.orange,
                padding: '2px 8px',
                borderRadius: 10,
                backgroundColor: `${COLORS.orange}18`,
                border: `1px solid ${COLORS.orange}33`,
              }}
            >
              TEMPO: 128 BPM
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontFamily: fontFamilyMono, fontSize: 10, color: COLORS.unlit }}>
                REASONING BUDGET:
              </span>
              <span style={{ fontFamily: fontFamilyMono, fontSize: 10, color: COLORS.teal, fontWeight: 600 }}>
                16,384 TOKENS
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: COLORS.teal }} />
              <span style={{ fontFamily: fontFamilyMono, fontSize: 11, color: COLORS.teal, fontWeight: 600 }}>
                Active Stream
              </span>
            </div>
          </div>
        </div>

        {/* User Chat Prompt Message Bubble (Top Right of conversation) */}
        {typedCount > 0 && (
          <div
            style={{
              position: 'absolute',
              right: 64,
              top: 100,
              maxWidth: 720,
              backgroundColor: `${COLORS.navy}aa`,
              border: `1px solid ${COLORS.unlit}44`,
              borderRadius: 14,
              padding: '14px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    backgroundColor: COLORS.teal,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 9,
                    fontWeight: 700,
                    color: COLORS.navy,
                  }}
                >
                  A
                </div>
                <span style={{ fontFamily: fontFamilyInter, fontSize: 11, fontWeight: 600, color: COLORS.text }}>
                  Aarav
                </span>
              </div>
              <span style={{ fontFamily: fontFamilyMono, fontSize: 9.5, color: COLORS.unlit }}>
                14:02:19 &bull; PROMPT #1
              </span>
            </div>
            <div
              style={{
                fontFamily: fontFamilyInter,
                fontSize: 16,
                color: COLORS.text,
                lineHeight: 1.4,
                letterSpacing: '-0.01em',
              }}
            >
              <span>{promptText.slice(0, typedCount)}</span>
              {typedCount < promptText.length && (
                <span style={{ color: COLORS.orange, fontWeight: 700 }}>|</span>
              )}
            </div>
          </div>
        )}

        {/* b2: Picture frame and padlock (right of chat, x: 1240, y: 220) */}
        {sec >= 21.16 && sec < 26.0 && (
          <div style={{ position: 'absolute', left: 1200, top: 220 }}>
            {/* CAD Blueprint Frame Wrapper */}
            <div
              style={{
                position: 'relative',
                padding: '24px 28px',
                borderRadius: 14,
                backgroundColor: `${COLORS.navy}e6`,
                border: `1px solid ${COLORS.unlit}55`,
                display: 'flex',
                gap: 50,
                alignItems: 'center',
                boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
              }}
            >
              {/* CAD Header Ribbon */}
              <div
                style={{
                  position: 'absolute',
                  top: -12,
                  left: 20,
                  backgroundColor: COLORS.navy,
                  padding: '1px 8px',
                  borderRadius: 4,
                  border: `1px solid ${COLORS.orange}66`,
                  fontFamily: fontFamilyMono,
                  fontSize: 8.5,
                  color: COLORS.orange,
                  letterSpacing: '0.08em',
                  fontWeight: 700,
                }}
              >
                CAD DRAFTING SPEC &bull; SECTION 02-B
              </div>

              {/* Picture frame */}
              <div style={{ position: 'relative', width: 190, height: 160 }}>
                <svg width={190} height={160} style={{ overflow: 'visible', position: 'absolute', left: 0, top: 0 }}>
                  {/* Blueprint grid dots */}
                  {[0, 40, 80, 120, 160].map((gx) =>
                    [0, 30, 60, 90, 120].map((gy) => (
                      <circle
                        key={`${gx}-${gy}`}
                        cx={gx}
                        cy={gy}
                        r={0.8}
                        fill={COLORS.unlit}
                        opacity={0.4}
                      />
                    ))
                  )}

                  {/* Main Frame Path */}
                  <path
                    d={framePath}
                    fill="none"
                    stroke={COLORS.text}
                    strokeWidth={2}
                    strokeDasharray={evolvedFrame.strokeDasharray}
                    strokeDashoffset={evolvedFrame.strokeDashoffset}
                  />

                  {/* CAD Dimension Extension Lines */}
                  {drawProg > 0.1 && (
                    <g opacity={drawProg * 2}>
                      {/* Top Horizontal Dimension |<-- 160.00 mm -->| */}
                      <line x1={0} y1={-14} x2={160} y2={-14} stroke={COLORS.orange} strokeWidth={1} strokeDasharray="3 2" />
                      <line x1={0} y1={-18} x2={0} y2={-10} stroke={COLORS.orange} strokeWidth={1.2} />
                      <line x1={160} y1={-18} x2={160} y2={-10} stroke={COLORS.orange} strokeWidth={1.2} />
                      <text x={80} y={-18} fill={COLORS.orange} fontSize={8.5} fontFamily={fontFamilyMono} textAnchor="middle">
                        160.00 mm
                      </text>

                      {/* Right Vertical Dimension */}
                      <line x1={174} y1={0} x2={174} y2={120} stroke={COLORS.orange} strokeWidth={1} strokeDasharray="3 2" />
                      <line x1={170} y1={0} x2={178} y2={0} stroke={COLORS.orange} strokeWidth={1.2} />
                      <line x1={170} y1={120} x2={178} y2={120} stroke={COLORS.orange} strokeWidth={1.2} />
                      <text x={180} y={64} fill={COLORS.orange} fontSize={8.5} fontFamily={fontFamilyMono} textAnchor="start">
                        120.00 mm
                      </text>
                    </g>
                  )}

                  {/* Corner CAD fiducials */}
                  <g opacity={0.7}>
                    <line x1={-6} y1={0} x2={6} y2={0} stroke={COLORS.teal} strokeWidth={1} />
                    <line x1={0} y1={-6} x2={0} y2={6} stroke={COLORS.teal} strokeWidth={1} />
                    <line x1={154} y1={0} x2={166} y2={0} stroke={COLORS.teal} strokeWidth={1} />
                    <line x1={160} y1={-6} x2={160} y2={6} stroke={COLORS.teal} strokeWidth={1} />
                    <line x1={154} y1={120} x2={166} y2={120} stroke={COLORS.teal} strokeWidth={1} />
                    <line x1={160} y1={114} x2={160} y2={126} stroke={COLORS.teal} strokeWidth={1} />
                    <line x1={-6} y1={120} x2={6} y2={120} stroke={COLORS.teal} strokeWidth={1} />
                    <line x1={0} y1={114} x2={0} y2={126} stroke={COLORS.teal} strokeWidth={1} />
                  </g>

                  {/* Internal aspect ratio vector guides */}
                  <line x1={0} y1={0} x2={160} y2={120} stroke={`${COLORS.unlit}33`} strokeWidth={1} strokeDasharray="4 4" />
                  <line x1={160} y1={0} x2={0} y2={120} stroke={`${COLORS.unlit}33`} strokeWidth={1} strokeDasharray="4 4" />
                </svg>
                <div
                  style={{
                    position: 'absolute',
                    bottom: -22,
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                    fontFamily: fontFamilyMono,
                    fontSize: 9.5,
                    color: COLORS.unlit,
                    letterSpacing: '0.04em',
                  }}
                >
                  CANVAS: 160 &times; 120 px
                </div>
              </div>

              {/* Padlock */}
              <div style={{ position: 'relative', width: 140, height: 160 }}>
                <svg width={140} height={160} style={{ overflow: 'visible', position: 'absolute', left: 0, top: 0 }}>
                  {/* Shackle */}
                  <path
                    d={lockShacklePath}
                    fill="none"
                    stroke={COLORS.text}
                    strokeWidth={2.5}
                    strokeDasharray={evolvedShackle.strokeDasharray}
                    strokeDashoffset={evolvedShackle.strokeDashoffset}
                  />

                  {/* Body */}
                  <path
                    d={lockBodyPath}
                    fill="none"
                    stroke={COLORS.text}
                    strokeWidth={2.5}
                    strokeDasharray={evolvedLockBody.strokeDasharray}
                    strokeDashoffset={evolvedLockBody.strokeDashoffset}
                  />

                  {/* 5 Visible Tumbler Pin Channels */}
                  {[18, 34, 50, 66, 82].map((pinX, pIdx) => (
                    <g key={pinX} opacity={0.4}>
                      <line x1={pinX} y1={46} x2={pinX} y2={64} stroke={COLORS.unlit} strokeWidth={1} strokeDasharray="1 2" />
                      <circle cx={pinX} cy={50 + (pIdx % 3) * 3} r={1.5} fill={COLORS.orange} />
                    </g>
                  ))}

                  {/* Padlock keyhole */}
                  <circle cx={50} cy={82} r={6} fill="none" stroke={COLORS.orange} strokeWidth={1.8} opacity={0.85} />
                  <line x1={50} y1={88} x2={50} y2={102} stroke={COLORS.orange} strokeWidth={2.2} strokeLinecap="round" opacity={0.85} />
                  <circle cx={50} cy={102} r={1.5} fill={COLORS.orange} />
                </svg>

                <div
                  style={{
                    position: 'absolute',
                    bottom: -22,
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                    fontFamily: fontFamilyMono,
                    fontSize: 9.5,
                    color: COLORS.orange,
                    fontWeight: 600,
                  }}
                >
                  AES-256 ENCLAVE
                </div>
              </div>
            </div>
          </div>
        )}

        {/* b3: The Spark and pointer line with Gaussian Distribution */}
        {showSpark && (
          <>
            <Spark x={960} y={440} burst={0.5} />
            <svg
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 1920,
                height: 1080,
                pointerEvents: 'none',
              }}
            >
              {/* Outer Glow Line */}
              <line
                x1={960}
                y1={440}
                x2={960 + (680 - 960) * lineSlide}
                y2={440 + (910 - 440) * lineSlide}
                stroke={COLORS.orange}
                strokeWidth={4}
                opacity={0.3}
              />
              {/* Coherent Inner Optical Core Line */}
              <line
                x1={960}
                y1={440}
                x2={960 + (680 - 960) * lineSlide}
                y2={440 + (910 - 440) * lineSlide}
                stroke="#FFFFFF"
                strokeWidth={1.5}
              />

              {/* Laser energy pulses along pointer line */}
              {lineSlide > 0.3 && (
                <circle
                  cx={960 + (680 - 960) * ((sec * 2.5) % 1)}
                  cy={440 + (910 - 440) * ((sec * 2.5) % 1)}
                  r={3}
                  fill={COLORS.orange}
                  opacity={0.8}
                />
              )}

              {/* b4: Three dotted forks with probability readouts */}
              {sec >= 28.77 && (
                <>
                  {/* Fork 1: fades */}
                  <g opacity={Math.max(0, forkProgress - forkFade)}>
                    <line
                      x1={680}
                      y1={910}
                      x2={590}
                      y2={850}
                      stroke={COLORS.orange}
                      strokeWidth={2}
                      strokeDasharray="4 4"
                    />
                    <circle cx={590} cy={850} r={3} fill={COLORS.unlit} />
                    <text x={530} y={845} fill={COLORS.unlit} fontSize="10" fontFamily={fontFamilyMono}>
                      p=0.14 [looks]
                    </text>
                  </g>

                  {/* Fork 2: fades */}
                  <g opacity={Math.max(0, forkProgress - forkFade)}>
                    <line
                      x1={680}
                      y1={910}
                      x2={750}
                      y2={850}
                      stroke={COLORS.orange}
                      strokeWidth={2}
                      strokeDasharray="4 4"
                    />
                    <circle cx={750} cy={850} r={3} fill={COLORS.unlit} />
                    <text x={760} y={845} fill={COLORS.unlit} fontSize="10" fontFamily={fontFamilyMono}>
                      p=0.19 [acts]
                    </text>
                  </g>

                  {/* Fork 3: flickers and stays with confidence lock */}
                  <g opacity={flicker ? 1 : 0.4}>
                    <line
                      x1={680}
                      y1={910}
                      x2={680}
                      y2={840}
                      stroke={COLORS.orange}
                      strokeWidth={2.5}
                      strokeDasharray="4 4"
                    />
                    <circle cx={680} cy={840} r={4} fill={COLORS.orange} />
                    <rect
                      x={635}
                      y={808}
                      width={105}
                      height={24}
                      rx={4}
                      fill={COLORS.navy}
                      stroke={COLORS.orange}
                      strokeWidth={1.5}
                    />
                    <text x={642} y={824} fill={COLORS.orange} fontSize="11" fontWeight="bold" fontFamily={fontFamilyMono}>
                      p=0.92 [feels]
                    </text>
                  </g>
                </>
              )}
            </svg>
          </>
        )}

        {/* b5 & b6: Circle dream and stall with Master Vector Radar */}
        {showCircle && (
          <div style={{ position: 'absolute', left: 960, top: 440, pointerEvents: 'none' }}>
            <svg
              width={380}
              height={380}
              style={{ position: 'absolute', left: -190, top: -190, overflow: 'visible' }}
            >
              {/* Outer compass degree ticks (360 degrees, 15 deg steps) */}
              {Array.from({ length: 24 }).map((_, i) => {
                const deg = i * 15;
                const isMajor = deg % 45 === 0;
                const rad = (deg * Math.PI) / 180;
                const rInner = isMajor ? 148 : 154;
                const rOuter = 162;
                const x1 = 190 + rInner * Math.sin(rad);
                const y1 = 190 - rInner * Math.cos(rad);
                const x2 = 190 + rOuter * Math.sin(rad);
                const y2 = 190 - rOuter * Math.cos(rad);
                return (
                  <g key={deg}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={isMajor ? COLORS.orange : `${COLORS.unlit}88`}
                      strokeWidth={isMajor ? 1.8 : 1}
                    />
                    {isMajor && (
                      <text
                        x={190 + 174 * Math.sin(rad)}
                        y={190 - 174 * Math.cos(rad) + 3}
                        fill={COLORS.unlit}
                        fontSize={8.5}
                        fontFamily={fontFamilyMono}
                        textAnchor="middle"
                      >
                        {deg.toString().padStart(3, '0')}&deg;
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Concentric Range Rings */}
              {[40, 80, 120, 150].map((r, idx) => (
                <circle
                  key={r}
                  cx={190}
                  cy={190}
                  r={r}
                  fill="none"
                  stroke={`${COLORS.unlit}44`}
                  strokeWidth={1}
                  strokeDasharray={idx === 3 ? undefined : '2 4'}
                />
              ))}

              {/* Crosshair Grids */}
              <line x1={30} y1={190} x2={350} y2={190} stroke={`${COLORS.unlit}33`} strokeWidth={1} strokeDasharray="3 3" />
              <line x1={190} y1={30} x2={190} y2={350} stroke={`${COLORS.unlit}33`} strokeWidth={1} strokeDasharray="3 3" />

              {/* Radar Sweep Line */}
              <line
                x1={190}
                y1={190}
                x2={190 + 150 * Math.sin((radarSweepAngle * Math.PI) / 180)}
                y2={190 - 150 * Math.cos((radarSweepAngle * Math.PI) / 180)}
                stroke={`${COLORS.orange}88`}
                strokeWidth={1.5}
              />

              {/* Pie fill up to 60% (216 degrees) */}
              {pieFill > 0 && (
                <path
                  d={`M 190 190 L 190 40 A 150 150 0 ${pieFill > 0.5 ? 1 : 0} 1 ${
                    190 + 150 * Math.sin(pieFill * 2 * Math.PI)
                  } ${190 - 150 * Math.cos(pieFill * 2 * Math.PI)} Z`}
                  fill={`${COLORS.orange}33`}
                  stroke={COLORS.orange}
                  strokeWidth={2}
                />
              )}

              {/* Center reticle target */}
              <circle cx={190} cy={190} r={4} fill={COLORS.orange} />
              <circle cx={190} cy={190} r={8} fill="none" stroke={COLORS.orange} strokeWidth={1} />
            </svg>

            {/* Label "everything you dream" */}
            <div
              style={{
                position: 'absolute',
                left: -180,
                top: 175,
                width: 360,
                textAlign: 'center',
                fontFamily: fontFamilyInter,
                fontSize: 18,
                color: COLORS.text,
                fontWeight: 600,
                letterSpacing: '-0.01em',
              }}
            >
              everything you dream
              <div
                style={{
                  fontFamily: fontFamilyMono,
                  fontSize: 10,
                  color: COLORS.orange,
                  marginTop: 4,
                  letterSpacing: '0.08em',
                  fontWeight: 700,
                }}
              >
                CAPACITY: 60.0% &bull; STALLED AT 216.0&deg;
              </div>
            </div>

            {/* b6: "?" over unfilled 40% */}
            {showMean && (
              <div
                style={{
                  position: 'absolute',
                  left: -120,
                  top: -80,
                  opacity: meanOpacity,
                  textAlign: 'center',
                  padding: '10px 14px',
                  borderRadius: 8,
                  backgroundColor: `${COLORS.navy}e6`,
                  border: `1px solid ${COLORS.orange}88`,
                  boxShadow: `0 0 20px ${COLORS.orange}33`,
                }}
              >
                <div style={{ fontFamily: fontFamilyInter, fontSize: 32, fontWeight: 800, color: COLORS.orange }}>
                  ?
                </div>
                <div style={{ fontFamily: fontFamilyInter, fontSize: 15, color: COLORS.text, fontWeight: 600 }}>
                  what you mean
                </div>
                <div style={{ fontFamily: fontFamilyMono, fontSize: 9.5, color: COLORS.unlit, marginTop: 3 }}>
                  UNMAPPED LATENT: 40.0%
                </div>
              </div>
            )}
          </div>
        )}

        {/* b7: Concentric rings */}
        {showRings && sec < 43.51 && (
          <Rings x={960} y={440} phase={ringPhase} maxRadius={360} count={4} color={COLORS.orange} />
        )}

        {/* b8: Gap widening between words */}
        {sec >= 43.51 && (
          <>
            <Gap x={960} y={540} h={600} gapWidth={gapWidth} warm={gapPush} />

            {/* Kinetic Typography: Words pushed apart by the pulsing rings */}
            <div
              style={{
                position: 'absolute',
                left: 960 - gapWidth / 2 - 300,
                top: 524,
                width: 280,
                textAlign: 'right',
                fontFamily: fontFamilyMono,
                fontSize: 20,
                fontWeight: 600,
                color: COLORS.text,
                letterSpacing: '0.04em',
                opacity: Math.min(1, gapPush * 2),
                textShadow: `0 0 16px ${COLORS.orange}66`,
              }}
            >
              make me something that
            </div>

            <div
              style={{
                position: 'absolute',
                left: 960 + gapWidth / 2 + 20,
                top: 524,
                width: 260,
                textAlign: 'left',
                fontFamily: fontFamilyMono,
                fontSize: 20,
                fontWeight: 600,
                color: COLORS.orange,
                letterSpacing: '0.04em',
                opacity: Math.min(1, gapPush * 2),
                textShadow: `0 0 16px ${COLORS.orange}aa`,
              }}
            >
              feels like
            </div>
          </>
        )}

        {/* Bottom PromptBox Area with Floating Action Toolbar */}
        <div style={{ position: 'absolute', left: 380, top: 900 }}>
          {/* Action Toolbar above input box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: 1160,
              paddingBottom: 8,
              paddingLeft: 4,
              paddingRight: 4,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '3px 8px',
                  borderRadius: 6,
                  backgroundColor: `${COLORS.surface}cc`,
                  border: `1px solid ${COLORS.unlit}33`,
                }}
              >
                <span style={{ fontSize: 11, color: COLORS.orange }}>🧠</span>
                <span style={{ fontFamily: fontFamilyMono, fontSize: 10, color: COLORS.text, fontWeight: 600 }}>
                  Thinking On
                </span>
              </div>
              <span style={{ fontFamily: fontFamilyMono, fontSize: 9.5, color: COLORS.unlit }}>
                16k tokens budget
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {['📎 Add Context', '🌐 Search', '⚡ Python Sandbox'].map((tool) => (
                <div
                  key={tool}
                  style={{
                    fontFamily: fontFamilyMono,
                    fontSize: 9.5,
                    color: `${COLORS.text}88`,
                    padding: '3px 8px',
                    borderRadius: 5,
                    backgroundColor: `${COLORS.surface}88`,
                    border: `1px solid ${COLORS.unlit}22`,
                  }}
                >
                  {tool}
                </div>
              ))}
            </div>
          </div>

          <PromptBox
            x={0}
            y={0}
            w={1160}
            text={promptText}
            typedChars={typedCount}
            glow={promptGlow}
          />
        </div>

        {/* The Underground Dot: 6 px orange circle at bottom centre (960, 1040), 20% opacity */}
        <UndergroundDot
          x={960}
          y={1040}
          size={6}
          opacity={0.2}
          pulse={dotPulse}
          color={COLORS.orange}
        />

        {/* Integrated Scene Lyrics inside Camera */}
        <SceneLyrics sceneId="S02" />
      </Camera>
    </div>
  );
};

export default Scene02;
