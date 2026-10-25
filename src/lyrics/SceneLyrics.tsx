import React from 'react';
import { useClock } from '../lib/clock';
import { LYRICS, wordTimings } from '../data/lyrics';
import { WordRise } from './variants/WordRise';
import { Stagger } from './variants/Stagger';
import { Pulse } from './variants/Pulse';
import { SlowFade } from './variants/SlowFade';
import { Karaoke } from './variants/Karaoke';
import { WhisperVariant } from './variants/WhisperVariant';

export interface SceneLyricsProps {
  sceneId: string;
  top?: number;
  left?: number;
  width?: number;
  scale?: number;
  style?: React.CSSProperties;
}

function getVariantForScene(sceneId: string) {
  switch (sceneId) {
    case 'S02':
    case 'S05':
      return WordRise;
    case 'S03':
    case 'S06':
      return Stagger;
    case 'S04':
    case 'S07':
      return Pulse;
    case 'S08':
      return SlowFade;
    case 'S09':
      return Karaoke;
    default:
      return WordRise;
  }
}

/**
 * SceneLyrics:
 * Embedded directly inside each scene's <Camera> container.
 * Moves, pans, zooms, and bounces in perfect 1:1 synchronization with the virtual camera and scene elements!
 */
export const SceneLyrics: React.FC<SceneLyricsProps> = ({
  sceneId,
  top: propTop,
  left: propLeft,
  width: propWidth,
  scale: propScale,
  style: propStyle,
}) => {
  const { sec } = useClock();

  // Find active line
  const activeLine = LYRICS.find(
    (line) => sec >= line.startSec && sec < line.endSec
  );

  if (!activeLine || sec >= 237.5) return null;

  const VariantComponent = getVariantForScene(sceneId);
  const words = wordTimings(activeLine);

  if (activeLine.kind === 'whisper') {
    return <WhisperVariant line={activeLine} words={words} />;
  }

  // Dynamic Scene-Integrated World Positioning:
  // Coordinates are in scene world space (1920 x 1080) inside <Camera>
  let targetTop = propTop ?? 520;
  let targetLeft = propLeft ?? 120;
  let targetWidth = propWidth ?? 1680;
  let targetScale = propScale ?? 1.0;

  if (propTop === undefined) {
    switch (sceneId) {
      case 'S02': // Verse 1 (18.55s - 47.09s):
        if (sec < 21.16) {
          // "You type a wish in a tiny glowing box":
          // Prompt box is at y=940; camera zoomed at (960, 920) scale 1.82
          // Floats cleanly above the top neon border of Prompt Box
          targetTop = 780;
          targetLeft = 480;
          targetWidth = 960;
          targetScale = 0.50;
        } else if (sec < 25.44) {
          // "Half a picture, half a lock":
          // Positioned beside the CAD Drafting Canvas at top-right (1420, 260) scale 1.76
          targetTop = 450;
          targetLeft = 980;
          targetWidth = 880;
          targetScale = 0.52;
        } else if (sec < 28.77) {
          // "I reach for the meaning behind the line":
          // Camera at (960, 500) scale 1.62
          targetTop = 410;
          targetLeft = 440;
          targetWidth = 1040;
          targetScale = 0.55;
        } else if (sec < 32.70) {
          // "Guess a little, hope I'm right this time":
          targetTop = 410;
          targetLeft = 440;
          targetWidth = 1040;
          targetScale = 0.55;
        } else if (sec < 43.51) {
          // Dial swing & Resonance rings (1360, 540) scale 1.76
          targetTop = 420;
          targetLeft = 880;
          targetWidth = 960;
          targetScale = 0.52;
        } else {
          // Approaching the Gap:
          targetTop = 480;
          targetLeft = 400;
          targetWidth = 1120;
          targetScale = 0.58;
        }
        break;

      case 'S03': // Chorus 1 Gap (47.09s - 62.94s):
        // Vertically centered directly in the glowing Gap band!
        targetTop = 470;
        targetLeft = 400;
        targetWidth = 1120;
        targetScale = 0.58;
        break;

      case 'S04': // Chorus 1 (62.94s - 92.84s):
        if (sec < 74.0) {
          // "So hear it with your heart..." / "The voice was never in the sound"
          // Heart is at y=430, ECG line at y=500. Camera zoomed at (960, 480) scale 1.75
          // Place lyrics at y=630 so they fit cleanly beneath the heart!
          targetTop = 630;
          targetLeft = 440;
          targetWidth = 1040;
          targetScale = 0.48;
        } else if (sec < 80.0) {
          // "From the slop into the art":
          // Sweeping across the arena between the two RLHF cards
          targetTop = 680;
          targetLeft = 420;
          targetWidth = 1080;
          targetScale = 0.52;
        } else if (sec < 86.24) {
          // "The quiet underground":
          // Floats cleanly above the Underground Dot at y=1040 (camera at 960, 920 scale 1.85)
          targetTop = 760;
          targetLeft = 440;
          targetWidth = 1040;
          targetScale = 0.48;
        } else {
          targetTop = 620;
          targetLeft = 420;
          targetWidth = 1080;
          targetScale = 0.52;
        }
        break;

      case 'S05': // Verse 2 (92.84s - 120.99s):
        if (sec < 99.21) {
          // "I caught the spark..." / "Built a little world you hadn't seen"
          targetTop = 380;
          targetLeft = 420;
          targetWidth = 1080;
          targetScale = 0.55;
        } else if (sec < 110.24) {
          // "I left a scar..." / "Brick by brick..." (camera at 1220, 520 scale 1.70)
          targetTop = 420;
          targetLeft = 760;
          targetWidth = 920;
          targetScale = 0.50;
        } else if (sec < 117.41) {
          // "Two hands lifting..."
          targetTop = 420;
          targetLeft = 420;
          targetWidth = 1080;
          targetScale = 0.55;
        } else {
          targetTop = 440;
          targetLeft = 400;
          targetWidth = 1120;
          targetScale = 0.58;
        }
        break;

      case 'S06': // Chorus 2 Gap (120.99s - 134.93s):
        // Centered inside the Gap!
        targetTop = 470;
        targetLeft = 400;
        targetWidth = 1120;
        targetScale = 0.58;
        break;

      case 'S07': // Chorus 2 (134.93s - 164.21s):
        if (sec < 144.0) {
          // Zoomed into Claude App window at top-left (OriginX: 480, OriginY: 240, Scale: 1.78)
          // Straddles cleanly across the lower horizon of the active window
          targetTop = 440;
          targetLeft = 120;
          targetWidth = 1100;
          targetScale = 0.36;
        } else if (sec < 155.0) {
          // Panned to VS Code Editor at bottom-left (OriginX: 440, OriginY: 640, Scale: 1.82)
          // Positioned cleanly inside the VS Code editor viewport under the code line!
          targetTop = 720;
          targetLeft = 160;
          targetWidth = 800;
          targetScale = 0.36;
        } else {
          // Terminal / Dock cascade:
          targetTop = 480;
          targetLeft = 400;
          targetWidth = 1120;
          targetScale = 0.55;
        }
        break;

      case 'S08': // Bridge (164.21s - 182.57s):
        // Floats in the starry celestial sky field below the sky line
        targetTop = 240;
        targetLeft = 400;
        targetWidth = 1120;
        targetScale = 0.52;
        break;

      case 'S09': // Chorus 3 (182.57s - 228.52s):
        if (sec < 204.0) {
          // Part A: Projected onto the lecture hall blackboard at (960, 302)
          targetTop = 320;
          targetLeft = 420;
          targetWidth = 1080;
          targetScale = 0.54;
        } else {
          // Part B: Grand Stadium Concert Chant! (camera at 1.70x)
          targetTop = 450;
          targetLeft = 420;
          targetWidth = 1080;
          targetScale = 0.44;
        }
        break;

      case 'S10': // Outro Coda (228.52s - 238.92s):
        targetTop = 680;
        targetLeft = 400;
        targetWidth = 1120;
        targetScale = 0.58;
        break;
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: targetLeft,
        top: targetTop,
        width: targetWidth,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
        zIndex: 800,
        transform: `scale(${targetScale})`,
        transformOrigin: 'top center',
        ...propStyle,
      }}
    >
      <VariantComponent line={activeLine} words={words} />
    </div>
  );
};
