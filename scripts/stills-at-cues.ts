import { execSync } from 'node:child_process';
import { TIMELINE } from '../src/data/timeline';
import { toFrame } from '../src/lib/time';

const sceneId = process.argv[2];
if (!sceneId) {
  console.error('Usage: tsx scripts/stills-at-cues.ts <sceneId> (e.g. S01)');
  process.exit(1);
}

const scene = TIMELINE.find((s) => s.id.toUpperCase() === sceneId.toUpperCase());
if (!scene) {
  console.error(`Scene ${sceneId} not found in timeline`);
  process.exit(1);
}

const beatsModule = require(`../src/scenes/${scene.id.toLowerCase()}.beats`);
const beatsObj = beatsModule[scene.id.toUpperCase()] || beatsModule.default;
const beats = beatsObj.beats || [];

const frames: { label: string; frame: number }[] = [];
const startFrame = toFrame(scene.start);
const endFrame = Math.max(startFrame + 1, toFrame(scene.end) - 1);

frames.push({ label: `${scene.id}-start`, frame: startFrame });

beats.forEach((b: { id: string; at: number }) => {
  const f = toFrame(b.at);
  frames.push({ label: `${scene.id}-${b.id}-at`, frame: f });
  frames.push({ label: `${scene.id}-${b.id}-at-plus-6`, frame: f + 6 });
});

frames.push({ label: `${scene.id}-end`, frame: endFrame });

console.log(`Rendering ${frames.length} stills for ${scene.id}...`);

for (const { label, frame } of frames) {
  const outPath = `out/stills/${label}-f${frame}.png`;
  console.log(`Rendering frame ${frame} -> ${outPath}`);
  execSync(`npx remotion still src/index.ts Video ${outPath} --frame=${frame}`, {
    stdio: 'inherit',
  });
}

console.log(`All stills rendered for ${scene.id}`);
