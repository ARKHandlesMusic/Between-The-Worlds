import React, { createContext, useContext } from 'react';
import { Sequence, useCurrentFrame, useVideoConfig } from 'remotion';
import { FPS, toFrame } from './time';

const SceneStart = createContext<number>(0); // absolute start frame of the enclosing Sequence
export const SceneStartProvider = SceneStart.Provider;

export function useClock() {
  const local = useCurrentFrame();
  const start = useContext(SceneStart);
  const { fps } = useVideoConfig();
  const abs = start + local;
  return { abs, sec: abs / fps, local };
}

export const SceneRoot: React.FC<{
  start: number;
  end: number;
  children: React.ReactNode;
}> = ({ start, end, children }) => {
  const from = toFrame(start);
  const duration = Math.max(1, toFrame(end) - from);
  return (
    <Sequence from={from} durationInFrames={duration} premountFor={FPS}>
      <SceneStartProvider value={from}>{children}</SceneStartProvider>
    </Sequence>
  );
};
