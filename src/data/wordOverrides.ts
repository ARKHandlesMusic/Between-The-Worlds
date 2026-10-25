import type { WordTiming } from './lyrics';

export type WordOverrideMap = Record<string, WordTiming[]>;

function createHeartRepeatTiming(
  words: string[],
  startSec: number,
  endSec: number
): WordTiming[] {
  const len = endSec - startSec;
  const usable = Math.min(Math.max(0.3, Math.min(len * 0.85, len - 0.15)), 3.0);
  const heartIndices = [words.length - 3, words.length - 2, words.length - 1];
  const prefixWords = words.slice(0, words.length - 3);

  // Allocate 45% of usable time to prefix and 55% to the three hearts (equal thirds)
  const prefixUsable = usable * 0.45;
  const heartsUsable = usable * 0.55;

  const prefixWeights = prefixWords.map((w) =>
    Math.max(2, w.replace(/[^\p{L}\p{N}]/gu, '').length)
  );
  const prefixTotalWeight = prefixWeights.reduce((a, b) => a + b, 0);

  const result: WordTiming[] = [];
  let t = startSec;

  for (let i = 0; i < prefixWords.length; i++) {
    const dur = (prefixUsable * prefixWeights[i]) / prefixTotalWeight;
    const s = t;
    t += dur;
    result.push({ text: prefixWords[i], startSec: s, endSec: t });
  }

  const heartDuration = heartsUsable / 3;
  for (const idx of heartIndices) {
    const s = t;
    t += heartDuration;
    result.push({ text: words[idx], startSec: s, endSec: t });
  }

  return result;
}

export const WORD_OVERRIDES: WordOverrideMap = {
  // Chorus 1
  'So hear it with your heart, heart, heart,@62.94': createHeartRepeatTiming(
    ['So', 'hear', 'it', 'with', 'your', 'heart,', 'heart,', 'heart,'],
    62.94,
    65.21
  ),
  'Hear it with your heart, heart, heart,@69.89': createHeartRepeatTiming(
    ['Hear', 'it', 'with', 'your', 'heart,', 'heart,', 'heart,'],
    69.89,
    72.46
  ),
  // Chorus 2
  'So hear it with your heart, heart, heart,@134.93': createHeartRepeatTiming(
    ['So', 'hear', 'it', 'with', 'your', 'heart,', 'heart,', 'heart,'],
    134.93,
    138.12
  ),
  'Hear it with your heart, heart, heart,@141.86': createHeartRepeatTiming(
    ['Hear', 'it', 'with', 'your', 'heart,', 'heart,', 'heart,'],
    141.86,
    144.44
  ),
  // Chorus 3 / Final chorus
  'So hear it with your heart, heart, heart,@182.57': createHeartRepeatTiming(
    ['So', 'hear', 'it', 'with', 'your', 'heart,', 'heart,', 'heart,'],
    182.57,
    184.21
  ),
  'Hear it with your heart, heart, heart,@188.26': createHeartRepeatTiming(
    ['Hear', 'it', 'with', 'your', 'heart,', 'heart,', 'heart,'],
    188.26,
    191.08
  ),
};

export function getWordOverride(text: string, startSec: number): WordTiming[] | undefined {
  const key = `${text}@${startSec.toFixed(2)}`;
  return WORD_OVERRIDES[key];
}
