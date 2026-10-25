import React from 'react';
import { useClock } from '../lib/clock';
import { ramp } from '../lib/ramp';
import { COLORS, COLORS_FINAL } from '../lib/tokens';
import { fontFamilyInter, fontFamilyMono } from '../lib/fonts';
import { Camera } from '../lib/camera';
import { Hall } from '../primitives/Hall';
import { Spark } from '../primitives/Spark';
import { Heart } from '../primitives/Heart';
import { CheckMark } from '../primitives/CheckMark';
import { Rings } from '../primitives/Rings';
import { UndergroundDot } from '../primitives/UndergroundDot';
import { SceneLyrics } from '../lyrics/SceneLyrics';
import { SideParticleStream } from '../primitives/SideParticleStream';
import { FloatingReactions } from '../primitives/FloatingReactions';
import { LiveTelemetryStream } from '../primitives/LiveTelemetryStream';
import { ExpandingReticles } from '../primitives/ExpandingReticles';

export const Scene09: React.FC = () => {
  const { sec } = useClock();

  // White flash from S08 fading out at start (182.57s to 183.1s)
  const whiteFlash = Math.max(0, 1 - ramp(sec, 182.57, 0.45));

  // Key change palette
  // Comedown in Part C dims hall back to navy between 226.5s and 228.0s
  const dimToNavy = ramp(sec, 226.5, 1.5);
  const bgColor = dimToNavy > 0 ? (dimToNavy >= 1 ? COLORS.navy : COLORS_FINAL.navy) : COLORS_FINAL.navy;

  // Tempo: 128 BPM -> 0.46875s per beat, 1.875s per bar
  const barPhase = (sec % 1.875) / 1.875;
  const bassPulse = Math.max(0, 1 - barPhase * 3.5);

  // 128 BPM Kick-Drum Groove Pulse on Camera during Chorus 3:
  const beatPeriod = 0.46875;
  const beatPhase = ((sec - 182.57) % beatPeriod) / beatPeriod;
  const kickPulse = Math.pow(Math.max(0, 1 - beatPhase * 3.2), 2.2);
  // -------------------------------------------------------------
  // Part A (182.57s to 202.79s): The Lecture Hall
  // -------------------------------------------------------------

  // b1: Dots light teal in 3 sweeps from front (row 0) to back (row 7)
  const sweep1 = ramp(sec, 182.8, 0.4);
  const sweep2 = ramp(sec, 183.4, 0.4);
  const sweep3 = ramp(sec, 183.9, 0.4);

  // b2: Slide title "The voice was never in the sound!", waveform sinks away
  const isPartA2 = sec >= 184.21;
  const waveSink = ramp(sec, 184.8, 2.2);

  // b3: Pointer circles Heart on slide 3 times on each "heart", dots jump 12px
  const isPartA3 = sec >= 188.26 && sec < 191.08;
  const heartCircleAngle = (sec - 188.26) * Math.PI * 2.2;
  const b3Jump = isPartA3 ? -12 * Math.abs(Math.sin((sec - 188.26) * Math.PI * 3)) : 0;

  // b4: Slide lifts off wall and hovers while shadow shrinks (191.08s to 195.85s)
  const liftProgress = ramp(sec, 191.08, 3.8);
  const slideLiftY = liftProgress * 60;
  const isLifting = sec >= 191.08 && sec < 195.85;
  const liftJump = isLifting ? -10 * Math.max(0, Math.sin((sec - 191.08) * 9)) : 0;

  // b5: Slide splits into two columns "slop" and "art", pointer connects them
  const isSplit = sec >= 195.85 && sec < 197.3;
  const splitLineProgress = ramp(sec, 195.85, 1.2);

  // b6: Columns fade to blank slide, caret blinks
  const isBlankSlide = sec >= 197.3 && sec < 199.21;

  // b7: Whole hall shifts 40px sideways on "moved", teal check mark draws
  const hallShift =
    ramp(sec, 199.21, 0.15) * 40 * (1 - ramp(sec, 199.8, 0.3));
  const checkProgress = ramp(sec, 199.4, 0.6);

  // b8: All dots light in warm white, Heart fills slide
  const allLitWarm = sec >= 202.79 && sec < 214.5;
  const heartFillSlide = ramp(sec, 202.79, 1.4);

  // -------------------------------------------------------------
  // Part B (202.79s to 213.77s): Dive into Slide & Gap River
  // -------------------------------------------------------------
  const isPartB = sec >= 204.0 && sec < 211.3;
  const diveScale = ramp(sec, 203.0, 1.4);
  const pullOutScale = ramp(sec, 211.0, 0.8);

  const gapRiver = sec >= 205.0 && sec < 208.3;
  const riverFlow = (sec - 205.0) * 160;
  const sparkCross = ramp(sec, 205.4, 2.4);

  const isKaraoke = sec >= 208.3 && sec < 211.3;
  const karaokeJump = isKaraoke ? -14 * Math.abs(Math.sin((sec - 208.3) * Math.PI * 4)) : 0;

  const rayBurst = ramp(sec, 211.3, 0.8);
  const rayFade = ramp(sec, 212.8, 1.0);
  const rayOpacity = Math.max(0, rayBurst - rayFade);

  // -------------------------------------------------------------
  // Part C (213.77s to 228.52s): Instrumental Comedown
  // -------------------------------------------------------------
  const comedownProgress = ramp(sec, 214.5, 12.0);
  const rowsTurnedOff = Math.floor(comedownProgress * 8);

  const slideFold = ramp(sec, 226.5, 1.4);

  const dotGlide = ramp(sec, 227.8, 0.7);
  const loneDotX = 360 + (960 - 36 - 360) * dotGlide;
  const loneDotY = 620 + (540 - 620) * dotGlide;

  // Calculate listener dot states:
  const getDotLit = (r: number, _c: number): number => {
    if (sec >= 226.5) return 0;
    if (sec >= 214.5) {
      const rowInverted = 7 - r;
      if (rowInverted < rowsTurnedOff) return 0;
      return 1;
    }
    if (allLitWarm) return 1;
    if (sec >= 184.21) return 0.8;
    const sweepRow1 = Math.min(1, Math.max(0, sweep1 * 10 - r));
    const sweepRow2 = Math.min(1, Math.max(0, sweep2 * 10 - r));
    const sweepRow3 = Math.min(1, Math.max(0, sweep3 * 10 - r));
    return Math.max(sweepRow1, sweepRow2, sweepRow3);
  };

  const getDotJump = (_r: number, _c: number): number => {
    return b3Jump + liftJump;
  };

  const slideTitle = isPartA2 && !isBlankSlide
    ? 'The voice was never in the sound'
    : isBlankSlide
    ? '|'
    : 'Between the Words';

  // Laser target coordinates relative to Spark container at (280, 290)
  // Spark is at (280, 290). Slide is at (360, 90 - slideLiftY).
  // Slide center target is (360 + 600, (90 - slideLiftY) + 56 + 212) = (960, 358 - slideLiftY)
  // Relative to Spark: targetX = 960 - 280 = 680, targetY = (358 - slideLiftY) - 290 = 68 - slideLiftY
  const laserBaseTargetX = 680;
  const laserBaseTargetY = 68 - slideLiftY;
  const laserTargetX = isPartA3 ? laserBaseTargetX + Math.cos(heartCircleAngle) * 50 : laserBaseTargetX;
  const laserTargetY = isPartA3 ? laserBaseTargetY + Math.sin(heartCircleAngle) * 50 : laserBaseTargetY;

  // Dynamic virtual camera choreography for Chorus 3 (182.57s to 228.52s):
  // Part A (182.57s to 204.0s): Dolly pushes deep into lecture hall blackboard (1.0 -> 1.55x) with 6.5% kick pulse
  // Part B (204.0s to 213.77s): Full stadium concert camera with sweeps (1.45x -> 1.70x) and 8.5% kick drum shockwave
  // Part C (213.77s to 228.52s): Comedown smoothly easing back to 1.0x with origin returning to center (960, 540)
  const partADolly = 1.0 + ramp(sec, 182.57, 18.0) * 0.52;
  const stadiumPush = ramp(sec, 204.0, 3.0) * 0.42;
  const comedownPull = ramp(sec, 224.0, 4.0);

  let camScale = 1.0;
  let camOriginX = 960;
  let camOriginY = 540;

  if (sec < 204.0) {
    camScale = partADolly * (1 + kickPulse * 0.065);
    camOriginX = 960;
    camOriginY = 540 - ramp(sec, 182.57, 18.0) * 160;
  } else if (sec < 213.77) {
    camScale = (1.28 + stadiumPush) * (1 + kickPulse * 0.085);
    camOriginX = 960 + Math.sin((sec - 204.0) * 0.8) * 80;
    camOriginY = 500;
  } else {
    // Comedown back to 1.0 at 228.0s
    camScale = 1.35 * (1 - comedownPull) + 1.0 * comedownPull;
    camOriginX = 960;
    camOriginY = 540;
  }

  // Subtle multi-frequency organic camera drift (smoothly zeroes before B9 boundary at 226.5s)
  if (sec < 226.5) {
    const driftP = ramp(sec, 182.57, 1.0) * (1 - ramp(sec, 225.5, 1.0));
    const driftX = (Math.sin(sec * 1.25) * 16 + Math.cos(sec * 0.8) * 10) * driftP;
    const driftY = (Math.cos(sec * 1.0) * 10 + Math.sin(sec * 1.5) * 8) * driftP;
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
        {/* Dynamic Stadium Atmosphere: Party Hats, Confetti, Thumbs Up, Credits & Token Streams */}
        <SideParticleStream density={32} speed={1.5} showTokens={true} opacity={0.65} />
        <FloatingReactions count={40} types={['party', 'reaction', 'billing', 'words']} opacity={0.85} />
        <ExpandingReticles x={960} y={302} maxRadius={320} color={COLORS_FINAL.orange} opacity={0.4} />

        {/* Live Active Telemetry HUD at Top-Right */}
        <LiveTelemetryStream
          variant="hud"
          style={{
            position: 'absolute',
            right: 48,
            top: 40,
            zIndex: 30,
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: hallShift,
            top: 0,
            width: 1920,
            height: 1080,
          }}
        >
          {/* Main Hall Component (Part A, Part C) */}
          {!isPartB && slideFold < 1 && (
            <div
              style={{
                transform: `scale(${1 - slideFold * 0.95})`,
                transformOrigin: '960px 330px',
                opacity: 1 - slideFold * 0.4,
              }}
            >
              <Hall
                slideLift={slideLiftY}
                title={slideTitle}
                dotLitAt={getDotLit}
                dotJumpAt={getDotJump}
                colorLit={allLitWarm ? COLORS_FINAL.teal : COLORS.teal}
                colorUnlit={COLORS.unlit}
              >
                {/* Waveform sinking on slide (b2) - High-Fidelity Audio Mastering Visualizer */}
                {isPartA2 && sec < 188.26 && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 100,
                      top: 40 + waveSink * 180,
                      width: 1000,
                      height: 320,
                      opacity: 1 - waveSink,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'none',
                    }}
                  >
                    {/* Visualizer Header Metadata */}
                    <div
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 12,
                        paddingLeft: 20,
                        paddingRight: 20,
                        boxSizing: 'border-box',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: fontFamilyMono,
                          fontSize: 11,
                          color: COLORS_FINAL.teal,
                          letterSpacing: '0.08em',
                        }}
                      >
                        SPECTRAL MASTER // 64 BANDS // 20Hz - 20kHz
                      </span>
                      <span
                        style={{
                          fontFamily: fontFamilyMono,
                          fontSize: 11,
                          color: COLORS.orange,
                          letterSpacing: '0.08em',
                        }}
                      >
                        DECAY: -{(waveSink * 48).toFixed(1)} dBFS
                      </span>
                    </div>

                    {/* Spectral analyzer grid & mirrored bars */}
                    <div
                      style={{
                        position: 'relative',
                        width: 960,
                        height: 180,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                      }}
                    >
                      {/* Horizontal calibration grid lines */}
                      {[-40, 0, 40].map((yOffset, idx) => (
                        <div
                          key={idx}
                          style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 90 + yOffset,
                            height: 1,
                            backgroundColor: 'rgba(255, 255, 255, 0.06)',
                          }}
                        />
                      ))}

                      {/* 64 Spectral frequency bars */}
                      {Array.from({ length: 64 }).map((_, i) => {
                        const freqWave = Math.sin(i * 0.28) * 0.5 + Math.sin(i * 0.12) * 0.5;
                        const h = (18 + Math.abs(freqWave) * 64) * (1 - waveSink);
                        const isMid = i > 24 && i < 40;
                        const barColor = isMid ? COLORS_FINAL.orange : COLORS_FINAL.teal;
                        return (
                          <div
                            key={i}
                            style={{
                              position: 'relative',
                              width: 8,
                              height: Math.max(3, h * 2),
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            {/* Peak indicator dot */}
                            <div
                              style={{
                                position: 'absolute',
                                top: 0,
                                width: 6,
                                height: 2,
                                backgroundColor: '#FFFFFF',
                                borderRadius: 1,
                                opacity: 0.8,
                              }}
                            />
                            {/* Mirrored spectral bar */}
                            <div
                              style={{
                                width: 5,
                                height: Math.max(2, h * 2 - 8),
                                backgroundColor: barColor,
                                borderRadius: 2,
                                opacity: 0.85,
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Frequency Axis Ticks */}
                    <div
                      style={{
                        width: 960,
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: 10,
                        fontFamily: fontFamilyMono,
                        fontSize: 10,
                        color: 'rgba(255, 255, 255, 0.3)',
                        letterSpacing: '0.04em',
                      }}
                    >
                      <span>20 Hz</span>
                      <span>100 Hz</span>
                      <span>500 Hz</span>
                      <span>1 kHz</span>
                      <span>5 kHz</span>
                      <span>20 kHz</span>
                    </div>
                  </div>
                )}

                {/* Lone Orange Dot on Slide (b2 onwards) with reticle crosshair */}
                {isPartA2 && sec < 195.85 && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 600,
                      top: 212,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {/* Concentric subtle radar ring */}
                    <div
                      style={{
                        position: 'absolute',
                        left: -24,
                        top: -24,
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        border: `1px solid ${COLORS_FINAL.orange}44`,
                      }}
                    />
                    {/* Core Orange Dot */}
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: COLORS_FINAL.orange,
                        boxShadow: `0 0 16px ${COLORS_FINAL.orange}`,
                      }}
                    />
                  </div>
                )}

                {/* Heart on Slide (b3) with precision orbital graduation */}
                {isPartA3 && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 600,
                      top: 212,
                    }}
                  >
                    {/* Orbital laser tracking ring */}
                    <svg
                      width={160}
                      height={160}
                      viewBox="-80 -80 160 160"
                      style={{
                        position: 'absolute',
                        left: -80,
                        top: -80,
                        overflow: 'visible',
                        pointerEvents: 'none',
                      }}
                    >
                      <circle
                        cx={0}
                        cy={0}
                        r={50}
                        fill="none"
                        stroke={`${COLORS_FINAL.orange}44`}
                        strokeWidth={1}
                        strokeDasharray="4 4"
                      />
                      {/* Orbital tracking head at laser position */}
                      <circle
                        cx={Math.cos(heartCircleAngle) * 50}
                        cy={Math.sin(heartCircleAngle) * 50}
                        r={5}
                        fill={COLORS_FINAL.orange}
                        stroke="#FFFFFF"
                        strokeWidth={1.5}
                      />
                    </svg>
                    <Heart x={0} y={0} d={80} pulse={1} color={COLORS_FINAL.orange} />
                  </div>
                )}

                {/* Two columns "slop" and "art" with connecting line (b5) */}
                {isSplit && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 100,
                      top: 80,
                      width: 1000,
                      height: 260,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {/* Top dialectic status bar */}
                    <div
                      style={{
                        fontFamily: fontFamilyMono,
                        fontSize: 11,
                        color: 'rgba(255, 255, 255, 0.4)',
                        letterSpacing: '0.12em',
                        marginBottom: 24,
                      }}
                    >
                      DIALECTIC SPECTRUM // SYNTHESIS PROGRESS: {(splitLineProgress * 100).toFixed(0)}%
                    </div>

                    <div
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingLeft: 40,
                        paddingRight: 40,
                        boxSizing: 'border-box',
                      }}
                    >
                      {/* Left: Slop column */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: fontFamilyInter,
                            fontSize: 56,
                            fontWeight: 800,
                            color: COLORS.text,
                            letterSpacing: '-0.02em',
                          }}
                        >
                          slop
                        </span>
                        <span
                          style={{
                            fontFamily: fontFamilyMono,
                            fontSize: 10,
                            color: '#FF5F56',
                            backgroundColor: 'rgba(255, 95, 86, 0.15)',
                            padding: '3px 8px',
                            borderRadius: 6,
                            border: '1px solid rgba(255, 95, 86, 0.3)',
                          }}
                        >
                          ENTROPY: 0.94 // UNVERIFIED
                        </span>
                      </div>

                      {/* Center connecting laser bridge */}
                      <div
                        style={{
                          position: 'relative',
                          flex: 1,
                          margin: '0 40px',
                          height: 6,
                          backgroundColor: `${COLORS.unlit}55`,
                          borderRadius: 3,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {/* Active synthesis laser progress bar */}
                        <div
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width: `${splitLineProgress * 100}%`,
                            height: '100%',
                            backgroundColor: COLORS_FINAL.orange,
                            borderRadius: 3,
                            boxShadow: `0 0 12px ${COLORS_FINAL.orange}`,
                          }}
                        />
                        {/* Traveling laser bead indicator */}
                        <div
                          style={{
                            position: 'absolute',
                            left: `calc(${splitLineProgress * 100}% - 8px)`,
                            top: -5,
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            backgroundColor: '#FFFFFF',
                            boxShadow: `0 0 10px ${COLORS_FINAL.orange}`,
                            border: `2px solid ${COLORS_FINAL.orange}`,
                          }}
                        />
                      </div>

                      {/* Right: Art column */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: fontFamilyInter,
                            fontSize: 56,
                            fontWeight: 800,
                            color: COLORS_FINAL.orange,
                            letterSpacing: '-0.02em',
                            textShadow: `0 0 20px ${COLORS_FINAL.orange}66`,
                          }}
                        >
                          art
                        </span>
                        <span
                          style={{
                            fontFamily: fontFamilyMono,
                            fontSize: 10,
                            color: COLORS_FINAL.teal,
                            backgroundColor: `${COLORS_FINAL.teal}22`,
                            padding: '3px 8px',
                            borderRadius: 6,
                            border: `1px solid ${COLORS_FINAL.teal}44`,
                          }}
                        >
                          RESONANCE: 1.00 // HUMAN INTENT
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* CheckMark on slide (b7) with verification badge */}
                {checkProgress > 0 && sec < 202.79 && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 600,
                      top: 212,
                      transform: 'translate(-50%, -50%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <CheckMark x={0} y={0} size={110} progress={checkProgress} color={COLORS.teal} />
                    <span
                      style={{
                        marginTop: 16,
                        fontFamily: fontFamilyMono,
                        fontSize: 12,
                        fontWeight: 600,
                        color: COLORS.teal,
                        backgroundColor: `${COLORS.teal}22`,
                        padding: '4px 12px',
                        borderRadius: 12,
                        border: `1px solid ${COLORS.teal}55`,
                        letterSpacing: '0.08em',
                      }}
                    >
                      INVARIANT TRUE // MOVED
                    </span>
                  </div>
                )}

                {/* Heart fills slide (b8) with expanding acoustic shockwave rings */}
                {heartFillSlide > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 600,
                      top: 212,
                      transform: `scale(${1 + heartFillSlide * 5})`,
                      opacity: Math.min(1, heartFillSlide * 1.5),
                    }}
                  >
                    <Heart x={0} y={0} d={120} pulse={1} color={COLORS_FINAL.orange} />
                  </div>
                )}
              </Hall>
            </div>
          )}

          {/* Spark holding laser pointer (Part A) with machined collimator optics */}
          {!isPartB && sec < 202.79 && (
            <div
              style={{
                position: 'absolute',
                left: 280,
                top: 290,
              }}
            >
              <Spark x={0} y={0} scale={1.2} />

              {/* Collimator lens mount on Spark */}
              <div
                style={{
                  position: 'absolute',
                  left: 14,
                  top: -2,
                  width: 8,
                  height: 4,
                  backgroundColor: COLORS_FINAL.orange,
                  borderRadius: 1,
                  boxShadow: `0 0 8px ${COLORS_FINAL.orange}`,
                }}
              />

              <svg
                width={1200}
                height={500}
                viewBox="0 0 1200 500"
                style={{
                  position: 'absolute',
                  left: 18,
                  top: 0,
                  overflow: 'visible',
                  pointerEvents: 'none',
                }}
              >
                {/* Laser core glow line */}
                <line
                  x1={0}
                  y1={0}
                  x2={laserTargetX}
                  y2={laserTargetY}
                  stroke={COLORS_FINAL.orange}
                  strokeWidth={5}
                  strokeOpacity={0.25}
                />
                {/* Sharp laser core line */}
                <line
                  x1={0}
                  y1={0}
                  x2={laserTargetX}
                  y2={laserTargetY}
                  stroke="#FFFFFF"
                  strokeWidth={1.5}
                  strokeOpacity={0.9}
                />
                {/* Laser hit crosshair reticle on slide */}
                <g transform={`translate(${laserTargetX}, ${laserTargetY})`}>
                  <circle r={6} fill="none" stroke={COLORS_FINAL.orange} strokeWidth={1.5} />
                  <circle r={2} fill="#FFFFFF" />
                  <line x1={-10} y1={0} x2={10} y2={0} stroke={COLORS_FINAL.orange} strokeWidth={1} />
                  <line x1={0} y1={-10} x2={0} y2={10} stroke={COLORS_FINAL.orange} strokeWidth={1} />
                </g>
              </svg>
            </div>
          )}

          {/* Lone Teal Dot in Comedown glides to Heart (226.5s to 228.52s) with guide trajectory */}
          {sec >= 226.5 && (
            <>
              {/* Guided trajectory line */}
              <svg
                width={1920}
                height={1080}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  pointerEvents: 'none',
                  opacity: 0.25,
                }}
              >
                <line
                  x1={360}
                  y1={620}
                  x2={960 - 36}
                  y2={540}
                  stroke={COLORS.teal}
                  strokeWidth={1}
                  strokeDasharray="4 4"
                />
              </svg>

              {/* The Lone Teal Dot */}
              <div
                style={{
                  position: 'absolute',
                  left: loneDotX,
                  top: loneDotY,
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  backgroundColor: COLORS.teal,
                  boxShadow: `0 0 16px ${COLORS.teal}`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Target badge tag */}
                <div
                  style={{
                    position: 'absolute',
                    left: 20,
                    top: -6,
                    fontFamily: fontFamilyMono,
                    fontSize: 9,
                    color: COLORS.teal,
                    letterSpacing: '0.08em',
                    whiteSpace: 'nowrap',
                    opacity: 0.8,
                  }}
                >
                  SEAT A-01 // CONVERGENCE
                </div>
              </div>
            </>
          )}

          {/* Small folded Heart at center in Comedown (Anchor B9: x=960, y=540, d=40) */}
          {slideFold > 0.8 && (
            <div
              style={{
                position: 'absolute',
                left: 960,
                top: 540,
              }}
            >
              <Heart x={0} y={0} d={40} pulse={0.3} color={COLORS_FINAL.orange} />
            </div>
          )}

          {/* 8 Rays Burst across whole frame (b11, 211.3s to 213.77s) */}
          {rayOpacity > 0 && (
            <svg
              width={1920}
              height={1080}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                pointerEvents: 'none',
                opacity: rayOpacity,
                zIndex: 60,
              }}
            >
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const len = 1400 * rayBurst;
                return (
                  <g key={i}>
                    {/* Broad ray halo */}
                    <line
                      x1={960}
                      y1={540}
                      x2={960 + Math.cos(rad) * len}
                      y2={540 + Math.sin(rad) * len}
                      stroke={COLORS_FINAL.orange}
                      strokeWidth={14}
                      strokeLinecap="round"
                      opacity={0.3}
                    />
                    {/* Crisp core ray */}
                    <line
                      x1={960}
                      y1={540}
                      x2={960 + Math.cos(rad) * len}
                      y2={540 + Math.sin(rad) * len}
                      stroke="#FFFFFF"
                      strokeWidth={3}
                      strokeLinecap="round"
                      opacity={0.9}
                    />
                  </g>
                );
              })}
              {/* Central starburst flare */}
              <circle cx={960} cy={540} r={40 * rayBurst} fill="#FFFFFF" opacity={0.8} />
              <circle cx={960} cy={540} r={80 * rayBurst} fill={COLORS_FINAL.orange} opacity={0.4} />
            </svg>
          )}

          {/* ========================================================= */}
          {/* PART B: Inside Slide (Gap River & Karaoke, 204.0s - 211.3s) */}
          {/* ========================================================= */}
          {isPartB && (
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 1920,
                height: 1080,
                backgroundColor: '#0D1424',
                opacity: Math.min(1, diveScale * 2) * (1 - pullOutScale),
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Gap River of Orange Light (205.0s to 208.3s) */}
              {gapRiver && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: 1920,
                    height: 1080,
                    overflow: 'hidden',
                  }}
                >
                  {/* Deep space coordinate grid */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: 1920,
                      height: 1080,
                      backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.08) 1px, transparent 1px)`,
                      backgroundSize: '48px 48px',
                      opacity: 0.5,
                    }}
                  />

                  {/* Left Shore of Structured Code & Intent Bars */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 60,
                      top: 100,
                      width: 580,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 20,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: fontFamilyMono,
                        fontSize: 12,
                        color: COLORS_FINAL.teal,
                        letterSpacing: '0.1em',
                        marginBottom: 4,
                      }}
                    >
                      SOURCE SHORE // HUMAN INTENT
                    </div>
                    {[
                      "import { humanIntent } from 'cognition';",
                      "const feel = listen(betweenTheWords);",
                      "const resonantState = synthesize({",
                      "  lossThreshold: 0.0001,",
                      "  semanticGrounding: true,",
                      "});",
                      "if (resonance.feelsTrue()) {",
                      "  bridge.traverse(voidGap);",
                      "  heart.ignite();",
                      "}",
                      "export default transcendentArtifact;",
                      "// UNCOMPROMISED EMOTIONAL CLARITY",
                    ].map((codeLine, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 16,
                          fontFamily: fontFamilyMono,
                          fontSize: 13,
                        }}
                      >
                        <span style={{ color: 'rgba(255,255,255,0.25)', width: 24 }}>
                          {(i + 1).toString().padStart(2, '0')}
                        </span>
                        <div
                          style={{
                            padding: '6px 14px',
                            backgroundColor: 'rgba(30, 41, 59, 0.7)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: 6,
                            color: i % 2 === 0 ? COLORS_FINAL.teal : COLORS.text,
                            letterSpacing: '0.02em',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                          }}
                        >
                          {codeLine}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* River of Orange Light - Multi-Strand Flowing Torrent */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 680,
                      top: -100,
                      width: 560,
                      height: 1280,
                      overflow: 'hidden',
                    }}
                  >
                    {/* Broad Ambient Torrent Glow */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 40,
                        top: 0,
                        width: 480,
                        height: '100%',
                        background: `linear-gradient(180deg, ${COLORS_FINAL.orange}44 0%, ${COLORS_FINAL.orange}88 50%, ${COLORS_FINAL.orange}44 100%)`,
                        filter: 'blur(30px)',
                      }}
                    />

                    {/* Multi-Strand Flowing Light Filaments */}
                    <svg
                      width={560}
                      height={1280}
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        transform: `translateY(${riverFlow % 80}px)`,
                      }}
                    >
                      {[100, 180, 280, 380, 460].map((baseX, idx) => {
                        const shift = Math.sin(idx * 1.5) * 20;
                        return (
                          <line
                            key={idx}
                            x1={baseX + shift}
                            y1={0}
                            x2={baseX - shift}
                            y2={1280}
                            stroke={idx % 2 === 0 ? COLORS_FINAL.orange : '#FFAA00'}
                            strokeWidth={idx === 2 ? 8 : 4}
                            strokeOpacity={0.8}
                            strokeDasharray={idx === 2 ? '16 8' : '24 12'}
                          />
                        );
                      })}
                    </svg>

                    {/* Rising photon spark embers */}
                    {Array.from({ length: 16 }).map((_, i) => {
                      const emberX = 60 + ((i * 37) % 440);
                      const emberY = (i * 80 + (riverFlow * 1.5)) % 1200;
                      return (
                        <div
                          key={i}
                          style={{
                            position: 'absolute',
                            left: emberX,
                            top: emberY,
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: '#FFFFFF',
                            boxShadow: `0 0 10px ${COLORS_FINAL.orange}`,
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* Right Shore of Structured Token AST Bars */}
                  <div
                    style={{
                      position: 'absolute',
                      right: 60,
                      top: 100,
                      width: 580,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 20,
                      alignItems: 'flex-end',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: fontFamilyMono,
                        fontSize: 12,
                        color: COLORS_FINAL.orange,
                        letterSpacing: '0.1em',
                        marginBottom: 4,
                      }}
                    >
                      DESTINATION SHORE // SYNTHESIS MANIFOLD
                    </div>
                    {[
                      "0x7FFF_E014 :: LATENT_VECTOR",
                      "attn_matrix.project(targetSemantics)",
                      "verify_invariant(B1_THROUGH_B9)",
                      "sample_loss: 0.000042 // MINIMUM",
                      "model.decode_stream(frame, fps)",
                      "render_pipeline.dispatch(8K_UHD)",
                      "bit_exact_precision === true",
                      "grounding_check: SATISFIED",
                      "heartbeat_envelope.lock()",
                      "emit_transcendent_video()",
                      "// MACHINE GROUNDED IN HEART",
                    ].map((astLine, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 16,
                          fontFamily: fontFamilyMono,
                          fontSize: 13,
                        }}
                      >
                        <div
                          style={{
                            padding: '6px 14px',
                            backgroundColor: 'rgba(30, 41, 59, 0.7)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: 6,
                            color: i % 2 === 0 ? COLORS_FINAL.orange : COLORS.text,
                            letterSpacing: '0.02em',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                            textAlign: 'right',
                          }}
                        >
                          {astLine}
                        </div>
                        <span style={{ color: 'rgba(255,255,255,0.25)', width: 24, textAlign: 'right' }}>
                          {(i + 1).toString().padStart(2, '0')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Spark crosses river as expanding Rings with radiant core */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 620 + sparkCross * 680,
                      top: 540,
                    }}
                  >
                    <Rings
                      x={0}
                      y={0}
                      count={3}
                      phase={sparkCross * 2}
                      maxRadius={70}
                      color={COLORS_FINAL.orange}
                    />
                    {/* High energy core dot */}
                    <div
                      style={{
                        position: 'absolute',
                        left: -8,
                        top: -8,
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: '#FFFFFF',
                        boxShadow: `0 0 24px ${COLORS_FINAL.orange}`,
                      }}
                    />
                  </div>
                </div>
              )}



              {/* Row of Dots along bottom jumping on every beat in Karaoke */}
              {isKaraoke && (
                <div
                  style={{
                    position: 'absolute',
                    left: 120,
                    right: 120,
                    bottom: 80 + karaokeJump,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  {Array.from({ length: 28 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {/* Ripple ring beneath jumping dot */}
                      <div
                        style={{
                          position: 'absolute',
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          border: `1px solid ${COLORS_FINAL.teal}55`,
                        }}
                      />
                      <div
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          backgroundColor: COLORS_FINAL.teal,
                          boxShadow: `0 0 14px ${COLORS_FINAL.teal}`,
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mandatory UndergroundDot at bottom center (960, 1040) */}
        <UndergroundDot
          size={6}
          opacity={0.25}
          x={960}
          y={1040}
          pulse={bassPulse}
          color={COLORS_FINAL.orange}
        />

        {/* White Flash overlay from S08 */}
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
              zIndex: 999,
            }}
          />
        )}
        {/* Integrated Scene Lyrics inside Camera */}
        <SceneLyrics sceneId="S09" />
      </Camera>
    </div>
  );
};

export default Scene09;
