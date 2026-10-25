export type SceneInfo = {
  id: string;
  name: string;
  start: number;
  end: number;
};

export const TOTAL_DURATION_SEC = 238.92;

export const TIMELINE: SceneInfo[] = [
  { id: 'S01', name: 'Intro', start: 0.0, end: 18.55 },
  { id: 'S02', name: 'Verse 1', start: 18.55, end: 47.09 },
  { id: 'S03', name: 'Pre-chorus 1', start: 47.09, end: 62.94 },
  { id: 'S04', name: 'Chorus 1 + interlude', start: 62.94, end: 92.84 },
  { id: 'S05', name: 'Verse 2', start: 92.84, end: 120.99 },
  { id: 'S06', name: 'Pre-chorus 2', start: 120.99, end: 134.93 },
  { id: 'S07', name: 'Chorus 2 + interlude', start: 134.93, end: 164.21 },
  { id: 'S08', name: 'Bridge', start: 164.21, end: 182.57 },
  { id: 'S09', name: 'Final chorus + comedown', start: 182.57, end: 228.52 },
  { id: 'S10', name: 'Outro', start: 228.52, end: TOTAL_DURATION_SEC },
];
