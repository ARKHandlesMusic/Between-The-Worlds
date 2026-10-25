export const FPS = 120;
export const toFrame = (sec: number): number => Math.round(sec * FPS);
export const toSec = (frame: number): number => frame / FPS;

