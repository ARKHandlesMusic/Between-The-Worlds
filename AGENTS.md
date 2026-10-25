# AGENTS.md

Project: "Between the Words (Hear It With Your Heart)" 2D music video.
Stack: Remotion 4 (React + TypeScript). Canvas 1920x1080, 30 fps. Length = length of the audio file.

Read this whole file before any action. Re-read the section for the step you are on before starting that step. Do not rely on memory of this file.

Precedence: the user's latest instruction, then this file (process and engineering), then docs/SCRIPT.md (what appears on screen and when). If two of them conflict, stop and ask.

---

## 0. Prime directives

1. Work in the order of Section 11, one step at a time. Do not start a step until every gate of the previous step passes.
2. Never guess. If something required is missing or ambiguous, ask (Section 15). Ask the shortest question that unblocks you, then continue.
3. Everything on screen comes from docs/SCRIPT.md. Do not add, remove or "improve" visual elements.
4. Everything moves because of the frame number. No wall-clock time, no randomness, no CSS animation (Section 4).
5. All timing comes from public/song.lrc through generated data. No hand-typed seconds inside components (Section 6).
6. Verify before you claim. A step is done only when its gates pass and you have the command output to show it.
7. Do not touch code that already works. Small diffs. If a working file blocks you, work around it or ask.
8. Plain, short, consistent tone. No emojis. No hype or marketing words. Minimal narration: report what changed, how it was verified, what is next, open questions.

---

## 1. Inputs

| File | Purpose | If missing |
|---|---|---|
| public/song.mp3 (or .wav) | Final Suno audio. Record the real file name in docs/PROGRESS.md and in src/lib/tokens.ts (`AUDIO_SRC`). | Stop and ask |
| public/song.lrc | Line-level lyric timestamps. A blank cue marks where the previous line ends. | Stop and ask |
| docs/SCRIPT.md | The scene script (10 scenes, timecodes, visuals). Source of truth for content and timing. | Stop and ask |

Never create placeholder audio, lyrics or script.

Preflight facts to verify in Step 0 and write into docs/PROGRESS.md. If any differ, ask before continuing:

- First LRC cue: 7.75 s, text `(Can you hear it?)`.
- Last LRC cue: 228.52 s, text `(You heard it.)`.
- SCRIPT.md has 10 scenes ("Scene 1" to "Scene 10").
- The final audio is longer than 228.52 s (it ends shortly after the last whisper). Record the exact duration.

---

## 2. Working agreement

2.1 Plan before you change. Before editing, write the plan in docs/PROGRESS.md under "Current step": files you will touch and why. Then edit.

2.2 Keep a running checklist in docs/PROGRESS.md (template in Section 16). Tick an item only after its gate passes. Log: step, what changed, how verified (command and result).

2.3 Ask before guessing. See Section 15 for the exact cases.

2.4 Stay in scope. Touch only the files of the current step. Do not refactor or restyle finished scenes.

2.5 Verify before claiming. Run the commands. Never write "fixed" or "done" without having run the relevant check in this session.

2.6 Understand, do not explore. Read only: this file, the relevant part of docs/SCRIPT.md, and the files you will edit. To read one scene section use `grep -n "^### Scene" docs/SCRIPT.md` then `sed -n 'START,ENDp' docs/SCRIPT.md`. To check a Remotion API, open its type definition or its official docs page. Do not browse node_modules or scan the repo.

2.7 Regressions. If something that worked now fails, read the previous version first (`git diff`, `git log -p -- <file>`), then fix the cause. Do not rewrite the file.

2.8 Keep README.md accurate: only commands you have run successfully.

2.9 Do not invent APIs. If you are not certain a Remotion function or prop exists, check its type definition. A wrong guess costs more than a lookup.

2.10 Git (if the repo is under git): one small commit per passed gate, message `step-N: <what>`.

---

## 3. Stack and setup

- Scaffold with `npx create-video@latest` (blank TypeScript template), or follow the existing setup if the repo already has one. Do not restructure an existing repo without asking.
- Pin `remotion` and every `@remotion/*` package to the same exact version (no `^`, no `~`). Mismatched versions are a common source of errors.
- Packages: `remotion`, `@remotion/cli`, `@remotion/media-utils`, `@remotion/google-fonts`, `@remotion/paths`, `@remotion/layout-utils`, `@remotion/noise` (only if needed), `vitest`, `tsx`, `typescript`, `eslint`. Ask before adding anything else.
- TypeScript: `strict: true`. No `any`. No unused variables.
- Fonts: Inter (400, 600, 700) and JetBrains Mono (400) through `@remotion/google-fonts`, loaded once at module level in `src/lib/fonts.ts`. If font loading fails (for example no network), stop and ask. Do not substitute fonts.
- Audio: use whichever of `Audio` / `Html5Audio` the installed Remotion version documents as current (check the version's docs or types), with `src={staticFile(AUDIO_SRC)}`. Mount it once, in `src/Video.tsx`.
- `package.json` scripts:
  - `dev`: `remotion studio`
  - `cues`: `tsx scripts/build-cues.ts`
  - `typecheck`: `tsc --noEmit`
  - `lint`: `eslint src --max-warnings 0`
  - `test`: `vitest run`
  - `banned`: `bash scripts/check-banned.sh`
  - `check`: runs `typecheck`, `lint`, `test`, `banned` in order, stops on first failure
  - `still`: `remotion still src/index.ts Video`
  - `render`: `remotion render src/index.ts Video out/between-the-words.mp4 --codec=h264 --crf=16`

---

## 4. Hard bans (determinism)

Remotion renders each frame separately, so anything that depends on real time or randomness will look different in the final render than in the preview.

Banned in `src/`:

- `setTimeout`, `setInterval`, `requestAnimationFrame`, `Date.now`, `new Date(`, `Math.random`
- CSS `transition`, CSS `animation`, `@keyframes`
- `useState` / `useEffect` for anything visual (a line carrying the comment `// allowed: <reason>` is exempt)
- `fetch(`, `localStorage`, any network call
- `<img`, `<Img`, `<Video`, `<OffthreadVideo`, any raster image, any video clip
- Animation libraries: framer-motion, gsap, react-spring, lottie, anime.js
- Any font other than Inter and JetBrains Mono
- People, faces, hands, photos, 3D, complex objects. Allowed primitives only: rectangles, rounded rectangles, circles, lines, arcs, SVG paths, text, the Heart (Section 7).

Required:

- Every animated value is a pure function of the frame (`useCurrentFrame` / `useClock`).
- Every `interpolate` has `extrapolateLeft: 'clamp'` and `extrapolateRight: 'clamp'`. Use `ramp()` (Section 6.4) so you cannot forget.
- Randomness only through `random('seed-string')` from `remotion`.

`scripts/check-banned.sh`:

```sh
#!/usr/bin/env bash
set -e
PATTERN='setTimeout|setInterval|requestAnimationFrame|Math\.random|Date\.now|new Date\(|transition:|animation:|@keyframes|useState|useEffect|localStorage|fetch\(|<img|<Img|<Video|<OffthreadVideo|framer-motion|gsap|react-spring|lottie'
if grep -rnE "$PATTERN" src --include=*.ts --include=*.tsx --include=*.css | grep -v 'allowed:'; then
  echo "Banned API found"; exit 1
fi
echo "banned check passed"
```

---

## 5. Repo layout

```
AGENTS.md
README.md
docs/        SCRIPT.md, PROGRESS.md
public/      song.mp3, song.lrc
scripts/     build-cues.ts, check-banned.sh, stills-at-cues.sh
tests/       time.test.ts, lrc.test.ts, lyrics.test.ts
src/
  index.ts              registerRoot
  Root.tsx              Compositions: "Video", "Gallery", "LyricTest"
  Video.tsx             audio + 10 SceneRoot + transition overlays
  data/                 cues.generated.ts, timeline.ts, lyrics.ts, wordOverrides.ts
  lib/                  time.ts, clock.tsx, ramp.ts, tokens.ts, anchors.ts, fonts.ts,
                        audio.ts, camera.tsx, overlays.tsx
  primitives/           Window, PromptBox, Spark, Cursor, Gap, ListenerDots, Heart,
                        Whisper, UndergroundDot, Ruler, Rings, CheckMark, Brackets, Hall
  lyrics/               LyricLayer.tsx, variants/*.tsx
  scenes/               s01.tsx ... s10.tsx and s01.beats.ts ... s10.beats.ts
```

One scene per file. One component per file. Keep files under about 200 lines; split when longer.

---

## 6. Time model and sync

### 6.1 Rules

- The LRC is the single source of timing. `scripts/build-cues.ts` turns it into `src/data/cues.generated.ts`. Never edit the generated file by hand.
- Scene boundaries live in `src/data/timeline.ts` (table in 6.5). Beat times inside a scene live in that scene's `sNN.beats.ts`, copied one-to-one from SCRIPT.md (timestamps verbatim).
- Components receive times from those files. No bare seconds or frame numbers inside component bodies.
- Express all animation in absolute seconds (`useClock().sec`). This removes off-by-scene errors.

### 6.2 `src/lib/time.ts`

```ts
export const FPS = 30;
export const toFrame = (sec: number): number => Math.round(sec * FPS);
export const toSec = (frame: number): number => frame / FPS;
```

### 6.3 `src/lib/clock.tsx`

```tsx
import {createContext, useContext} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';

const SceneStart = createContext<number>(0); // absolute start frame of the enclosing Sequence
export const SceneStartProvider = SceneStart.Provider;

export function useClock() {
  const local = useCurrentFrame();
  const start = useContext(SceneStart);
  const {fps} = useVideoConfig();
  const abs = start + local;
  return {abs, sec: abs / fps, local};
}
```

`SceneRoot` (in `src/lib/clock.tsx` or its own file):

```tsx
import {Sequence} from 'remotion';
import {FPS, toFrame} from './time';

export const SceneRoot: React.FC<{start: number; end: number; children: React.ReactNode}> = ({start, end, children}) => {
  const from = toFrame(start);
  const duration = Math.max(1, toFrame(end) - from);
  return (
    <Sequence from={from} durationInFrames={duration} premountFor={FPS}>
      <SceneStartProvider value={from}>{children}</SceneStartProvider>
    </Sequence>
  );
};
```

### 6.4 `src/lib/ramp.ts`

```ts
import {Easing, interpolate} from 'remotion';

type Ease = (t: number) => number;

/** 0 before `start`, 1 after `start + dur`, eased in between. Times in absolute seconds. */
export const ramp = (sec: number, start: number, dur: number, easing: Ease = Easing.out(Easing.cubic)): number =>
  interpolate(sec, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });
```

Use `ramp` for every entrance, exit, fill and draw. Chain two ramps for in-then-out.

### 6.5 Scene table (`src/data/timeline.ts`)

Boundaries sit on LRC cue times. Seconds:

| id | Name | start | end |
|---|---|---|---|
| S01 | Intro | 0.00 | 18.55 |
| S02 | Verse 1 | 18.55 | 47.09 |
| S03 | Pre-chorus 1 | 47.09 | 62.94 |
| S04 | Chorus 1 + interlude | 62.94 | 92.84 |
| S05 | Verse 2 | 92.84 | 120.99 |
| S06 | Pre-chorus 2 | 120.99 | 134.93 |
| S07 | Chorus 2 + interlude | 134.93 | 164.21 |
| S08 | Bridge | 164.21 | 182.57 |
| S09 | Final chorus + comedown | 182.57 | 228.52 |
| S10 | Outro | 228.52 | end of audio |

S10 `end` = `toSec(durationInFrames)` of the composition.

Total duration is set in `Root.tsx` with `calculateMetadata`, reading the audio length with `getAudioDurationInSeconds(staticFile(AUDIO_SRC))` from `@remotion/media-utils`, and returning `durationInFrames: Math.ceil(seconds * FPS)`.

### 6.6 LRC parsing (`scripts/build-cues.ts` uses this; put the function in `src/lib/lrc.ts` so tests can import it)

```ts
export type Cue = {sec: number; text: string};

const CUE = /^\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\](.*)$/;

export function parseLrc(src: string): Cue[] {
  return src.split(/\r?\n/).flatMap((raw) => {
    const m = CUE.exec(raw.trim());
    if (!m) return [];
    const frac = m[3] ? Number(`0.${m[3]}`) : 0;
    return [{sec: Number(m[1]) * 60 + Number(m[2]) + frac, text: m[4].trim()}];
  });
}
```

Lines such as `[ar:...]` do not match (letters) and are ignored. Blank text = end-of-line marker, not a lyric.

### 6.7 Audio-reactive motion (`src/lib/audio.ts`)

Do not invent a beat grid from a BPM guess. Where SCRIPT.md asks for a pulse on the kick, or a flash on a clap, read the audio itself.

```ts
import {useAudioData, visualizeAudio} from '@remotion/media-utils';
import {staticFile, useVideoConfig} from 'remotion';
import {useClock} from './clock';
import {AUDIO_SRC, BASS_GAIN, HIGH_GAIN} from './tokens';

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export function useBands() {
  const {abs} = useClock();
  const {fps} = useVideoConfig();
  const audioData = useAudioData(staticFile(AUDIO_SRC));
  if (!audioData) return {bass: 0, high: 0};
  const bins = visualizeAudio({fps, frame: abs, audioData, numberOfSamples: 64});
  const avg = (a: number, b: number) => bins.slice(a, b).reduce((s, v) => s + v, 0) / (b - a);
  return {bass: clamp01(avg(0, 4) * BASS_GAIN), high: clamp01(avg(24, 48) * HIGH_GAIN)};
}
```

- Calibrate `BASS_GAIN` and `HIGH_GAIN` once: log `avg(0, 4)` and `avg(24, 48)` for about 20 frames inside a chorus (62.94 s to 70 s), then set the gains so the loudest kick is close to 1. Store the numbers in `tokens.ts` with a comment saying how they were measured.
- Kick pulse: `scale = 1 + 0.04 * bass`. Maximum scale 1.04.
- Clap flash: dots brighten by `high`, never faster than the frame rate allows (no extra smoothing tricks).
- For instrumental stretches with no lyric cue (intro 0 to 18.55 s, interludes, comedown), place events from audio onsets: an event fires on the frame where a band crosses a threshold upward (`value(f) > t && value(f-1) <= t`), with a minimum spacing of 0.25 s. Do not invent times.

### 6.8 Sync verification

- Unit tests (Section 10.8) prove the data. Stills prove the picture.
- `scripts/stills-at-cues.sh <sceneId>` renders stills at: scene start, every beat frame, every beat frame + 6, scene end - 1. Inspect them.
- A lyric's first word must be visible on the frame `toFrame(cue.sec)` and not on the frame before.

---

## 7. Design system

All values live in `src/lib/tokens.ts`. Components import from it. No hex codes or pixel constants inside components.

```ts
export const COLORS = {
  navy: '#0F1B2D', surface: '#1B2A41', unlit: '#3A4A63',
  text: '#F3EFE6', orange: '#E07A4F', teal: '#4FB3A9',
} as const;

// Final chorus palette (key change at 182.57 s). Warm white for lit dots is #FFF4E0.
export const COLORS_FINAL = {...COLORS, navy: '#1A2350', orange: '#F29A52', teal: '#FFF4E0'} as const;
```

- Palette in use: background navy, window surface, unlit grey-blue, text off-white, orange (Claude, the Spark), teal (the listener, lit dots). In S09 use `COLORS_FINAL`. S10 returns to `COLORS` (the comedown in S09 dims back to navy per SCRIPT.md).
- Flat fills only. One soft glow is allowed: an SVG `radialGradient` circle. No blur filters on large areas.
- Corner radius 16 px for windows and boxes. Stroke 2 px for outlines and 3 px for the pointer line.
- Type: Inter for all text, JetBrains Mono for typed prompts.
- Safe margin: 96 px from every edge for anything that carries meaning. Intentional exceptions are listed in SCRIPT.md.

Primitives (`src/primitives/`). Build each once, show all of them in the `Gallery` composition, and reuse everywhere. Props are plain data; animation state comes in as numbers from `ramp`.

| Primitive | Recipe | Key props |
|---|---|---|
| Window | Rounded rect (surface), three 10 px circles at top left | x, y, w, h, draw (0 to 1 outline then fill) |
| PromptBox | Rounded rect 72 px tall, mono 28 px text, caret 2x34 px blinking 15 frames on, 15 off | text, typedChars, glow (0 to 1) |
| Spark | Orange circle r=24; eight rays of length 28 starting at r+8 | x, y, burst (0 to 1), ring (0 to 1 for outgoing rings) |
| Cursor | Arrow path `M0 0 L0 24 L6 18 L10 28 L14 26 L10 16 L18 16 Z`, off-white fill, orange stroke | x, y, press (0 to 1) |
| Gap | Vertical band, orange at 25% opacity, 2 px edges, soft glow | x, y, w, h, gapWidth, warm (0 to 1) |
| ListenerDots | Grid of 14 px circles, unlit grey-blue, lit teal (or warm white in S09) | rows, cols, litAt(row, col) -> 0..1, jumpAt(row, col) -> px |
| Heart | Square rotated 45 degrees with half-diagonal d (corner pointing down), plus two circles of radius d/sqrt(2) centred at (-d/2, -d/2) and (d/2, -d/2); single orange fill | x, y, d, pulse |
| Whisper | Inter 14 px, off-white, 30% opacity, bottom left (x 48, y 1032) | text, reveal (0 to 1 by word) |
| UndergroundDot | 6 px orange circle at bottom centre (960, 1040), 20% opacity; pulses once per bar using `bass` | size, opacity |
| Ruler | Horizontal line with tick marks | progress, jitter |
| Rings | Concentric circle outlines expanding from a point | x, y, phase |
| CheckMark | Two-segment path drawn with `evolvePath` | x, y, progress |
| Brackets | L-shaped corner brackets (the "hands") | x, y, rotation, spread |
| Hall | Slide rectangle with title bar plus the 8 x 24 ListenerDots grid | slideLift, title |

Heart, Spark and UndergroundDot also carry the "hidden voice" idea. Do not drop them for time.

When SCRIPT.md describes an element not in this table, build it from the allowed primitives, add it to the table in README.md, and keep it in `src/primitives/`.

---

## 8. Motion standards

These rules are what makes the result look professional. Apply them in Pass 2 of every scene.

Motion language:

- Entrances ease out (`Easing.out(Easing.cubic)`). Exits ease in (`Easing.in(Easing.cubic)`). Camera moves ease in-out (`Easing.inOut(Easing.quad)`). Linear only for rings, progress fills and very slow camera drift.
- Durations in seconds (convert with `toFrame`): micro 0.15 to 0.25, standard 0.4 to 0.6, large 0.8 to 1.2. A camera move lasts as long as the lyric line or section it belongs to.
- Springs: default `spring({frame, fps, config: {damping: 200}})` (no overshoot). Final chorus only (S09): `config: {damping: 12, stiffness: 120}` for bounce. Compute the spring on `frame - delayFrames`.
- Anticipation: before a large move, a 3 to 4 frame counter-move of 2 to 4% scale.
- Overshoot: at most 4% outside S09.
- Stagger: 2 to 3 frames between sibling elements.
- Holds: leave at least 6 frames of stillness before a key beat so it lands.
- Follow-through: rings and trails trail the main motion by 4 to 8 frames.
- Pulses: only where SCRIPT.md asks. Maximum scale 1.04, driven by `useBands().bass`.

Craft details:

- Typing: characters shown = `Math.floor(charsPerSecond * (sec - startSec))`, clamped to the text length. Caret blink is `Math.floor(frame / 15) % 2`, computed from the frame.
- Drawing strokes: `evolvePath(progress, path)` from `@remotion/paths`. At progress 0 set opacity to 0 (a zero-length dash can show a dot).
- Camera (`src/lib/camera.tsx`): a wrapper that applies `scale` and `translate` with an explicit `transformOrigin`. Push-ins are scale only (for example 1.00 to 1.08). Never rotate the camera.
- Crisp lines: when static, round x and y of 1 to 2 px strokes and of text to integers. While moving, sub-pixel values are fine. The deliberate one-pixel offset in Scene 3 and Scene 6 must be exactly 1 px.
- Layer order, back to front: background, scene content, Underground Dot, lyric layer, Whisper, transition overlays.
- Use `random('seed')` and `@remotion/noise` for any organic wobble (for example the Spark's search drift in Scene 5), driven by seconds.

---

## 9. Transitions

Do not cross-fade overlapping scenes. Every boundary is a match cut or a root-level overlay. A match cut means the last frame of scene N and the first frame of scene N+1 show the same anchor element at the same position and size.

- Shared anchor positions live in `src/lib/anchors.ts` and are imported by both neighbouring scenes. This guarantees the match.
- Overlays (`src/lib/overlays.tsx`): `Flash` (white), `FadeToBlack`, `DarkOverlay`. Each takes absolute-second times and returns a full-frame element with opacity from `ramp`. Flash starts at full opacity on its start frame (hard onset) and fades out.

| Boundary | Time (s) | Technique | Anchor |
|---|---|---|---|
| S01 to S02 | 18.55 | Scale-through match cut. In the last 0.5 s of S01 the Window outline grows to full-bleed. S02 starts on the full-bleed Window. | Window rect and chrome |
| S02 to S03 | 47.09 | Match cut. S02 ends with the camera pushed into one glowing space between words. S03 starts with the Gap band at the same position and width. | Gap band |
| S03 to S04 | 62.94 | Riser then drop. In the last 0.4 s everything scales toward the Gap centre (ease in). White Flash on the drop frame, 0.05 s hold, 0.25 s fade. S04 is already drawn under the flash. | Gap centre |
| S04 to S05 | 92.84 | Continuity. The bare browser page keeps its background; S05's wireframe blocks grow out of the same block positions. | Page block layout |
| S05 to S06 | 120.99 | The dark overlay on the site fades out over 0.5 s to reveal the navy of S06. | Block positions |
| S06 to S07 | 134.93 | Same riser and Flash as S03 to S04, so the song's two drops feel related. | Heart / Gap centre |
| S07 to S08 | 164.21 | The row of windows closes one by one until only the Prompt Box remains. S08 starts on that Prompt Box. | Prompt Box |
| S08 to S09 | 182.57 | The bridge's light circle expands to fill the frame (this is the flash), 0.35 s fade, and the palette shifts from `COLORS` to `COLORS_FINAL` on the first frame of S09. | Light circle centre |
| S09 to S10 | 228.52 | Continuity. S09's comedown ends with the Heart alone; S10 starts on the same Heart at the same size, then shrinks. | Heart |

Inside scenes, cuts between windows (Scene 7) land on lyric cue frames, not on an invented grid.

Verification: render stills at frames N-1 and N for each boundary. The anchor's position difference must be 2 px or less. Record the result in docs/PROGRESS.md.

---

## 10. Lyrics system

Goal: every sung line is on screen, timed to its cue, with a treatment that fits its section. The Whisper lines are the exception (10.4).

### 10.1 Data

`src/data/lyrics.ts` is derived from `CUES`:

```ts
export type LyricLine = {
  id: string; text: string; startSec: number; endSec: number; kind: 'sung' | 'whisper';
};

export function toLyricLines(cues: Cue[], endOfAudioSec: number): LyricLine[] {
  const out: LyricLine[] = [];
  cues.forEach((c, i) => {
    if (c.text === '') return;
    const next = cues[i + 1];
    out.push({
      id: `L${String(out.length + 1).padStart(2, '0')}`,
      text: c.text,
      startSec: c.sec,
      endSec: next ? next.sec : endOfAudioSec,
      kind: /^\(.*\)$/.test(c.text) ? 'whisper' : 'sung',
    });
  });
  return out;
}
```

### 10.2 Word timing

The LRC is line-level. Word times are an estimate, and must never be described as forced alignment.

```ts
export type WordTiming = {text: string; startSec: number; endSec: number};

export function wordTimings(line: LyricLine): WordTiming[] {
  const words = line.text.split(/\s+/).filter(Boolean);
  const len = line.endSec - line.startSec;
  // Long held lines: spread the words over the first 3 s, then hold.
  const usable = Math.min(Math.max(0.3, Math.min(len * 0.85, len - 0.15)), 3.0);
  const weights = words.map((w) => Math.max(2, w.replace(/[^\p{L}\p{N}]/gu, '').length));
  const total = weights.reduce((a, b) => a + b, 0);
  let t = line.startSec;
  return words.map((w, i) => {
    const dur = (usable * weights[i]) / total;
    const start = t;
    t += dur;
    return {text: w, startSec: start, endSec: t};
  });
}
```

- Repeated groups ("heart, heart, heart") get equal thirds. Put such lines in `src/data/wordOverrides.ts`, keyed by `${text}@${startSec}`, as hand-set word times.
- Tell the user once, in docs/PROGRESS.md, that word-level timing is estimated and that a word-level (enhanced) LRC would make it exact. Ask whether they want to supply one. Do not block on the answer.

### 10.3 Placement and typography

- Lyric band: x 160 to 1760, y 760 to 960 (inside the safe margin). Maximum 2 lines. Left, centre or right alignment per variant; default centre.
- Inter 600. Sizes: 64 px verses, 56 px pre-choruses, 84 px choruses and the final chorus. Line height 1.15. Letter spacing -0.01em. Colour off-white; the active word takes the accent colour.
- Contrast of lyric text against its local background must be at least 4.5:1. If a scene background makes that impossible, place the text on a navy plate at 35% opacity with 16 px radius.
- Use typographic apostrophes (’) and quotes (“ ”). Never hyphenate. For lines longer than 28 characters, set the break by hand in a `LINE_BREAKS` map so no line ends on a lone word.
- Lyric text is separate from scene objects. Words that SCRIPT.md puts inside the scene (for example "everything you dream", "slop", "art") are scene content, not lyric layer.

### 10.4 Variants (`src/lyrics/variants/`)

Every variant has the same props: `{line: LyricLine; words: WordTiming[]}`.

| Section | Variant | Behaviour |
|---|---|---|
| Lines in parentheses | Whisper | Render only with the Whisper primitive (bottom left, 14 px, 30% opacity), word by word at word times. No lyric band. |
| Verse 1, Verse 2 | `wordRise` | Each word fades in over 6 frames while rising 4 px, at its word time. Line exits with an 8 frame fade at `endSec`. |
| Pre-chorus | `stagger` | Words rise 12 px into place with a 3 frame stagger. On the last line, "making" scales 1.00 to 1.06. |
| Chorus 1, Chorus 2 | `pulse` | Whole line 84 px. Each "heart" is orange and scales to 1.15 at its word time (no spring bounce). "quiet underground" sinks 8 px and dims to 70% as it is sung. |
| Bridge | `slowFade` | Line by line, 0.8 s fades, no motion, half-speed feel. |
| Final chorus | `karaoke` | Full line visible at 30% opacity. Each word fills to 100% in the accent colour at its word time, with the S09 bounce spring. In Part B (SCRIPT.md, 3:28.3) show "Hear it with your heart" centred, one word highlighted per beat as SCRIPT.md describes. |

### 10.5 Line lifecycle

- First word starts on the cue frame exactly.
- A line leaves at `endSec + 0.25 s`, or earlier if the next line starts.
- At most 2 lines are visible at once. The outgoing line fades while the incoming one appears.
- Minimum time on screen 0.6 s.

### 10.6 Component

`LyricLayer` reads `LYRICS`, picks the variant by the current scene (from `timeline.ts`), and renders the lines whose window includes the current second. It lives in `Video.tsx` above the scenes and below the transition overlays.

### 10.7 Test composition

`LyricTest` shows every variant on a plain navy background with a sample line, so you can check type, contrast and motion without running a scene.

### 10.8 Tests (`tests/`)

- `parseLrc`: first cue 7.75 `(Can you hear it?)`, last cue 228.52 `(You heard it.)`, times strictly increasing.
- `toLyricLines`: count equals the number of non-blank cues; every line has `endSec > startSec`; whisper lines are exactly those in parentheses.
- `wordTimings`: at least one word; times increasing; all inside `[startSec, endSec]`.
- `toFrame` / `toSec` round trip within half a frame.

---

## 11. Order of work

Each step ends with gates. Do not skip a gate. Log every gate result in docs/PROGRESS.md.

### Step 0. Preflight
- Check inputs (Section 1). Verify the preflight facts. Record audio file name and duration.
- Gate: all facts match, or the user has answered.

### Step 1. Scaffold
- Create or confirm the project (Section 3), install pinned packages, add scripts, add `scripts/check-banned.sh`, create folders from Section 5.
- Gate: `npm run dev` starts, `npx remotion compositions src/index.ts` lists `Video`, `npm run check` passes on the empty project.

### Step 2. Timeline and lyrics data
- Write `time.ts`, `lrc.ts`, `build-cues.ts`, `timeline.ts`, `lyrics.ts`, `wordOverrides.ts`. Run `npm run cues`.
- Write the tests in 10.8.
- Gate: `npm run check` passes, cue counts printed and recorded.

### Step 3. Tokens and primitives
- Write `tokens.ts`, `anchors.ts`, `fonts.ts`, `camera.tsx`, `overlays.tsx`, `audio.ts` and calibrate the gains (6.7). Build every primitive. Build the `Gallery` composition showing all primitives in a grid.
- Gate: a still of `Gallery` shows every primitive correctly drawn, in the right colours, with no clipping. `npm run check` passes.

### Step 4. Lyric system
- Build `LyricLayer` and all variants. Build `LyricTest`.
- Gate: stills of `LyricTest` for each variant at its start, middle and end frames. Contrast rule satisfied. `npm run check` passes.

### Step 5. Scenes, in order S01 to S10
Per-scene procedure:

a. Read only that scene's section of SCRIPT.md (use `grep -n` and `sed -n`).
b. Write `sNN.beats.ts`: one entry per SCRIPT.md bullet, with the timestamp verbatim, an id and a short description. Example:
   ```ts
   export const S02 = {
     start: 18.55, end: 47.09,
     beats: [
       {id: 'b1', at: 18.55, desc: 'Prompt Box glows; text types out and stops'},
       {id: 'b2', at: 21.16, desc: 'Picture frame and padlock draw halfway'},
     ],
   } as const;
   ```
c. In docs/PROGRESS.md, list each beat with the component that realises it.
d. Implement `sNN.tsx` using primitives only. Each beat is one `ramp` or one small state function. No magic numbers outside the beats file and `tokens.ts`.
e. Pass 1 (correctness): render stills at scene start, each beat frame, each beat frame + 6, and scene end - 1. Every beat must be visible within 1 frame of its time.
f. Pass 2 (polish): apply Section 8 to every beat.
g. Render a 6 to 10 second preview of the hardest stretch: `npx remotion render src/index.ts Video out/previews/sNN.mp4 --frames=A-B`. Check it.
h. Gate for the scene: `npm run check` passes; all beats on time; no element outside SCRIPT.md; no clipping or overlaps; lyrics legible; anchors match neighbours (Section 9).
i. Tick the checklist. Commit.

Scene-specific reminders:
- S01, S04 interlude, S07 interlude, S09 comedown, S10 contain instrumental stretches. Use audio-derived events (6.7), not an invented grid.
- S03 and S06 share one layout; build it once with a `resolved` flag. S06 has no "Are we precise?" line: the ruler is already on screen.
- S08 runs at half-speed motion with no kick pulse.
- S09 uses `COLORS_FINAL` and the bounce spring. Its last sung line is held for about 11 s; use it as SCRIPT.md Part B describes.
- The lyric in the LRC is "Is where the making lies!". Use it exactly.

### Step 6. Transitions
- Implement every boundary in Section 9 and verify each with still pairs at N-1 and N.
- Gate: all 9 boundaries verified and recorded.

### Step 7. Full QA (Section 13)
- Gate: every item in the checklist passes.

### Step 8. Render and README
- `npm run render`. Verify the output (Section 12). Update README.md.
- Gate: output file verified; README commands all tested.

---

## 12. Commands

```
npm run check
npx remotion compositions src/index.ts
npx remotion still src/index.ts Video out/stills/s02-f600.png --frame=600
npx remotion render src/index.ts Video out/previews/s02.mp4 --frames=557-1410
npm run render
npx remotion ffprobe out/between-the-words.mp4
```

- Determinism check: render the same still twice and compare `shasum`. They must match.
- Audio check: the final file has an audio stream and its duration is within one frame (0.034 s) of the audio file.
- Frame numbers: `frame = toFrame(seconds)`. Print them with a one-line `tsx` script rather than computing by hand.
- If rendering is slow, lower `--concurrency` before changing code. Do not remove effects to save time without asking.

---

## 13. Final QA checklist (Step 7)

- [ ] `npm run check` passes (typecheck, lint, tests, banned).
- [ ] Every sung line's first word appears on its cue frame (spot-check at least 12 lines across all sections, including the first and last).
- [ ] All 9 match cuts verified with still pairs (anchor difference 2 px or less).
- [ ] Contrast of every lyric at least 4.5:1.
- [ ] No text or meaningful element within the 96 px margin unless SCRIPT.md says so.
- [ ] Only allowed primitives and only palette colours from `tokens.ts`.
- [ ] Every entrance eases out, every exit eases in; no linear drift except rings, fills and slow camera pushes.
- [ ] Pulses never exceed scale 1.04. No overshoot above 4% outside S09.
- [ ] The Underground Dot appears in every scene. The Whisper appears on every whispered line.
- [ ] No console errors or warnings during render.
- [ ] Same frame rendered twice is identical.
- [ ] Final audio is present and in sync (compare a stills pair at a chorus start against the cue time).

---

## 14. Common failures and fixes

| Symptom | Cause | Fix |
|---|---|---|
| Elements jump or never reach their final value | Missing clamp on `interpolate` | Use `ramp()` everywhere |
| Flash of missing content at the start of a scene | No premount, or fonts not loaded | `premountFor={FPS}` in `SceneRoot`; call `loadFont()` at module level |
| Studio looks right, render looks wrong | CSS transition, `Date`, or random in use | Run `npm run banned`; remove |
| Scene timing off by the scene's start time | Local frame used with absolute seconds | Use `useClock().sec` only |
| Lyrics early or late | Used the wrong cue, or ignored blank cues | Re-read 10.1; run the lyric tests |
| `Cannot find module '@remotion/...'` or odd runtime errors | Package versions differ | Pin all to one exact version |
| Text shimmers | Sub-pixel positions on static text | Round static text positions to integers |
| Stroke shows a dot before it draws | `evolvePath` at progress 0 | Set opacity 0 at progress 0 |
| Spring never settles | Spring used where a fixed duration is needed | Use `ramp` with a duration |
| Render very slow | Large blur or SVG filter over the frame | Use radial gradients for glow; ask before removing effects |
| Pulse looks random | Gains uncalibrated or too much smoothing | Recalibrate (6.7); keep max scale 1.04 |
| Invented prop or function | Guessed API | Check the type definition (2.9) |

---

## 15. Stop and ask

Stop and ask (one short question, with your best proposal if you have one) when:

- Any input in Section 1 is missing, or a preflight fact does not match.
- A SCRIPT.md bullet is unclear, or contradicts the LRC or this file.
- SCRIPT.md needs something outside the allowed primitives (Section 4).
- You want to add a dependency not listed in Section 3.
- Fonts or audio fail to load.
- The credit line on the title card is needed (SCRIPT.md leaves it for the user).
- A gate fails twice after two different fixes.
- Anything would require changing a scene that is already ticked as done.

Do not ask about things this file already decides.

---

## 16. docs/PROGRESS.md template

```md
# Progress

## Inputs
- Audio file: <name>, duration <seconds>
- LRC: first cue <time> / last cue <time> / cue count <n> / lyric lines <n>

## Checklist
- [ ] Step 0 Preflight
- [ ] Step 1 Scaffold
- [ ] Step 2 Timeline and lyrics data
- [ ] Step 3 Tokens and primitives
- [ ] Step 4 Lyric system
- [ ] Step 5 Scenes: S01 S02 S03 S04 S05 S06 S07 S08 S09 S10 (tick each)
- [ ] Step 6 Transitions: B1 B2 B3 B4 B5 B6 B7 B8 B9 (tick each)
- [ ] Step 7 Full QA
- [ ] Step 8 Render and README

## Current step
<plan: files to touch and why>

## Log
- <date> | <step> | <what changed> | <command and result>

## Open questions
- <question> (status)

## Notes
- Word-level lyric timing is estimated from line cues. A word-level LRC would make it exact.
```

---

## 17. Deliverables

- `out/between-the-words.mp4` (H.264, 1920x1080, 30 fps, audio in sync).
- Working project with `npm run dev`, `npm run check` and `npm run render`.
- `README.md` listing only commands that were run successfully, the primitives table, and how to rebuild cues from a new LRC.
- `docs/PROGRESS.md` fully ticked, with gate results.
