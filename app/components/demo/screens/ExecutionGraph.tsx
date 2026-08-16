"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Check,
  Clock,
  Database,
  Info,
  RotateCcw,
  Send,
  Shield,
  Sparkles,
  Unplug,
  X,
  Zap,
} from "lucide-react";

const NODE_W = 178;
const TOOL_GAP_Y = 30;
const BUS_Y = 16;
const MIN_SCALE = 0.18;
const MAX_SCALE = 2.2;

function measureWorld(
  current: Record<string, { x: number; y: number }>,
  showTools: boolean
) {
  let minX = 1e9;
  let minY = 1e9;
  let maxX = -1e9;
  let maxY = -1e9;
  for (const def of BASE) {
    const p = current[def.id];
    const w = Math.max(NODE_W, showTools ? def.tools.length * 92 : 0);
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y - 20);
    maxX = Math.max(maxX, p.x + w);
    maxY = Math.max(maxY, p.y + 52 + (showTools && def.tools.length ? TOOL_GAP_Y + 25 : 0));
  }
  return { minX, minY, maxX, maxY };
}

type NodeStatus =
  | "pass"
  | "fail"
  | "crashed"
  | "semantic"
  | "degraded"
  | "running"
  | "skipped";
type ToolStatus = "ok" | "error" | "slow" | "empty" | "running" | "skipped";
type Kind = "trigger" | "llm" | "retrieval" | "connector" | "guard" | "output";

interface ToolDef {
  id: string;
  type: string;
}
interface NodeDef {
  id: string;
  kind: Kind;
  x: number;
  y: number;
  tools: ToolDef[];
}

const BASE: NodeDef[] = [
  { id: "ingest_ticket", kind: "trigger", x: 30, y: 170, tools: [{ id: "zendesk", type: "api" }] },
  { id: "classify_intent", kind: "llm", x: 270, y: 170, tools: [{ id: "gpt-4o-mini", type: "llm" }] },
  {
    id: "retrieve_context",
    kind: "retrieval",
    x: 520,
    y: 50,
    tools: [
      { id: "pinecone", type: "vector" },
      { id: "s3_docs", type: "blob" },
    ],
  },
  {
    id: "enrich_account",
    kind: "connector",
    x: 520,
    y: 305,
    tools: [
      { id: "postgres", type: "db" },
      { id: "stripe_api", type: "rest" },
    ],
  },
  { id: "draft_reply", kind: "llm", x: 800, y: 185, tools: [{ id: "sonnet-4", type: "llm" }] },
  { id: "policy_check", kind: "guard", x: 1045, y: 185, tools: [{ id: "rule_engine", type: "local" }] },
  {
    id: "send_reply",
    kind: "output",
    x: 1290,
    y: 185,
    tools: [
      { id: "zendesk_out", type: "api" },
      { id: "slack_notify", type: "hook" },
    ],
  },
];

const EDGES: [string, string][] = [
  ["ingest_ticket", "classify_intent"],
  ["classify_intent", "retrieve_context"],
  ["classify_intent", "enrich_account"],
  ["retrieve_context", "draft_reply"],
  ["enrich_account", "draft_reply"],
  ["draft_reply", "policy_check"],
  ["policy_check", "send_reply"],
];

const CHAIN = ["enrich_account", "draft_reply", "policy_check"];

const NODE_STATE: Record<
  string,
  { s: NodeStatus; ms?: number; why?: string; cat?: string }
> = {
  ingest_ticket: { s: "pass", ms: 88 },
  classify_intent: { s: "pass", ms: 412 },
  retrieve_context: {
    s: "fail",
    ms: 1204,
    why: "Retrieved 1 chunk against a floor of 5.",
    cat: "Quality · Low Retrieval",
  },
  enrich_account: {
    s: "fail",
    ms: 1344,
    why: "Returned pass while omitting csat_history. The stripe_api error was swallowed by the handler.",
    cat: "Tool · Rate Limited",
  },
  draft_reply: {
    s: "semantic",
    ms: 2410,
    why: "Compensated for the absent history with a placeholder body.",
    cat: "Semantic · Placeholder",
  },
  policy_check: {
    s: "crashed",
    ms: 0,
    why: "KeyError: 'csat_history' — three nodes after the field was lost.",
    cat: "Tool · Error Response",
  },
  send_reply: { s: "skipped" },
};

const TOOL_STATE: Record<string, { s: ToolStatus; tag?: string }> = {
  pinecone: { s: "slow", tag: "1 hit" },
  s3_docs: { s: "ok" },
  postgres: { s: "ok" },
  stripe_api: { s: "error", tag: "429" },
  "sonnet-4": { s: "ok" },
  rule_engine: { s: "error", tag: "raise" },
  zendesk_out: { s: "skipped" },
  slack_notify: { s: "skipped" },
};

const STATUS_META: Record<
  NodeStatus,
  { cls: string; label: string; color: string }
> = {
  pass: { cls: "s-pass", label: "pass", color: "var(--ok)" },
  fail: { cls: "s-fail", label: "silent failure", color: "var(--quality)" },
  crashed: { cls: "s-crashed", label: "crashed", color: "var(--tool)" },
  semantic: { cls: "s-semantic", label: "semantic fail", color: "var(--semantic)" },
  degraded: { cls: "s-degraded", label: "degraded input", color: "var(--coherence)" },
  running: { cls: "s-running", label: "running", color: "var(--iris-bright)" },
  skipped: { cls: "s-skipped", label: "not reached", color: "var(--ink-3)" },
};

const TOOL_META: Record<ToolStatus, { cls: string; label: string }> = {
  ok: { cls: "t-ok", label: "ok" },
  error: { cls: "t-error", label: "error" },
  slow: { cls: "t-slow", label: "degraded" },
  empty: { cls: "t-empty", label: "empty result" },
  running: { cls: "t-ok", label: "in flight" },
  skipped: { cls: "t-skipped", label: "not called" },
};

const SEVERITY: Partial<Record<NodeStatus, number>> = {
  crashed: 4,
  semantic: 3,
  fail: 2,
  degraded: 1,
};

const EDGE_COLOR: Record<string, string> = {
  pass: "var(--edge-pass)",
  running: "var(--iris)",
  skipped: "var(--edge-skip)",
  crashed: "var(--tool)",
  semantic: "var(--semantic)",
  fail: "var(--quality)",
  degraded: "var(--coherence)",
};

function KindIcon({ kind }: { kind: Kind }) {
  const props = { size: 14, strokeWidth: 1.7 };
  if (kind === "trigger") return <Zap {...props} />;
  if (kind === "llm") return <Sparkles {...props} />;
  if (kind === "retrieval") return <Database {...props} />;
  if (kind === "connector") return <Unplug {...props} />;
  if (kind === "guard") return <Shield {...props} />;
  return <Send {...props} />;
}

function ToolIcon({ status }: { status: ToolStatus }) {
  const props = { className: "gtool-ico", size: 11, strokeWidth: 1.7 };
  if (status === "error") return <AlertTriangle {...props} />;
  if (status === "slow" || status === "running") return <Clock {...props} />;
  if (status === "empty") return <Info {...props} />;
  if (status === "skipped") return <Unplug {...props} />;
  return <Check {...props} />;
}

function related(id: string) {
  const keep: Record<string, true> = { [id]: true };
  let grew = true;
  while (grew) {
    grew = false;
    for (const [a, b] of EDGES) {
      if (keep[a] && !keep[b]) {
        keep[b] = true;
        grew = true;
      }
      if (keep[b] && !keep[a]) {
        keep[a] = true;
        grew = true;
      }
    }
  }
  return keep;
}

function edgeState(a: NodeStatus, b: NodeStatus) {
  if (a === "running" || b === "running") return "running";
  if (a === "skipped" && b === "skipped") return "skipped";
  const sa = SEVERITY[a] || 0;
  const sb = SEVERITY[b] || 0;
  if (sa === 0 && sb === 0) return "pass";
  return sa >= sb ? a : b;
}

function subLabel(status: NodeStatus, ms?: number, toolCount?: number, showTools?: boolean) {
  const core =
    status === "running"
      ? "running…"
      : status === "skipped"
        ? "not reached"
        : status === "crashed"
          ? "raised"
          : `${(ms || 0).toLocaleString()} ms`;
  return showTools && toolCount ? `${core} · ${toolCount}T` : core;
}

export function ExecutionGraph({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(() =>
    Object.fromEntries(BASE.map((n) => [n.id, { x: n.x, y: n.y }]))
  );
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [showTools, setShowTools] = useState(true);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const view = useRef({ scale: 1, tx: 0, ty: 0 });
  const posRef = useRef(pos);

  useEffect(() => {
    view.current = { scale, tx, ty };
  }, [scale, tx, ty]);

  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  const applyView = useCallback((nextScale: number, nextTx: number, nextTy: number) => {
    const canvas = canvasRef.current;
    const box = measureWorld(posRef.current, showTools);
    let txv = nextTx;
    let tyv = nextTy;
    if (canvas) {
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      const pad = 48;
      const minTx = cw - pad - box.maxX * nextScale;
      const maxTx = pad - box.minX * nextScale;
      const minTy = ch - pad - box.maxY * nextScale;
      const maxTy = pad - box.minY * nextScale;
      txv = minTx > maxTx ? (minTx + maxTx) / 2 : Math.min(maxTx, Math.max(minTx, nextTx));
      tyv = minTy > maxTy ? (minTy + maxTy) / 2 : Math.min(maxTy, Math.max(minTy, nextTy));
    }
    view.current = { scale: nextScale, tx: txv, ty: tyv };
    setScale(nextScale);
    setTx(txv);
    setTy(tyv);
  }, [showTools]);

  const applyFit = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { minX, minY, maxX, maxY } = measureWorld(posRef.current, showTools);
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    if (cw < 8 || ch < 8) return;
    const pad = 28;
    const next = Math.max(
      0.12,
      Math.min(
        1,
        (cw - pad * 2) / Math.max(1, maxX - minX),
        (ch - pad * 2) / Math.max(1, maxY - minY)
      )
    );
    const nextTx = (cw - (maxX - minX) * next) / 2 - minX * next;
    const nextTy = (ch - (maxY - minY) * next) / 2 - minY * next;
    view.current = { scale: next, tx: nextTx, ty: nextTy };
    setScale(next);
    setTx(nextTx);
    setTy(nextTy);
  }, [showTools]);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => applyFit());
    ro.observe(el);
    applyFit();
    return () => ro.disconnect();
  }, [applyFit]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      const node = canvasRef.current;
      if (!node) return;
      const r = node.getBoundingClientRect();
      zoomAt(e.clientX - r.left, e.clientY - r.top, view.current.scale * (e.deltaY > 0 ? 0.9 : 1.1));
    }
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onSelect(null);
        setSelectedTool(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onSelect]);

  function zoomAt(px: number, py: number, nextRaw: number) {
    const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, nextRaw));
    const { scale: s, tx: x, ty: y } = view.current;
    applyView(next, px - ((px - x) * next) / s, py - ((py - y) * next) / s);
  }

  function onCanvasPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button !== 0 || (e.target as HTMLElement).closest(".gnode, .gtool, .ginsp, .gzoom, .gbar"))
      return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const sx = e.clientX;
    const sy = e.clientY;
    const otx = view.current.tx;
    const oty = view.current.ty;
    canvas.classList.add("panning");
    canvas.setPointerCapture(e.pointerId);
    function move(ev: PointerEvent) {
      applyView(view.current.scale, otx + ev.clientX - sx, oty + ev.clientY - sy);
    }
    function up(ev: PointerEvent) {
      const node = canvasRef.current;
      if (node) {
        node.classList.remove("panning");
        node.releasePointerCapture(ev.pointerId);
      }
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      if (Math.abs(ev.clientX - sx) < 3 && Math.abs(ev.clientY - sy) < 3) {
        onSelect(null);
        setSelectedTool(null);
      }
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function onNodePointerDown(e: React.PointerEvent, id: string) {
    if (e.button !== 0) return;
    e.stopPropagation();
    const start = pos[id];
    const sx = e.clientX;
    const sy = e.clientY;
    let moved = false;
    setDragging(id);
    function move(ev: PointerEvent) {
      const dx = (ev.clientX - sx) / view.current.scale;
      const dy = (ev.clientY - sy) / view.current.scale;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) moved = true;
      setPos((prev) => ({
        ...prev,
        [id]: {
          x: Math.round(Math.min(1380, Math.max(-20, start.x + dx))),
          y: Math.round(Math.min(360, Math.max(20, start.y + dy))),
        },
      }));
    }
    function up() {
      setDragging(null);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      if (!moved) {
        onSelect(id);
        setSelectedTool(null);
      }
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function relayout() {
    const next = Object.fromEntries(BASE.map((n) => [n.id, { x: n.x, y: n.y }]));
    posRef.current = next;
    setPos(next);
    requestAnimationFrame(applyFit);
  }

  const keep = selectedId ? related(selectedId) : null;
  const selectedNode = BASE.find((n) => n.id === selectedId) ?? null;
  const selectedNodeState = selectedId ? NODE_STATE[selectedId] : null;

  const paths = EDGES.map(([from, to]) => {
    const a = pos[from];
    const b = pos[to];
    const as = NODE_STATE[from].s;
    const bs = NODE_STATE[to].s;
    const st = edgeState(as, bs);
    const col = EDGE_COLOR[st];
    const sx = a.x + NODE_W;
    const sy = a.y + 26;
    const ex = b.x;
    const ey = b.y + 26;
    const dx = Math.max(36, Math.abs(ex - sx) * 0.5);
    const ai = CHAIN.indexOf(from);
    const bi = CHAIN.indexOf(to);
    const isProp = ai > -1 && bi === ai + 1;
    return { from, to, st, col, d: `M${sx},${sy} C${sx + dx},${sy} ${ex - dx},${ey} ${ex},${ey}`, ex, ey, isProp };
  });

  return (
    <div className="gwrap">
      <div className="gbar">
        <span className="gbar-note">support-triage · tool failure</span>
        <div className="gbar-sp" />
        <label className="gbar-tools">
          <span
            className={`switch${showTools ? " on" : ""}`}
            role="switch"
            aria-checked={showTools}
            tabIndex={0}
            onClick={() => setShowTools((v) => !v)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setShowTools((v) => !v);
              }
            }}
          />
          Tools
        </label>
        <button type="button" className="btn btn-sm" onClick={relayout}>
          <RotateCcw />
          Re-layout
        </button>
      </div>

      <div
        ref={canvasRef}
        className="gcanvas"
        onPointerDown={onCanvasPointerDown}
      >
        <span className="gtick tl" />
        <span className="gtick tr" />
        <span className="gtick bl" />
        <span className="gtick br" />
        <div
          className="gworld"
          style={{ transform: `translate(${tx}px, ${ty}px) scale(${scale})` }}
        >
          <svg className="gedges" width={1600} height={520}>
            {paths.map((p) => (
              <g key={`${p.from}-${p.to}`}>
                <path
                  d={p.d}
                  fill="none"
                  stroke={p.col}
                  strokeWidth={p.st === "pass" || p.st === "skipped" ? 1.2 : 1.9}
                  className={p.st === "running" ? "e-live" : p.isProp ? "e-prop" : undefined}
                />
                <path
                  d={`M${p.ex - 6},${p.ey - 3.6} L${p.ex},${p.ey} L${p.ex - 6},${p.ey + 3.6} Z`}
                  fill={p.col}
                />
              </g>
            ))}
            {showTools
              ? BASE.map((def) => {
                  const p = pos[def.id];
                  const anyErr = def.tools.some((t) => (TOOL_STATE[t.id]?.s ?? "ok") === "error");
                  const col = anyErr ? "var(--tool)" : "var(--edge-pass)";
                  const dash = anyErr ? undefined : "3 3";
                  const top = p.y + 52;
                  const busY = top + BUS_Y;
                  const mid = p.x + NODE_W / 2;
                  const centers = def.tools.map((_, i) => p.x + 40 + i * 88);
                  const lo = Math.min(mid, ...centers);
                  const hi = Math.max(mid, ...centers);
                  return (
                    <g key={`bus-${def.id}`}>
                      <path
                        d={`M${mid},${top} L${mid},${busY}`}
                        stroke={col}
                        strokeWidth={anyErr ? 1.5 : 1}
                        fill="none"
                        strokeDasharray={dash}
                      />
                      <path
                        d={`M${lo},${busY} L${hi},${busY}`}
                        stroke={col}
                        strokeWidth={anyErr ? 1.5 : 1}
                        fill="none"
                        strokeDasharray={dash}
                      />
                      {centers.map((c, i) => {
                        const err = (TOOL_STATE[def.tools[i].id]?.s ?? "ok") === "error";
                        return (
                          <path
                            key={def.tools[i].id}
                            d={`M${c},${busY} L${c},${top + TOOL_GAP_Y}`}
                            stroke={err ? "var(--tool)" : col}
                            strokeWidth={err ? 1.5 : 1}
                            fill="none"
                            strokeDasharray={err ? undefined : dash}
                          />
                        );
                      })}
                    </g>
                  );
                })
              : null}
          </svg>

          {BASE.map((def) => {
            const p = pos[def.id];
            const st = NODE_STATE[def.id];
            const meta = STATUS_META[st.s];
            const isRoot = def.id === "enrich_account";
            const dim = keep ? !keep[def.id] : false;
            return (
              <div key={def.id}>
                <div
                  role="button"
                  tabIndex={0}
                  className={`gnode ${meta.cls}${isRoot ? " rootcause" : ""}${selectedId === def.id ? " selected" : ""}${dim ? " dimmed" : ""}${dragging === def.id ? " dragging" : ""}`}
                  style={{ transform: `translate3d(${p.x}px, ${p.y}px, 0)` }}
                  onPointerDown={(e) => onNodePointerDown(e, def.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelect(def.id);
                      setSelectedTool(null);
                    }
                  }}
                >
                  {isRoot ? <span className="gnode-tab">ROOT CAUSE</span> : null}
                  <div className="gnode-top">
                    <span className="gnode-ico">
                      <KindIcon kind={def.kind} />
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div className="gnode-name">{def.id}</div>
                      <div className="gnode-sub">
                        <span style={{ color: meta.color }}>●</span>
                        {subLabel(st.s, st.ms, def.tools.length, showTools)}
                      </div>
                    </div>
                  </div>
                  {st.s === "fail" || st.s === "semantic" || st.s === "crashed" ? (
                    <span className="gnode-badge">
                      {st.s === "crashed" ? (
                        <X style={{ width: 9, height: 9 }} />
                      ) : (
                        <AlertTriangle style={{ width: 9, height: 9 }} />
                      )}
                    </span>
                  ) : null}
                </div>
                {showTools ? (
                  <div
                    className={`gtools${dim ? " dimmed" : ""}`}
                    style={{
                      transform: `translate3d(${p.x}px, ${p.y + 52 + TOOL_GAP_Y}px, 0)`,
                    }}
                  >
                    {def.tools.map((t) => {
                      const ts = TOOL_STATE[t.id] ?? { s: "ok" as const };
                      const tm = TOOL_META[ts.s];
                      return (
                        <span
                          key={t.id}
                          role="button"
                          tabIndex={0}
                          className={`gtool ${tm.cls}${selectedTool === t.id ? " selected" : ""}`}
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect(def.id);
                            setSelectedTool(t.id);
                          }}
                        >
                          <ToolIcon status={ts.s} />
                          {t.id}
                          <span
                            className="gtool-kind"
                            style={
                              ts.s === "error"
                                ? { color: "var(--tool)" }
                                : ts.s === "slow"
                                  ? { color: "var(--quality)" }
                                  : undefined
                            }
                          >
                            ·{ts.tag || t.type}
                          </span>
                        </span>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        {selectedNode && selectedNodeState ? (
          <aside className="ginsp">
            <div className="ginsp-h">
              <div style={{ minWidth: 0 }}>
                <h5>{selectedTool ?? selectedNode.id}</h5>
                <div className="sub">
                  {selectedTool
                    ? `External tool · ${selectedNode.tools.find((t) => t.id === selectedTool)?.type}`
                    : `${selectedNode.kind} node${selectedNode.id === "enrich_account" ? " · root cause" : ""}`}
                </div>
              </div>
              <button
                type="button"
                className="ginsp-x"
                aria-label="Close inspector"
                onClick={() => {
                  onSelect(null);
                  setSelectedTool(null);
                }}
              >
                ✕
              </button>
            </div>
            <div className="ginsp-b">
              {selectedTool ? (
                <ToolInspector
                  nodeId={selectedNode.id}
                  toolId={selectedTool}
                  type={selectedNode.tools.find((t) => t.id === selectedTool)?.type ?? ""}
                />
              ) : (
                <NodeInspector id={selectedNode.id} kind={selectedNode.kind} />
              )}
            </div>
          </aside>
        ) : null}

        <div
          className="gzoom"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            aria-label="Zoom out"
            onClick={() => {
              const el = canvasRef.current;
              if (!el) return;
              zoomAt(el.clientWidth / 2, el.clientHeight / 2, view.current.scale / 1.18);
            }}
          >
            −
          </button>
          <span className="gzoom-val">{Math.round(scale * 100)}%</span>
          <button
            type="button"
            aria-label="Zoom in"
            onClick={() => {
              const el = canvasRef.current;
              if (!el) return;
              zoomAt(el.clientWidth / 2, el.clientHeight / 2, view.current.scale * 1.18);
            }}
          >
            +
          </button>
          <button type="button" aria-label="Fit to view" className="gzoom-fit" onClick={applyFit}>
            FIT
          </button>
        </div>
      </div>

      <div className="glegend">
        <span className="glegend-i">
          <span className="lg-key" style={{ borderColor: "var(--line-2)", background: "var(--raised)" }} />
          Node · passed
        </span>
        <span className="glegend-i">
          <span className="lg-key" style={{ borderColor: "var(--tool)", borderWidth: 1.5, background: "var(--surf-tool)" }} />
          Crashed
        </span>
        <span className="glegend-i">
          <span className="lg-key" style={{ borderColor: "var(--quality)", background: "var(--surf-quality)" }} />
          Silent failure
        </span>
        <span className="glegend-i">
          <span
            className="lg-key"
            style={{
              borderColor: "var(--semantic)",
              background:
                "repeating-linear-gradient(135deg, var(--semantic) 0 3px, transparent 3px 7px)",
            }}
          />
          Semantic
        </span>
        <span className="glegend-i">
          <span className="lg-pill" style={{ borderColor: "var(--tool)", borderStyle: "solid", background: "var(--surf-tool)" }} />
          Tool · error
        </span>
      </div>
    </div>
  );
}

function InspRow({ k, v, color }: { k: string; v: string; color?: string }) {
  return (
    <div className="insp-line">
      <span>{k}</span>
      <span style={color ? { color } : undefined}>{v}</span>
    </div>
  );
}

function NodeInspector({ id, kind }: { id: string; kind: Kind }) {
  const st = NODE_STATE[id];
  const m = STATUS_META[st.s];
  const def = BASE.find((n) => n.id === id);
  return (
    <>
      <div className="ginsp-sec">
        <InspRow k="Status" v={m.label} color={m.color} />
        <InspRow k="Duration" v={st.ms != null ? `${st.ms.toLocaleString()} ms` : "—"} />
        <InspRow k="Tools" v={String(def?.tools.length ?? 0)} />
        <InspRow k="Kind" v={kind} />
      </div>
      {st.cat ? (
        <div className="ginsp-sec">
          <div className="specimen-label">Finding</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: m.color }}>{st.cat}</div>
          <p style={{ margin: "6px 0 0", fontSize: 11.5, color: "var(--ink-2)", lineHeight: 1.6 }}>
            {st.why}
          </p>
        </div>
      ) : null}
      {id === "enrich_account" ? (
        <div className="ginsp-sec">
          <div className="specimen-label">Propagation</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-2)", lineHeight: 1.9 }}>
            {CHAIN.map((x, i) => (
              <span key={x}>
                {i ? <span style={{ color: "var(--ink-4)" }}> → </span> : null}
                <span style={{ color: i === 0 ? "var(--tool)" : "var(--ink-2)" }}>{x}</span>
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}

function ToolInspector({
  nodeId,
  toolId,
  type,
}: {
  nodeId: string;
  toolId: string;
  type: string;
}) {
  const ts = TOOL_STATE[toolId] ?? { s: "ok" as const };
  const tm = TOOL_META[ts.s];
  const color =
    ts.s === "error"
      ? "var(--tool)"
      : ts.s === "slow"
        ? "var(--quality)"
        : ts.s === "skipped"
          ? "var(--ink-3)"
          : "var(--ok)";
  return (
    <>
      <div className="ginsp-sec">
        <InspRow k="Status" v={tm.label} color={color} />
        <InspRow k="Called by" v={nodeId} />
        <InspRow k="Signal" v={ts.tag || "—"} />
        <InspRow k="Type" v={type} />
      </div>
      {ts.s === "error" ? (
        <div className="ginsp-sec">
          <div className="specimen-label">Response</div>
          <div className="insp-code">{`HTTP 429 Too Many Requests\n{"error":{"type":"rate_limit",\n "retry_after":30}}`}</div>
        </div>
      ) : null}
    </>
  );
}
