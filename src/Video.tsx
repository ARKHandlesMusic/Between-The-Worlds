import React from 'react';
import { Audio, staticFile, useVideoConfig } from 'remotion';
import { AUDIO_SRC, COLORS } from './lib/tokens';
import { SceneRoot, useClock } from './lib/clock';
import { UndergroundDot } from './primitives/UndergroundDot';
import { useBands } from './lib/audio';
import { TIMELINE } from './data/timeline';
import { Scene01 } from './scenes/s01';
import { Scene02 } from './scenes/s02';
import { Scene03 } from './scenes/s03';
import { Scene04 } from './scenes/s04';
import { Scene05 } from './scenes/s05';
import { Scene06 } from './scenes/s06';
import { Scene07 } from './scenes/s07';
import { Scene08 } from './scenes/s08';
import { Scene09 } from './scenes/s09';
import { Scene10 } from './scenes/s10';

export const Video: React.FC = () => {
  const { width, height } = useVideoConfig();
  const scale = width / 1920;
  const { bass } = useBands();
  const { sec } = useClock();

  const s01 = TIMELINE[0];
  const s02 = TIMELINE[1];
  const s03 = TIMELINE[2];
  const s04 = TIMELINE[3];
  const s05 = TIMELINE[4];
  const s06 = TIMELINE[5];
  const s07 = TIMELINE[6];
  const s08 = TIMELINE[7];
  const s09 = TIMELINE[8];
  const s10 = TIMELINE[9];

  const isS08 = sec >= s08.start && sec < s08.end;
  const isFlash = sec >= 182.35 && sec < 182.65;
  const isS10Pulse = sec >= 236.0 && sec < 236.8;
  const isFadeOut = sec >= 237.5;

  const dotSize = isS08 ? 16 : 6;
  const dotY = isS08 ? 840 : 1040;
  const dotOpacity = sec < 2.0 || isFlash || isFadeOut ? 0 : isS08 ? 0.9 : 0.2;
  const dotPulse = isS10Pulse
    ? Math.sin(((sec - 236.0) / 0.8) * Math.PI)
    : isS08
    ? 0
    : bass;

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: COLORS.navy,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: 1920,
          height: 1080,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <Audio src={staticFile(AUDIO_SRC)} />

      {/* 1. Scenes */}
      <SceneRoot start={s01.start} end={s01.end}>
        <Scene01 />
      </SceneRoot>
      <SceneRoot start={s02.start} end={s02.end}>
        <Scene02 />
      </SceneRoot>
      <SceneRoot start={s03.start} end={s03.end}>
        <Scene03 />
      </SceneRoot>
      <SceneRoot start={s04.start} end={s04.end}>
        <Scene04 />
      </SceneRoot>
      <SceneRoot start={s05.start} end={s05.end}>
        <Scene05 />
      </SceneRoot>
      <SceneRoot start={s06.start} end={s06.end}>
        <Scene06 />
      </SceneRoot>
      <SceneRoot start={s07.start} end={s07.end}>
        <Scene07 />
      </SceneRoot>
      <SceneRoot start={s08.start} end={s08.end}>
        <Scene08 />
      </SceneRoot>
      <SceneRoot start={s09.start} end={s09.end}>
        <Scene09 />
      </SceneRoot>
      <SceneRoot start={s10.start} end={s10.end}>
        <Scene10 />
      </SceneRoot>

      {/* 2. Underground Dot - appears in every scene */}
      <UndergroundDot
        size={dotSize}
        y={dotY}
        opacity={dotOpacity}
        pulse={dotPulse}
      />
      </div>
    </div>
  );
};

