import React from 'react';
import { Easing, interpolate } from 'remotion';
import { useClock } from '../lib/clock';
import { ramp } from '../lib/ramp';
import { COLORS } from '../lib/tokens';
import { fontFamilyInter, fontFamilyMono } from '../lib/fonts';
import { Camera } from '../lib/camera';
import { Heart } from '../primitives/Heart';
import { Cursor } from '../primitives/Cursor';
import { Rings } from '../primitives/Rings';
import { CheckMark } from '../primitives/CheckMark';
import { Spark } from '../primitives/Spark';
import { Window } from '../primitives/Window';
import { UndergroundDot } from '../primitives/UndergroundDot';
import { SceneLyrics } from '../lyrics/SceneLyrics';
import { SideParticleStream } from '../primitives/SideParticleStream';
import { FloatingReactions } from '../primitives/FloatingReactions';
import { LiveTelemetryStream } from '../primitives/LiveTelemetryStream';
import { ExpandingReticles } from '../primitives/ExpandingReticles';
import { CodeCascade } from '../primitives/CodeCascade';

export const Scene04: React.FC = () => {
  const { sec } = useClock();

  // b1: Flash in from white at 62.94s
  const whiteFlash = (1 - ramp(sec, 62.94, 0.25)) * (sec < 63.5 ? 1 : 0);

  // Tabs status
  // 5 tabs. Lighting teal in b3 on each click:
  // click 1 at ~70.75, click 2 at ~71.30, click 3 at ~71.85
  const tab2Lit = sec >= 70.75;
  const tab3Lit = sec >= 71.3;
  const tab4Lit = sec >= 71.85;

  // Interlude tab closing (b9: 88.0 to 91.0)
  const tabClosing = ramp(sec, 88.0, 3.0);
  const visibleTabsCount = Math.max(0, Math.floor(5 - tabClosing * 5));

  // b4: Page slide up out of frame (72.46s to 77.06s)
  const slideUpProgress =
    ramp(sec, 72.46, 0.8) * (1 - ramp(sec, 76.2, 0.86));
  const pageSlideY = slideUpProgress * -1080;

  // b7: Blocks shift 20px right on "moved" (81.5s)
  const shiftX = ramp(sec, 81.5, 0.3) * 20;

  // b9: Browser frame falls away (91.0s to 92.84s)
  const frameFall = ramp(sec, 91.0, 1.84);
  const frameOpacity = 1 - frameFall;

  // Typing in address bar in b9 (87.24s to 89.5s)
  const urlFull = 'betweenthewords.ai';
  const urlProgress = ramp(sec, 87.24, 2.2);
  const urlChars = Math.floor(urlProgress * urlFull.length);
  const urlText = urlFull.slice(0, urlChars);

  // Spark position during b9
  const sparkSlide = ramp(sec, 86.24, 1.0);
  const sparkX = 960;
  const sparkY = 540 - sparkSlide * 420;

  // 128 BPM Kick-Drum Groove Pulse on Camera (Chorus 1: 62.94s to 86.24s)
  const beatPeriod = 0.46875;
  const beatPhase = ((sec - 62.94) % beatPeriod) / beatPeriod;
  const kickPulse = Math.pow(Math.max(0, 1 - beatPhase * 3.2), 2.2);

  // Dynamic Multi-Waypoint Virtual Camera Choreography for Chorus 1:
  let baseCamScale = 1.0;
  let camOriginX = 960;
  let camOriginY = 540;

  if (sec < 65.2) {
    // b1: Focus zoom into Heart (macro push up to 1.75)
    const p = ramp(sec, 62.94, 1.2, Easing.out(Easing.cubic));
    baseCamScale = interpolate(p, [0, 1], [1.0, 1.75]);
    camOriginX = 960;
    camOriginY = 540;
  } else if (sec < 69.89) {
    // b2: Focus on Oscilloscope Damping screen (macro push up to 1.82)
    const p = ramp(sec, 65.2, 1.0, Easing.inOut(Easing.cubic));
    baseCamScale = interpolate(p, [0, 1], [1.75, 1.82]);
    camOriginX = 960;
    camOriginY = interpolate(p, [0, 1], [540, 500]);
  } else if (sec < 72.46) {
    // b3: Cursor clicks Heart on each "heart" (scale 1.65)
    const p = ramp(sec, 69.89, 0.8, Easing.inOut(Easing.cubic));
    baseCamScale = interpolate(p, [0, 1], [1.82, 1.65]);
    camOriginX = 960;
    camOriginY = 540;
  } else if (sec < 77.06) {
    // b4: Page slides up revealing Underground Dot in dark strip (tilt down to y=800)
    const tiltP = ramp(sec, 72.46, 1.2, Easing.inOut(Easing.cubic));
    const returnP = ramp(sec, 76.2, 0.8, Easing.inOut(Easing.cubic));
    baseCamScale = interpolate(
      returnP,
      [0, 1],
      [interpolate(tiltP, [0, 1], [1.65, 1.55]), 1.35]
    );
    camOriginX = 960;
    camOriginY = interpolate(
      returnP,
      [0, 1],
      [interpolate(tiltP, [0, 1], [540, 800]), 540]
    );
  } else if (sec < 79.45) {
    // b5: RLHF arena - massive sweeping pan from "slop" (480) to "art" (1440) at 1.70x
    const panP = ramp(sec, 77.06, 1.5, Easing.inOut(Easing.cubic));
    baseCamScale = 1.70;
    camOriginX = interpolate(panP, [0, 1], [480, 1440]);
    camOriginY = 480;
  } else if (sec < 80.6) {
    // b6: Focus on top left blinking caret on "start" (macro push to 1.85!)
    const p = ramp(sec, 79.45, 0.7, Easing.out(Easing.cubic));
    baseCamScale = interpolate(p, [0, 1], [1.70, 1.85]);
    camOriginX = interpolate(p, [0, 1], [1440, 300]);
    camOriginY = interpolate(p, [0, 1], [480, 220]);
  } else if (sec < 84.33) {
    // b7: Blocks shift 20px right on "moved", teal assertion stamp (scale 1.55)
    const p = ramp(sec, 80.6, 1.0, Easing.inOut(Easing.cubic));
    baseCamScale = interpolate(p, [0, 1], [1.85, 1.55]);
    camOriginX = interpolate(p, [0, 1], [300, 960]);
    camOriginY = interpolate(p, [0, 1], [220, 540]);
  } else if (sec < 86.24) {
    // b8: Heart fills frame, collapses into Spark (scale 1.35)
    const p = ramp(sec, 84.33, 1.2, Easing.inOut(Easing.cubic));
    baseCamScale = interpolate(p, [0, 1], [1.55, 1.35]);
    camOriginX = 960;
    camOriginY = 540;
  } else if (sec < 91.0) {
    // b9: Spark slides into address bar typing betweenthewords.ai (scale 1.65)
    const p = ramp(sec, 86.24, 1.5, Easing.inOut(Easing.cubic));
    baseCamScale = interpolate(p, [0, 1], [1.35, 1.65]);
    camOriginX = 960;
    camOriginY = interpolate(p, [0, 1], [540, 180]);
  } else {
    // Browser frame falls away into wireframe layout for S05 (match cut B4 at 92.84s)
    const p = ramp(sec, 91.0, 1.84, Easing.inOut(Easing.cubic));
    baseCamScale = interpolate(p, [0, 1], [1.65, 1.0]);
    camOriginX = 960;
    camOriginY = interpolate(p, [0, 1], [180, 540]);
  }

  // Subtle multi-frequency organic camera drift (smoothly zeroes before B4 boundary at 91.0s)
  if (sec < 91.0) {
    const driftP = ramp(sec, 62.94, 1.0) * (1 - ramp(sec, 90.0, 1.0));
    const driftX = (Math.sin(sec * 1.2) * 15 + Math.cos(sec * 0.8) * 10) * driftP;
    const driftY = (Math.cos(sec * 1.0) * 10 + Math.sin(sec * 1.5) * 8) * driftP;
    camOriginX += driftX;
    camOriginY += driftY;
  }

  const cameraScale = baseCamScale * (1 + kickPulse * 0.076 * (1 - frameFall));

  // Underground dot pulse once per bar (1.875s)
  const barPhase = (sec % 1.875) / 1.875;
  const dotPulse = Math.max(0, Math.sin(barPhase * Math.PI));

  // Click ripple for "art"
  const artClickRipple = ramp(sec, 78.4, 0.65);

  // Continuous Smooth Spline Cursor Trajectory across Chorus 1:
  let cursorX = 960;
  let cursorY = 540;
  let cursorPress = 0;
  let cursorOpacity = 1;

  if (sec < 64.5) {
    const p = ramp(sec, 62.94, 1.4, Easing.out(Easing.cubic));
    cursorX = interpolate(p, [0, 1], [1400, 1040]);
    cursorY = interpolate(p, [0, 1], [800, 590]);
    cursorPress = 0;
  } else if (sec < 67.5) {
    const p = ramp(sec, 65.0, 1.2, Easing.inOut(Easing.cubic));
    cursorX = interpolate(p, [0, 1], [1040, 1060]);
    cursorY = interpolate(p, [0, 1], [590, 650]);
    cursorPress = 0;
  } else if (sec < 69.89) {
    const p = ramp(sec, 67.5, 1.2, Easing.inOut(Easing.cubic));
    cursorX = interpolate(p, [0, 1], [1060, 1040]);
    cursorY = interpolate(p, [0, 1], [650, 590]);
    cursorPress = 0;
  } else if (sec < 72.46) {
    cursorX = 1040;
    cursorY = 590;
    const c1 =
      sec >= 70.75 && sec < 70.98
        ? Math.sin(((sec - 70.75) / 0.23) * Math.PI)
        : 0;
    const c2 =
      sec >= 71.3 && sec < 71.53
        ? Math.sin(((sec - 71.3) / 0.23) * Math.PI)
        : 0;
    const c3 =
      sec >= 71.85 && sec < 72.08
        ? Math.sin(((sec - 71.85) / 0.23) * Math.PI)
        : 0;
    cursorPress = Math.max(c1, c2, c3);
  } else if (sec < 77.06) {
    const p = ramp(sec, 72.46, 1.2, Easing.inOut(Easing.cubic));
    const returnP = ramp(sec, 76.2, 0.8, Easing.inOut(Easing.cubic));
    cursorX = interpolate(
      returnP,
      [0, 1],
      [interpolate(p, [0, 1], [1040, 960]), 540]
    );
    cursorY = interpolate(
      returnP,
      [0, 1],
      [interpolate(p, [0, 1], [590, 480]), 480]
    );
    cursorPress = 0;
  } else if (sec < 79.45) {
    if (sec < 77.6) {
      cursorX = 540;
      cursorY = 480;
      cursorPress = 0;
    } else if (sec < 78.4) {
      const arcP = ramp(sec, 77.6, 0.75, Easing.inOut(Easing.cubic));
      cursorX = interpolate(arcP, [0, 1], [540, 1260]);
      cursorY =
        interpolate(arcP, [0, 1], [480, 480]) -
        Math.sin(arcP * Math.PI) * 45;
      cursorPress = 0;
    } else {
      cursorX = 1260;
      cursorY = 480;
      cursorPress =
        sec < 78.7 ? Math.sin(((sec - 78.4) / 0.3) * Math.PI) : 0;
    }
  } else if (sec < 80.6) {
    const p = ramp(sec, 79.45, 0.7, Easing.out(Easing.cubic));
    cursorX = interpolate(p, [0, 1], [1260, 300]);
    cursorY = interpolate(p, [0, 1], [480, 340]);
    cursorPress = 0;
  } else if (sec < 84.33) {
    const p = ramp(sec, 81.2, 0.9, Easing.inOut(Easing.cubic));
    cursorX = interpolate(p, [0, 1], [300, 1040]) + shiftX;
    cursorY = interpolate(p, [0, 1], [340, 590]);
    cursorPress = 0;
  } else if (sec < 86.24) {
    cursorX = 1040;
    cursorY = 590;
    cursorPress = 0;
  } else {
    cursorX = 1040;
    cursorY = 590;
    cursorPress = 0;
    cursorOpacity = Math.max(0, 1 - ramp(sec, 86.24, 0.5));
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
        {/* Dynamic Background Atmosphere: Sideways Particle Streams, Party Hats, Thumbs Up, Credits, Code Cascade */}
        <CodeCascade columns={6} opacity={0.16} />
        <SideParticleStream density={26} speed={1.35} showTokens={true} opacity={0.55} />
        <FloatingReactions count={32} types={['party', 'reaction', 'billing', 'words']} opacity={0.8} />
        <ExpandingReticles x={960} y={430} maxRadius={250} color={COLORS.orange} opacity={0.4} />

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

        {/* Dark strip below page: reveals the glowing Underground Dot at full opacity in b4 */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 1920,
            height: 1080,
            backgroundColor: '#0A121E',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <UndergroundDot
            x={960}
            y={540}
            size={14}
            opacity={slideUpProgress > 0.05 ? 1.0 : 0.2}
            pulse={dotPulse}
            color={COLORS.orange}
          />
          {slideUpProgress > 0.4 && (
            <div
              style={{
                position: 'absolute',
                top: 590,
                fontFamily: fontFamilyMono,
                fontSize: 12,
                color: `${COLORS.orange}88`,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
              }}
            >
              the quiet underground
            </div>
          )}
        </div>

        {/* Main Browser Window Container */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: pageSlideY,
            width: 1920,
            height: 1080,
          }}
        >
          {/* Browser Window Chrome */}
          <div style={{ opacity: frameOpacity }}>
            <Window
              x={80}
              y={50}
              w={1760}
              h={980}
              draw={1}
              title="Google Chrome — Between the Words"
              icon="browser"
            />

            {/* Top Browser Tabs */}
            <div
              style={{
                position: 'absolute',
                left: 170,
                top: 48,
                display: 'flex',
                gap: 6,
                alignItems: 'center',
                zIndex: 10,
              }}
            >
              {[
                { name: 'Claude — Chat', icon: 'chat', mem: '14MB' },
                { name: 'App.tsx — Editor', icon: 'code', mem: '22MB' },
                { name: 'localhost:3000', icon: 'globe', mem: '18MB' },
                { name: 'PR #42 — Review', icon: 'git', mem: '11MB' },
                { name: 'Audio Stream', icon: 'audio', mem: '9MB' },
              ].slice(0, visibleTabsCount).map((tab, idx) => {
                let isLit = false;
                if (idx === 2) isLit = tab2Lit;
                if (idx === 3) isLit = tab3Lit;
                if (idx === 4) isLit = tab4Lit;

                const isActive = idx === 0 && !isLit;

                return (
                  <div
                    key={idx}
                    style={{
                      width: 185,
                      height: 34,
                      backgroundColor: isLit
                        ? COLORS.teal
                        : isActive
                          ? COLORS.surface
                          : `${COLORS.navy}dd`,
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                      border: `1px solid ${isLit ? COLORS.teal : COLORS.unlit}66`,
                      borderBottom: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingLeft: 10,
                      paddingRight: 8,
                      boxSizing: 'border-box',
                      boxShadow: isLit ? `0 0 12px ${COLORS.teal}66` : undefined,
                    }}
                  >
                    {/* Tab Icon & Name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, overflow: 'hidden' }}>
                      {tab.icon === 'chat' && (
                        <svg width={13} height={13} viewBox="0 0 24 24" fill={isLit ? COLORS.navy : COLORS.orange} style={{ flexShrink: 0 }}>
                          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                        </svg>
                      )}
                      {tab.icon === 'code' && (
                        <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={isLit ? COLORS.navy : COLORS.teal} strokeWidth={2.5} style={{ flexShrink: 0 }}>
                          <polyline points="16 18 22 12 16 6" />
                          <polyline points="8 6 2 12 8 18" />
                        </svg>
                      )}
                      {tab.icon === 'globe' && (
                        <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={isLit ? COLORS.navy : COLORS.text} strokeWidth={2} style={{ flexShrink: 0, opacity: isLit ? 1 : 0.7 }}>
                          <circle cx="12" cy="12" r="10" />
                          <line x1="2" y1="12" x2="22" y2="12" />
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                      )}
                      {tab.icon === 'git' && (
                        <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={isLit ? COLORS.navy : COLORS.text} strokeWidth={2} style={{ flexShrink: 0, opacity: isLit ? 1 : 0.7 }}>
                          <circle cx="6" cy="6" r="3" />
                          <circle cx="6" cy="18" r="3" />
                          <circle cx="18" cy="9" r="3" />
                          <path d="M6 9v6M9 9l6 3" />
                        </svg>
                      )}
                      {tab.icon === 'audio' && (
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, height: 12, flexShrink: 0 }}>
                          {[6, 12, 8, 14, 5].map((h, bIdx) => (
                            <div
                              key={bIdx}
                              style={{
                                width: 2,
                                height: isLit ? h : 4,
                                backgroundColor: isLit ? COLORS.navy : COLORS.orange,
                                borderRadius: 1,
                              }}
                            />
                          ))}
                        </div>
                      )}

                      <span
                        style={{
                          fontFamily: fontFamilyInter,
                          fontSize: 11,
                          fontWeight: isLit || isActive ? 600 : 500,
                          color: isLit ? COLORS.navy : COLORS.text,
                          opacity: isLit || isActive ? 1 : 0.7,
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                        }}
                      >
                        {tab.name}
                      </span>
                    </div>

                    {/* Tab Memory Tag & Close '×' */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span
                        style={{
                          fontFamily: fontFamilyMono,
                          fontSize: 8.5,
                          color: isLit ? COLORS.navy : COLORS.unlit,
                          opacity: 0.6,
                        }}
                      >
                        {tab.mem}
                      </span>
                      <div
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: isLit ? 0.7 : 0.4,
                        }}
                      >
                        <svg width={7} height={7} viewBox="0 0 10 10" stroke={isLit ? COLORS.navy : COLORS.text} strokeWidth={1.8}>
                          <line x1="2" y1="2" x2="8" y2="8" />
                          <line x1="8" y1="2" x2="2" y2="8" />
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* New Tab '+' Button */}
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  backgroundColor: `${COLORS.navy}bb`,
                  border: `1px solid ${COLORS.unlit}55`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  color: COLORS.text,
                  opacity: 0.7,
                }}
              >
                +
              </div>
            </div>

            {/* Browser Navigation & Address Bar Row */}
            <div
              style={{
                position: 'absolute',
                left: 100,
                top: 90,
                width: 1720,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                paddingLeft: 8,
                paddingRight: 8,
                boxSizing: 'border-box',
                zIndex: 10,
              }}
            >
              {/* Browser Back / Forward / Refresh Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 6,
                    backgroundColor: `${COLORS.surface}aa`,
                    border: `1px solid ${COLORS.unlit}55`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={COLORS.text} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                </div>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 6,
                    backgroundColor: `${COLORS.surface}aa`,
                    border: `1px solid ${COLORS.unlit}55`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={COLORS.text} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35 }}>
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 6,
                    backgroundColor: `${COLORS.surface}aa`,
                    border: `1px solid ${COLORS.unlit}55`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={COLORS.text} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                </div>
              </div>

              {/* Address Input Bar */}
              <div
                style={{
                  flex: 1,
                  height: 36,
                  backgroundColor: COLORS.navy,
                  borderRadius: 18,
                  border: `1px solid ${COLORS.unlit}88`,
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 14,
                  paddingRight: 14,
                  justifyContent: 'space-between',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.4)',
                }}
              >
                {/* Left: SSL Lock & URL */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={COLORS.teal} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>

                  <span
                    style={{
                      fontFamily: fontFamilyMono,
                      fontSize: 13.5,
                      color: COLORS.text,
                      letterSpacing: '-0.01em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {sec >= 86.24 ? (
                      <span>
                        <span style={{ opacity: 0.5 }}>https://</span>
                        <span style={{ color: COLORS.teal, fontWeight: 600 }}>{urlText}</span>
                        {sec < 89.8 && (Math.floor(sec * 4) % 2 === 0 ? '|' : ' ')}
                      </span>
                    ) : (
                      <span>
                        <span style={{ opacity: 0.5 }}>https://</span>
                        <span>listen.internal/stream?session=live&amp;fps=120</span>
                      </span>
                    )}
                  </span>
                </div>

                {/* Right: Security & DevTools Extensions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: 0.75 }}>
                  <span style={{ fontFamily: fontFamilyMono, fontSize: 9.5, color: COLORS.teal }}>
                    TLS 1.3
                  </span>
                  <svg width={13} height={13} viewBox="0 0 24 24" fill={COLORS.orange} stroke={COLORS.orange} strokeWidth={1}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <div
                    style={{
                      fontFamily: fontFamilyMono,
                      fontSize: 9,
                      padding: '1px 5px',
                      borderRadius: 3,
                      backgroundColor: `${COLORS.teal}22`,
                      color: COLORS.teal,
                      fontWeight: 600,
                    }}
                  >
                    120 FPS
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Page Area Content (Inside Browser) */}
          <div
            style={{
              position: 'absolute',
              left: 100,
              top: 150,
              width: 1720,
              height: 860,
              overflow: 'hidden',
            }}
          >
            {/* Rich Web Application Header & Telemetry Dashboard */}
            {sec < 79.45 || sec >= 80.6 ? (
              <div
                style={{
                  position: 'absolute',
                  left: 40 + shiftX,
                  top: 20,
                  width: 1640,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 18,
                  opacity: 0.45,
                }}
              >
                {/* Web App Top Navbar */}
                <div
                  style={{
                    width: '100%',
                    height: 52,
                    backgroundColor: `${COLORS.surface}ee`,
                    borderRadius: 12,
                    border: `1px solid ${COLORS.unlit}66`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingLeft: 20,
                    paddingRight: 20,
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: COLORS.orange }} />
                    <span style={{ fontFamily: fontFamilyInter, fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', color: COLORS.text }}>
                      AUDIO SYNTHESIS ENGINE
                    </span>
                    <div style={{ display: 'flex', gap: 16, marginLeft: 24 }}>
                      <span style={{ fontFamily: fontFamilyInter, fontSize: 12, color: COLORS.teal, fontWeight: 600 }}>Master Out</span>
                      <span style={{ fontFamily: fontFamilyInter, fontSize: 12, color: COLORS.text, opacity: 0.6 }}>Oscilloscope</span>
                      <span style={{ fontFamily: fontFamilyInter, fontSize: 12, color: COLORS.text, opacity: 0.6 }}>Filter LFO</span>
                      <span style={{ fontFamily: fontFamilyInter, fontSize: 12, color: COLORS.text, opacity: 0.6 }}>DSP Rack</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: COLORS.teal, boxShadow: `0 0 6px ${COLORS.teal}` }} />
                    <span style={{ fontFamily: fontFamilyMono, fontSize: 11, color: COLORS.teal, fontWeight: 600 }}>120.0 FPS SYNC</span>
                  </div>
                </div>

                {/* Dashboard Metric Pills */}
                <div style={{ display: 'flex', gap: 16 }}>
                  {[
                    { label: 'SAMPLE RATE', val: '96.0 kHz / 32-bit float' },
                    { label: 'BUFFER LATENCY', val: '1.2 ms (128 samples)' },
                    { label: 'DETERMINISM', val: '100% BIT-EXACT ZERO-DRIFT' },
                    { label: 'DSP LOAD', val: '14.2% CPU' },
                  ].map((m, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: 48,
                        backgroundColor: `${COLORS.surface}aa`,
                        borderRadius: 8,
                        border: `1px solid ${COLORS.unlit}44`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingLeft: 16,
                        paddingRight: 16,
                      }}
                    >
                      <span style={{ fontFamily: fontFamilyInter, fontSize: 10, color: COLORS.text, opacity: 0.6 }}>{m.label}</span>
                      <span style={{ fontFamily: fontFamilyMono, fontSize: 11.5, color: COLORS.text, fontWeight: 600 }}>{m.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* b1: 62.94 to 65.21 Heart pulses on "heart, heart, heart" with ECG Background Monitor */}
            {sec >= 62.94 && sec < 65.21 && (
              <>
                {/* SVG ECG Monitor Line behind Heart */}
                <svg
                  width={800}
                  height={120}
                  style={{
                    position: 'absolute',
                    left: 460,
                    top: 320,
                    opacity: 0.4,
                    overflow: 'visible',
                  }}
                >
                  <path
                    d="M 0 60 L 260 60 L 275 40 L 285 85 L 295 10 L 305 70 L 315 60 L 520 60 L 535 40 L 545 85 L 555 10 L 565 70 L 575 60 L 780 60 L 795 40 L 800 60"
                    fill="none"
                    stroke={COLORS.orange}
                    strokeWidth={2}
                  />
                  <line x1={0} y1={60} x2={800} y2={60} stroke={`${COLORS.unlit}33`} strokeWidth={1} strokeDasharray="4 4" />
                </svg>

                <Heart
                  x={860}
                  y={360}
                  d={56}
                  pulse={
                    (sec >= 63.7 && sec < 64.0 ? 1 : 0) ||
                    (sec >= 64.2 && sec < 64.5 ? 1 : 0) ||
                    (sec >= 64.7 && sec < 65.0 ? 1 : 0)
                  }
                />
              </>
            )}

            {/* b2: 65.21 to 69.89 Waveform flattens into straight line with VU meters */}
            {sec >= 65.21 && sec < 69.89 && (
              <div
                style={{
                  position: 'absolute',
                  left: 460,
                  top: 320,
                  width: 800,
                  height: 140,
                  backgroundColor: `${COLORS.surface}66`,
                  borderRadius: 12,
                  border: `1px solid ${COLORS.unlit}44`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 14,
                  padding: 16,
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontFamily: fontFamilyMono, fontSize: 10, color: COLORS.unlit }}>
                  <span>OSCILLOSCOPE DAMPING</span>
                  <span style={{ color: COLORS.orange }}>
                    AMPLITUDE: {(Math.max(0, 1 - ramp(sec, 65.21, 1.2)) * 100).toFixed(0)}%
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, height: 60 }}>
                  {Array.from({ length: 31 }).map((_, i) => {
                    const flatten = ramp(sec, 65.21, 1.2);
                    const initialH = 14 + Math.sin(i * 0.4) * 40;
                    const h = initialH * (1 - flatten) + 2;
                    return (
                      <div
                        key={i}
                        style={{
                          width: 6,
                          height: h,
                          backgroundColor:
                            i === 15 ? COLORS.orange : `${COLORS.unlit}bb`,
                          borderRadius: 3,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* b3: 69.89 to 72.46 Cursor clicks Heart */}
            {sec >= 69.89 && sec < 72.46 && (
              <>
                <Heart x={860} y={360} d={54} pulse={sec >= 70.75 ? 0.6 : 0} />
                {sec >= 70.75 && (
                  <Rings
                    x={860}
                    y={360}
                    count={3}
                    phase={ramp(sec, 70.75, 1.2)}
                    maxRadius={160}
                    color={COLORS.teal}
                  />
                )}
              </>
            )}

            {/* b5: 77.06 to 79.45 RLHF Model Preference Arena: "slop" left, "art" right */}
            {sec >= 77.06 && sec < 79.45 && (
              <div
                style={{
                  position: 'absolute',
                  left: 320,
                  top: 260,
                  width: 1080,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 40,
                }}
              >
                {/* Left Card: "slop" */}
                <div
                  style={{
                    flex: 1,
                    height: 220,
                    borderRadius: 16,
                    backgroundColor: `${COLORS.surface}99`,
                    border: `2px solid ${COLORS.unlit}55`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                    padding: 20,
                    boxSizing: 'border-box',
                    opacity: sec >= 78.2 ? 0.35 : 0.8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: fontFamilyInter,
                      fontSize: 52,
                      fontWeight: 800,
                      color: COLORS.unlit,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    slop
                  </span>
                  <div
                    style={{
                      fontFamily: fontFamilyMono,
                      fontSize: 10,
                      color: COLORS.unlit,
                      padding: '3px 8px',
                      borderRadius: 4,
                      backgroundColor: `${COLORS.unlit}22`,
                    }}
                  >
                    REJECTED &bull; LOSS: 0.884 &bull; NOVELTY: 0%
                  </div>
                </div>

                {/* VS Divider Pill */}
                <div
                  style={{
                    fontFamily: fontFamilyMono,
                    fontSize: 12,
                    fontWeight: 700,
                    color: COLORS.unlit,
                    padding: '8px 12px',
                    borderRadius: 20,
                    backgroundColor: `${COLORS.navy}ee`,
                    border: `1px solid ${COLORS.unlit}44`,
                  }}
                >
                  VS
                </div>

                {/* Right Card: "art" */}
                <div
                  style={{
                    flex: 1,
                    height: 220,
                    borderRadius: 16,
                    backgroundColor: `${COLORS.surface}ee`,
                    border: `2px solid ${COLORS.orange}`,
                    boxShadow: `0 0 32px ${COLORS.orange}33`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                    padding: 20,
                    boxSizing: 'border-box',
                  }}
                >
                  <span
                    style={{
                      fontFamily: fontFamilyInter,
                      fontSize: 52,
                      fontWeight: 800,
                      color: COLORS.orange,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    art
                  </span>
                  <div
                    style={{
                      fontFamily: fontFamilyMono,
                      fontSize: 10,
                      color: COLORS.orange,
                      padding: '3px 8px',
                      borderRadius: 4,
                      backgroundColor: `${COLORS.orange}22`,
                      fontWeight: 700,
                      border: `1px solid ${COLORS.orange}44`,
                    }}
                  >
                    HUMAN RESONANT &bull; SCORE: 0.985 &bull; BIT-EXACT
                  </div>
                </div>
              </div>
            )}

            {/* b6: 79.45 to 80.60 Blinking caret top left ("start") */}
            {sec >= 79.45 && sec < 80.6 && (
              <div
                style={{
                  position: 'absolute',
                  left: 120,
                  top: 100,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 4,
                    height: 36,
                    backgroundColor:
                      Math.floor(sec * 4) % 2 === 0
                        ? COLORS.text
                        : 'transparent',
                    borderRadius: 2,
                  }}
                />
                <span style={{ fontFamily: fontFamilyMono, fontSize: 16, color: COLORS.unlit }}>
                  start
                </span>
              </div>
            )}

            {/* b7: 80.60 to 84.33 Check mark on "true" with Engineering Pass Stamp */}
            {sec >= 82.8 && sec < 84.33 && (
              <div style={{ position: 'absolute', left: 860, top: 360 }}>
                {/* Dynamic Radial Sunburst rays */}
                <svg
                  width={240}
                  height={240}
                  style={{ position: 'absolute', left: -120, top: -120, overflow: 'visible' }}
                >
                  <circle cx={120} cy={120} r={64} fill="none" stroke={`${COLORS.teal}44`} strokeWidth={2} strokeDasharray="4 4" />
                  <circle cx={120} cy={120} r={74} fill="none" stroke={`${COLORS.teal}22`} strokeWidth={1} />
                </svg>

                <CheckMark
                  x={0}
                  y={0}
                  size={96}
                  progress={ramp(sec, 82.8, 0.6)}
                />

                <div
                  style={{
                    position: 'absolute',
                    left: -160,
                    top: 64,
                    width: 320,
                    textAlign: 'center',
                    fontFamily: fontFamilyMono,
                    fontSize: 10.5,
                    color: COLORS.teal,
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                  }}
                >
                  ASSERTION: true === true &bull; PASSED
                </div>
              </div>
            )}

            {/* b8: 84.33 to 86.24 Heart grows to fill frame, then collapses into Spark */}
            {sec >= 84.33 && sec < 86.24 && (
              <Heart
                x={860}
                y={360}
                d={48 + ramp(sec, 84.33, 1.2) * 400}
                pulse={sec >= 85.5 ? 1 : 0}
              />
            )}

            {/* b9: 86.24 to 92.84 Spark slides up to address bar */}
            {sec >= 86.24 && (
              <Spark
                x={sparkX - 100}
                y={sparkY - 150}
                burst={0.25}
                scale={1.3}
              />
            )}
          </div>
        </div>

        {/* Golden ripple on clicking "art" in RLHF arena */}
        {artClickRipple > 0 && artClickRipple < 1 && (
          <Rings
            x={1260}
            y={480}
            count={2}
            phase={artClickRipple}
            maxRadius={80}
            color={COLORS.orange}
          />
        )}

        {/* Continuous Cursor */}
        <Cursor
          x={cursorX}
          y={cursorY}
          press={cursorPress}
          style={{ opacity: cursorOpacity }}
        />

        {/* White flash overlay */}
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
            }}
          />
        )}

        {/* Integrated Scene Lyrics inside Camera */}
        <SceneLyrics sceneId="S04" />
      </Camera>
    </div>
  );
};

export default Scene04;
