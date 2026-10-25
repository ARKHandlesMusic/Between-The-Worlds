export const AUDIO_SRC = 'song.mp3';

export const COLORS = {
  navy: '#0F1B2D',
  surface: '#1B2A41',
  unlit: '#3A4A63',
  text: '#F3EFE6',
  orange: '#E07A4F',
  teal: '#4FB3A9',
} as const;

// Final chorus palette (key change at 182.57 s). Warm white for lit dots is #FFF4E0.
export const COLORS_FINAL = {
  ...COLORS,
  navy: '#1A2350',
  orange: '#F29A52',
  teal: '#FFF4E0',
} as const;

// Calibrated once per Section 6.7: measured avg(0, 4) and avg(24, 48) on frames 1888-2100 (62.94s - 70.00s, Chorus 1).
// Loudest kick in chorus: maxBass = 0.1736, maxHigh = 0.0181.
// Gains set so the loudest kick is close to 1.
export const BASS_GAIN = 5.76;
export const HIGH_GAIN = 55.22;
