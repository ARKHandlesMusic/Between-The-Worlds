import React from 'react';
import { useClock } from '../lib/clock';
import { ramp } from '../lib/ramp';
import { COLORS } from '../lib/tokens';
import { fontFamilyMono } from '../lib/fonts';
import { Easing } from 'remotion';
import { Camera } from '../lib/camera';
import { PromptBox } from '../primitives/PromptBox';
import { Spark } from '../primitives/Spark';
import { Whisper } from '../primitives/Whisper';
import { UndergroundDot } from '../primitives/UndergroundDot';
import { SceneLyrics } from '../lyrics/SceneLyrics';
import { SideParticleStream } from '../primitives/SideParticleStream';
import { FloatingReactions } from '../primitives/FloatingReactions';
import { ExpandingReticles } from '../primitives/ExpandingReticles';

export const Scene08: React.FC = () => {
  const { sec } = useClock();

  // Underground dot is full size (14px) centered under PromptBox (x=960, y=820)
  // Half speed piano pulse (~3.75s per 2-bar cycle)
  const pianoPulse = Math.max(0, Math.sin(((sec % 3.75) / 3.75) * Math.PI));

  // b1: Spark rises, taps sky line, bounces down (164.21s to 166.99s)
  const skyLineY = 160;
  const sparkStartSec = 164.21;
  const riseProgress = ramp(sec, sparkStartSec, 1.1);
  const bounceDown = ramp(sec, sparkStartSec + 1.2, 0.9);

  let sparkY = 620;
  if (sec < sparkStartSec + 1.2) {
    // Rises to tap sky line at 160
    sparkY = 620 - riseProgress * 460;
  } else {
    // Bounces down to 480
    sparkY = 160 + bounceDown * 320;
  }

  // Ripple on sky line when Spark taps it (around 165.3s)
  const tapRipple = ramp(sec, sparkStartSec + 1.1, 0.6);

  // b2: Teardrop falls slowly from Spark over 4.3s line (166.99s to 171.27s)
  const tearProgress = ramp(sec, 166.99, 4.0);
  const tearY = 480 + tearProgress * 260;
  const tearOpacity =
    sec >= 166.99 && sec < 171.2
      ? Math.min(ramp(sec, 166.99, 0.4), 1 - ramp(sec, 170.8, 0.4))
      : 0;

  // b3: Tiny square appears at centre with 4 corner tick marks (171.27s to 174.25s)
  const squareAppear = ramp(sec, 171.27, 0.4);
  const sparkFade = ramp(sec, 171.27, 0.3);

  // 4 corner ticks draw one at a time, carefully
  const tick1 = ramp(sec, 171.5, 0.25);
  const tick2 = ramp(sec, 172.1, 0.25);
  const tick3 = ramp(sec, 172.7, 0.25);
  const tick4 = ramp(sec, 173.3, 0.25);

  // b4: Frame widens into large dark room, teal dot at left, light circle expands (174.25s to 179.36s)
  const roomExpand = ramp(sec, 174.25, 1.2);
  // Soft light circle expands from tiny square to reach teal dot (x=360, dist=600px)
  const lightExpand = ramp(sec, 174.6, 2.4);
  const lightRadius = lightExpand * 740;

  // Whisper "(Hear it... hear it...)" at 179.4s to 180.7s
  const whisperReveal = ramp(sec, 179.4, 1.0);
  const whisperFade = sec >= 180.4 ? Math.max(0, 1 - ramp(sec, 180.4, 0.3)) : 1;

  // b5: Fade to black over 1.9s gap (180.65s to 182.57s) and white flash at end
  const fadeBlack = ramp(sec, 180.65, 1.8);
  const whiteFlash = ramp(sec, 182.4, 0.17);

  // Constellation stars data (Ursa Major / Celestial Grid)
  const constellationStars = [
    { x: 420, y: 70, name: 'Dubhe', mag: 1.8 },
    { x: 540, y: 85, name: 'Merak', mag: 2.4 },
    { x: 620, y: 110, name: 'Phecda', mag: 2.4 },
    { x: 740, y: 95, name: 'Megrez', mag: 3.3 },
    { x: 880, y: 80, name: 'Alioth', mag: 1.8 },
    { x: 1020, y: 65, name: 'Mizar', mag: 2.2 },
    { x: 1160, y: 90, name: 'Alkaid', mag: 1.9 },
    { x: 1320, y: 60, name: 'Polaris', mag: 2.0 },
    { x: 1480, y: 100, name: 'Vega', mag: 0.0 },
  ];

  // Dynamic Camera Waypoints across Bridge (164.21s to 182.57s)
  // B7 match cut: at 164.21s, scale=1.0, originX=960, originY=540
  // B8 match cut: at 182.57s, scale=1.0, originX=960, originY=540
  let baseCamScale = 1.0;
  let camOriginX = 960;
  let camOriginY = 540;

  if (sec < 164.35) {
    // B7 entry anchor
    baseCamScale = 1.0;
    camOriginX = 960;
    camOriginY = 540;
  } else if (sec < 167.0) {
    // b1 (164.35 - 167.0): Track Spark rising to tap the sky line at y=160 and bouncing
    const p = (sec - 164.35) / (167.0 - 164.35);
    const ep = Easing.inOut(Easing.cubic)(p);
    // Camera arches up to follow Spark's trajectory (1.0 -> 1.48x)
    baseCamScale = 1.0 + ep * 0.48;
    camOriginX = 960;
    camOriginY = 540 - Math.sin(p * Math.PI) * 280; // 540 -> 260 -> 540
  } else if (sec < 171.27) {
    // b2 (167.0 - 171.27): Intimate zoom following the teardrop falling from Spark
    const p = (sec - 167.0) / (171.27 - 167.0);
    const ep = Easing.inOut(Easing.cubic)(p);
    baseCamScale = 1.48 + ep * 0.18; // 1.48 -> 1.66
    camOriginX = 960;
    camOriginY = 540 + ep * 100; // follows teardrop downward (540 -> 640)
  } else if (sec < 174.25) {
    // b3 (171.27 - 174.25): Macro precision zoom on tiny square and 4 corner ticks
    const p = (sec - 171.27) / (174.25 - 171.27);
    const ep = Easing.inOut(Easing.cubic)(p);
    baseCamScale = 1.66 + ep * 0.12; // 1.66 -> 1.78x
    camOriginX = 960;
    camOriginY = 640 - ep * 100; // returns to center (640 -> 540)
  } else if (sec < 179.36) {
    // b4 (174.25 - 179.36): Frame widens as room expands into dark chamber, light circle reaches teal dot
    const p = (sec - 174.25) / (179.36 - 174.25);
    const ep = Easing.inOut(Easing.cubic)(p);
    baseCamScale = 1.78 - ep * 0.70; // 1.78 -> 1.08
    camOriginX = 960 - ep * 400; // 960 -> 560 (dramatic sweeping pan toward teal dot at left)
    camOriginY = 540;
  } else if (sec < 181.0) {
    // b5 whisper and fade: Camera recenters
    const p = (sec - 179.36) / (181.0 - 179.36);
    const ep = Easing.inOut(Easing.cubic)(p);
    baseCamScale = 1.08 - ep * 0.08; // 1.08 -> 1.0
    camOriginX = 560 + ep * 400; // 560 -> 960
    camOriginY = 540;
  } else {
    // 181.0 - 182.57: Locked at 1.0, 960, 540 for B8 match cut and white flash
    baseCamScale = 1.0;
    camOriginX = 960;
    camOriginY = 540;
  }

  // Subtle breathing pulse on piano ballad
  const breathing = sec >= 164.35 && sec < 181.0 ? pianoPulse * 0.035 : 0;
  const camScale = baseCamScale * (1 + breathing);

  // Subtle multi-frequency organic camera drift (smoothly zeroes before B8 boundary at 181.0s)
  if (sec < 181.0) {
    const driftP = ramp(sec, 164.21, 1.0) * (1 - ramp(sec, 180.0, 1.0));
    const driftX = (Math.sin(sec * 0.9) * 12 + Math.cos(sec * 0.6) * 8) * driftP;
    const driftY = (Math.cos(sec * 0.8) * 8 + Math.sin(sec * 1.1) * 6) * driftP;
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
        backgroundColor: COLORS.navy,
        overflow: 'hidden',
      }}
    >
      <Camera scale={camScale} originX={camOriginX} originY={camOriginY}>
        {/* Dynamic Celestial Atmosphere: Shooting Star Streaks, Floating Words & Starlight Reticles */}
        <SideParticleStream density={16} speed={0.8} showTokens={false} opacity={0.4} />
        <FloatingReactions count={18} types={['words']} opacity={0.65} />
        <ExpandingReticles x={960} y={sparkY} maxRadius={180} color={COLORS.orange} opacity={0.4} />

        {/* Celestial Star Field & Constellations above Sky Line */}
        <svg
          width={1920}
          height={160}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            pointerEvents: 'none',
            opacity: (1 - fadeBlack) * 0.7,
          }}
        >
          {/* RA/DEC Subtle Coordinate Grid */}
          {[60, 110].map((gridY) => (
            <line
              key={gridY}
              x1={200}
              y1={gridY}
              x2={1720}
              y2={gridY}
              stroke={`${COLORS.unlit}22`}
              strokeWidth={1}
              strokeDasharray="4 8"
            />
          ))}

          {/* Constellation Connecting Lines */}
          <path
            d="M 420 70 L 540 85 L 620 110 L 740 95 L 420 70 M 740 95 L 880 80 L 1020 65 L 1160 90"
            fill="none"
            stroke={`${COLORS.unlit}44`}
            strokeWidth={1}
            strokeDasharray="2 4"
          />
          <line x1={1160} y1={90} x2={1320} y2={60} stroke={`${COLORS.teal}44`} strokeWidth={1} strokeDasharray="2 4" />
          <line x1={1320} y1={60} x2={1480} y2={100} stroke={`${COLORS.orange}44`} strokeWidth={1} strokeDasharray="2 4" />

          {/* Stars */}
          {constellationStars.map((star) => (
            <g key={star.name}>
              {/* Star Aura */}
              <circle cx={star.x} cy={star.y} r={star.mag < 2.0 ? 3 : 2} fill={star.name === 'Polaris' ? COLORS.teal : star.name === 'Vega' ? COLORS.orange : COLORS.text} opacity={0.8} />
              {/* Star Crosshair Fiducial */}
              <line x1={star.x - 5} y1={star.y} x2={star.x + 5} y2={star.y} stroke={COLORS.text} strokeWidth={0.8} opacity={0.5} />
              <line x1={star.x} y1={star.y - 5} x2={star.x} y2={star.y + 5} stroke={COLORS.text} strokeWidth={0.8} opacity={0.5} />
              {/* Star Label */}
              <text
                x={star.x + 8}
                y={star.y + 3}
                fill={`${COLORS.unlit}88`}
                fontSize={8}
                fontFamily={fontFamilyMono}
                letterSpacing="0.06em"
              >
                {star.name}
              </text>
            </g>
          ))}
        </svg>

        {/* Subtle Celestial Coordinates on Sky Line */}
        <div
          style={{
            position: 'absolute',
            left: 240,
            top: skyLineY - 18,
            right: 240,
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: fontFamilyMono,
            fontSize: 9,
            color: `${COLORS.unlit}88`,
            letterSpacing: '0.08em',
            opacity: 1 - fadeBlack,
          }}
        >
          <div style={{ display: 'flex', gap: 14 }}>
            <span>CELESTIAL BOUNDARY // ALT: 90.00&deg;</span>
            <span style={{ opacity: 0.5 }}>&bull;</span>
            <span>RA: 14h 29m 42s</span>
            <span style={{ opacity: 0.5 }}>&bull;</span>
            <span>DEC: +60&deg; 12&prime; 38&Prime;</span>
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            <span style={{ color: COLORS.teal }}>PIANO ADAGIO // NO DRUMS</span>
            <span style={{ opacity: 0.5 }}>&bull;</span>
            <span>TEMPO: 64 BPM</span>
          </div>
        </div>

        {/* Sky Line near top */}
        <div
          style={{
            position: 'absolute',
            left: 240,
            top: skyLineY,
            width: 1440,
            height: 2,
            backgroundColor: COLORS.unlit,
            opacity: (1 - fadeBlack) * 0.7,
          }}
        />

        {/* Tap ripple on sky line */}
        {tapRipple > 0 && tapRipple < 1 && (
          <div
            style={{
              position: 'absolute',
              left: 960 - tapRipple * 160,
              top: skyLineY - 2,
              width: tapRipple * 320,
              height: 5,
              backgroundColor: COLORS.orange,
              opacity: 1 - tapRipple,
              borderRadius: 3,
              boxShadow: `0 0 20px ${COLORS.orange}`,
            }}
          />
        )}

        {/* Large dark room (b4) with Architectural Anechoic Wedge Markings */}
        {roomExpand > 0 && (
          <div
            style={{
              position: 'absolute',
              left: 960 - 800 * roomExpand,
              top: 540 - 440 * roomExpand,
              width: 1600 * roomExpand,
              height: 880 * roomExpand,
              border: `1px solid ${COLORS.unlit}88`,
              backgroundColor: `${COLORS.surface}33`,
              borderRadius: 12,
              opacity: (1 - fadeBlack) * 0.9,
              boxSizing: 'border-box',
              padding: 24,
              overflow: 'hidden',
              boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6)',
            }}
          >
            {/* Room Dimension Corner Callouts & Acoustic Telemetry */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: fontFamilyMono, fontSize: 9.5, color: `${COLORS.unlit}99` }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <span>ACOUSTIC CHAMBER: 1600 &times; 880 px</span>
                <span>&bull;</span>
                <span>RT60 DECAY: 0.000 s</span>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <span style={{ color: COLORS.teal }}>NOISE FLOOR: -94.2 dBFS</span>
                <span>&bull;</span>
                <span>ISOLATION: 100%</span>
              </div>
            </div>

            {/* Inner Wall Acoustic Foam Wedges Pattern (Subtle Architectural Geometry) */}
            <svg
              width="100%"
              height="100%"
              style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none', opacity: 0.2 }}
            >
              {/* Top border wedges */}
              {Array.from({ length: 40 }).map((_, i) => (
                <polygon
                  key={`top-${i}`}
                  points={`${i * 40},0 ${i * 40 + 20},14 ${i * 40 + 40},0`}
                  fill="none"
                  stroke={COLORS.unlit}
                  strokeWidth={0.8}
                />
              ))}
              {/* Bottom border wedges */}
              {Array.from({ length: 40 }).map((_, i) => (
                <polygon
                  key={`bot-${i}`}
                  points={`${i * 40},880 ${i * 40 + 20},866 ${i * 40 + 40},880`}
                  fill="none"
                  stroke={COLORS.unlit}
                  strokeWidth={0.8}
                />
              ))}
            </svg>
          </div>
        )}

        {/* Soft light circle expanding from center (b4) */}
        {lightRadius > 0 && (
          <div
            style={{
              position: 'absolute',
              left: 960 - lightRadius,
              top: 480 - lightRadius,
              width: lightRadius * 2,
              height: lightRadius * 2,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${COLORS.orange}38 0%, ${COLORS.orange}14 55%, transparent 100%)`,
              opacity: 1 - fadeBlack,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Single teal dot at left (b4) with Consciousness Aura */}
        {sec >= 174.25 && (
          <div
            style={{
              position: 'absolute',
              left: 360 - 7,
              top: 480 - 7,
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: COLORS.teal,
              opacity: 1 - fadeBlack,
              boxShadow: `0 0 24px ${COLORS.teal}`,
            }}
          >
            {/* Consciousness Beacon Label */}
            <div
              style={{
                position: 'absolute',
                top: 22,
                left: -60,
                width: 140,
                textAlign: 'center',
                fontFamily: fontFamilyMono,
                fontSize: 8.5,
                color: COLORS.teal,
                letterSpacing: '0.06em',
                fontWeight: 600,
              }}
            >
              HUMAN LISTENER
            </div>
          </div>
        )}

        {/* Spark (b1 & b2) */}
        {sparkFade < 1 && (
          <div
            style={{
              position: 'absolute',
              left: 960,
              top: sparkY,
              opacity: 1 - sparkFade,
            }}
          >
            <Spark x={0} y={0} scale={1.25} />
          </div>
        )}

        {/* Teardrop (b2) falling slowly over 4.3s with Optical Caustic Refraction */}
        {tearOpacity > 0 && (
          <div
            style={{
              position: 'absolute',
              left: 960 - 8,
              top: tearY - 12,
              opacity: tearOpacity,
            }}
          >
            <svg width={16} height={24} viewBox="0 0 16 24" fill="none">
              <path
                d="M 8 1 C 8 1, 1 12, 1 17 C 1 20.8, 4.1 23.5, 8 23.5 C 11.9 23.5, 15 20.8, 15 17 C 15 12, 8 1, 8 1 Z"
                fill={COLORS.teal}
                opacity={0.92}
              />
              {/* Internal meniscus reflection arc */}
              <path
                d="M 4 14 A 5 5 0 0 0 12 14"
                stroke="#FFFFFF"
                strokeWidth={1}
                strokeLinecap="round"
                opacity={0.7}
              />
              {/* Highlight refraction dot */}
              <circle cx={5.5} cy={16} r={1.8} fill="#FFFFFF" opacity={0.8} />
            </svg>

            {/* Droplet Telemetry */}
            <div
              style={{
                position: 'absolute',
                left: 20,
                top: 4,
                fontFamily: fontFamilyMono,
                fontSize: 8,
                color: `${COLORS.teal}bb`,
                whiteSpace: 'nowrap',
              }}
            >
              v = {(tearProgress * 65).toFixed(0)} px/s
            </div>
          </div>
        )}

        {/* Tiny square at centre with 4 tick marks (b3) */}
        {squareAppear > 0 && (
          <div
            style={{
              position: 'absolute',
              left: 960 - 20,
              top: 480 - 20,
              width: 40,
              height: 40,
              border: `2px solid ${COLORS.orange}`,
              backgroundColor: COLORS.surface,
              borderRadius: 4,
              opacity: (1 - fadeBlack) * squareAppear,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 16px ${COLORS.orange}33`,
            }}
          >
            {/* Center Precision Crosshair + */}
            <div style={{ position: 'relative', width: 8, height: 8 }}>
              <div style={{ position: 'absolute', left: 0, top: 3.5, width: 8, height: 1, backgroundColor: COLORS.orange }} />
              <div style={{ position: 'absolute', left: 3.5, top: 0, width: 1, height: 8, backgroundColor: COLORS.orange }} />
            </div>

            {/* Label below */}
            <span
              style={{
                position: 'absolute',
                top: 46,
                fontFamily: fontFamilyMono,
                fontSize: 8.5,
                color: COLORS.orange,
                whiteSpace: 'nowrap',
                letterSpacing: '0.08em',
                fontWeight: 700,
              }}
            >
              MADE WITH CARE &bull; 40mm
            </span>

            {/* Top-Left Corner Tick */}
            {tick1 > 0 && (
              <div
                style={{
                  position: 'absolute',
                  left: -6,
                  top: -6,
                  width: 8,
                  height: 8,
                  borderLeft: `2px solid ${COLORS.text}`,
                  borderTop: `2px solid ${COLORS.text}`,
                  opacity: tick1,
                }}
              />
            )}
            {/* Top-Right Corner Tick */}
            {tick2 > 0 && (
              <div
                style={{
                  position: 'absolute',
                  right: -6,
                  top: -6,
                  width: 8,
                  height: 8,
                  borderRight: `2px solid ${COLORS.text}`,
                  borderTop: `2px solid ${COLORS.text}`,
                  opacity: tick2,
                }}
              />
            )}
            {/* Bottom-Right Corner Tick */}
            {tick3 > 0 && (
              <div
                style={{
                  position: 'absolute',
                  right: -6,
                  bottom: -6,
                  width: 8,
                  height: 8,
                  borderRight: `2px solid ${COLORS.text}`,
                  borderBottom: `2px solid ${COLORS.text}`,
                  opacity: tick3,
                }}
              />
            )}
            {/* Bottom-Left Corner Tick */}
            {tick4 > 0 && (
              <div
                style={{
                  position: 'absolute',
                  left: -6,
                  bottom: -6,
                  width: 8,
                  height: 8,
                  borderLeft: `2px solid ${COLORS.text}`,
                  borderBottom: `2px solid ${COLORS.text}`,
                  opacity: tick4,
                }}
              />
            )}
          </div>
        )}

        {/* Prompt Box low and centred (b1 to b5) */}
        <PromptBox
          x={660}
          y={700}
          w={600}
          text=""
          glow={0.15}
          style={{ opacity: 1 - fadeBlack }}
        />

        {/* Full-size Underground Dot centred under Prompt Box (960, 820) */}
        <UndergroundDot
          x={960}
          y={820}
          size={14}
          opacity={(1 - fadeBlack) * 0.75}
          pulse={pianoPulse}
          color={COLORS.orange}
        />

        {/* Whisper: (Hear it... hear it...) */}
        {sec >= 179.4 && sec < 181.0 && (
          <Whisper
            text="hear it... hear it..."
            reveal={whisperReveal}
            x={48}
            y={1028}
            opacity={0.35 * whisperFade}
          />
        )}

        {/* White flash transition at 182.57s into Key Change */}
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
        <SceneLyrics sceneId="S08" />
      </Camera>
    </div>
  );
};

export default Scene08;
