export type Cue = { sec: number; text: string };

const CUE = /^\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\](.*)$/;

export function parseLrc(src: string): Cue[] {
  return src.split(/\r?\n/).flatMap((raw) => {
    const m = CUE.exec(raw.trim());
    if (!m) return [];
    const frac = m[3] ? Number(`0.${m[3]}`) : 0;
    return [{ sec: Number(m[1]) * 60 + Number(m[2]) + frac, text: m[4].trim() }];
  });
}
