export const ANCHORS = {
  // S01 to S02: Window
  window: {
    x: 96,
    y: 96,
    w: 1728,
    h: 888,
  },
  // S02 to S03: Gap
  gap: {
    x: 960,
    y: 540,
    width: 64,
    height: 600,
  },
  // S03 to S04 & S06 to S07: Center point for riser / flash
  center: {
    x: 960,
    y: 540,
  },
  // S04 to S05: Page layout blocks
  pageBlocks: {
    banner: { x: 360, y: 180, w: 1200, h: 180 },
    cards: [
      { x: 360, y: 400, w: 370, h: 260 },
      { x: 775, y: 400, w: 370, h: 260 },
      { x: 1190, y: 400, w: 370, h: 260 },
    ],
    paragraph: { x: 360, y: 700, w: 1200, h: 160 },
  },
  // S07 to S08: Prompt Box
  promptBox: {
    x: 560,
    y: 504,
    w: 800,
    h: 72,
  },
  // S08 to S09: Light circle
  lightCircle: {
    x: 960,
    y: 540,
  },
  // S09 to S10: Heart
  heart: {
    x: 960,
    y: 540,
    d: 64,
  },
} as const;
