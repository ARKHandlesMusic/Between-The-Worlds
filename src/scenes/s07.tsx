import React from 'react';
import { Easing, interpolate } from 'remotion';
import { useClock } from '../lib/clock';
import { ramp } from '../lib/ramp';
import { COLORS } from '../lib/tokens';
import { fontFamilyInter, fontFamilyMono } from '../lib/fonts';
import { Camera } from '../lib/camera';
import { Window } from '../primitives/Window';
import { Cursor } from '../primitives/Cursor';
import { Heart } from '../primitives/Heart';
import { CheckMark } from '../primitives/CheckMark';
import { Rings } from '../primitives/Rings';
import { PromptBox } from '../primitives/PromptBox';
import { UndergroundDot } from '../primitives/UndergroundDot';
import { SceneLyrics } from '../lyrics/SceneLyrics';
import { SideParticleStream } from '../primitives/SideParticleStream';
import { FloatingReactions } from '../primitives/FloatingReactions';
import { LiveTelemetryStream } from '../primitives/LiveTelemetryStream';
import { ExpandingReticles } from '../primitives/ExpandingReticles';

export const Scene07: React.FC = () => {
  const { sec } = useClock();

  // White flash dissolve from Scene 06 drop (134.93s)
  const whiteFlash = Math.max(0, 1 - ramp(sec, 134.93, 0.45));

  // 128 BPM Kick-Drum Groove Pulse on the Camera:
  // 128 BPM -> 0.46875s per beat. Chorus 2 runs 134.93s to 158.86s.
  const beatPeriod = 0.46875;
  const beatPhase = ((sec - 134.93) % beatPeriod) / beatPeriod;
  const kickPulse = Math.pow(Math.max(0, 1 - beatPhase * 3.2), 2.2);

  // Underground dot pulse once per bar (1.875s)
  const barPhase = (sec % 1.875) / 1.875;
  const dotPulse = Math.max(0, Math.sin(barPhase * Math.PI));

  // b1: Click Claude app (134.93s to 138.12s)
  const claudeHeartPulse =
    (sec >= 135.7 && sec < 136.0 ? 1 : 0) ||
    (sec >= 136.3 && sec < 136.6 ? 1 : 0) ||
    (sec >= 136.9 && sec < 137.2 ? 1 : 0);

  // Click ripple phases for b1 Heart clicks
  const c1Ripple = ramp(sec, 135.8, 0.65);
  const c2Ripple = ramp(sec, 136.4, 0.65);
  const c3Ripple = ramp(sec, 137.0, 0.65);

  // b2: Volume drag (138.12s to 141.86s)
  const volDrag = ramp(sec, 138.5, 1.8, Easing.inOut(Easing.cubic));
  const volSliderX = 220 - volDrag * 120;
  const volMeterHeight = Math.max(2, 28 * (1 - volDrag));

  // b3: Browser tab and address bar (141.86s to 144.44s)
  const tabPlusClick = sec >= 141.86;
  const tabPlusRipple = ramp(sec, 141.86, 0.6);
  const addressFull = 'what moved you?';
  const addressProgress = ramp(sec, 142.4, 1.6, Easing.out(Easing.cubic));
  const addressText = addressFull.slice(
    0,
    Math.floor(addressProgress * addressFull.length)
  );
  const browserTab2Lit = sec >= 142.7;
  const browserTab3Lit = sec >= 143.2;

  // b4: Document drag down off edge (144.44s to 149.29s)
  const docDragProgress = ramp(sec, 145.0, 3.8, Easing.inOut(Easing.cubic));
  const docDragY = docDragProgress * 620;

  // b5: Document text slop -> art (149.29s to 151.03s)
  const slopSelect = ramp(sec, 149.3, 0.7, Easing.inOut(Easing.cubic));
  const isArt = sec >= 150.2;

  // b6: New blank doc opens and types "start" (151.03s to 152.82s)
  const blankDocOpen = ramp(sec, 151.03, 0.4);
  const blankDocRipple = ramp(sec, 151.35, 0.6);
  const startFull = 'start';
  const startChars = Math.floor(
    ramp(sec, 151.4, 0.8, Easing.out(Easing.cubic)) * startFull.length
  );
  const startText = startFull.slice(0, startChars);

  // b7: Window nudge and checkmark (152.82s to 156.50s)
  const nudgeDrag = ramp(sec, 153.3, 0.35, Easing.out(Easing.cubic));
  const snapProgress = ramp(sec, 153.65, 0.75);
  const elasticNudge =
    sec < 153.65
      ? nudgeDrag * 24
      : (1 - snapProgress) *
        Math.cos(snapProgress * Math.PI * 4) *
        Math.exp(-snapProgress * 3.5) *
        24;
  const nudgeOffset = elasticNudge;
  const snapRipple = ramp(sec, 153.65, 0.85);
  const checkProgress = ramp(sec, 154.2, 0.65);

  // b8: Windows shrink to neat row, Heart expands (156.50s to 158.86s)
  const shrinkToRow = ramp(sec, 156.5, 1.2, Easing.inOut(Easing.cubic));
  const heartExpand = ramp(sec, 156.5, 1.5, Easing.out(Easing.cubic));

  // b9: Windows close one by one, leaving PromptBox (158.86s to 164.21s)
  const heartFade = ramp(sec, 158.86, 0.8);
  const winCloseProgress = ramp(sec, 159.5, 3.2);

  // Dynamic Multi-Waypoint Virtual Camera Choreography:
  let baseCamScale = 1.0;
  let camOriginX = 960;
  let camOriginY = 540;

  if (sec < 138.12) {
    // b1: Focus zoom into Claude App (macro push to 1.78)
    const p = ramp(sec, 134.93, 1.4, Easing.out(Easing.cubic));
    baseCamScale = interpolate(p, [0, 1], [1.0, 1.78]);
    camOriginX = interpolate(p, [0, 1], [960, 480]);
    camOriginY = interpolate(p, [0, 1], [540, 240]);
  } else if (sec < 141.86) {
    // b2: Pan down to Volume Slider & Audio Meters (macro push to 1.85)
    const p = ramp(sec, 138.12, 1.0, Easing.inOut(Easing.cubic));
    baseCamScale = interpolate(p, [0, 1], [1.78, 1.85]);
    camOriginX = interpolate(p, [0, 1], [480, 480]);
    camOriginY = interpolate(p, [0, 1], [240, 360]);
  } else if (sec < 144.44) {
    // b3: Swoop up to Browser (scale 1.68, pan across to 1280)
    const p = ramp(sec, 141.86, 1.2, Easing.inOut(Easing.cubic));
    baseCamScale = interpolate(p, [0, 1], [1.85, 1.68]);
    camOriginX = interpolate(p, [0, 1], [480, 1280]);
    camOriginY = interpolate(p, [0, 1], [360, 200]);
  } else if (sec < 149.29) {
    // b4: Pull back & tilt down following descending document window into underground
    const p = ramp(sec, 144.44, 1.4, Easing.inOut(Easing.cubic));
    const tiltP = ramp(sec, 145.8, 2.5, Easing.inOut(Easing.cubic));
    baseCamScale = interpolate(p, [0, 1], [1.68, 1.45]);
    camOriginX = interpolate(p, [0, 1], [1280, 960]);
    camOriginY = interpolate(tiltP, [0, 1], [540, 760]);
  } else if (sec < 151.03) {
    // b5: Dive into VS Code editor (slop -> art) (macro zoom up to 1.82!)
    const p = ramp(sec, 149.29, 0.8, Easing.inOut(Easing.cubic));
    baseCamScale = interpolate(p, [0, 1], [1.45, 1.82]);
    camOriginX = interpolate(p, [0, 1], [960, 440]);
    camOriginY = interpolate(p, [0, 1], [760, 640]);
  } else if (sec < 152.82) {
    // b6: Float to New Document modal (start) (scale 1.65)
    const p = ramp(sec, 151.03, 0.9, Easing.inOut(Easing.cubic));
    baseCamScale = interpolate(p, [0, 1], [1.82, 1.65]);
    camOriginX = interpolate(p, [0, 1], [440, 960]);
    camOriginY = interpolate(p, [0, 1], [640, 480]);
  } else if (sec < 156.50) {
    // b7: Snap to Window 4 (nudge & checkmark) (scale 1.60)
    const p = ramp(sec, 152.82, 0.8, Easing.inOut(Easing.cubic));
    baseCamScale = interpolate(p, [0, 1], [1.65, 1.60]);
    camOriginX = interpolate(p, [0, 1], [960, 1380]);
    camOriginY = interpolate(p, [0, 1], [480, 520]);
  } else if (sec < 158.86) {
    // b8: Pull back to wide epic desktop shot as windows cascade & Heart expands
    const p = ramp(sec, 156.50, 1.2, Easing.inOut(Easing.cubic));
    baseCamScale = interpolate(p, [0, 1], [1.60, 1.30]);
    camOriginX = interpolate(p, [0, 1], [1380, 960]);
    camOriginY = interpolate(p, [0, 1], [520, 540]);
  } else if (sec < 162.50) {
    // b9: Push smoothly towards PromptBox at bottom (scale 1.42)
    const p = ramp(sec, 159.5, 2.5, Easing.inOut(Easing.cubic));
    baseCamScale = interpolate(p, [0, 1], [1.30, 1.42]);
    camOriginX = 960;
    camOriginY = interpolate(p, [0, 1], [540, 700]);
  } else {
    // Return to rock solid 1.0x / 960x540 for match cut B7 at 164.21s
    const returnP = ramp(sec, 162.5, 1.2, Easing.inOut(Easing.cubic));
    baseCamScale = interpolate(returnP, [0, 1], [1.42, 1.0]);
    camOriginX = 960;
    camOriginY = interpolate(returnP, [0, 1], [700, 540]);
  }

  // Subtle multi-frequency organic camera drift (smoothly zeroes before B7 boundary at 162.5s)
  if (sec < 162.5) {
    const driftP = ramp(sec, 134.93, 1.0) * (1 - ramp(sec, 161.5, 1.0));
    const driftX = (Math.sin(sec * 1.15) * 12 + Math.cos(sec * 0.75) * 8) * driftP;
    const driftY = (Math.cos(sec * 0.95) * 9 + Math.sin(sec * 1.4) * 6) * driftP;
    camOriginX += driftX;
    camOriginY += driftY;
  }

  const cameraScale = baseCamScale * (1 + kickPulse * 0.075 * (1 - winCloseProgress));

  // Continuous Smooth Spline Cursor Trajectory across all beats:
  let cursorX = 880;
  let cursorY = 480;
  let cursorPress = 0;

  if (sec < 135.5) {
    const p = ramp(sec, 134.93, 0.57, Easing.out(Easing.cubic));
    cursorX = interpolate(p, [0, 1], [880, 434]);
    cursorY = interpolate(p, [0, 1], [480, 221]);
    cursorPress = 0;
  } else if (sec < 138.0) {
    cursorX = 434;
    cursorY = 221;
    const c1 =
      sec >= 135.7 && sec < 135.95
        ? Math.sin(((sec - 135.7) / 0.25) * Math.PI)
        : 0;
    const c2 =
      sec >= 136.3 && sec < 136.55
        ? Math.sin(((sec - 136.3) / 0.25) * Math.PI)
        : 0;
    const c3 =
      sec >= 136.9 && sec < 137.15
        ? Math.sin(((sec - 136.9) / 0.25) * Math.PI)
        : 0;
    cursorPress = Math.max(c1, c2, c3);
  } else if (sec < 138.5) {
    const p = ramp(sec, 138.0, 0.5, Easing.inOut(Easing.cubic));
    cursorX = interpolate(p, [0, 1], [434, 553]);
    cursorY = interpolate(p, [0, 1], [221, 303]);
    cursorPress = 0;
  } else if (sec < 140.8) {
    cursorX = 553 - volDrag * 120;
    cursorY = 303;
    cursorPress = 1;
  } else if (sec < 141.15) {
    cursorX = 433;
    cursorY = 303;
    cursorPress = 0;
  } else if (sec < 141.86) {
    const p = ramp(sec, 141.15, 0.71, Easing.inOut(Easing.cubic));
    cursorX = interpolate(p, [0, 1], [433, 970]);
    cursorY = interpolate(p, [0, 1], [303, 96]);
    cursorPress = 0;
  } else if (sec < 142.2) {
    cursorX = 970;
    cursorY = 96;
    cursorPress = Math.sin(((sec - 141.86) / 0.34) * Math.PI);
  } else if (sec < 142.7) {
    const p = ramp(sec, 142.2, 0.5, Easing.inOut(Easing.cubic));
    cursorX = interpolate(p, [0, 1], [970, 1020]);
    cursorY = interpolate(p, [0, 1], [96, 140]);
    cursorPress = 0;
  } else if (sec < 144.44) {
    cursorX = 1020 + addressProgress * 120;
    cursorY = 140;
    cursorPress = 0;
  } else if (sec < 145.0) {
    const p = ramp(sec, 144.44, 0.56, Easing.inOut(Easing.cubic));
    cursorX = interpolate(p, [0, 1], [1140, 440]);
    cursorY = interpolate(p, [0, 1], [140, 526]);
    cursorPress = 0;
  } else if (sec < 148.8) {
    cursorX = 440;
    cursorY = 526 + docDragY;
    cursorPress = 1;
  } else if (sec < 149.3) {
    const p = ramp(sec, 148.8, 0.5, Easing.out(Easing.cubic));
    cursorX = interpolate(p, [0, 1], [440, 330]);
    cursorY = interpolate(p, [0, 1], [1146, 640]);
    cursorPress = 0;
  } else if (sec < 150.1) {
    const selP = ramp(sec, 149.3, 0.7, Easing.inOut(Easing.cubic));
    cursorX = 330 + selP * 80;
    cursorY = 640;
    cursorPress = 0.85;
  } else if (sec < 150.8) {
    cursorX = 410;
    cursorY = 640;
    cursorPress = 0;
  } else if (sec < 151.35) {
    const p = ramp(sec, 150.8, 0.55, Easing.inOut(Easing.cubic));
    cursorX = interpolate(p, [0, 1], [410, 720]);
    cursorY = interpolate(p, [0, 1], [640, 405]);
    cursorPress = 0;
  } else if (sec < 152.82) {
    const clickP =
      sec < 151.6 ? Math.sin(((sec - 151.35) / 0.25) * Math.PI) : 0;
    cursorX = 720 + startChars * 16;
    cursorY = 405;
    cursorPress = clickP;
  } else if (sec < 153.3) {
    const p = ramp(sec, 152.82, 0.48, Easing.inOut(Easing.cubic));
    cursorX = interpolate(p, [0, 1], [780, 1340]);
    cursorY = interpolate(p, [0, 1], [405, 526]);
    cursorPress = 0;
  } else if (sec < 153.65) {
    cursorX = 1340 + nudgeDrag * 24;
    cursorY = 526;
    cursorPress = 1;
  } else if (sec < 155.0) {
    cursorX = 1340;
    cursorY = 526;
    cursorPress = 0;
  } else if (sec < 156.5) {
    const p = ramp(sec, 155.0, 1.5, Easing.inOut(Easing.cubic));
    cursorX = interpolate(p, [0, 1], [1340, 960]);
    cursorY = interpolate(p, [0, 1], [526, 540]);
    cursorPress = 0;
  } else if (sec < 158.86) {
    cursorX = 960;
    cursorY = 540;
    cursorPress = 0;
  } else if (sec < 162.0) {
    const p = ramp(sec, 159.2, 1.8, Easing.inOut(Easing.cubic));
    cursorX = interpolate(p, [0, 1], [960, 685]);
    cursorY = interpolate(p, [0, 1], [540, 724]);
    cursorPress = 0;
  } else {
    cursorX = 685;
    cursorY = 724;
    cursorPress = 0;
  }

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
      <Camera scale={cameraScale} originX={camOriginX} originY={camOriginY}>
        {/* Dynamic Desktop Atmosphere: Sideways Token Streams, Party Hats, Thumbs Up, Credits & Reticles */}
        <SideParticleStream density={22} speed={1.3} showTokens={true} opacity={0.5} />
        <FloatingReactions count={30} types={['party', 'reaction', 'billing', 'words']} opacity={0.8} />
        <ExpandingReticles x={434} y={171} maxRadius={240} color={COLORS.orange} opacity={0.4} />

        {/* Top Desktop Menu Bar */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 1920,
            height: 30,
            backgroundColor: `${COLORS.surface}f0`,
            borderBottom: `1px solid ${COLORS.unlit}66`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: 16,
            paddingRight: 20,
            boxSizing: 'border-box',
            opacity: 1 - winCloseProgress,
            zIndex: 10,
          }}
        >
          {/* Left Menu Cluster */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            {/* Claude Spark Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill={COLORS.orange}>
                <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
              </svg>
              <span style={{ fontFamily: fontFamilyInter, fontSize: 12, fontWeight: 700, color: COLORS.text }}>
                Claude
              </span>
            </div>

            {/* Menu Items */}
            {['File', 'Edit', 'View', 'Audio', 'Synthesis', 'Window', 'Help'].map((item, idx) => (
              <span
                key={idx}
                style={{
                  fontFamily: fontFamilyInter,
                  fontSize: 11,
                  color: COLORS.text,
                  opacity: idx === 0 || idx === 3 ? 0.9 : 0.6,
                  cursor: 'pointer',
                }}
              >
                {item}
              </span>
            ))}
          </div>

          {/* Center Studio Telemetry */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontFamily: fontFamilyMono,
              fontSize: 10,
              color: `${COLORS.unlit}`,
              letterSpacing: '0.05em',
            }}
          >
            <span style={{ color: COLORS.teal }}>STUDIO RUNTIME</span>
            <span>•</span>
            <span>120.000 FPS</span>
            <span>•</span>
            <span>7680×4320 UHD</span>
          </div>

          {/* Right Status Tray */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: fontFamilyMono, fontSize: 11, color: COLORS.text, opacity: 0.85 }}>
            <span style={{ fontSize: 10, color: COLORS.teal }}>96 kHz • 32-bit float</span>
            <span>•</span>
            <span style={{ fontSize: 10 }}>LATENCY: 1.2ms</span>
            <span>•</span>
            <span style={{ fontSize: 10, color: COLORS.orange }}>100% ⚡</span>
            <span>•</span>
            <span>14:02:18</span>
          </div>
        </div>

        {/* 4 Windows Layout (or shrunk into neat row in b8/b9) */}
        {shrinkToRow <= 0 ? (
          <>
            {/* Window 1: Claude App (Top-Left) */}
            <div
              style={{
                position: 'absolute',
                left: 80,
                top: 48,
                width: 720,
                height: 442,
              }}
            >
              <Window x={0} y={0} w={720} h={442} draw={1} title="Claude Desktop — Between the Words" icon="chat" />

              {/* Claude App Interface */}
              <div style={{ position: 'absolute', left: 0, top: 38, width: 720, height: 404, display: 'flex' }}>
                {/* Left Mini Sidebar */}
                <div
                  style={{
                    width: 175,
                    height: '100%',
                    backgroundColor: `${COLORS.navy}dd`,
                    borderRight: `1px solid ${COLORS.unlit}44`,
                    padding: '12px 10px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {/* Search bar */}
                    <div
                      style={{
                        height: 24,
                        borderRadius: 4,
                        backgroundColor: `${COLORS.surface}88`,
                        border: `1px solid ${COLORS.unlit}44`,
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: 8,
                        paddingRight: 8,
                        justifyContent: 'space-between',
                        fontFamily: fontFamilyInter,
                        fontSize: 10,
                        color: `${COLORS.text}66`,
                      }}
                    >
                      <span>🔍 Search chats</span>
                      <span style={{ fontSize: 9, opacity: 0.6 }}>⌘K</span>
                    </div>

                    {/* New Chat Button */}
                    <div
                      style={{
                        height: 28,
                        borderRadius: 6,
                        backgroundColor: `${COLORS.surface}ee`,
                        border: `1px solid ${COLORS.unlit}66`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        fontSize: 11,
                        fontFamily: fontFamilyInter,
                        color: COLORS.text,
                        fontWeight: 600,
                      }}
                    >
                      <span style={{ fontSize: 13, color: COLORS.orange }}>+</span> New Chat
                    </div>

                    {/* Recent Chats Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ fontFamily: fontFamilyInter, fontSize: 9, color: COLORS.text, opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.05em', paddingLeft: 4 }}>
                        Recent
                      </span>
                      {[
                        { title: 'Audio Heartbeat', active: true, tag: 'BASS' },
                        { title: 'Waveform Synth', active: false, tag: 'DSP' },
                        { title: 'Visual Tokens', active: false, tag: '8K' },
                        { title: 'Match Cut Anchors', active: false, tag: 'QA' },
                      ].map((chat, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '4px 8px',
                            borderRadius: 4,
                            backgroundColor: chat.active ? `${COLORS.teal}22` : 'transparent',
                            border: chat.active ? `1px solid ${COLORS.teal}55` : 'none',
                            fontFamily: fontFamilyInter,
                            fontSize: 10,
                            color: chat.active ? COLORS.teal : COLORS.text,
                            opacity: chat.active ? 1 : 0.65,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            • {chat.title}
                          </span>
                          <span style={{ fontSize: 8, fontFamily: fontFamilyMono, opacity: 0.5 }}>{chat.tag}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sidebar User Footer */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0', borderTop: `1px solid ${COLORS.unlit}33` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: COLORS.orange, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: COLORS.navy }}>
                        A
                      </div>
                      <span style={{ fontFamily: fontFamilyInter, fontSize: 10, color: COLORS.text, opacity: 0.85 }}>Aarav</span>
                    </div>
                    <span style={{ fontFamily: fontFamilyMono, fontSize: 8, color: COLORS.teal, border: `1px solid ${COLORS.teal}44`, padding: '1px 4px', borderRadius: 2 }}>PRO</span>
                  </div>
                </div>

                {/* Right Chat Area */}
                <div style={{ flex: 1, padding: 14, boxSizing: 'border-box', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                  {/* Top Chat Header / Model Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${COLORS.unlit}33`, paddingBottom: 6, marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontFamily: fontFamilyInter, fontSize: 11, fontWeight: 600, color: COLORS.orange }}>Claude 3.7 Sonnet</span>
                      <span style={{ fontFamily: fontFamilyMono, fontSize: 9, color: `${COLORS.text}66`, backgroundColor: `${COLORS.surface}aa`, padding: '1px 5px', borderRadius: 3 }}>THINKING</span>
                    </div>
                    <span style={{ fontFamily: fontFamilyMono, fontSize: 9, color: `${COLORS.unlit}` }}>4,096 / 200k tokens</span>
                  </div>

                  {/* User message prompt */}
                  <div
                    style={{
                      alignSelf: 'flex-end',
                      backgroundColor: `${COLORS.surface}ee`,
                      border: `1px solid ${COLORS.unlit}55`,
                      padding: '6px 12px',
                      borderRadius: '10px 10px 2px 10px',
                      fontFamily: fontFamilyInter,
                      fontSize: 11,
                      color: COLORS.text,
                      opacity: 0.9,
                      marginBottom: 8,
                      maxWidth: 340,
                    }}
                  >
                    Render audio heartbeat with full spectrum pulse
                  </div>

                  {/* Claude Response: Thinking pill & Chat Bubble with Heart */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: fontFamilyMono, fontSize: 9, color: COLORS.teal, opacity: 0.8 }}>
                      <span>✓ Thought for 12.4s</span>
                      <span style={{ opacity: 0.4 }}>•</span>
                      <span style={{ opacity: 0.6 }}>Synthesized resonance: 46 BPM</span>
                    </div>

                    <div
                      style={{
                        width: 330,
                        height: 120,
                        backgroundColor: COLORS.navy,
                        borderRadius: 12,
                        border: `1px solid ${COLORS.unlit}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                      }}
                    >
                      <Heart x={165} y={60} d={38} pulse={claudeHeartPulse ? 1 : 0.2} />
                    </div>
                  </div>

                  {/* Volume Slider & Audio Meter in Claude app */}
                  <div
                    style={{
                      marginTop: 12,
                      width: 500,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: fontFamilyMono,
                          fontSize: 10,
                          color: COLORS.text,
                          opacity: 0.6,
                        }}
                      >
                        VOLUME
                      </span>
                      {/* Slider Track with Decibel Graduations */}
                      <div
                        style={{
                          position: 'relative',
                          width: 220,
                          height: 6,
                          backgroundColor: COLORS.unlit,
                          borderRadius: 3,
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            left: volSliderX,
                            top: -6,
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            backgroundColor: COLORS.orange,
                            boxShadow: `0 0 10px ${COLORS.orange}88`,
                          }}
                        />
                      </div>
                      <span style={{ fontFamily: fontFamilyMono, fontSize: 9, color: COLORS.teal }}>
                        {volDrag > 0.9 ? '-∞ dB' : `${(-18 * (1 - volDrag)).toFixed(1)} dB`}
                      </span>
                    </div>

                    {/* Audio Meter Stereo Bars */}
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <span style={{ fontFamily: fontFamilyMono, fontSize: 8, color: `${COLORS.text}66`, width: 16 }}>L/R</span>
                      {Array.from({ length: 24 }).map((_, i) => (
                        <div
                          key={i}
                          style={{
                            width: 5,
                            height: Math.max(2, volMeterHeight * (0.35 + (i % 6) * 0.15)),
                            backgroundColor:
                              volDrag > 0.9
                                ? COLORS.unlit
                                : i > 20
                                ? COLORS.orange
                                : i > 15
                                ? COLORS.teal
                                : `${COLORS.teal}bb`,
                            borderRadius: 1,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Window 2: Browser (Top-Right) */}
            <div
              style={{
                position: 'absolute',
                left: 840,
                top: 48,
                width: 1000,
                height: 442,
              }}
            >
              <Window x={0} y={0} w={1000} h={442} draw={1} title="Google Chrome — internal.app" icon="browser" />

              {/* Browser Sub-Chrome */}
              <div style={{ position: 'absolute', left: 0, top: 38, width: 1000, height: 404 }}>
                {/* Browser Tabs Row */}
                <div
                  style={{
                    position: 'absolute',
                    left: 16,
                    top: 6,
                    display: 'flex',
                    gap: 6,
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      height: 28,
                      paddingLeft: 10,
                      paddingRight: 10,
                      backgroundColor: COLORS.surface,
                      borderRadius: '6px 6px 0 0',
                      border: `1px solid ${COLORS.unlit}`,
                      borderBottom: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: COLORS.orange }} />
                    <span
                      style={{
                        fontFamily: fontFamilyInter,
                        fontSize: 11,
                        fontWeight: 600,
                        color: COLORS.text,
                      }}
                    >
                      Claude Chat
                    </span>
                    <span style={{ fontSize: 10, opacity: 0.5, paddingLeft: 4 }}>×</span>
                  </div>
                  {tabPlusClick && (
                    <div
                      style={{
                        height: 28,
                        paddingLeft: 10,
                        paddingRight: 10,
                        backgroundColor: browserTab2Lit
                          ? COLORS.teal
                          : COLORS.navy,
                        borderRadius: '6px 6px 0 0',
                        border: `1px solid ${COLORS.unlit}`,
                        borderBottom: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: browserTab2Lit ? COLORS.navy : COLORS.teal }} />
                      <span
                        style={{
                          fontFamily: fontFamilyInter,
                          fontSize: 11,
                          fontWeight: 600,
                          color: browserTab2Lit ? COLORS.navy : COLORS.text,
                        }}
                      >
                        API Query
                      </span>
                      <span style={{ fontSize: 10, opacity: 0.5, paddingLeft: 4 }}>×</span>
                    </div>
                  )}
                  {browserTab3Lit && (
                    <div
                      style={{
                        height: 28,
                        paddingLeft: 10,
                        paddingRight: 10,
                        backgroundColor: COLORS.teal,
                        borderRadius: '6px 6px 0 0',
                        border: `1px solid ${COLORS.unlit}`,
                        borderBottom: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: COLORS.navy }} />
                      <span
                        style={{
                          fontFamily: fontFamilyInter,
                          fontSize: 11,
                          fontWeight: 600,
                          color: COLORS.navy,
                        }}
                      >
                        Live Stream 🔊
                      </span>
                      <span style={{ fontSize: 10, opacity: 0.5, paddingLeft: 4 }}>×</span>
                    </div>
                  )}
                  {/* "+" Button */}
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      backgroundColor: `${COLORS.unlit}55`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 13,
                      color: COLORS.text,
                      opacity: 0.8,
                    }}
                  >
                    +
                  </div>
                </div>

                {/* Address Bar */}
                <div
                  style={{
                    position: 'absolute',
                    left: 16,
                    top: 38,
                    width: 968,
                    height: 32,
                    backgroundColor: COLORS.navy,
                    borderRadius: 6,
                    border: `1px solid ${COLORS.unlit}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingLeft: 12,
                    paddingRight: 12,
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ display: 'flex', gap: 6, opacity: 0.6, fontSize: 12 }}>
                      <span>‹</span>
                      <span>›</span>
                      <span>↻</span>
                    </div>
                    <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke={COLORS.teal} strokeWidth={2.5}>
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span
                      style={{
                        fontFamily: fontFamilyMono,
                        fontSize: 12,
                        color: COLORS.text,
                      }}
                    >
                      {sec >= 141.86 ? (
                        <span>
                          <span style={{ opacity: 0.5 }}>https://</span>
                          <span style={{ color: COLORS.teal }}>{addressText}</span>
                          {Math.floor(sec * 4) % 2 === 0 ? '|' : ' '}
                        </span>
                      ) : (
                        'https://internal.app/dashboard'
                      )}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: COLORS.orange }}>★</span>
                    <span style={{ fontSize: 10, opacity: 0.5 }}>⚙</span>
                  </div>
                </div>

                {/* Web Page Preview Body */}
                <div
                  style={{
                    position: 'absolute',
                    left: 16,
                    top: 78,
                    width: 968,
                    height: 312,
                    backgroundColor: `${COLORS.surface}99`,
                    borderRadius: 8,
                    border: `1px solid ${COLORS.unlit}44`,
                    padding: 16,
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${COLORS.unlit}33`, paddingBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: fontFamilyInter, fontSize: 12, fontWeight: 700, color: COLORS.text }}>SYSTEM TELEMETRY</span>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: COLORS.teal }} />
                    </div>
                    <span style={{ fontFamily: fontFamilyMono, fontSize: 10, color: COLORS.teal }}>ALL 14 PRIMITIVES OPERATIONAL</span>
                  </div>

                  <div style={{ display: 'flex', gap: 12 }}>
                    {[
                      { label: 'AUDIO DSP PIPELINE', stat: 'SYNCHRONIZED', val: '96.0 kHz' },
                      { label: 'FRAME RATE ENGINE', stat: '120.000 FPS', val: '0.00ms JITTER' },
                      { label: 'CANVAS RESOLUTION', stat: '7680 × 4320', val: '8K UHD' },
                      { label: 'MATCH CUT ANCHORS', stat: 'BIT-EXACT 0PX', val: 'B1-B9 PASS' },
                    ].map((card, cIdx) => (
                      <div
                        key={cIdx}
                        style={{
                          flex: 1,
                          height: 70,
                          backgroundColor: `${COLORS.navy}dd`,
                          borderRadius: 6,
                          border: `1px solid ${COLORS.unlit}44`,
                          padding: '8px 12px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          gap: 3,
                        }}
                      >
                        <span style={{ fontFamily: fontFamilyInter, fontSize: 9, color: COLORS.text, opacity: 0.5 }}>{card.label}</span>
                        <span style={{ fontFamily: fontFamilyMono, fontSize: 11, color: COLORS.text, fontWeight: 600 }}>{card.stat}</span>
                        <span style={{ fontFamily: fontFamilyMono, fontSize: 9, color: COLORS.teal }}>{card.val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Micro Live Frame Jitter Graph & Dancing Oscilloscope */}
                  <div style={{ flex: 1, backgroundColor: `${COLORS.navy}88`, borderRadius: 6, border: `1px solid ${COLORS.unlit}33`, padding: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: fontFamilyMono, fontSize: 9, color: `${COLORS.text}66` }}>
                      <span>FRAME TIMING STABILITY (LAST 120 FRAMES)</span>
                      <span style={{ color: COLORS.teal }}>STABLE 8.33ms (120 FPS)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <LiveTelemetryStream variant="oscilloscope" style={{ flexShrink: 0 }} />
                      <svg width="100%" height={36} viewBox="0 0 740 36" fill="none">
                        <line x1="0" y1="18" x2="740" y2="18" stroke={`${COLORS.unlit}66`} strokeWidth="1" strokeDasharray="4 4" />
                        <path
                          d="M 0 18 Q 120 17 240 18 T 480 18 T 740 18"
                          stroke={COLORS.teal}
                          strokeWidth="2"
                          fill="none"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Window 3: Document / VS Code (Bottom-Left) */}
            <div
              style={{
                position: 'absolute',
                left: 80,
                top: 512 + docDragY,
                width: 720,
                height: 488,
              }}
            >
              <Window x={0} y={0} w={720} h={488} draw={1} title="VS Code — docs/SCRIPT.md" icon="doc" />

              {/* VS Code Interface */}
              <div style={{ position: 'absolute', left: 0, top: 38, width: 720, height: 450, display: 'flex' }}>
                {/* Far Left Activity Bar */}
                <div
                  style={{
                    width: 36,
                    height: '100%',
                    backgroundColor: `${COLORS.surface}ee`,
                    borderRight: `1px solid ${COLORS.unlit}33`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingTop: 10,
                    gap: 16,
                    color: `${COLORS.text}66`,
                    fontSize: 14,
                  }}
                >
                  <span style={{ color: COLORS.orange }}>📄</span>
                  <span>🔍</span>
                  <div style={{ position: 'relative' }}>
                    <span>⎇</span>
                    <span style={{ position: 'absolute', top: -4, right: -6, width: 8, height: 8, borderRadius: '50%', backgroundColor: COLORS.teal }} />
                  </div>
                  <span>⚙</span>
                </div>

                {/* Explorer Sidebar */}
                <div
                  style={{
                    width: 140,
                    height: '100%',
                    backgroundColor: `${COLORS.navy}aa`,
                    borderRight: `1px solid ${COLORS.unlit}44`,
                    padding: '10px 8px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  <span style={{ fontFamily: fontFamilyInter, fontSize: 9, color: COLORS.text, opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Explorer
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11, fontFamily: fontFamilyMono, color: COLORS.text }}>
                    <span style={{ opacity: 0.5 }}>▾ docs</span>
                    <span style={{ paddingLeft: 10, color: COLORS.orange, fontWeight: 600 }}>SCRIPT.md</span>
                    <span style={{ paddingLeft: 10, opacity: 0.6 }}>AGENTS.md</span>
                    <span style={{ paddingLeft: 10, opacity: 0.6 }}>PROGRESS.md</span>
                    <span style={{ opacity: 0.5 }}>▾ src</span>
                    <span style={{ paddingLeft: 10, opacity: 0.6 }}>Video.tsx</span>
                    <span style={{ paddingLeft: 10, opacity: 0.6 }}>anchors.ts</span>
                  </div>
                </div>

                {/* Editor Content Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* File Tab */}
                  <div style={{ height: 26, backgroundColor: `${COLORS.surface}ee`, borderBottom: `1px solid ${COLORS.unlit}44`, display: 'flex', alignItems: 'center', paddingLeft: 12, gap: 6 }}>
                    <span style={{ fontFamily: fontFamilyMono, fontSize: 11, color: COLORS.orange }}>SCRIPT.md</span>
                    <span style={{ opacity: 0.4, fontSize: 10 }}>×</span>
                  </div>

                  {/* Breadcrumb Navigation */}
                  <div style={{ height: 20, backgroundColor: `${COLORS.navy}dd`, display: 'flex', alignItems: 'center', paddingLeft: 12, gap: 4, fontFamily: fontFamilyMono, fontSize: 9, color: `${COLORS.text}66` }}>
                    <span>Claude</span>
                    <span>›</span>
                    <span>docs</span>
                    <span>›</span>
                    <span style={{ color: COLORS.text }}>SCRIPT.md</span>
                    <span>›</span>
                    <span style={{ color: COLORS.teal }}># Section 7</span>
                  </div>

                  {/* Lines & Text */}
                  <div style={{ flex: 1, padding: 14, display: 'flex', gap: 14, position: 'relative' }}>
                    {/* Line Numbers with Git diff gutter */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontFamily: fontFamilyMono, fontSize: 13, color: COLORS.unlit, textAlign: 'right', width: 24, borderRight: `2px solid ${COLORS.teal}66`, paddingRight: 6 }}>
                      <span>01</span>
                      <span>02</span>
                      <span>03</span>
                      <span>04</span>
                      <span>05</span>
                    </div>

                    {/* Document Text */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                        fontFamily: fontFamilyMono,
                        fontSize: 13,
                        color: COLORS.text,
                      }}
                    >
                      <span style={{ opacity: 0.5 }}>// Dialectic: human intent over mechanical tokenization</span>
                      <span>
                        <span style={{ color: COLORS.teal }}>const</span> resolution = {'{'}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 16 }}>
                        <span style={{ color: COLORS.orange }}>mode</span>:
                        <span
                          style={{
                            fontFamily: fontFamilyInter,
                            fontSize: 32,
                            fontWeight: 700,
                            color: isArt ? COLORS.orange : COLORS.text,
                            backgroundColor:
                              slopSelect > 0 && !isArt
                                ? `${COLORS.teal}44`
                                : 'transparent',
                            padding: '2px 8px',
                            borderRadius: 6,
                          }}
                        >
                          {isArt ? 'art' : 'slop'}
                        </span>
                      </div>
                      <span style={{ paddingLeft: 16, opacity: 0.8 }}>
                        resonance: <span style={{ color: COLORS.teal }}>'human_heart'</span>
                      </span>
                      <span>{'}'};</span>
                    </div>

                    {/* Autocomplete popup on "art" */}
                    {isArt && (
                      <div
                        style={{
                          position: 'absolute',
                          left: 170,
                          top: 100,
                          backgroundColor: `${COLORS.surface}f0`,
                          border: `1px solid ${COLORS.teal}`,
                          borderRadius: 6,
                          padding: '6px 10px',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2,
                          zIndex: 5,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ color: COLORS.teal, fontSize: 10 }}>▾</span>
                          <span style={{ fontFamily: fontFamilyMono, fontSize: 11, fontWeight: 700, color: COLORS.teal }}>art</span>
                          <span style={{ fontFamily: fontFamilyMono, fontSize: 9, color: `${COLORS.text}66` }}>(property: Intent.RESONANCE)</span>
                        </div>
                        <span style={{ fontFamily: fontFamilyInter, fontSize: 9, color: `${COLORS.text}88` }}>Auto-resolved from human conviction</span>
                      </div>
                    )}
                  </div>

                  {/* Status Bar */}
                  <div style={{ height: 20, backgroundColor: `${COLORS.surface}ee`, borderTop: `1px solid ${COLORS.unlit}44`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 10, fontFamily: fontFamilyMono, fontSize: 9, color: `${COLORS.text}88` }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <span style={{ color: COLORS.teal }}>⎇ main*</span>
                      <span>⊗ 0 ⚠ 0</span>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <span>Ln 3, Col 9</span>
                      <span>UTF-8</span>
                      <span>TypeScript React</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Window 4: Terminal (Bottom-Right, with nudge in b7) */}
            <div
              style={{
                position: 'absolute',
                left: 840 + nudgeOffset,
                top: 512,
                width: 1000,
                height: 488,
              }}
            >
              <Window x={0} y={0} w={1000} h={488} draw={1} title="Terminal — zsh (remotion)" icon="terminal" />

              {/* Terminal Interface */}
              <div style={{ position: 'absolute', left: 0, top: 38, width: 1000, height: 450, padding: 18, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                {/* Terminal Tab Bar & Stats */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${COLORS.unlit}44`, paddingBottom: 6 }}>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <span style={{ fontFamily: fontFamilyMono, fontSize: 11, color: COLORS.teal, borderBottom: `2px solid ${COLORS.teal}`, paddingBottom: 4 }}>
                      1. zsh (active)
                    </span>
                    <span style={{ fontFamily: fontFamilyMono, fontSize: 11, color: COLORS.text, opacity: 0.5, paddingBottom: 4 }}>
                      2. remotion dev
                    </span>
                    <span style={{ fontFamily: fontFamilyMono, fontSize: 11, color: COLORS.text, opacity: 0.5, paddingBottom: 4 }}>
                      3. vitest --watch
                    </span>
                  </div>
                  <span style={{ fontFamily: fontFamilyMono, fontSize: 9, color: `${COLORS.unlit}` }}>PID: 4092 • MEM: 142 MB • THREADS: 16</span>
                </div>

                {/* Shell Logs */}
                <div
                  style={{
                    fontFamily: fontFamilyMono,
                    fontSize: 13,
                    color: COLORS.text,
                    opacity: 0.9,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    paddingTop: 10,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: COLORS.orange }}>aarav@deepmind:~/Remotion/Claude</span>
                    <span style={{ color: COLORS.teal }}>⎇ main</span>
                    <span>$ remotion render --composition=Video</span>
                  </div>
                  <span style={{ opacity: 0.6 }}>[ready] bundling 14 vector primitives (8K @ 120 FPS)</span>
                  <span style={{ opacity: 0.6 }}>[extract] audio waveform: song.mp3 (238.92s @ 44.1 kHz bit-exact)</span>
                  <span style={{ color: COLORS.teal }}>
                    ✓ verified all 9 match cuts (B1-B9 delta max = 0px &lt;= 2px)
                  </span>
                  <span style={{ color: COLORS.teal }}>
                    ✓ audio sync verified: 238.92s bit-exact
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <span style={{ color: COLORS.orange }}>[render]</span>
                    <div style={{ width: 300, height: 8, backgroundColor: COLORS.unlit, borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: '100%', height: '100%', backgroundColor: COLORS.teal }} />
                    </div>
                    <span style={{ fontSize: 11, color: COLORS.teal }}>100% (28,671 / 28,671 frames)</span>
                  </div>
                  <span style={{ color: COLORS.orange, fontWeight: 700, marginTop: 2 }}>
                    ✓ RENDER COMPLETE • BIT-EXACT ZERO-ARTIFACT MASTER
                  </span>

                  {/* Active Scrolling Shell Logs Stream */}
                  <LiveTelemetryStream variant="terminal" style={{ margin: '4px 0', opacity: 0.85 }} />
                </div>

                {/* Terminal Bottom Command Prompt */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: fontFamilyMono, fontSize: 12, borderTop: `1px solid ${COLORS.unlit}33`, paddingTop: 8 }}>
                  <span style={{ color: COLORS.teal }}>➜</span>
                  <span style={{ color: COLORS.orange }}>Claude</span>
                  <span style={{ color: COLORS.text, opacity: 0.8 }}>git:(main)</span>
                  <div style={{ width: 8, height: 14, backgroundColor: Math.floor(sec * 4) % 2 === 0 ? COLORS.teal : 'transparent' }} />
                </div>
              </div>
            </div>

            {/* Blank Document window in b6 (151.03s to 152.82s) */}
            {blankDocOpen > 0 && sec < 156.5 && (
              <div
                style={{
                  position: 'absolute',
                  left: 600,
                  top: 300,
                  width: 720,
                  height: 460,
                  opacity: blankDocOpen,
                  boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
                }}
              >
                <Window x={0} y={0} w={720} h={460} draw={1} title="New Document — Template Selector" icon="doc" />

                <div style={{ position: 'absolute', left: 0, top: 38, width: 720, height: 422, padding: 28, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <span style={{ fontFamily: fontFamilyInter, fontSize: 11, color: COLORS.text, opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Document Title
                    </span>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        backgroundColor: COLORS.navy,
                        borderRadius: 8,
                        border: `1px solid ${COLORS.teal}`,
                        padding: '10px 16px',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: fontFamilyInter,
                          fontSize: 24,
                          fontWeight: 600,
                          color: COLORS.text,
                        }}
                      >
                        {startText}
                      </span>
                      <div
                        style={{
                          width: 2,
                          height: 24,
                          backgroundColor:
                            Math.floor(sec * 4) % 2 === 0
                              ? COLORS.teal
                              : 'transparent',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12 }}>
                    {[
                      { title: 'Blank Canvas', desc: 'Precision vector grid', icon: '⊞' },
                      { title: 'Audio Video Sync', desc: '46 BPM cardiac cadence', icon: '♥' },
                      { title: 'Lyrics Score', desc: 'Kinetic typography engine', icon: '♫' },
                    ].map((tpl, tIdx) => (
                      <div
                        key={tIdx}
                        style={{
                          flex: 1,
                          height: 80,
                          backgroundColor: tIdx === 0 ? `${COLORS.teal}22` : `${COLORS.surface}aa`,
                          border: `1px solid ${tIdx === 0 ? COLORS.teal : COLORS.unlit}`,
                          borderRadius: 8,
                          padding: 12,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          gap: 4,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ color: tIdx === 0 ? COLORS.teal : COLORS.orange }}>{tpl.icon}</span>
                          <span style={{ fontFamily: fontFamilyInter, fontSize: 12, fontWeight: 600, color: tIdx === 0 ? COLORS.teal : COLORS.text }}>
                            {tpl.title}
                          </span>
                        </div>
                        <span style={{ fontFamily: fontFamilyInter, fontSize: 10, color: COLORS.text, opacity: 0.5 }}>{tpl.desc}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
                    <div style={{ padding: '6px 16px', borderRadius: 6, border: `1px solid ${COLORS.unlit}`, fontFamily: fontFamilyInter, fontSize: 11, color: COLORS.text, opacity: 0.7 }}>
                      Cancel
                    </div>
                    <div style={{ padding: '6px 20px', borderRadius: 6, backgroundColor: COLORS.teal, fontFamily: fontFamilyInter, fontSize: 11, fontWeight: 600, color: COLORS.navy }}>
                      Create Document ↵
                    </div>
                  </div>
                </div>
              </div>
            )}


            {/* Click Ripple Rings on Interactive Elements */}
            {c1Ripple > 0 && c1Ripple < 1 && (
              <Rings x={434} y={221} count={2} phase={c1Ripple} maxRadius={70} color={COLORS.orange} />
            )}
            {c2Ripple > 0 && c2Ripple < 1 && (
              <Rings x={434} y={221} count={2} phase={c2Ripple} maxRadius={70} color={COLORS.orange} />
            )}
            {c3Ripple > 0 && c3Ripple < 1 && (
              <Rings x={434} y={221} count={2} phase={c3Ripple} maxRadius={70} color={COLORS.orange} />
            )}
            {tabPlusRipple > 0 && tabPlusRipple < 1 && (
              <Rings x={970} y={96} count={2} phase={tabPlusRipple} maxRadius={60} color={COLORS.teal} />
            )}
            {blankDocRipple > 0 && blankDocRipple < 1 && (
              <Rings x={720} y={405} count={2} phase={blankDocRipple} maxRadius={60} color={COLORS.teal} />
            )}

            {/* Snap Ripple & Teal CheckMark in b7 */}
            {snapRipple > 0 && sec < 156.5 && (
              <Rings
                x={1340}
                y={526}
                count={3}
                phase={snapRipple}
                maxRadius={90}
                color={COLORS.teal}
              />
            )}
            {checkProgress > 0 && sec < 156.5 && (
              <div style={{ position: 'absolute', left: 1340, top: 760 }}>
                <CheckMark
                  x={0}
                  y={0}
                  size={80}
                  progress={checkProgress}
                />
              </div>
            )}
          </>
        ) : (
          /* b8 & b9: Windows shrink into neat row at bottom */
          <div
            style={{
              position: 'absolute',
              left: 260,
              top: 860,
              display: 'flex',
              gap: 32,
            }}
          >
            {[
              { title: 'Claude', icon: 'chat' as const },
              { title: 'Browser', icon: 'browser' as const },
              { title: 'VS Code', icon: 'doc' as const },
              { title: 'Terminal', icon: 'terminal' as const },
            ].map((win, i) => {
              // Windows close one by one in b9
              const winClosed = winCloseProgress * 4 > i;
              if (winClosed) return null;

              return (
                <div
                  key={i}
                  style={{
                    width: 320,
                    height: 160,
                    position: 'relative',
                  }}
                >
                  <Window x={0} y={0} w={320} h={160} draw={1} title={win.title} icon={win.icon} />
                </div>
              );
            })}
          </div>
        )}

        {/* Large Expanding Heart in b8 (156.5s to 158.86s) */}
        {heartExpand > 0 && heartFade < 1 && (
          <div
            style={{
              position: 'absolute',
              left: 960,
              top: 480,
              opacity: 1 - heartFade,
            }}
          >
            <Heart
              x={0}
              y={0}
              d={48 + heartExpand * 320}
              pulse={sec >= 157.5 ? 1 : 0.4}
            />
          </div>
        )}

        {/* Empty PromptBox in b9 remaining into Scene 8 */}
        {winCloseProgress > 0.8 && (
          <PromptBox
            x={660}
            y={700}
            w={600}
            text=""
            glow={0.2}
          />
        )}

        {/* The Underground Dot: reveals when Window 3 dragged down */}
        <UndergroundDot
          x={960}
          y={1040}
          size={docDragProgress > 0.4 ? 14 : 6}
          opacity={docDragProgress > 0.4 ? 0.9 : 0.2}
          pulse={dotPulse}
          color={COLORS.orange}
        />

        {/* Cursor */}
        <Cursor
          x={cursorX}
          y={cursorY}
          press={cursorPress}
          style={{ opacity: 1 - ramp(sec, 162.5, 1.0) }}
        />

        {/* White Flash Dissolve from Scene 06 Drop */}
        {whiteFlash > 0 && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 1920,
              height: 1080,
              backgroundColor: '#FFFFFF',
              opacity: whiteFlash,
              pointerEvents: 'none',
              zIndex: 100,
            }}
          />
        )}

        {/* Integrated Scene Lyrics inside Camera */}
        <SceneLyrics sceneId="S07" />
      </Camera>
    </div>
  );
};

export default Scene07;
