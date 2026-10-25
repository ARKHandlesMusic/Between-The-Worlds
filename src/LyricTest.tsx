import React from 'react';
import { COLORS } from './lib/tokens';
import { fontFamilyInter } from './lib/fonts';
import { WordRise } from './lyrics/variants/WordRise';
import { Stagger } from './lyrics/variants/Stagger';
import { Pulse } from './lyrics/variants/Pulse';
import { SlowFade } from './lyrics/variants/SlowFade';
import { Karaoke } from './lyrics/variants/Karaoke';
import { Whisper } from './primitives/Whisper';
import { useClock } from './lib/clock';

export const LyricTest: React.FC = () => {
  const { sec } = useClock();

  // Test lines active from 1.0s to 5.0s
  const sampleStart = 1.0;
  const sampleEnd = 5.0;

  const testLines = {
    wordRise: {
      line: {
        id: 'T1',
        text: 'You type a wish in a tiny glowing box',
        startSec: sampleStart,
        endSec: sampleEnd,
        kind: 'sung' as const,
      },
      words: [
        { text: 'You', startSec: 1.0, endSec: 1.4 },
        { text: 'type', startSec: 1.4, endSec: 1.9 },
        { text: 'a', startSec: 1.9, endSec: 2.2 },
        { text: 'wish', startSec: 2.2, endSec: 2.8 },
        { text: 'in', startSec: 2.8, endSec: 3.2 },
        { text: 'a', startSec: 3.2, endSec: 3.5 },
        { text: 'tiny', startSec: 3.5, endSec: 4.0 },
        { text: 'glowing', startSec: 4.0, endSec: 4.5 },
        { text: 'box', startSec: 4.5, endSec: 5.0 },
      ],
    },
    stagger: {
      line: {
        id: 'T2',
        text: 'Are we precise? Are we making lies!',
        startSec: sampleStart,
        endSec: sampleEnd,
        kind: 'sung' as const,
      },
      words: [
        { text: 'Are', startSec: 1.0, endSec: 1.5 },
        { text: 'we', startSec: 1.5, endSec: 2.0 },
        { text: 'precise?', startSec: 2.0, endSec: 2.7 },
        { text: 'Are', startSec: 2.7, endSec: 3.3 },
        { text: 'we', startSec: 3.3, endSec: 3.8 },
        { text: 'making', startSec: 3.8, endSec: 4.4 },
        { text: 'lies!', startSec: 4.4, endSec: 5.0 },
      ],
    },
    pulse: {
      line: {
        id: 'T3',
        text: 'So hear it with your heart, heart, heart,',
        startSec: sampleStart,
        endSec: sampleEnd,
        kind: 'sung' as const,
      },
      words: [
        { text: 'So', startSec: 1.0, endSec: 1.4 },
        { text: 'hear', startSec: 1.4, endSec: 1.8 },
        { text: 'it', startSec: 1.8, endSec: 2.1 },
        { text: 'with', startSec: 2.1, endSec: 2.5 },
        { text: 'your', startSec: 2.5, endSec: 2.9 },
        { text: 'heart,', startSec: 2.9, endSec: 3.6 },
        { text: 'heart,', startSec: 3.6, endSec: 4.3 },
        { text: 'heart,', startSec: 4.3, endSec: 5.0 },
      ],
    },
    slowFade: {
      line: {
        id: 'T4',
        text: 'They say it is slop unless it breaks the sky',
        startSec: sampleStart,
        endSec: sampleEnd,
        kind: 'sung' as const,
      },
      words: [
        { text: 'They', startSec: 1.0, endSec: 1.4 },
        { text: 'say', startSec: 1.4, endSec: 1.8 },
        { text: 'it', startSec: 1.8, endSec: 2.2 },
        { text: 'is', startSec: 2.2, endSec: 2.6 },
        { text: 'slop', startSec: 2.6, endSec: 3.2 },
        { text: 'unless', startSec: 3.2, endSec: 3.8 },
        { text: 'it', startSec: 3.8, endSec: 4.1 },
        { text: 'breaks', startSec: 4.1, endSec: 4.6 },
        { text: 'the', startSec: 4.6, endSec: 4.8 },
        { text: 'sky', startSec: 4.8, endSec: 5.0 },
      ],
    },
    karaoke: {
      line: {
        id: 'T5',
        text: 'Hear it with your heart, heart, heart',
        startSec: sampleStart,
        endSec: sampleEnd,
        kind: 'sung' as const,
      },
      words: [
        { text: 'Hear', startSec: 1.0, endSec: 1.5 },
        { text: 'it', startSec: 1.5, endSec: 2.0 },
        { text: 'with', startSec: 2.0, endSec: 2.5 },
        { text: 'your', startSec: 2.5, endSec: 3.0 },
        { text: 'heart,', startSec: 3.0, endSec: 3.7 },
        { text: 'heart,', startSec: 3.7, endSec: 4.4 },
        { text: 'heart', startSec: 4.4, endSec: 5.0 },
      ],
    },
  };

  const whisperReveal = Math.min(1, Math.max(0, (sec - sampleStart) / (sampleEnd - sampleStart)));

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        backgroundColor: COLORS.navy,
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Title */}
      <div
        style={{
          position: 'absolute',
          left: 96,
          top: 40,
          fontFamily: fontFamilyInter,
          fontSize: 28,
          fontWeight: 700,
          color: COLORS.text,
        }}
      >
        Lyric Variant Test (sec: {sec.toFixed(2)})
      </div>

      {/* 1. WordRise */}
      <div style={{ position: 'absolute', left: 96, top: 100, width: 1728 }}>
        <div style={{ fontFamily: fontFamilyInter, fontSize: 14, color: COLORS.unlit, marginBottom: 4 }}>
          WordRise (Verse 1 & 2 - 64px)
        </div>
        <WordRise line={testLines.wordRise.line} words={testLines.wordRise.words} />
      </div>

      {/* 2. Stagger */}
      <div style={{ position: 'absolute', left: 96, top: 250, width: 1728 }}>
        <div style={{ fontFamily: fontFamilyInter, fontSize: 14, color: COLORS.unlit, marginBottom: 4 }}>
          Stagger (Pre-chorus - 56px)
        </div>
        <Stagger line={testLines.stagger.line} words={testLines.stagger.words} />
      </div>

      {/* 3. Pulse */}
      <div style={{ position: 'absolute', left: 96, top: 400, width: 1728 }}>
        <div style={{ fontFamily: fontFamilyInter, fontSize: 14, color: COLORS.unlit, marginBottom: 4 }}>
          Pulse (Chorus 1 & 2 - 84px)
        </div>
        <Pulse line={testLines.pulse.line} words={testLines.pulse.words} />
      </div>

      {/* 4. SlowFade */}
      <div style={{ position: 'absolute', left: 96, top: 580, width: 1728 }}>
        <div style={{ fontFamily: fontFamilyInter, fontSize: 14, color: COLORS.unlit, marginBottom: 4 }}>
          SlowFade (Bridge - 64px)
        </div>
        <SlowFade line={testLines.slowFade.line} words={testLines.slowFade.words} />
      </div>

      {/* 5. Karaoke */}
      <div style={{ position: 'absolute', left: 96, top: 740, width: 1728 }}>
        <div style={{ fontFamily: fontFamilyInter, fontSize: 14, color: COLORS.unlit, marginBottom: 4 }}>
          Karaoke (Final Chorus - 84px)
        </div>
        <Karaoke line={testLines.karaoke.line} words={testLines.karaoke.words} />
      </div>

      {/* 6. Whisper */}
      <div style={{ position: 'absolute', left: 96, top: 920, width: 1728 }}>
        <div style={{ fontFamily: fontFamilyInter, fontSize: 14, color: COLORS.unlit, marginBottom: 4 }}>
          Whisper (Bottom left - 14px 30% opacity)
        </div>
        <div style={{ position: 'relative', width: 400, height: 40 }}>
          <Whisper text="(Can you hear it?)" reveal={whisperReveal} x={0} y={10} />
        </div>
      </div>
    </div>
  );
};
