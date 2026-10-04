/* World geometry of the research-agent graph (ARGUS demo/research_agent),
   ported from the launch film at 300 units per hop. Names, finish order and
   durations are the real ones from run 20260930-130913-58c376. */

export type StationId =
  | "ingest"
  | "plan"
  | "fetch"
  | "a"
  | "b"
  | "c"
  | "merge"
  | "synth"
  | "verify";

export interface Station {
  id: StationId;
  x: number;
  y: number;
  name: string;
  ms?: string;
}

const LANE = 150;

export const STATIONS: readonly Station[] = [
  { id: "ingest", x: 0, y: 0, name: "ingest_query", ms: "0 ms" },
  { id: "plan", x: 300, y: 0, name: "plan_subqueries", ms: "2987 ms" },
  { id: "fetch", x: 600, y: 0, name: "fetch_sources", ms: "1641 ms" },
  { id: "a", x: 900, y: -LANE, name: "summarize_a", ms: "1715 ms" },
  { id: "b", x: 900, y: 0, name: "summarize_b", ms: "3422 ms" },
  { id: "c", x: 900, y: LANE, name: "summarize_c", ms: "1864 ms" },
  { id: "merge", x: 1200, y: 0, name: "merge_summaries", ms: "0 ms" },
  { id: "synth", x: 1500, y: 0, name: "synthesize_report" },
  { id: "verify", x: 1800, y: 0, name: "verify_citations" },
];

export const RING = 12;
export const GATE_X = 2060;

/** Drawing bounds, in world units. The camera never shows past these. */
export const BOUNDS = { x0: -170, x1: 2270, y0: -222, y1: 238 } as const;

const gap = RING + 8;
const line = (x0: number, x1: number) => `M ${x0 + gap} 0 L ${x1 - gap} 0`;
const fanOut = (y: number) =>
  `M ${600 + gap} 0 L 667 0 C 725 0, 742 ${y}, 800 ${y} L ${900 - gap} ${y}`;
const fanIn = (y: number) =>
  `M ${900 + gap} ${y} L 958 ${y} C 1017 ${y}, 1033 0, 1092 0 L ${1200 - gap} 0`;

export interface Edge {
  id: string;
  d: string;
}

/** Edges the first run walks, in execution order. */
export const EDGES: readonly Edge[] = [
  { id: "e1", d: line(0, 300) },
  { id: "e2", d: line(300, 600) },
  { id: "fa", d: fanOut(-LANE) },
  { id: "fb", d: line(600, 900) },
  { id: "fc", d: fanOut(LANE) },
  { id: "ja", d: fanIn(-LANE) },
  { id: "jb", d: line(900, 1200) },
  { id: "jc", d: fanIn(LANE) },
  { id: "e3", d: line(1200, 1500) },
];

/** Never walked: the run dies at synthesize_report. */
export const UNREACHED: readonly Edge[] = [
  { id: "e4", d: line(1500, 1800) },
  { id: "e5", d: `M ${1800 + gap} 0 L ${GATE_X} 0` },
  { id: "e6", d: `M ${GATE_X} 0 L ${BOUNDS.x1} 0` },
];

/** Token routes through station centres. */
export const ROUTES = {
  toFetch: "M 0 0 L 600 0",
  fanA: `M 600 0 L 667 0 C 725 0, 742 ${-LANE}, 800 ${-LANE} L 900 ${-LANE}`,
  fanB: "M 600 0 L 900 0",
  fanC: `M 600 0 L 667 0 C 725 0, 742 ${LANE}, 800 ${LANE} L 900 ${LANE}`,
  joinA: `M 900 ${-LANE} L 958 ${-LANE} C 1017 ${-LANE}, 1033 0, 1092 0 L 1200 0`,
  joinB: "M 900 0 L 1200 0",
  joinC: `M 900 ${LANE} L 958 ${LANE} C 1017 ${LANE}, 1033 0, 1092 0 L 1200 0`,
  tail: "M 1200 0 L 1500 0",
} as const;

export type RouteId = keyof typeof ROUTES;

export interface Rect {
  cx: number;
  cy: number;
  w: number;
  h: number;
}

/** ARGUS's selection frame: where it lands first, and where it locks. */
export const FRAME_SYNTH: Rect = { cx: 1500, cy: 33, w: 270, h: 104 };
export const FRAME_MERGE: Rect = { cx: 1200, cy: 33, w: 250, h: 104 };
