import { Easing, interpolate } from 'remotion';

type Ease = (t: number) => number;

/** 0 before `start`, 1 after `start + dur`, eased in between. Times in absolute seconds. */
export const ramp = (
  sec: number,
  start: number,
  dur: number,
  easing: Ease = Easing.out(Easing.cubic)
): number =>
  interpolate(sec, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });
