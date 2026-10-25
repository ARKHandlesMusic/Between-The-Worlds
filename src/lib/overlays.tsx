import React from 'react';
import { ramp } from './ramp';
import { useClock } from './clock';

export const Flash: React.FC<{
  startSec: number;
  holdSec?: number;
  fadeSec?: number;
}> = ({ startSec, holdSec = 0.05, fadeSec = 0.25 }) => {
  const { sec } = useClock();
  if (sec < startSec || sec > startSec + holdSec + fadeSec) {
    return null;
  }
  const opacity =
    sec <= startSec + holdSec
      ? 1
      : 1 - ramp(sec, startSec + holdSec, fadeSec);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 1920,
        height: 1080,
        backgroundColor: '#FFFFFF',
        opacity,
        pointerEvents: 'none',
        zIndex: 900,
      }}
    />
  );
};

export const FadeToBlack: React.FC<{
  startSec: number;
  durSec: number;
}> = ({ startSec, durSec }) => {
  const { sec } = useClock();
  const opacity = ramp(sec, startSec, durSec);
  if (opacity <= 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 1920,
        height: 1080,
        backgroundColor: '#000000',
        opacity,
        pointerEvents: 'none',
        zIndex: 950,
      }}
    />
  );
};

export const DarkOverlay: React.FC<{
  startSec: number;
  durSec: number;
  direction?: 'in' | 'out';
  maxOpacity?: number;
}> = ({ startSec, durSec, direction = 'in', maxOpacity = 0.8 }) => {
  const { sec } = useClock();
  const r = ramp(sec, startSec, durSec);
  const opacity = (direction === 'in' ? r : 1 - r) * maxOpacity;
  if (opacity <= 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 1920,
        height: 1080,
        backgroundColor: '#000000',
        opacity,
        pointerEvents: 'none',
        zIndex: 850,
      }}
    />
  );
};
