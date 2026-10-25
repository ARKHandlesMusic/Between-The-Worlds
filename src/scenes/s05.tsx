import React from 'react';
import { useClock } from '../lib/clock';
import { ramp } from '../lib/ramp';
import { COLORS } from '../lib/tokens';
import { fontFamilyInter, fontFamilyMono } from '../lib/fonts';
import { Easing } from 'remotion';
import { Camera } from '../lib/camera';
import { Spark } from '../primitives/Spark';
import { Brackets } from '../primitives/Brackets';
import { UndergroundDot } from '../primitives/UndergroundDot';
import { ClaudeIcon } from '../primitives/ClaudeIcon';
import { SceneLyrics } from '../lyrics/SceneLyrics';
import { SideParticleStream } from '../primitives/SideParticleStream';
import { FloatingReactions } from '../primitives/FloatingReactions';
import { LiveTelemetryStream } from '../primitives/LiveTelemetryStream';
import { ExpandingReticles } from '../primitives/ExpandingReticles';
import { CodeCascade } from '../primitives/CodeCascade';

const PARAGRAPH_LINES = [
  'With clever lines and paragraphs that almost sound alright,',
  'Syntax intact, the cadence neat, the meter holding tight,',
  'Every bracket closed in place, the grammar sharp and clean,',
  'Yet lingering between the words, the space that lies unseen,',
  'A phantom chord without a hand, a voice without a face.',
];

export const Scene05: React.FC = () => {
  const { sec } = useClock();

  // Underground dot pulses once per bar (~1.875s)
  const barProgress = (sec % 1.875) / 1.875;
  const dotPulse = Math.max(0, Math.sin(barProgress * Math.PI));

  // Scroll camera down gently across verse
  const scrollY = ramp(sec, 92.84, 25.0) * -180;

  // Dark mode switch at 99.21s (b3)
  const darkMode = ramp(sec, 99.21, 1.2);
  const bgColor = darkMode > 0.5 ? '#070C14' : COLORS.navy;

  // Arc bridge drawn by Spark in b1 (92.84s to 95.37s)
  // Spark moves from (545, 530) toward (825, 490)
  const arcProgress = ramp(sec, 92.84, 1.8);
  const sparkArcX = 545 + arcProgress * 280;
  const sparkArcY = 530 - Math.sin(arcProgress * Math.PI) * 50;

  // Paragraph lines filling in b2 (95.37s to 99.21s)
  const linesProgress = ramp(sec, 95.37, 3.5);

  // Scar drawn on human teal dot in b4 (102.5s to 105.0s)
  const scarProgress = ramp(sec, 102.5, 0.8);

  // Squeeze and bend in b5 (106.36s to 110.24s)
  const squeezePeak =
    ramp(sec, 106.36, 0.8) * (1 - ramp(sec, 108.5, 0.8));
  const permanentBent = sec >= 108.5 ? 0.2 : 0;
  const dotWidth = 24 * (1 - (squeezePeak * 0.4 + permanentBent * 0.15));
  const dotHeight = 24 * (1 + (squeezePeak * 0.5 + permanentBent * 0.2));
  const dotRadius = squeezePeak > 0.5 ? 6 : 12;

  // Letterbox in b6 and b7, opening in b8 (110.24s to 120.99s)
  const letterboxClose = ramp(sec, 110.24, 2.0);
  const letterboxOpen = ramp(sec, 118.5, 2.4);
  const letterboxHeight = Math.max(0, (letterboxClose - letterboxOpen) * 360);

  // Bricks in b7 (113.87s to 117.41s)
  const bricksCount = Math.floor(ramp(sec, 113.87, 2.5) * 6);
  const wallDim = ramp(sec, 118.5, 2.0);

  // Brackets cup and lift in b8 (117.41s to 120.99s)
  const bracketsRotate = ramp(sec, 117.41, 0.8) * 180;
  const liftProgress = ramp(sec, 117.41, 1.8);
  const humanLiftY = liftProgress * -50;

  // Soft light circles in dark mode (b3)
  const lightOpacity =
    ramp(sec, 99.21, 1.0) * (1 - ramp(sec, 114.0, 3.0));

  // Physiological pulse on Card 3 (72 BPM = 0.833s period)
  const ecgPhase = (sec % 0.833) / 0.833;
  const ecgPulse = Math.sin(ecgPhase * Math.PI);

  // 128 BPM Kick drum groove pulse
  const beatPeriod = 60 / 128; // 0.46875s
  const beatPhase = ((sec - 92.84) % beatPeriod) / beatPeriod;
  const kickPulse = Math.pow(Math.max(0, 1 - beatPhase * 3.2), 2.2);

  // Dynamic Camera Waypoints across Verse 2 (92.84s to 120.99s)
  // B4 Match Cut: at 92.84s, scale=1.0, originX=960, originY=540
  // B5 Match Cut: at 120.99s, scale=1.0, originX=960, originY=540
  let baseCamScale = 1.0;
  let camOriginX = 960;
  let camOriginY = 540;

  if (sec < 93.0) {
    // B4 Entry match cut anchor
    baseCamScale = 1.0;
    camOriginX = 960;
    camOriginY = 540;
  } else if (sec < 95.37) {
    // b1 (93.0 - 95.37): Zoom into Spark drawing arc bridge from Card 1 to Card 2
    const p = (sec - 93.0) / (95.37 - 93.0);
    const ep = Easing.inOut(Easing.cubic)(p);
    baseCamScale = 1.0 + ep * 0.55; // 1.0 -> 1.55
    camOriginX = 960 - ep * 280; // 960 -> 680 (tracking spark)
    camOriginY = 540 - ep * 30; // 540 -> 510
  } else if (sec < 99.21) {
    // b2 (95.37 - 99.21): Pan across 5 paragraph lines typing out in Card 2
    const p = (sec - 95.37) / (99.21 - 95.37);
    const ep = Easing.inOut(Easing.cubic)(p);
    baseCamScale = 1.55 + ep * 0.15; // 1.55 -> 1.70
    camOriginX = 680 + ep * 540; // 680 -> 1220 (pan to Card 2 code & text)
    camOriginY = 510 - ep * 50; // 510 -> 460
  } else if (sec < 102.5) {
    // b3 (99.21 - 102.5): Dark mode switch & searchlight reveal
    const p = (sec - 99.21) / (102.5 - 99.21);
    const ep = Easing.inOut(Easing.cubic)(p);
    baseCamScale = 1.70 - ep * 0.35; // 1.70 -> 1.35
    camOriginX = 1220 - ep * 260; // 1220 -> 960
    camOriginY = 460 + ep * 80; // 460 -> 540
  } else if (sec < 106.36) {
    // b4 (102.5 - 106.36): Macro zoom onto human teal dot as jagged scar cuts across
    const p = (sec - 102.5) / (106.36 - 102.5);
    const ep = Easing.inOut(Easing.cubic)(p);
    baseCamScale = 1.35 + ep * 0.38; // 1.35 -> 1.73
    camOriginX = 960;
    camOriginY = 540 - ep * 40; // 540 -> 500 (center on scar)
  } else if (sec < 110.24) {
    // b5 (106.36 - 110.24): Caliper squeeze & bend
    const p = (sec - 106.36) / (110.24 - 106.36);
    const ep = Easing.inOut(Easing.cubic)(p);
    baseCamScale = 1.73 - ep * 0.13; // 1.73 -> 1.60
    camOriginX = 960;
    camOriginY = 500 + ep * 20;
  } else if (sec < 113.87) {
    // b6 (110.24 - 113.87): Letterbox closes in (cinematic 2.39:1 scope)
    const p = (sec - 110.24) / (113.87 - 110.24);
    const ep = Easing.inOut(Easing.cubic)(p);
    baseCamScale = 1.60 - ep * 0.25; // 1.60 -> 1.35
    camOriginX = 960;
    camOriginY = 520 + ep * 20; // 520 -> 540
  } else if (sec < 117.41) {
    // b7 (113.87 - 117.41): Grey bricks place wall one by one
    const p = (sec - 113.87) / (117.41 - 113.87);
    const ep = Easing.inOut(Easing.cubic)(p);
    baseCamScale = 1.35 + ep * 0.25; // 1.35 -> 1.60
    camOriginX = 960 + (ep - 0.5) * 220; // pan across wall
    camOriginY = 540;
  } else if (sec < 120.2) {
    // b8 (117.41 - 120.2): Brackets cup and lift teal dot upward
    const p = (sec - 117.41) / (120.2 - 117.41);
    const ep = Easing.inOut(Easing.cubic)(p);
    baseCamScale = 1.60 - ep * 0.25; // 1.60 -> 1.35
    camOriginX = 960;
    camOriginY = 540 - ep * 60; // track upward lift
  } else {
    // Safe return to scale=1.0, originX=960, originY=540 for B5 match cut!
    const p = (sec - 120.2) / (120.99 - 120.2);
    const ep = Easing.inOut(Easing.cubic)(p);
    baseCamScale = 1.35 - ep * 0.35; // 1.35 -> 1.0
    camOriginX = 960;
    camOriginY = 480 + ep * 60; // 480 -> 540
  }

  // Groove kick pulse active throughout verse
  const kickAmount = sec >= 93.0 && sec < 120.2 ? kickPulse * 0.065 : 0;
  const camScale = baseCamScale * (1 + kickAmount);

  // Subtle multi-frequency organic camera drift (smoothly zeroes before B5 boundary at 120.2s)
  if (sec < 120.2) {
    const driftP = ramp(sec, 92.84, 1.0) * (1 - ramp(sec, 119.5, 0.7));
    const driftX = (Math.sin(sec * 1.1) * 14 + Math.cos(sec * 0.7) * 9) * driftP;
    const driftY = (Math.cos(sec * 0.95) * 10 + Math.sin(sec * 1.4) * 7) * driftP;
    camOriginX += driftX;
    camOriginY += driftY;
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 1920,
        height: 1080,
        backgroundColor: bgColor,
        overflow: 'hidden',
      }}
    >
      <Camera scale={camScale} originX={camOriginX} originY={camOriginY}>
        {/* Dynamic Background Atmosphere: Code Rain, Sideways Particle Streams, Floating Reactions & Reticles */}
        <CodeCascade columns={8} opacity={0.2} />
        <SideParticleStream density={20} speed={1.2} showTokens={true} opacity={0.5} />
        <FloatingReactions count={22} types={['billing', 'words', 'reaction']} opacity={0.75} />
        <ExpandingReticles x={545} y={530} maxRadius={200} color={COLORS.orange} opacity={0.4} />

        {/* Live Active Telemetry HUD at Top-Right */}
        <LiveTelemetryStream
          variant="hud"
          style={{
            position: 'absolute',
            right: 48,
            top: 48,
            zIndex: 30,
          }}
        />

        {/* Scrolling Website Canvas */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: scrollY,
            width: 1920,
            height: 1400,
          }}
        >
          {/* Engineering Blueprint Calipers & 12-Column Layout Grid */}
          <div
            style={{
              position: 'absolute',
              left: 360,
              top: 70,
              width: 1200,
              pointerEvents: 'none',
              opacity: (1 - darkMode * 0.75) * 0.45,
            }}
          >
            {/* Top dimension extension line: 1200.00 px */}
            <svg width={1200} height={24} style={{ display: 'block', overflow: 'visible' }}>
              <line x1={0} y1={12} x2={1200} y2={12} stroke={COLORS.unlit} strokeWidth={1} strokeDasharray="4 4" />
              <line x1={0} y1={4} x2={0} y2={20} stroke={COLORS.unlit} strokeWidth={1.5} />
              <line x1={1200} y1={4} x2={1200} y2={20} stroke={COLORS.unlit} strokeWidth={1.5} />
              <rect x={510} y={2} width={180} height={20} rx={4} fill={bgColor} />
              <text
                x={600}
                y={16}
                fill={COLORS.unlit}
                fontSize={10}
                fontFamily={fontFamilyMono}
                textAnchor="middle"
                letterSpacing="0.08em"
              >
                |&lt;--- 1200.00 px (12 COLS) ---&gt;|
              </text>
            </svg>

            {/* 12-Column responsive guides */}
            <div style={{ display: 'flex', width: 1200, gap: 24, marginTop: 4 }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 820,
                    borderLeft: `1px dashed ${COLORS.unlit}22`,
                    borderRight: `1px dashed ${COLORS.unlit}22`,
                    backgroundColor: `${COLORS.unlit}06`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '2px 4px',
                    boxSizing: 'border-box',
                  }}
                >
                  <span style={{ fontFamily: fontFamilyMono, fontSize: 8, color: `${COLORS.unlit}66` }}>
                    C{String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ fontFamily: fontFamilyMono, fontSize: 7, color: `${COLORS.unlit}44` }}>
                    78px
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Website Navigation Bar */}
          <div
            style={{
              position: 'absolute',
              left: 360,
              top: 100,
              width: 1200,
              height: 56,
              borderRadius: 12,
              backgroundColor: `${COLORS.surface}ee`,
              border: `1px solid ${COLORS.unlit}44`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: 24,
              paddingRight: 24,
              boxSizing: 'border-box',
              opacity: 1 - darkMode * 0.7,
              zIndex: 2,
            }}
          >
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <ClaudeIcon size={18} color={COLORS.orange} />
              <span style={{ fontFamily: fontFamilyInter, fontSize: 13, fontWeight: 700, color: COLORS.text }}>
                CLAUDE // SYNTHESIS
              </span>
              <span
                style={{
                  fontFamily: fontFamilyMono,
                  fontSize: 9,
                  color: COLORS.unlit,
                  marginLeft: 8,
                  padding: '2px 6px',
                  borderRadius: 4,
                  backgroundColor: `${COLORS.unlit}22`,
                }}
              >
                v3.7.0
              </span>
            </div>

            {/* Nav items with active state pill */}
            <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
              {['Philosophy', 'Components', 'Experiments', 'About'].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {i === 0 && <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: COLORS.orange }} />}
                  <span
                    style={{
                      fontFamily: fontFamilyInter,
                      fontSize: 12,
                      color: i === 0 ? COLORS.text : COLORS.unlit,
                      fontWeight: i === 0 ? 600 : 400,
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Status Pill & Telemetry */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontFamily: fontFamilyMono, fontSize: 10, color: `${COLORS.unlit}88` }}>
                VIEWPORT: 1920×1080 @ 120 FPS
              </span>
              <div
                style={{
                  fontFamily: fontFamilyMono,
                  fontSize: 10,
                  color: darkMode > 0.5 ? COLORS.orange : COLORS.teal,
                  padding: '4px 8px',
                  borderRadius: 6,
                  backgroundColor: `${darkMode > 0.5 ? COLORS.orange : COLORS.teal}18`,
                  border: `1px solid ${darkMode > 0.5 ? COLORS.orange : COLORS.teal}33`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <div
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    backgroundColor: darkMode > 0.5 ? COLORS.orange : COLORS.teal,
                  }}
                />
                {darkMode > 0.5 ? 'DARK MODE' : 'LIGHT MODE'}
              </div>
            </div>
          </div>

          {/* Banner Rectangle (ANCHORS.pageBlocks.banner: 360, 180, 1200, 180) */}
          <div
            style={{
              position: 'absolute',
              left: 360,
              top: 180,
              width: 1200,
              height: 180,
              backgroundColor: COLORS.surface,
              borderRadius: 16,
              border: `2px solid ${COLORS.unlit}`,
              boxSizing: 'border-box',
              padding: '24px 36px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              opacity: 1 - darkMode * 0.7,
              zIndex: 2,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  style={{
                    fontFamily: fontFamilyMono,
                    fontSize: 10,
                    color: COLORS.orange,
                    padding: '2px 6px',
                    borderRadius: 4,
                    backgroundColor: `${COLORS.orange}22`,
                  }}
                >
                  v3.7.0 RELEASE
                </span>
                <span style={{ fontFamily: fontFamilyMono, fontSize: 10, color: COLORS.unlit }}>
                  DETERMINISTIC VECTOR WEB
                </span>
                <span style={{ fontFamily: fontFamilyMono, fontSize: 10, color: `${COLORS.unlit}88` }}>
                  • WCAG AAA COMPLIANT
                </span>
              </div>
              <span
                style={{
                  fontFamily: fontFamilyInter,
                  fontSize: 28,
                  fontWeight: 700,
                  color: COLORS.text,
                  letterSpacing: '-0.02em',
                }}
              >
                Where the making happens.
              </span>
              <span style={{ fontFamily: fontFamilyInter, fontSize: 14, color: `${COLORS.text}88` }}>
                A collaborative canvas between human intent and machine synthesis.
              </span>
            </div>

            {/* CTA Buttons with micro-badges */}
            <div style={{ display: 'flex', gap: 12 }}>
              <div
                style={{
                  padding: '10px 18px',
                  borderRadius: 8,
                  backgroundColor: COLORS.orange,
                  color: COLORS.navy,
                  fontFamily: fontFamilyInter,
                  fontSize: 12,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>Explore Interface</span>
                <span style={{ fontSize: 14 }}>&rarr;</span>
              </div>
              <div
                style={{
                  padding: '10px 18px',
                  borderRadius: 8,
                  backgroundColor: `${COLORS.unlit}33`,
                  border: `1px solid ${COLORS.unlit}55`,
                  color: COLORS.text,
                  fontFamily: fontFamilyInter,
                  fontSize: 12,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>Docs</span>
                <span
                  style={{
                    fontFamily: fontFamilyMono,
                    fontSize: 9,
                    color: COLORS.teal,
                    padding: '1px 4px',
                    borderRadius: 3,
                    backgroundColor: `${COLORS.teal}22`,
                  }}
                >
                  API
                </span>
              </div>
            </div>
          </div>

          {/* Flexbox layout inspector bar between Banner and Cards */}
          <div
            style={{
              position: 'absolute',
              left: 360,
              top: 368,
              width: 1200,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pointerEvents: 'none',
              opacity: (1 - darkMode * 0.75) * 0.5,
            }}
          >
            <span style={{ fontFamily: fontFamilyMono, fontSize: 9, color: COLORS.unlit }}>
              CSS: .cards-grid {'{ display: flex; gap: 45px; justify-content: space-between; }'}
            </span>
            <span style={{ fontFamily: fontFamilyMono, fontSize: 9, color: COLORS.unlit }}>
              3 CARDS • 370px × 260px
            </span>
          </div>

          {/* Three Card Blocks (ANCHORS.pageBlocks.cards: 360/775/1190, y: 400, w: 370, h: 260) */}
          <div
            style={{
              position: 'absolute',
              left: 360,
              top: 400,
              width: 1200,
              display: 'flex',
              gap: 45,
              zIndex: 2,
            }}
          >
            {/* Card 1: Agent Reasoning (Spark starts here at center 545, 530) */}
            <div
              style={{
                width: 370,
                height: 260,
                backgroundColor: COLORS.surface,
                borderRadius: 14,
                border: `2px solid ${COLORS.unlit}`,
                boxSizing: 'border-box',
                padding: 18,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: 1 - darkMode * 0.7,
                position: 'relative',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: fontFamilyMono, fontSize: 10, color: COLORS.orange, fontWeight: 700 }}>
                      01 // AGENT REASONING
                    </span>
                    <span
                      style={{
                        fontFamily: fontFamilyMono,
                        fontSize: 8,
                        color: `${COLORS.orange}bb`,
                        padding: '1px 4px',
                        borderRadius: 3,
                        backgroundColor: `${COLORS.orange}18`,
                      }}
                    >
                      AST: CallExpression
                    </span>
                  </div>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: COLORS.orange }} />
                </div>
                <div style={{ fontFamily: fontFamilyInter, fontSize: 16, fontWeight: 600, color: COLORS.text, marginTop: 6 }}>
                  Bot Bridge Synthesis
                </div>
              </div>

              {/* Code Editor block with syntax styling */}
              <div
                style={{
                  backgroundColor: `${COLORS.navy}dd`,
                  borderRadius: 8,
                  padding: 10,
                  fontFamily: fontFamilyMono,
                  fontSize: 10.5,
                  color: `${COLORS.text}bb`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                  border: `1px solid ${COLORS.unlit}33`,
                }}
              >
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ color: `${COLORS.unlit}88` }}>01</span>
                  <span><span style={{ color: COLORS.teal }}>const</span> bridge = <span style={{ color: COLORS.orange }}>invent</span>();</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ color: `${COLORS.unlit}88` }}>02</span>
                  <span>bridge.<span style={{ color: '#E0AF68' }}>span</span>(<span style={{ color: '#7AA2F7' }}>0.72</span>);</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ color: `${COLORS.unlit}88` }}>03</span>
                  <span style={{ color: COLORS.orange }}>&gt; // falls short into void</span>
                </div>
              </div>

              {/* Live Compiler Telemetry Footer */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontFamily: fontFamilyMono,
                  fontSize: 8.5,
                  color: COLORS.unlit,
                  borderTop: `1px solid ${COLORS.unlit}33`,
                  paddingTop: 8,
                }}
              >
                <span>SPEED: 342 t/s</span>
                <span>•</span>
                <span>LATENCY: 8.4 ms</span>
                <span>•</span>
                <span style={{ color: arcProgress > 0 ? COLORS.orange : COLORS.unlit }}>
                  SPAN: {(arcProgress * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Card 2: Uncharted Space / The Void (Latent Gap) */}
            <div
              style={{
                width: 370,
                height: 260,
                backgroundColor: COLORS.surface,
                borderRadius: 14,
                border: `2px solid ${COLORS.unlit}`,
                boxSizing: 'border-box',
                padding: 18,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: 1 - darkMode * 0.7,
                position: 'relative',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: fontFamilyMono, fontSize: 10, color: COLORS.unlit, fontWeight: 700 }}>
                      02 // UNCHARTED SPACE
                    </span>
                    <span
                      style={{
                        fontFamily: fontFamilyMono,
                        fontSize: 8,
                        color: `${COLORS.unlit}bb`,
                        padding: '1px 4px',
                        borderRadius: 3,
                        backgroundColor: `${COLORS.unlit}18`,
                      }}
                    >
                      METRIC: RIEMANN
                    </span>
                  </div>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: COLORS.unlit }} />
                </div>
                <div style={{ fontFamily: fontFamilyInter, fontSize: 16, fontWeight: 600, color: COLORS.text, marginTop: 6 }}>
                  The Latent Gap
                </div>
              </div>

              {/* Vector Topological Latent Contour Map */}
              <div
                style={{
                  height: 104,
                  borderRadius: 8,
                  backgroundColor: `${COLORS.navy}bb`,
                  border: `1px dashed ${COLORS.unlit}55`,
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg
                  width={334}
                  height={104}
                  style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}
                >
                  {/* Nested elliptical probability contours */}
                  {[
                    { rx: 140, ry: 44, op: 0.1 },
                    { rx: 110, ry: 35, op: 0.18 },
                    { rx: 80, ry: 26, op: 0.28 },
                    { rx: 50, ry: 16, op: 0.4 },
                    { rx: 24, ry: 8, op: 0.55 },
                  ].map((ring, idx) => (
                    <ellipse
                      key={idx}
                      cx={167}
                      cy={52}
                      rx={ring.rx}
                      ry={ring.ry}
                      fill="none"
                      stroke={COLORS.unlit}
                      strokeWidth={1}
                      strokeDasharray="4 3"
                      opacity={ring.op}
                    />
                  ))}
                  {/* Singularity center reticle */}
                  <line x1={155} y1={52} x2={179} y2={52} stroke={COLORS.orange} strokeWidth={1} strokeOpacity={0.6} />
                  <line x1={167} y1={40} x2={167} y2={64} stroke={COLORS.orange} strokeWidth={1} strokeOpacity={0.6} />
                  <circle cx={167} cy={52} r={3} fill="none" stroke={COLORS.orange} strokeWidth={1} strokeOpacity={0.8} />
                </svg>

                {/* Center Badge */}
                <div
                  style={{
                    zIndex: 2,
                    fontFamily: fontFamilyMono,
                    fontSize: 9.5,
                    color: COLORS.unlit,
                    letterSpacing: '0.08em',
                    backgroundColor: `${COLORS.surface}ee`,
                    padding: '3px 8px',
                    borderRadius: 4,
                    border: `1px solid ${COLORS.unlit}33`,
                  }}
                >
                  [LATENT VOID // 0.000 DENSITY]
                </div>
              </div>

              {/* Telemetry Footer */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontFamily: fontFamilyMono,
                  fontSize: 8.5,
                  color: COLORS.unlit,
                  borderTop: `1px solid ${COLORS.unlit}33`,
                  paddingTop: 8,
                }}
              >
                <span>SINGULARITY: (960, 530)</span>
                <span>•</span>
                <span>ENTROPY: 7.94 nats</span>
                <span>•</span>
                <span>STATUS: UNBRIDGED</span>
              </div>
            </div>

            {/* Card 3: Human Intent (Teal Dot sits here at center 1375, 530) */}
            <div
              style={{
                width: 370,
                height: 260,
                backgroundColor: COLORS.surface,
                borderRadius: 14,
                border: `2px solid ${COLORS.unlit}`,
                boxSizing: 'border-box',
                padding: 18,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: 1 - darkMode * 0.7,
                position: 'relative',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: fontFamilyMono, fontSize: 10, color: COLORS.teal, fontWeight: 700 }}>
                      03 // HUMAN INTENT
                    </span>
                    <span
                      style={{
                        fontFamily: fontFamilyMono,
                        fontSize: 8,
                        color: `${COLORS.teal}bb`,
                        padding: '1px 4px',
                        borderRadius: 3,
                        backgroundColor: `${COLORS.teal}18`,
                      }}
                    >
                      QUANTUM: ORGANIC
                    </span>
                  </div>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: COLORS.teal }} />
                </div>
                <div style={{ fontFamily: fontFamilyInter, fontSize: 16, fontWeight: 600, color: COLORS.text, marginTop: 6 }}>
                  Silent Contemplation
                </div>
              </div>

              {/* Bio-telemetry & ECG Heartbeat Waveform */}
              <div
                style={{
                  backgroundColor: `${COLORS.navy}dd`,
                  borderRadius: 8,
                  padding: 10,
                  fontFamily: fontFamilyMono,
                  fontSize: 10.5,
                  color: `${COLORS.text}bb`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  border: `1px solid ${COLORS.unlit}33`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: COLORS.teal }}>HEARTBEAT: 72 BPM</span>
                  <span style={{ fontSize: 9, color: `${COLORS.teal}88` }}>P-Q-R-S-T WAVE</span>
                </div>

                {/* Vector ECG Wave line */}
                <svg width={314} height={26} style={{ overflow: 'visible' }}>
                  <line x1={0} y1={13} x2={314} y2={13} stroke={`${COLORS.teal}22`} strokeWidth={1} />
                  <path
                    d={`
                      M 0 13
                      L 40 13
                      L 48 11
                      L 56 13
                      L 62 15
                      L 70 ${13 - 12 * (ecgPulse > 0 ? ecgPulse : 0.2)}
                      L 78 18
                      L 86 13
                      L 98 10
                      L 110 13
                      L 180 13
                      L 188 11
                      L 196 13
                      L 202 15
                      L 210 ${13 - 12 * (ecgPulse > 0 ? ecgPulse : 0.2)}
                      L 218 18
                      L 226 13
                      L 238 10
                      L 250 13
                      L 314 13
                    `}
                    fill="none"
                    stroke={COLORS.teal}
                    strokeWidth={1.5}
                    strokeOpacity={0.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5 }}>
                  <span style={{ color: `${COLORS.text}88` }}>CONSCIOUSNESS: 100%</span>
                  <span style={{ color: COLORS.teal }}>ORGANIC INTENT</span>
                </div>
              </div>

              {/* Telemetry Footer */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontFamily: fontFamilyMono,
                  fontSize: 8.5,
                  color: COLORS.teal,
                  borderTop: `1px solid ${COLORS.unlit}33`,
                  paddingTop: 8,
                }}
              >
                <span>CHROMA: #4EBEB3</span>
                <span>•</span>
                <span>EMPATHY: 1.000</span>
                <span>•</span>
                <span>STATUS: OBSERVING</span>
              </div>
            </div>
          </div>

          {/* Paragraph Block with Grey Bars (ANCHORS.pageBlocks.paragraph: 360, 700, 1200, 160) */}
          <div
            style={{
              position: 'absolute',
              left: 360,
              top: 700,
              width: 1200,
              height: 180,
              backgroundColor: COLORS.surface,
              borderRadius: 14,
              border: `2px solid ${COLORS.unlit}`,
              padding: '20px 24px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              opacity: 1 - darkMode * 0.7,
              zIndex: 2,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: fontFamilyMono, fontSize: 10, color: COLORS.unlit, letterSpacing: '0.08em' }}>
                ESSAY ON INTENT // PARAGRAPH BLOCK
              </span>
              <div style={{ display: 'flex', gap: 14, fontFamily: fontFamilyMono, fontSize: 9, color: `${COLORS.unlit}99` }}>
                <span>TOKENS: 54</span>
                <span>•</span>
                <span>METER: IAMBIC</span>
                <span>•</span>
                <span>LINES: 5 / 5</span>
              </div>
            </div>

            {PARAGRAPH_LINES.map((lineText, i) => {
              const lineOp =
                sec < 95.37
                  ? 0.3
                  : Math.min(1, Math.max(0, linesProgress * 5 - i));
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    position: 'relative',
                  }}
                >
                  <span style={{ fontFamily: fontFamilyMono, fontSize: 9.5, color: `${COLORS.unlit}88`, width: 18 }}>
                    0{i + 1}
                  </span>
                  <div
                    style={{
                      position: 'relative',
                      width: `${85 - i * 6}%`,
                      height: 16,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {/* Underlying placeholder bar */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 2,
                        width: '100%',
                        height: 12,
                        backgroundColor: COLORS.unlit,
                        borderRadius: 4,
                        opacity: lineOp * 0.35,
                      }}
                    />
                    {/* Micro typographic text reveal */}
                    <span
                      style={{
                        position: 'relative',
                        zIndex: 2,
                        fontFamily: fontFamilyInter,
                        fontSize: 11,
                        color: COLORS.text,
                        opacity: lineOp,
                        letterSpacing: '-0.01em',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        paddingLeft: 6,
                      }}
                    >
                      {lineText}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Arc Bridge drawn by Spark in b1 */}
          {arcProgress > 0 && (
            <svg
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 1920,
                height: 1400,
                pointerEvents: 'none',
                zIndex: 5,
              }}
            >
              <defs>
                <linearGradient id="bridgeGradient" x1="545" y1="530" x2="825" y2="490" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor={COLORS.orange} stopOpacity="1" />
                  <stop offset="100%" stopColor="#FFAA66" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <path
                d="M 545 530 Q 685 440 825 490"
                fill="none"
                stroke="url(#bridgeGradient)"
                strokeWidth={3}
                strokeDasharray="6 6"
                opacity={Math.min(1, arcProgress * 1.5) * (1 - ramp(sec, 99.0, 1.0))}
              />
              {/* Endpoint target circle where bridge stops short into the void */}
              <circle cx={825} cy={490} r={4.5} fill={COLORS.orange} opacity={arcProgress >= 0.9 ? 1 : 0} />
              <circle cx={825} cy={490} r={9} fill="none" stroke={COLORS.orange} strokeWidth={1} strokeDasharray="3 2" opacity={arcProgress >= 0.9 ? 0.8 : 0} />
              <text
                x={842}
                y={494}
                fill={COLORS.orange}
                fontSize="10"
                fontFamily={fontFamilyMono}
                opacity={arcProgress >= 0.9 ? 1 : 0}
                letterSpacing="0.08em"
              >
                [GAP SHORTFALL: 135px FROM INTENT]
              </text>
            </svg>
          )}

          {/* Spark (Bot) */}
          {sec < 99.21 ? (
            <div style={{ zIndex: 12 }}>
              <Spark x={sparkArcX} y={sparkArcY} burst={0.2} scale={1} />
            </div>
          ) : (
            // Spark drifting in dark mode (700, 530)
            <div style={{ position: 'absolute', left: 700, top: 530, zIndex: 12 }}>
              {lightOpacity > 0 && (
                <>
                  <div
                    style={{
                      position: 'absolute',
                      left: -80,
                      top: -80,
                      width: 160,
                      height: 160,
                      borderRadius: '50%',
                      background: `radial-gradient(circle, ${COLORS.orange}55 0%, transparent 70%)`,
                      pointerEvents: 'none',
                    }}
                  />
                  {/* Subtle photon ray lines radiating from Spark */}
                  <svg
                    width={160}
                    height={160}
                    viewBox="-80 -80 160 160"
                    style={{ position: 'absolute', left: -80, top: -80, overflow: 'visible', pointerEvents: 'none' }}
                  >
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                      <line
                        key={deg}
                        x1={Math.cos((deg * Math.PI) / 180) * 16}
                        y1={Math.sin((deg * Math.PI) / 180) * 16}
                        x2={Math.cos((deg * Math.PI) / 180) * 36}
                        y2={Math.sin((deg * Math.PI) / 180) * 36}
                        stroke={COLORS.orange}
                        strokeWidth={1}
                        strokeOpacity={lightOpacity * 0.4}
                      />
                    ))}
                  </svg>
                </>
              )}
              <Spark x={0} y={0} burst={0.1} scale={0.9} />
            </div>
          )}

          {/* Human Teal Dot on Card 3 (1375, 530) */}
          <div
            style={{
              position: 'absolute',
              left: 1375 - dotWidth / 2,
              top: 530 - dotHeight / 2 + humanLiftY,
              width: dotWidth,
              height: dotHeight,
              borderRadius: dotRadius,
              backgroundColor: COLORS.teal,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              boxShadow: `0 0 18px ${COLORS.teal}88`,
            }}
          >
            {/* Scar across teal dot (b4) */}
            {scarProgress > 0 && (
              <svg
                width={dotWidth}
                height={dotHeight}
                viewBox="0 0 24 24"
                style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}
              >
                <path
                  d="M 4 18 L 9 12 L 8 10 L 13 8 L 12 6 L 17 5 L 20 2"
                  fill="none"
                  stroke={COLORS.orange}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={scarProgress}
                />
              </svg>
            )}
          </div>

          {/* Soft light around human teal dot in dark mode */}
          {lightOpacity > 0 && (
            <div
              style={{
                position: 'absolute',
                left: 1375 - 80,
                top: 530 - 80 + humanLiftY,
                width: 160,
                height: 160,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${COLORS.teal}55 0%, transparent 70%)`,
                pointerEvents: 'none',
                zIndex: 8,
              }}
            >
              {/* Subtle photon ring ticks around human dot */}
              <svg
                width={160}
                height={160}
                viewBox="-80 -80 160 160"
                style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}
              >
                <circle cx={0} cy={0} r={48} fill="none" stroke={COLORS.teal} strokeWidth={1} strokeDasharray="3 3" opacity={lightOpacity * 0.3} />
              </svg>
            </div>
          )}

          {/* Precision Micrometer Calipers Squeeze Rig in b5 (106.36s to 110.24s) */}
          {squeezePeak > 0 && (
            <div
              style={{
                position: 'absolute',
                left: 1375,
                top: 530,
                pointerEvents: 'none',
                zIndex: 15,
              }}
            >
              {/* Left Caliper Jaw */}
              <div
                style={{
                  position: 'absolute',
                  left: -52 + squeezePeak * 26,
                  top: -24,
                  width: 22,
                  height: 48,
                  backgroundColor: `${COLORS.surface}ee`,
                  border: `1.5px solid ${COLORS.orange}`,
                  borderRadius: '4px 0 0 4px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  alignItems: 'flex-end',
                  paddingRight: 3,
                  boxSizing: 'border-box',
                }}
              >
                {[0, 1, 2, 3].map((t) => (
                  <div key={t} style={{ width: t % 2 === 0 ? 8 : 5, height: 1, backgroundColor: COLORS.orange }} />
                ))}
              </div>

              {/* Right Caliper Jaw */}
              <div
                style={{
                  position: 'absolute',
                  left: 30 - squeezePeak * 26,
                  top: -24,
                  width: 22,
                  height: 48,
                  backgroundColor: `${COLORS.surface}ee`,
                  border: `1.5px solid ${COLORS.orange}`,
                  borderRadius: '0 4px 4px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  alignItems: 'flex-start',
                  paddingLeft: 3,
                  boxSizing: 'border-box',
                }}
              >
                {[0, 1, 2, 3].map((t) => (
                  <div key={t} style={{ width: t % 2 === 0 ? 8 : 5, height: 1, backgroundColor: COLORS.orange }} />
                ))}
              </div>

              {/* Stress Gauge readout above */}
              <div
                style={{
                  position: 'absolute',
                  left: -80,
                  top: -50,
                  width: 160,
                  textAlign: 'center',
                  fontFamily: fontFamilyMono,
                  fontSize: 9.5,
                  color: COLORS.orange,
                  backgroundColor: `${COLORS.navy}ee`,
                  padding: '3px 6px',
                  borderRadius: 4,
                  border: `1px solid ${COLORS.orange}55`,
                  letterSpacing: '0.06em',
                }}
              >
                STRESS: {(squeezePeak * 840).toFixed(0)} MPa
              </div>
            </div>
          )}

          {/* Multilayer Vector Fires in b6 (110.24s to 114.0s) - "burn it at both ends" */}
          {sec >= 110.24 && sec < 114.0 && (
            <div style={{ position: 'absolute', left: 1375, top: 530, zIndex: 16 }}>
              {/* Left End Flame Cluster */}
              <div style={{ position: 'absolute', left: -32, top: -14 }}>
                <svg width={28} height={40} viewBox="-14 -30 28 40" style={{ overflow: 'visible' }}>
                  {/* Outer flame halo */}
                  <path
                    d={`
                      M 0 0
                      C -10 -8, -12 -20, 0 -28
                      C 12 -20, 10 -8, 0 0
                    `}
                    fill={`${COLORS.orange}44`}
                  />
                  {/* Mid flame body with harmonic wobble */}
                  <path
                    d={`
                      M 0 0
                      C ${-6 + Math.sin(sec * 24) * 2} -6, -8 -16, 0 ${-24 + Math.sin(sec * 32) * 3}
                      C 8 -16, ${6 + Math.sin(sec * 24) * 2} -6, 0 0
                    `}
                    fill={COLORS.orange}
                  />
                  {/* Inner plasma core */}
                  <ellipse cx={0} cy={-6} rx={3} ry={6} fill="#FFF3E0" />
                </svg>
              </div>

              {/* Right End Flame Cluster */}
              <div style={{ position: 'absolute', left: 18, top: -14 }}>
                <svg width={28} height={40} viewBox="-14 -30 28 40" style={{ overflow: 'visible' }}>
                  <path
                    d={`
                      M 0 0
                      C -10 -8, -12 -20, 0 -28
                      C 12 -20, 10 -8, 0 0
                    `}
                    fill={`${COLORS.orange}44`}
                  />
                  <path
                    d={`
                      M 0 0
                      C ${-6 + Math.sin(sec * 28 + 1) * 2} -6, -8 -16, 0 ${-24 + Math.sin(sec * 36) * 3}
                      C 8 -16, ${6 + Math.sin(sec * 28 + 1) * 2} -6, 0 0
                    `}
                    fill={COLORS.orange}
                  />
                  <ellipse cx={0} cy={-6} rx={3} ry={6} fill="#FFF3E0" />
                </svg>
              </div>

              {/* Thermal telemetry badge */}
              <div
                style={{
                  position: 'absolute',
                  left: -65,
                  top: 24,
                  width: 130,
                  textAlign: 'center',
                  fontFamily: fontFamilyMono,
                  fontSize: 8.5,
                  color: COLORS.orange,
                  backgroundColor: `${COLORS.navy}cc`,
                  padding: '2px 4px',
                  borderRadius: 3,
                  border: `1px solid ${COLORS.orange}44`,
                }}
              >
                TEMP: 1420 K • PYROLYSIS
              </div>
            </div>
          )}

          {/* Architectural Bricks Wall in b7 (113.87s to 117.41s) */}
          {bricksCount > 0 && (
            <div
              style={{
                position: 'absolute',
                left: 1375 - 70,
                top: 556,
                display: 'flex',
                flexWrap: 'wrap',
                width: 140,
                gap: 4,
                opacity: 1 - wallDim * 0.8,
                zIndex: 14,
              }}
            >
              {Array.from({ length: bricksCount }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 66,
                    height: 20,
                    backgroundColor: COLORS.surface,
                    borderRadius: 3,
                    border: `1.5px solid ${COLORS.unlit}`,
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 6px',
                  }}
                >
                  <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: `${COLORS.unlit}66` }} />
                  <span style={{ fontFamily: fontFamilyMono, fontSize: 8, color: `${COLORS.unlit}99` }}>
                    M12
                  </span>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: `${COLORS.unlit}66` }} />
                </div>
              ))}
              {/* Masonry spec tag */}
              <div
                style={{
                  width: '100%',
                  textAlign: 'center',
                  fontFamily: fontFamilyMono,
                  fontSize: 8,
                  color: COLORS.unlit,
                  marginTop: 2,
                }}
              >
                CLASS B MASONRY // 25 N/mm²
              </div>
            </div>
          )}

          {/* Brackets in b7 & b8 */}
          {sec >= 113.87 && (
            <Brackets
              x={1375}
              y={545 + humanLiftY * 0.7}
              rotation={bracketsRotate}
              spread={44}
              size={24}
              color={COLORS.orange}
            />
          )}
        </div>

        {/* Letterbox Bars closing from top and bottom in b6/b7 */}
        {letterboxHeight > 0 && (
          <>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 1920,
                height: letterboxHeight,
                backgroundColor: '#000000',
                zIndex: 40,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                width: 1920,
                height: letterboxHeight,
                backgroundColor: '#000000',
                zIndex: 40,
              }}
            />
          </>
        )}

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
        <SceneLyrics sceneId="S05" />
      </Camera>
    </div>
  );
};

export default Scene05;
