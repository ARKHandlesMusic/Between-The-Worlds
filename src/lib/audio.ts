import { useAudioData, visualizeAudio } from '@remotion/media-utils';
import { staticFile, useVideoConfig } from 'remotion';
import { useClock } from './clock';
import { AUDIO_SRC, BASS_GAIN, HIGH_GAIN } from './tokens';

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export function useBands() {
  const { abs } = useClock();
  const { fps } = useVideoConfig();
  const audioData = useAudioData(staticFile(AUDIO_SRC));
  if (!audioData) return { bass: 0, high: 0 };
  const bins = visualizeAudio({ fps, frame: abs, audioData, numberOfSamples: 64 });
  const avg = (a: number, b: number) =>
    bins.slice(a, b).reduce((s, v) => s + v, 0) / (b - a);
  return {
    bass: clamp01(avg(0, 4) * BASS_GAIN),
    high: clamp01(avg(24, 48) * HIGH_GAIN),
  };
}
