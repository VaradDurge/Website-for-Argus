"use client";

import { useEffect, useRef } from "react";
import {
  BOUNDS,
  EDGES,
  FRAME_MERGE,
  FRAME_SYNTH,
  GATE_X,
  RING,
  ROUTES,
  STATIONS,
  UNREACHED,
  type Rect,
  type RouteId,
  type StationId,
} from "./geometry";
import {
  T,
  cameraX,
  clamp01,
  ease,
  lerp,
  ramp,
  settle,
  stationState,
  travel,
  visited,
} from "./timeline";
import "./trace.css";

const FULL_W = BOUNDS.x1 - BOUNDS.x0;
const H = BOUNDS.y1 - BOUNDS.y0;
// Text stays legible: the drawing never renders below 0.5 or above 0.72 px
// per world unit. Narrower screens get a camera that follows the run.
const MIN_SCALE = 0.5;
const MAX_SCALE = 0.72;
const R = T.run;

type Pt = { x: number; y: number };

/** Writes an attribute only when it changes, so held frames cost nothing. */
function writer() {
  const last = new Map<Element, Map<string, string>>();
  return (el: Element, name: string, value: string | null) => {
    let attrs = last.get(el);
    if (!attrs) {
      attrs = new Map();
      last.set(el, attrs);
    }
    const key = value ?? "\u0000";
    if (attrs.get(name) === key) return;
    attrs.set(name, key);
    if (value === null) el.removeAttribute(name);
    else el.setAttribute(name, value);
  };
}

/** Where the three execution tokens are at time t (null = hidden). */
function tokenRoutes(t: number): [RouteId, number][] {
  const out: [RouteId, number][] = [];
  if (t >= R.ingest - 0.2 && t < R.fetch) {
    const p =
      t < R.plan
        ? travel(t, R.ingest, R.plan) * 0.5
        : 0.5 + travel(t, R.plan, R.fetch) * 0.5;
    out.push(["toFetch", p]);
  } else if (t >= R.fetch && t < R.b) out.push(["fanB", travel(t, R.fetch, R.b)]);
  else if (t >= R.b && t < R.merge) out.push(["joinB", travel(t, R.b, R.b + T.join)]);
  else if (t >= R.merge && t < R.synth) out.push(["tail", travel(t, R.merge, R.synth)]);
  if (t >= R.fetch && t < R.a) out.push(["fanA", travel(t, R.fetch, R.a)]);
  else if (t >= R.a && t < R.merge) out.push(["joinA", travel(t, R.a, R.a + T.join)]);
  if (t >= R.fetch && t < R.c) out.push(["fanC", travel(t, R.fetch, R.c)]);
  else if (t >= R.c && t < R.merge) out.push(["joinC", travel(t, R.c, R.c + T.join)]);
  return out;
}

/** ARGUS's selection frame: lands on the crash, walks back, locks on the origin. */
function gazeRect(t: number): Rect {
  const w = ramp(t, T.walk[0], T.walk[1], ease.cam);
  const appear = settle(t, T.gazeOn, 0.5);
  const lock = t >= T.lock ? 0.07 * (1 - settle(t, T.lock, 0.5)) : 0;
  const k = (1 + 0.25 * (1 - appear)) * (1 + lock);
  return {
    cx: lerp(FRAME_SYNTH.cx, FRAME_MERGE.cx, w),
    cy: lerp(FRAME_SYNTH.cy, FRAME_MERGE.cy, w),
    w: lerp(FRAME_SYNTH.w, FRAME_MERGE.w, w) * k,
    h: lerp(FRAME_SYNTH.h, FRAME_MERGE.h, w) * k,
  };
}

export function HeroTrace() {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const wrap = wrapRef.current;
    if (!svg || !wrap) return;
    const one = <E extends Element>(sel: string) => svg.querySelector<E>(sel);
    const all = <E extends Element>(sel: string) =>
      Array.from(svg.querySelectorAll<E>(sel));

    const set = writer();
    const stations = all<SVGGElement>("[data-st]");
    const edges = all<SVGPathElement>("[data-edge]");
    const tokens = all<SVGGElement>("[data-token]");
    const gaze = one<SVGGElement>("[data-gaze]");
    const gazeBox = one<SVGRectElement>("[data-gaze-box]");
    const handles = all<SVGRectElement>("[data-handle]");
    const chip = one<SVGGElement>("[data-gaze-chip]");
    const back = one<SVGPathElement>("[data-back]");
    const routes = new Map<RouteId, { el: SVGPathElement; len: number }>();
    for (const el of all<SVGPathElement>("[data-route]")) {
      routes.set(el.dataset.route as RouteId, { el, len: el.getTotalLength() });
    }
    if (!gaze || !gazeBox || !chip || !back) return;

    let viewW = FULL_W;
    let scale = MAX_SCALE;

    // arrow functions, not declarations: TS keeps the null checks above
    // narrowed inside closures but not inside hoisted functions
    const resize = (width: number) => {
      scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, width / FULL_W));
      viewW = width / scale;
    };

    const point = (id: RouteId, p: number): Pt => {
      const r = routes.get(id);
      if (!r) return { x: 0, y: 0 };
      const pt = r.el.getPointAtLength(clamp01(p) * r.len);
      return { x: pt.x, y: pt.y };
    };

    const draw = (t: number) => {
      // camera
      const full = viewW >= FULL_W;
      const centre = full
        ? (BOUNDS.x0 + BOUNDS.x1) / 2
        : Math.min(
            BOUNDS.x1 - viewW / 2,
            Math.max(BOUNDS.x0 + viewW / 2, cameraX(t))
          );
      set(
        svg!,
        "viewBox",
        `${(centre - viewW / 2).toFixed(1)} ${BOUNDS.y0} ${viewW.toFixed(1)} ${H}`
      );

      // discrete beats, set on the wrapper so the HTML caption can follow
      // them too; CSS owns how each one looks and fades
      const live = t < T.out[0];
      set(wrap, "data-merge", live && t >= R.merge ? "" : null);
      set(wrap, "data-crash", live && t >= R.synth ? "" : null);
      set(wrap, "data-gaze", live && t >= T.gazeOn ? "" : null);
      set(wrap, "data-lock", live && t >= T.lock ? "" : null);
      set(wrap, "data-finding", live && t >= T.finding ? "" : null);
      set(wrap, "data-gate", live && t >= T.gate ? "" : null);
      set(wrap, "data-out", live ? null : "");
      for (const el of stations) {
        set(el, "data-s", stationState(el.dataset.st as StationId, t));
      }

      // the first run walking the graph
      for (const el of edges) {
        set(el, "stroke-dashoffset", (1 - visited(el.dataset.edge ?? "", t)).toFixed(4));
      }
      const running = tokenRoutes(t);
      tokens.forEach((el, i) => {
        const route = running[i];
        if (!route) {
          set(el, "opacity", "0");
          return;
        }
        const pt = point(route[0], route[1]);
        set(el, "opacity", "1");
        set(el, "transform", `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
      });

      // ARGUS's gaze and the trace-back path under it
      const o =
        ramp(t, T.gazeOn, T.gazeOn + 0.25) * (1 - ramp(t, T.out[0], T.out[0] + 0.4));
      set(gaze, "opacity", o.toFixed(3));
      set(back, "opacity", o.toFixed(3));
      if (o <= 0) return;
      const r = gazeRect(t);
      const x = r.cx - r.w / 2;
      const y = r.cy - r.h / 2;
      set(gazeBox, "x", x.toFixed(1));
      set(gazeBox, "y", y.toFixed(1));
      set(gazeBox, "width", r.w.toFixed(1));
      set(gazeBox, "height", r.h.toFixed(1));
      const corners: Pt[] = [
        { x, y },
        { x: x + r.w, y },
        { x, y: y + r.h },
        { x: x + r.w, y: y + r.h },
      ];
      handles.forEach((el, i) => {
        set(el, "x", (corners[i].x - 5).toFixed(1));
        set(el, "y", (corners[i].y - 5).toFixed(1));
      });
      set(chip, "transform", `translate(${x.toFixed(1)} ${(y - 38).toFixed(1)})`);
      const walk = ramp(t, T.walk[0], T.walk[1], ease.cam);
      const x0 = FRAME_SYNTH.cx - RING - 8;
      const x1 = lerp(x0, FRAME_MERGE.cx + RING + 8, walk);
      set(back, "d", `M ${x0} 0 L ${x1.toFixed(1)} 0`);
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let last = 0;
    let t = 0;
    let visible = false;

    const frame = (now: number) => {
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
      last = now;
      t = (t + dt) % T.loop;
      draw(t);
      raf = requestAnimationFrame(frame);
    };

    const sync = () => {
      cancelAnimationFrame(raf);
      last = 0;
      if (reduced.matches) draw(T.still);
      else if (visible) raf = requestAnimationFrame(frame);
    };

    const ro = new ResizeObserver(([entry]) => {
      resize(entry.contentRect.width);
      draw(reduced.matches ? T.still : t);
    });
    const io = new IntersectionObserver((entries) => {
      visible = entries[entries.length - 1].isIntersecting;
      sync();
    });
    ro.observe(svg);
    io.observe(svg);
    reduced.addEventListener("change", sync);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      reduced.removeEventListener("change", sync);
    };
  }, []);

  return (
    <div ref={wrapRef} className="trace-wrap">
      <svg
        ref={svgRef}
        className="trace"
        viewBox={`${BOUNDS.x0} ${BOUNDS.y0} ${FULL_W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="A LangGraph run: merge_summaries returns an empty update and passes, synthesize_report crashes with a KeyError, and ARGUS walks back from the crash to merge_summaries, names it as the root cause and blocks the deploy."
      >
        <defs>
          <pattern id="trace-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" className="grid-line" />
          </pattern>
          <radialGradient id="trace-glow">
            <stop offset="0" className="glow-stop" />
            <stop offset="1" className="glow-stop glow-stop--end" />
          </radialGradient>
        </defs>

        <rect
          className="grid"
          x={BOUNDS.x0}
          y={BOUNDS.y0}
          width={FULL_W}
          height={H}
          fill="url(#trace-grid)"
        />
        <ellipse className="lock-glow" cx={FRAME_MERGE.cx} cy={20} rx={340} ry={210} fill="url(#trace-glow)" />

        <g className="routes" aria-hidden>
          {(Object.keys(ROUTES) as RouteId[]).map((id) => (
            <path key={id} data-route={id} d={ROUTES[id]} />
          ))}
        </g>

        <g className="edges">
          {EDGES.map((e) => (
            <path key={e.id} d={e.d} />
          ))}
          {UNREACHED.map((e) => (
            <path key={e.id} d={e.d} className="unreached" />
          ))}
        </g>
        {/* phosphor: a soft wide copy under each walked edge, driven by the
            same data-edge offsets as the crisp line above it */}
        <g className="edges-glow" aria-hidden>
          {EDGES.map((e) => (
            <path
              key={e.id}
              data-edge={e.id}
              d={e.d}
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1}
            />
          ))}
        </g>
        <g className="edges-run">
          {EDGES.map((e) => (
            <path
              key={e.id}
              data-edge={e.id}
              d={e.d}
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1}
            />
          ))}
        </g>
        <path data-back className="back" d="M 0 0" opacity={0} />

        <g transform={`translate(${GATE_X} 0)`} className="gate">
          <path className="gate-line" d="M 0 -168 L 0 78" />
          <text className="gate-label" y={-192} textAnchor="middle">
            DEPLOY
          </text>
          <text className="gate-side" x={-18} y={-146} textAnchor="end">
            ← CI
          </text>
          <text className="gate-side" x={18} y={-146}>
            PRODUCTION →
          </text>
          <rect className="gate-bar" x={-7} y={-58} width={14} height={116} rx={3} />
          <text className="gate-exit" y={116} textAnchor="middle">
            exit 1
          </text>
          <text className="gate-blocked" y={146} textAnchor="middle">
            DEPLOY BLOCKED
          </text>
        </g>

        {STATIONS.map((s) => (
          <g
            key={s.id}
            data-st={s.id}
            data-s="pending"
            className="st"
            transform={`translate(${s.x} ${s.y})`}
          >
            <circle className="ring" r={RING} />
            <circle className="dot" r={4.6} />
            <path className="x" d="M -4.6 -4.6 L 4.6 4.6 M 4.6 -4.6 L -4.6 4.6" />
            <text className="name" y={45} textAnchor="middle">
              {s.name}
            </text>
            {s.ms ? (
              <text className="v v-done" y={73} textAnchor="middle">
                <tspan className="ok">✓</tspan> {s.ms}
              </text>
            ) : null}
            {s.id === "merge" ? (
              <text className="v v-silent" y={73} textAnchor="middle">
                ⚠ silent failure
              </text>
            ) : null}
            {s.id === "synth" ? (
              <text className="v v-crash" y={73} textAnchor="middle">
                ✕ KeyError
              </text>
            ) : null}
            {s.id === "verify" ? (
              <text className="v v-skip" y={73} textAnchor="middle">
                ○ skipped
              </text>
            ) : null}
          </g>
        ))}

        <text className="empty" x={FRAME_MERGE.cx} y={-66} textAnchor="middle">
          {"{}"}
        </text>
        <text className="raised" x={FRAME_SYNTH.cx} y={-34} textAnchor="middle">
          raised KeyError
        </text>
        <circle className="ripple" cx={FRAME_SYNTH.cx} cy={0} r={RING} />

        {[0, 1, 2].map((i) => (
          <g key={i} data-token={i} className="token" opacity={0}>
            <circle className="token-halo" r={15} />
            <circle r={6.5} />
          </g>
        ))}

        <g data-gaze className="gaze" opacity={0}>
          <rect data-gaze-box className="gaze-box" />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} data-handle className="gaze-handle" width={10} height={10} />
          ))}
          <g data-gaze-chip className="gaze-chip">
            <rect width={92} height={28} rx={5} />
            <text x={46} y={19.5} textAnchor="middle">
              ARGUS
            </text>
          </g>
        </g>

        <g transform={`translate(${FRAME_MERGE.cx - FRAME_MERGE.w / 2 + 2} 126)`}>
          <g className="finding">
            <text className="finding-label">ROOT CAUSE</text>
            <text className="finding-head" y={34}>
              merge_summaries returned <tspan className="warn">{"{}"}</tspan>
            </text>
            <text className="finding-sub" y={64}>
              synthesize_report crashed reading it · 100%
            </text>
          </g>
        </g>
      </svg>
      {/* Narrow screens: the camera follows the run, so the finding moves
          out of the drawing to where it can always be read. */}
      <p className="trace-caption" aria-hidden>
        <span className="trace-caption__label">Root cause</span>
        <code>merge_summaries</code> returned <code className="warn">{"{}"}</code>.{" "}
        <code>synthesize_report</code> crashed reading it.
      </p>
    </div>
  );
}
