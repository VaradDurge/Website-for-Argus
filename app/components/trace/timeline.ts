import type { StationId } from "./geometry";

/* One loop of the hero trace, in seconds. Every visual is a pure function of
   `t`, the same way the launch film is authored, so the loop is exact. */
export const T = {
  run: {
    ingest: 0.7,
    plan: 1.15,
    fetch: 1.6,
    a: 2.05, // finish order a → c → b, as in the real run
    c: 2.15,
    b: 2.35,
    merge: 2.85,
    synth: 3.25,
  },
  join: 0.3, // a summary token's trip to merge
  skip: 3.55,
  gazeOn: 4.35,
  walk: [4.95, 6.05] as const,
  lock: 6.05,
  finding: 6.4,
  gate: 7.3,
  out: [11.0, 11.6] as const,
  loop: 12.4,
  /** The frame shown when motion is reduced: everything resolved. */
  still: 9,
} as const;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

const cubicInOut = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const quadInOut = (x: number) =>
  x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
const expoOut = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));

export const ease = { cam: cubicInOut, out: expoOut } as const;

/** 0→1 between seconds a and b, eased. */
export const ramp = (t: number, a: number, b: number, fn = expoOut) =>
  fn(clamp01((t - a) / (b - a)));

/** Token / edge travel between two times. */
export const travel = (t: number, a: number, b: number) =>
  quadInOut(clamp01((t - a) / (b - a)));

/** Damped spring 0→1 with a small overshoot, starting at `a`. */
export const settle = (t: number, a: number, dur = 0.55) => {
  const x = clamp01((t - a) / dur);
  if (x <= 0) return 0;
  return 1 - Math.exp(-6.5 * x) * Math.cos(7.2 * x);
};

export type StationState = "pending" | "done" | "silent" | "crash" | "skip";

const R = T.run;
const TICK: Partial<Record<StationId, number>> = {
  ingest: R.ingest,
  plan: R.plan,
  fetch: R.fetch,
  a: R.a,
  b: R.b,
  c: R.c,
  merge: R.merge,
};

export function stationState(id: StationId, t: number): StationState {
  if (t >= T.out[0]) return "pending";
  if (id === "synth") return t >= R.synth ? "crash" : "pending";
  if (id === "verify") return t >= T.skip ? "skip" : "pending";
  if (id === "merge" && t >= T.lock) return "silent";
  const tick = TICK[id];
  return tick !== undefined && t >= tick ? "done" : "pending";
}

/** How far the first run has walked each edge, 0..1. */
export function visited(edge: string, t: number): number {
  switch (edge) {
    case "e1": return travel(t, R.ingest, R.plan);
    case "e2": return travel(t, R.plan, R.fetch);
    case "fa": return travel(t, R.fetch, R.a);
    case "fb": return travel(t, R.fetch, R.b);
    case "fc": return travel(t, R.fetch, R.c);
    case "ja": return travel(t, R.a, R.a + T.join);
    case "jb": return travel(t, R.b, R.b + T.join);
    case "jc": return travel(t, R.c, R.c + T.join);
    case "e3": return travel(t, R.merge, R.synth);
    default: return 0;
  }
}

/** Camera centre (world x) over the loop, for viewports too narrow to show
    the whole drawing. Clamped to the bounds by the caller. */
const CAM: readonly (readonly [number, number])[] = [
  [0, 300],
  [1.3, 300],
  [2.5, 880],
  [3.2, 1330],
  [7.0, 1330],
  [7.7, 1790],
  [11.0, 1790],
  [12.2, 300],
];

export function cameraX(t: number): number {
  for (let i = 1; i < CAM.length; i += 1) {
    const [t1, x1] = CAM[i];
    if (t <= t1) {
      const [t0, x0] = CAM[i - 1];
      return lerp(x0, x1, ease.cam(clamp01((t - t0) / (t1 - t0))));
    }
  }
  return CAM[CAM.length - 1][1];
}
