import React from 'react';
import { useClock } from '../lib/clock';
import { ramp } from '../lib/ramp';
import { COLORS } from '../lib/tokens';
import { fontFamilyInter, fontFamilyMono } from '../lib/fonts';
import { Camera } from '../lib/camera';
import { Gap } from '../primitives/Gap';
import { Ruler } from '../primitives/Ruler';
import { Cursor } from '../primitives/Cursor';
import { Spark } from '../primitives/Spark';
import { Heart } from '../primitives/Heart';
import { UndergroundDot } from '../primitives/UndergroundDot';
import { SceneLyrics } from '../lyrics/SceneLyrics';
import { SideParticleStream } from '../primitives/SideParticleStream';
import { FloatingReactions } from '../primitives/FloatingReactions';
import { LiveTelemetryStream } from '../primitives/LiveTelemetryStream';
import { ExpandingReticles } from '../primitives/ExpandingReticles';

export type GapSceneProps = {
  resolved: boolean;
};

export const GapScene: React.FC<GapSceneProps> = ({ resolved }) => {
  const { sec } = useClock();

  // Underground dot pulses once per bar (~1.875s)
  const barProgress = (sec % 1.875) / 1.875;
  const dotPulse = Math.max(0, Math.sin(barProgress * Math.PI));

  if (!resolved) {
    // S03: 47.09 to 62.94
    // b2: Ruler draws (48.17 to 50.44)
    const rulerDraw = ramp(sec, 48.17, 1.2);
    // b3: Ticks jitter & zoom on cursor (50.44 to 53.77)
    const jitter = sec >= 50.44 && sec < 53.77 ? 2 : 0;
    const zoomProgress = ramp(sec, 50.44, 0.8) * (1 - ramp(sec, 53.0, 0.77));
    const zoomScale = 1.0 + zoomProgress * 1.2;

    // b4: Ruler fades, blocks slide apart (53.77 to 58.06)
    const rulerFade = ramp(sec, 53.77, 0.6);
    const slideProgress = ramp(sec, 53.77, 4.3);
    const slideOffset = slideProgress * 120;
    const gapWidth = 64 + slideProgress * 140;

    // b5: Small line -> square -> pulsing block (58.06 to 60.78)
    const shapeProgress = ramp(sec, 58.06, 1.5);
    const pulseBlock = sec >= 59.5 ? Math.sin((sec - 59.5) * 12) * 4 : 0;

    // b6: Instrumental riser pulls toward Gap centre (60.78 to 62.94)
    const riserPull = ramp(sec, 62.54, 0.4); // last 0.4s
    const pullScale = 1.0 - riserPull * 0.9;
    const whiteFlashOut = ramp(sec, 62.64, 0.3);

    // 128 BPM Kick groove pulse
    const beatPeriod = 60 / 128;
    const beatPhase = ((sec - 47.09) % beatPeriod) / beatPeriod;
    const kickPulse = Math.pow(Math.max(0, 1 - beatPhase * 3.2), 2.2);
    const s03Kick = sec >= 53.77 && sec < 62.54 ? kickPulse * 0.055 : 0;
    const s03CamScale = zoomScale * pullScale * (1 + s03Kick);

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
        <Camera scale={s03CamScale} originX={960} originY={540}>
          {/* Dynamic Background Atmosphere: High-Speed Token Streams, Floating Reactions & Reticles */}
          <SideParticleStream density={20} speed={1.25} direction="both" showTokens={true} opacity={0.5} />
          <FloatingReactions count={16} types={['words', 'billing', 'reaction']} opacity={0.65} />
          <ExpandingReticles x={960} y={540} maxRadius={260} color={COLORS.orange} opacity={0.4} />

          {/* Active Live Telemetry HUD */}
          <LiveTelemetryStream
            variant="hud"
            style={{
              position: 'absolute',
              left: 48,
              bottom: 36,
              zIndex: 25,
            }}
          />

          {/* Blueprint Precision Grid Background */}
          <svg
            width={1920}
            height={1080}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              opacity: 0.16,
              pointerEvents: 'none',
            }}
          >
            <defs>
              <pattern id="gap-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke={COLORS.unlit} strokeWidth="1" strokeDasharray="2 4" />
                <circle cx="60" cy="60" r="1.5" fill={COLORS.text} opacity="0.4" />
              </pattern>
            </defs>
            <rect width="1920" height="1080" fill="url(#gap-grid)" />
          </svg>

          {/* Top HUD Telemetry Ribbon */}
          <div
            style={{
              position: 'absolute',
              top: 24,
              left: 48,
              right: 48,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontFamily: fontFamilyMono,
              fontSize: 11,
              color: COLORS.unlit,
              letterSpacing: '0.06em',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ color: COLORS.orange, fontWeight: 700 }}>PRE-CHORUS 1 // THE GAP</span>
              <span style={{ opacity: 0.4 }}>•</span>
              <span>CALIBRATION: 1:1.000</span>
              <span style={{ opacity: 0.4 }}>•</span>
              <span>GRID: 30px SNAP</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ color: jitter > 0 ? COLORS.orange : COLORS.teal, fontWeight: 600 }}>
                {jitter > 0 ? 'STATUS: NOISE JITTER &plusmn;2.0px' : 'STATUS: NOMINAL'}
              </span>
              <span style={{ opacity: 0.4 }}>•</span>
              <span>DELTA X: -1.000px</span>
            </div>
          </div>

          {/* Slider Guide Rails Top and Bottom */}
          <div
            style={{
              position: 'absolute',
              left: 120,
              right: 120,
              top: 220,
              height: 2,
              backgroundColor: `${COLORS.unlit}44`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 120,
              right: 120,
              top: 858,
              height: 2,
              backgroundColor: `${COLORS.unlit}44`,
            }}
          />

          {/* Left block: "what you meant" */}
          <div
            style={{
              position: 'absolute',
              left: 160 - slideOffset,
              top: 240,
              width: 760,
              height: 600,
              borderRadius: 16,
              backgroundColor: COLORS.surface,
              border: `2px solid ${COLORS.unlit}`,
              boxSizing: 'border-box',
              padding: 28,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
            }}
          >
            {/* Block Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: COLORS.teal, boxShadow: `0 0 8px ${COLORS.teal}` }} />
                <span style={{ fontFamily: fontFamilyMono, fontSize: 11, color: COLORS.teal, letterSpacing: '0.08em', fontWeight: 600 }}>
                  INPUT SPECIFICATION // HUMAN INTENT
                </span>
              </div>
              <span style={{ fontFamily: fontFamilyMono, fontSize: 10, color: COLORS.unlit }}>
                DIM: 760 &times; 600 px
              </span>
            </div>

            {/* Center Label & Concept Nodes */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
              <span
                style={{
                  fontFamily: fontFamilyInter,
                  fontWeight: 600,
                  fontSize: 34,
                  color: COLORS.text,
                  letterSpacing: '-0.02em',
                }}
              >
                what you meant
              </span>

              {/* Intuition intent nodes */}
              <div style={{ display: 'flex', gap: 14 }}>
                {['"feels like"', '"picture"', '"meaning"'].map((tag, i) => (
                  <span
                    key={i}
                    style={{
                      fontFamily: fontFamilyMono,
                      fontSize: 11,
                      color: `${COLORS.text}dd`,
                      padding: '4px 10px',
                      borderRadius: 6,
                      backgroundColor: `${COLORS.teal}18`,
                      border: `1px solid ${COLORS.teal}44`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Sub-label entropy */}
              <div style={{ fontFamily: fontFamilyMono, fontSize: 10, color: `${COLORS.text}66` }}>
                ENTROPY: 4.82 bits/token &bull; CONTINUOUS VALENCE
              </div>
            </div>

            {/* Block Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: fontFamilyMono, fontSize: 10, color: `${COLORS.text}66` }}>
                ORIGIN: INTUITION
              </span>
              <span style={{ fontFamily: fontFamilyMono, fontSize: 10, color: `${COLORS.text}66` }}>
                PRECISION: INTANGIBLE
              </span>
            </div>
          </div>

          {/* Right block: "what I made" */}
          <div
            style={{
              position: 'absolute',
              left: 1000 + slideOffset,
              top: 240,
              width: 760,
              height: 600,
              borderRadius: 16,
              backgroundColor: COLORS.surface,
              border: `2px solid ${COLORS.unlit}`,
              boxSizing: 'border-box',
              padding: 28,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
            }}
          >
            {/* Block Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: COLORS.orange, boxShadow: `0 0 8px ${COLORS.orange}` }} />
                <span style={{ fontFamily: fontFamilyMono, fontSize: 11, color: COLORS.orange, letterSpacing: '0.08em', fontWeight: 600 }}>
                  OUTPUT ARTIFACT // MACHINE SYNTHESIS
                </span>
              </div>
              <span style={{ fontFamily: fontFamilyMono, fontSize: 10, color: COLORS.unlit }}>
                DIM: 760 &times; 600 px
              </span>
            </div>

            {/* Center Label & AST Nodes */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
              <span
                style={{
                  fontFamily: fontFamilyInter,
                  fontWeight: 600,
                  fontSize: 34,
                  color: COLORS.text,
                  letterSpacing: '-0.02em',
                }}
              >
                what I made
              </span>

              {/* Machine synthesis tokens */}
              <div style={{ display: 'flex', gap: 14 }}>
                {['render()', 'tokens: 4096', 'loss: 0.001'].map((tag, i) => (
                  <span
                    key={i}
                    style={{
                      fontFamily: fontFamilyMono,
                      fontSize: 11,
                      color: `${COLORS.text}dd`,
                      padding: '4px 10px',
                      borderRadius: 6,
                      backgroundColor: `${COLORS.orange}18`,
                      border: `1px solid ${COLORS.orange}44`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Sub-label precision */}
              <div style={{ fontFamily: fontFamilyMono, fontSize: 10, color: `${COLORS.text}66` }}>
                TEMPERATURE: 0.70 &bull; DISCRETE TOKENS
              </div>
            </div>

            {/* Block Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: fontFamilyMono, fontSize: 10, color: `${COLORS.text}66` }}>
                ORIGIN: NEURAL WEIGHTS
              </span>
              <span style={{ fontFamily: fontFamilyMono, fontSize: 10, color: `${COLORS.text}66` }}>
                PRECISION: DISCRETE
              </span>
            </div>
          </div>

          {/* The Gap */}
          <Gap x={960} y={540} h={600} gapWidth={gapWidth} warm={slideProgress} />

          {/* Gap Dimension Callout Line */}
          {slideProgress > 0.1 && (
            <div
              style={{
                position: 'absolute',
                left: 960 - gapWidth / 2,
                top: 200,
                width: gapWidth,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                pointerEvents: 'none',
              }}
            >
              <div style={{ width: '100%', height: 1, backgroundColor: COLORS.orange }} />
              <span
                style={{
                  fontFamily: fontFamilyMono,
                  fontSize: 10,
                  color: COLORS.orange,
                  marginTop: 2,
                  backgroundColor: COLORS.navy,
                  padding: '1px 6px',
                  borderRadius: 4,
                  whiteSpace: 'nowrap',
                  fontWeight: 600,
                }}
              >
                GAP: {gapWidth.toFixed(1)}px
              </span>
            </div>
          )}

          {/* Ruler and Cursor (b2 & b3) */}
          {sec < 54.5 && (
            <div style={{ opacity: 1 - rulerFade }}>
              <Ruler
                x={360}
                y={540}
                w={1200}
                progress={rulerDraw}
                jitter={jitter}
                tickSpacing={30}
              />
              {/* Cursor attempting to sit on tick at x:960, sitting 1 px off at 959 */}
              {sec >= 48.5 && (
                <>
                  <Cursor x={959} y={516} press={0} />

                  {/* High Precision Zoom Reticle Callout (b3) */}
                  {zoomProgress > 0.2 && (
                    <div
                      style={{
                        position: 'absolute',
                        left: 959 + 24,
                        top: 516 - 36,
                        padding: '6px 12px',
                        backgroundColor: `${COLORS.surface}f0`,
                        border: `1px solid ${COLORS.orange}`,
                        borderRadius: 6,
                        boxShadow: `0 0 16px ${COLORS.orange}44`,
                        fontFamily: fontFamilyMono,
                        fontSize: 11,
                        color: COLORS.text,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                        pointerEvents: 'none',
                        zIndex: 100,
                      }}
                    >
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ color: COLORS.teal }}>TARGET: 960.000</span>
                        <span style={{ color: COLORS.orange }}>ACTUAL: 959.000</span>
                      </div>
                      <div style={{ fontSize: 10, color: COLORS.orange, fontWeight: 700 }}>
                        DELTA: -1.000 px [OFF BY ONE]
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* b5: Orange line -> square -> pulsing block inside Gap */}
          {sec >= 58.06 && (
            <div
              style={{
                position: 'absolute',
                left: 960 - (20 + shapeProgress * 30 + pulseBlock) / 2,
                top: 540 - (4 + shapeProgress * 46 + pulseBlock) / 2,
                width: 20 + shapeProgress * 30 + pulseBlock,
                height: 4 + shapeProgress * 46 + pulseBlock,
                backgroundColor: COLORS.orange,
                borderRadius: shapeProgress * 8,
                boxShadow: `0 0 ${16 + pulseBlock * 4}px ${COLORS.orange}`,
              }}
            />
          )}

          {/* Underground Dot */}
          <UndergroundDot
            x={960}
            y={1040}
            size={6}
            opacity={0.2}
            pulse={dotPulse}
            color={COLORS.orange}
          />

          {/* White Flash Out on Drop */}
          {whiteFlashOut > 0 && (
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 1920,
                height: 1080,
                backgroundColor: '#FFFFFF',
                opacity: whiteFlashOut,
                pointerEvents: 'none',
                zIndex: 100,
              }}
            />
          )}

          {/* Integrated Scene Lyrics inside Camera */}
          <SceneLyrics sceneId="S03" />
        </Camera>
      </div>
    );
  }

  // S06: Resolved (120.99 to 134.93)
  // Ruler already on screen, cursor 1 px off, no jitter
  const rulerDissolve = ramp(sec, 122.87, 0.8);
  const slideProgress = ramp(sec, 126.13, 3.7);
  const slideOffset = slideProgress * 120;
  const gapWidth = 64 + slideProgress * 140;

  // b4: Orange block shapes into Heart (129.84 to 133.31)
  const heartProgress = ramp(sec, 129.84, 2.0);
  const heartPulse = sec >= 133.31 ? Math.sin((sec - 133.31) * 16) * 0.5 + 0.5 : 0;

  // Instrumental riser
  const riserPull = ramp(sec, 134.53, 0.4);
  const pullScale = 1.0 - riserPull * 0.9;
  const whiteFlashOut = ramp(sec, 134.63, 0.3);

  // 128 BPM Kick groove pulse
  const beatPeriod = 60 / 128;
  const beatPhase = ((sec - 120.99) % beatPeriod) / beatPeriod;
  const kickPulse = Math.pow(Math.max(0, 1 - beatPhase * 3.2), 2.2);

  // Dynamic Camera for S06
  let s06BaseScale = 1.0;
  if (sec < 122.0) {
    s06BaseScale = 1.0; // B5 match cut entry
  } else if (sec < 126.13) {
    const p = ramp(sec, 122.0, 3.0);
    s06BaseScale = 1.0 + p * 0.35; // 1.0 -> 1.35
  } else if (sec < 129.84) {
    const p = ramp(sec, 126.13, 3.0);
    s06BaseScale = 1.35 + p * 0.15; // 1.35 -> 1.50
  } else if (sec < 134.53) {
    const p = ramp(sec, 129.84, 3.0);
    s06BaseScale = 1.50 + p * 0.15; // 1.50 -> 1.65 (macro push on Heart formation!)
  } else {
    s06BaseScale = 1.65;
  }

  const s06CamScale = s06BaseScale * pullScale * (1 + (sec >= 122.0 && sec < 134.5 ? kickPulse * 0.055 : 0));

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
      <Camera scale={s06CamScale} originX={960} originY={540}>
        {/* Dynamic Background Atmosphere: High-Speed Token Streams, Floating Reactions & Reticles */}
        <SideParticleStream density={22} speed={1.35} direction="both" showTokens={true} opacity={0.55} />
        <FloatingReactions count={20} types={['words', 'billing', 'reaction', 'party']} opacity={0.7} />
        <ExpandingReticles x={960} y={540} maxRadius={280} color={COLORS.teal} opacity={0.45} />

        {/* Active Live Telemetry HUD */}
        <LiveTelemetryStream
          variant="hud"
          style={{
            position: 'absolute',
            left: 48,
            bottom: 36,
            zIndex: 25,
          }}
        />

        {/* Blueprint Precision Grid Background */}
        <svg
          width={1920}
          height={1080}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            opacity: 0.16,
            pointerEvents: 'none',
          }}
        >
          <defs>
            <pattern id="gap-grid-s06" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke={COLORS.unlit} strokeWidth="1" strokeDasharray="2 4" />
              <circle cx="60" cy="60" r="1.5" fill={COLORS.text} opacity="0.4" />
            </pattern>
          </defs>
          <rect width="1920" height="1080" fill="url(#gap-grid-s06)" />
        </svg>

        {/* Top HUD Telemetry Ribbon (Resolved) */}
        <div
          style={{
            position: 'absolute',
            top: 24,
            left: 48,
            right: 48,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: fontFamilyMono,
            fontSize: 11,
            color: COLORS.unlit,
            letterSpacing: '0.06em',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ color: COLORS.orange, fontWeight: 700 }}>PRE-CHORUS 2 // THE GAP RESOLVED</span>
            <span style={{ opacity: 0.4 }}>•</span>
            <span>SYNTHESIS: CONVERGED</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ color: COLORS.teal, fontWeight: 700 }}>
              STATUS: PERFECT HARMONY
            </span>
            <span style={{ opacity: 0.4 }}>•</span>
            <span style={{ color: COLORS.teal }}>HEART RECEPTIVE</span>
          </div>
        </div>

        {/* Slider Guide Rails Top and Bottom */}
        <div
          style={{
            position: 'absolute',
            left: 120,
            right: 120,
            top: 220,
            height: 2,
            backgroundColor: `${COLORS.teal}44`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 120,
            right: 120,
            top: 858,
            height: 2,
            backgroundColor: `${COLORS.teal}44`,
          }}
        />

        {/* Left block: "what you meant" */}
        <div
          style={{
            position: 'absolute',
            left: 160 - slideOffset,
            top: 240,
            width: 760,
            height: 600,
            borderRadius: 16,
            backgroundColor: COLORS.surface,
            border: `2px solid ${COLORS.teal}88`,
            boxSizing: 'border-box',
            padding: 28,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: `0 16px 40px ${COLORS.teal}22`,
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: COLORS.teal, boxShadow: `0 0 8px ${COLORS.teal}` }} />
              <span style={{ fontFamily: fontFamilyMono, fontSize: 11, color: COLORS.teal, letterSpacing: '0.08em', fontWeight: 600 }}>
                INPUT SPECIFICATION // RESOLVED
              </span>
            </div>
            <span style={{ fontFamily: fontFamilyMono, fontSize: 10, color: COLORS.teal, fontWeight: 600 }}>
              CONVERGED
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <span
              style={{
                fontFamily: fontFamilyInter,
                fontWeight: 600,
                fontSize: 34,
                color: COLORS.text,
                letterSpacing: '-0.02em',
              }}
            >
              what you meant
            </span>
            <div style={{ display: 'flex', gap: 14 }}>
              {['"feels like"', '"picture"', '"meaning"'].map((tag, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: fontFamilyMono,
                    fontSize: 11,
                    color: COLORS.teal,
                    padding: '4px 10px',
                    borderRadius: 6,
                    backgroundColor: `${COLORS.teal}22`,
                    border: `1px solid ${COLORS.teal}55`,
                    fontWeight: 600,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: fontFamilyMono, fontSize: 10, color: `${COLORS.text}66` }}>
              ORIGIN: INTUITION
            </span>
            <span style={{ fontFamily: fontFamilyMono, fontSize: 10, color: COLORS.teal, fontWeight: 600 }}>
              STATUS: UNDERSTOOD
            </span>
          </div>
        </div>

        {/* Right block: "what I made" */}
        <div
          style={{
            position: 'absolute',
            left: 1000 + slideOffset,
            top: 240,
            width: 760,
            height: 600,
            borderRadius: 16,
            backgroundColor: COLORS.surface,
            border: `2px solid ${COLORS.orange}88`,
            boxSizing: 'border-box',
            padding: 28,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: `0 16px 40px ${COLORS.orange}22`,
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: COLORS.orange, boxShadow: `0 0 8px ${COLORS.orange}` }} />
              <span style={{ fontFamily: fontFamilyMono, fontSize: 11, color: COLORS.orange, letterSpacing: '0.08em', fontWeight: 600 }}>
                OUTPUT ARTIFACT // SYNTHESIS
              </span>
            </div>
            <span style={{ fontFamily: fontFamilyMono, fontSize: 10, color: COLORS.orange, fontWeight: 600 }}>
              CONVERGED
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <span
              style={{
                fontFamily: fontFamilyInter,
                fontWeight: 600,
                fontSize: 34,
                color: COLORS.text,
                letterSpacing: '-0.02em',
              }}
            >
              what I made
            </span>
            <div style={{ display: 'flex', gap: 14 }}>
              {['render()', 'tokens: 4096', 'loss: 0.000'].map((tag, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: fontFamilyMono,
                    fontSize: 11,
                    color: COLORS.orange,
                    padding: '4px 10px',
                    borderRadius: 6,
                    backgroundColor: `${COLORS.orange}22`,
                    border: `1px solid ${COLORS.orange}55`,
                    fontWeight: 600,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: fontFamilyMono, fontSize: 10, color: `${COLORS.text}66` }}>
              ORIGIN: NEURAL WEIGHTS
            </span>
            <span style={{ fontFamily: fontFamilyMono, fontSize: 10, color: COLORS.orange, fontWeight: 600 }}>
              STATUS: EMBODIED
            </span>
          </div>
        </div>

        {/* The Gap (warmer in S06) */}
        <Gap x={960} y={540} h={600} gapWidth={gapWidth} warm={0.5 + slideProgress * 0.5} />

        {/* Spark already in Gap in S06 */}
        {sec < 129.84 && <Spark x={960} y={540} burst={0.3} />}

        {/* Ruler on screen, dissolves at 122.87 */}
        {sec < 124.0 && (
          <div style={{ opacity: 1 - rulerDissolve }}>
            <Ruler x={360} y={540} w={1200} progress={1} jitter={0} tickSpacing={30} />
            <Cursor x={959} y={516} press={0} />
          </div>
        )}

        {/* Heart grows out of Gap in S06 */}
        {sec >= 129.84 && (
          <Heart x={960} y={540} d={12 + heartProgress * 36} pulse={heartPulse} />
        )}

        {/* Underground Dot */}
        <UndergroundDot
          x={960}
          y={1040}
          size={6}
          opacity={0.2}
          pulse={dotPulse}
          color={COLORS.orange}
        />

        {/* White Flash Out on Drop */}
        {whiteFlashOut > 0 && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 1920,
              height: 1080,
              backgroundColor: '#FFFFFF',
              opacity: whiteFlashOut,
              pointerEvents: 'none',
              zIndex: 100,
            }}
          />
        )}

        {/* Integrated Scene Lyrics inside Camera */}
        <SceneLyrics sceneId="S06" />
      </Camera>
    </div>
  );
};

export default GapScene;
