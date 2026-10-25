import React from 'react';
import { Composition, staticFile } from 'remotion';
import { getAudioDurationInSeconds } from '@remotion/media-utils';
import { Video } from './Video';
import { AUDIO_SRC } from './lib/tokens';
import { FPS } from './lib/time';
import './lib/fonts';

import { Gallery } from './Gallery';

import { LyricTest } from './LyricTest';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="Video"
        component={Video}
        durationInFrames={Math.ceil(238.92 * FPS)}
        fps={FPS}
        width={7680}
        height={4320}
        calculateMetadata={async () => {
          const seconds = await getAudioDurationInSeconds(staticFile(AUDIO_SRC));
          return {
            durationInFrames: Math.ceil(seconds * FPS),
          };
        }}
      />
      <Composition
        id="Gallery"
        component={Gallery}
        durationInFrames={300}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="LyricTest"
        component={LyricTest}
        durationInFrames={300}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
