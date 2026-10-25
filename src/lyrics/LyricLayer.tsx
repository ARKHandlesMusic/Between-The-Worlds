import React from 'react';
import { useClock } from '../lib/clock';
import { LYRICS, wordTimings, LyricLine } from '../data/lyrics';
import { TIMELINE } from '../data/timeline';
import { WordRise } from './variants/WordRise';
import { Stagger } from './variants/Stagger';
import { Pulse } from './variants/Pulse';
import { SlowFade } from './variants/SlowFade';
import { Karaoke } from './variants/Karaoke';
import { WhisperVariant } from './variants/WhisperVariant';

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

export const LyricLayer: React.FC = () => {
  const { sec } = useClock();

  // Find current scene
  const currentScene =
    TIMELINE.find((s) => sec >= s.start && sec < s.end) || TIMELINE[0];

  // Active lyric lines for current time:
  // Each line is active in [startSec, endSec) with no overlap
  const activeLines = LYRICS.filter(
    (line) => sec >= line.startSec && sec < line.endSec
  ).slice(0, 1);

  if (activeLines.length === 0 || sec >= 237.5) return null;

  const VariantComponent = getVariantForScene(currentScene.id);

  // Dynamic Scene-Integrated World Positioning:
  // Eliminates static bottom caption box by embedding lyrics into the visual focal point of each scene
  let targetTop = 520;
  let targetScale = 1.0;

  switch (currentScene.id) {
    case 'S02': // Verse 1 (18.55s - 47.09s):
      if (sec < 26.0) {
        // Floating above PromptBox & early Canvas
        targetTop = 590;
      } else if (sec < 35.0) {
        // Panning beside Canvas & Spark forks
        targetTop = 480;
      } else if (sec < 43.0) {
        // Dial swing & Rings
        targetTop = 510;
      } else {
        // Approaching the Gap
        targetTop = 520;
      }
      break;

    case 'S03': // Chorus 1 Gap (47.09s - 62.94s):
      // Centered directly in the glowing Gap band!
      targetTop = 460;
      targetScale = 1.08;
      break;

    case 'S04': // Chorus 1 (62.94s - 92.84s):
      if (sec >= 74.0 && sec < 80.0) {
        // "From the slop into the art" across the arena
        targetTop = 490;
        targetScale = 1.05;
      } else if (sec >= 80.0 && sec < 88.0) {
        // "The quiet underground"
        targetTop = 640;
      } else {
        targetTop = 580;
      }
      break;

    case 'S05': // Verse 2 (92.84s - 120.99s):
      if (sec < 99.21) {
        // Typing across Website Canvas code cards
        targetTop = 420;
      } else if (sec < 110.24) {
        // Dark mode searchlights & scar
        targetTop = 480;
      } else if (sec < 117.41) {
        // Brick wall building
        targetTop = 450;
      } else {
        // Hands lifting
        targetTop = 440;
      }
      break;

    case 'S06': // Chorus 2 Gap (120.99s - 134.93s):
      // Centered in the Gap!
      targetTop = 460;
      targetScale = 1.1;
      break;

    case 'S07': // Chorus 2 (134.93s - 164.21s):
      if (sec < 144.0) {
        targetTop = 500;
      } else if (sec < 155.0) {
        targetTop = 540;
      } else {
        targetTop = 480;
      }
      break;

    case 'S08': // Bridge (164.21s - 182.57s):
      // Floats in the starry constellation sky field above sky line!
      targetTop = 260;
      targetScale = 0.98;
      break;

    case 'S09': // Chorus 3 / Outro (182.57s - 228.52s):
      if (sec < 208.3) {
        // Part A: Projecting on lecture hall blackboard
        targetTop = 380;
      } else {
        // Part B: Grand Karaoke chant "Hear it with your heart!"
        targetTop = 460;
        targetScale = 1.15;
      }
      break;

    default:
      targetTop = 520;
      break;
  }

  return (
    <>
      {activeLines.map((line: LyricLine) => {
        const words = wordTimings(line);

        if (line.kind === 'whisper') {
          return <WhisperVariant key={line.id} line={line} words={words} />;
        }

        return (
          <div
            key={line.id}
            style={{
              position: 'absolute',
              left: 120,
              top: targetTop,
              width: 1680,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              pointerEvents: 'none',
              zIndex: 700,
              transform: `scale(${targetScale})`,
              transformOrigin: 'center center',
            }}
          >
            <VariantComponent line={line} words={words} />
          </div>
        );
      })}
    </>
  );
};
