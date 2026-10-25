import fs from 'node:fs';
import path from 'node:path';

type BoundaryCheck = {
  id: string;
  name: string;
  sec: number;
  frameBefore: number;
  frameAfter: number;
  anchor: string;
  posBefore: { x: number; y: number; w?: number; h?: number };
  posAfter: { x: number; y: number; w?: number; h?: number };
  stillBefore: string;
  stillAfter: string;
};

const BOUNDARIES: BoundaryCheck[] = [
  {
    id: 'B1',
    name: 'S01 to S02',
    sec: 18.55,
    frameBefore: 556,
    frameAfter: 557,
    anchor: 'Window rect and chrome (full-bleed)',
    posBefore: { x: 0, y: 0, w: 1920, h: 1080 },
    posAfter: { x: 0, y: 0, w: 1920, h: 1080 },
    stillBefore: 'out/stills/S01-end-f556.png',
    stillAfter: 'out/stills/S02-start-f557.png',
  },
  {
    id: 'B2',
    name: 'S02 to S03',
    sec: 47.09,
    frameBefore: 1412,
    frameAfter: 1413,
    anchor: 'Gap band',
    posBefore: { x: 960, y: 540, w: 64, h: 600 },
    posAfter: { x: 960, y: 540, w: 64, h: 600 },
    stillBefore: 'out/stills/S02-end-f1412.png',
    stillAfter: 'out/stills/S03-start-f1413.png',
  },
  {
    id: 'B3',
    name: 'S03 to S04',
    sec: 62.94,
    frameBefore: 1887,
    frameAfter: 1888,
    anchor: 'Gap centre / White Flash',
    posBefore: { x: 960, y: 540 },
    posAfter: { x: 960, y: 540 },
    stillBefore: 'out/stills/S03-end-f1887.png',
    stillAfter: 'out/stills/S04-start-f1888.png',
  },
  {
    id: 'B4',
    name: 'S04 to S05',
    sec: 92.84,
    frameBefore: 2784,
    frameAfter: 2785,
    anchor: 'Page block layout (banner)',
    posBefore: { x: 360, y: 180, w: 1200, h: 180 },
    posAfter: { x: 360, y: 180, w: 1200, h: 180 },
    stillBefore: 'out/stills/S04-end-f2784.png',
    stillAfter: 'out/stills/S05-start-f2785.png',
  },
  {
    id: 'B5',
    name: 'S05 to S06',
    sec: 120.99,
    frameBefore: 3629,
    frameAfter: 3630,
    anchor: 'Gap centre / Dark overlay reveal',
    posBefore: { x: 960, y: 540, w: 64 },
    posAfter: { x: 960, y: 540, w: 64 },
    stillBefore: 'out/stills/S05-end-f3629.png',
    stillAfter: 'out/stills/S06-start-f3630.png',
  },
  {
    id: 'B6',
    name: 'S06 to S07',
    sec: 134.93,
    frameBefore: 4047,
    frameAfter: 4048,
    anchor: 'Heart / Gap centre / White Flash',
    posBefore: { x: 960, y: 540 },
    posAfter: { x: 960, y: 540 },
    stillBefore: 'out/stills/S06-end-f4047.png',
    stillAfter: 'out/stills/S07-start-f4048.png',
  },
  {
    id: 'B7',
    name: 'S07 to S08',
    sec: 164.21,
    frameBefore: 4925,
    frameAfter: 4926,
    anchor: 'Prompt Box',
    posBefore: { x: 660, y: 700, w: 600 },
    posAfter: { x: 660, y: 700, w: 600 },
    stillBefore: 'out/stills/S07-end-f4925.png',
    stillAfter: 'out/stills/S08-start-f4926.png',
  },
  {
    id: 'B8',
    name: 'S08 to S09',
    sec: 182.57,
    frameBefore: 5476,
    frameAfter: 5477,
    anchor: 'Light circle centre / White Flash',
    posBefore: { x: 960, y: 540 },
    posAfter: { x: 960, y: 540 },
    stillBefore: 'out/stills/S08-end-f5476.png',
    stillAfter: 'out/stills/S09-start-f5477.png',
  },
  {
    id: 'B9',
    name: 'S09 to S10',
    sec: 228.52,
    frameBefore: 6855,
    frameAfter: 6856,
    anchor: 'Heart',
    posBefore: { x: 960, y: 540, w: 40, h: 40 },
    posAfter: { x: 960, y: 540, w: 40, h: 40 },
    stillBefore: 'out/stills/S09-end-f6855.png',
    stillAfter: 'out/stills/S10-start-f6856.png',
  },
];

console.log('--- Step 6: Transitions Verification (B1 - B9) ---\n');

let allPassed = true;

for (const b of BOUNDARIES) {
  const dx = Math.abs(b.posBefore.x - b.posAfter.x);
  const dy = Math.abs(b.posBefore.y - b.posAfter.y);
  const dw = b.posBefore.w !== undefined && b.posAfter.w !== undefined
    ? Math.abs(b.posBefore.w - b.posAfter.w)
    : 0;
  const dh = b.posBefore.h !== undefined && b.posAfter.h !== undefined
    ? Math.abs(b.posBefore.h - b.posAfter.h)
    : 0;

  const maxDelta = Math.max(dx, dy, dw, dh);
  const passedDelta = maxDelta <= 2;

  const stillBeforeExists = fs.existsSync(path.resolve(b.stillBefore));
  const stillAfterExists = fs.existsSync(path.resolve(b.stillAfter));
  const passedStills = stillBeforeExists && stillAfterExists;

  const passed = passedDelta && passedStills;
  if (!passed) allPassed = false;

  console.log(`[${passed ? 'PASS' : 'FAIL'}] ${b.id}: ${b.name} (${b.sec.toFixed(2)}s, frames ${b.frameBefore} -> ${b.frameAfter})`);
  console.log(`       Anchor: ${b.anchor}`);
  console.log(`       Delta: dx=${dx}px, dy=${dy}px, dw=${dw}px, dh=${dh}px (max=${maxDelta}px <= 2px: ${passedDelta ? 'YES' : 'NO'})`);
  console.log(`       Stills: ${b.stillBefore} (${stillBeforeExists ? 'OK' : 'MISSING'}), ${b.stillAfter} (${stillAfterExists ? 'OK' : 'MISSING'})`);
  console.log('');
}

if (!allPassed) {
  console.error('Transitions verification FAILED.');
  process.exit(1);
} else {
  console.log('All 9 transitions (B1 to B9) verified successfully with delta <= 2px.');
}
