import React from 'react';
import type { LyricLine, WordTiming } from '../../data/lyrics';
import { useClock } from '../../lib/clock';
import { Whisper } from '../../primitives/Whisper';

export const WhisperVariant: React.FC<{
  line: LyricLine;
  words: WordTiming[];
}> = ({ line, words }) => {
  const { sec } = useClock();

  if (sec < line.startSec || sec > line.endSec + 0.5) return null;

  // Count how many words have started
  const startedWords = words.filter((w) => sec >= w.startSec).length;
  const reveal = words.length > 0 ? startedWords / words.length : 1;

  return <Whisper text={line.text} reveal={reveal} x={48} y={1032} />;
};
