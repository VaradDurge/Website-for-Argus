"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Link2,
  GitCompare,
  UserCheck,
  BarChart3,
  GitBranch,
  Bell,
  Database,
  BookOpen,
  Clock,
  LayoutDashboard,
  Settings,
  Search,
  LogOut,
  ChevronRight,
  ArrowLeft,
  Filter,
  RefreshCw,
  FileText,
  Check,
  X,
  AlertTriangle,
  Sparkles,
  Shield,
  Play,
  Flag,
  Maximize2,
  RotateCcw,
  Minus,
} from "lucide-react";

// ═══════════════════════════════════════
//  Types
// ═══════════════════════════════════════

type PageId = "runs" | "run-detail" | "compare" | "approvals";
type NodeStatus = "succeeded" | "failed" | "running" | "skipped" | "pending";

interface GNode {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  status: NodeStatus;
  durationMs: number;
  col: number;
  row: number;
}

interface GEdge {
  from: string;
  to: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  page?: PageId;
  soon?: boolean;
}

// ═══════════════════════════════════════
//  Sidebar config
// ═══════════════════════════════════════

const SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: "OBSERVE",
    items: [
      { id: "runs", label: "Runs", icon: Activity, page: "runs" },
      { id: "traces", label: "Traces", icon: Link2, soon: true },
    ],
  },
  {
    label: "ANALYZE",
    items: [
      { id: "compare", label: "Compare", icon: GitCompare, page: "compare" },
      { id: "approvals", label: "Approvals", icon: UserCheck, page: "approvals" },
      { id: "evaluation", label: "Evaluation", icon: BarChart3, soon: true },
    ],
  },
  {
    label: "WORKFLOWS",
    items: [
      { id: "graphs", label: "Graphs", icon: GitBranch, soon: true },
      { id: "alerts", label: "Alerts", icon: Bell, soon: true },
      { id: "datasets", label: "Datasets", icon: Database, soon: true },
    ],
  },
];

const BOTTOM_NAV: NavItem[] = [
  { id: "guide", label: "Guide", icon: BookOpen },
  { id: "changelog", label: "Changelog", icon: Clock },
  { id: "report-board", label: "Report Board", icon: LayoutDashboard },
  { id: "settings", label: "Settings", icon: Settings, soon: true },
];

// ═══════════════════════════════════════
//  Mock data
// ═══════════════════════════════════════

type StepColor = "ok" | "warn" | "fail";

interface RunRow {
  id: string;
  name: string;
  status: "clean" | "silent-failure";
  failedNode?: string;
  stepColors: StepColor[];
  duration: string;
  ago: string;
  clickable?: boolean;
}

const ALL_RUNS: RunRow[] = [
  { id: "20260613-061921-080f8d", name: "parse_diff \u2192 detect_risk \u2192 review_code \u2192 ch...", failedNode: "parse_diff", status: "silent-failure", stepColors: ["fail", "ok", "ok", "ok", "ok"], duration: "25.09s", ago: "4d ago", clickable: true },
  { id: "20260617", name: "router \u2192 weather \u2192 general", status: "clean", stepColors: ["ok", "ok", "ok"], duration: "2.23s", ago: "7h ago" },
  { id: "20260617", name: "clean \u2192 meta", status: "clean", stepColors: ["ok", "ok"], duration: "3.43s", ago: "7h ago" },
  { id: "20260617", name: "process", status: "clean", stepColors: ["ok"], duration: "1.68s", ago: "7h ago" },
  { id: "20260617", name: "respond \u2192 summarize", status: "clean", stepColors: ["ok", "ok"], duration: "2.84s", ago: "7h ago" },
  { id: "20260617", name: "answer", status: "clean", stepColors: ["ok"], duration: "1.33s", ago: "7h ago" },
  { id: "20260617", name: "step_1 \u2192 step_2 \u2192 step_3 \u2192 step_4 \u2192 step_5...", status: "clean", stepColors: ["ok", "ok", "ok", "ok", "ok", "ok", "ok"], duration: "11.51s", ago: "7h ago" },
  { id: "20260617", name: "scan \u2192 report", status: "clean", stepColors: ["ok", "ok"], duration: "2.96s", ago: "7h ago" },
  { id: "20260617", name: "compute", status: "clean", stepColors: ["ok"], duration: "1.33s", ago: "7h ago" },
];

const FAILED_RUNS: RunRow[] = [
  { id: "20260613-061921-080f8d", name: "parse_diff \u2192 detect_risk \u2192 review_code \u2192 ch...", failedNode: "parse_diff", status: "silent-failure", stepColors: ["fail", "ok", "ok", "ok", "ok"], duration: "25.09s", ago: "4d ago", clickable: true },
  { id: "20260616", name: "researcher \u2192 analyzer \u2192 summarizer \u2192 format...", failedNode: "summarizer", status: "silent-failure", stepColors: ["ok", "ok", "warn", "fail"], duration: "12.73s", ago: "21h ago" },
  { id: "20260616", name: "researcher \u2192 analyzer \u2192 summarizer \u2192 format...", failedNode: "summarizer", status: "silent-failure", stepColors: ["ok", "ok", "warn", "fail"], duration: "11.21s", ago: "21h ago" },
  { id: "20260613", name: "testingv", failedNode: "detect_risk", status: "silent-failure", stepColors: ["ok", "fail", "ok", "ok", "ok"], duration: "20.81s", ago: "4d ago" },
  { id: "20260613", name: "scan \u2192 report", failedNode: "scan", status: "silent-failure", stepColors: ["fail", "ok"], duration: "1.31s", ago: "4d ago" },
  { id: "20260613", name: "classify \u2192 list_files", failedNode: "list_files", status: "silent-failure", stepColors: ["ok", "fail"], duration: "2.81s", ago: "4d ago" },
];

// Pipeline steps for detail view
const PIPELINE_STEPS = [
  { num: "01", name: "parse_diff", type: "structured_json", duration: "0 ms", status: "fail" as const, isRootCause: true, error: "[BA-005] structural malformation \u2014 expected: structured_json structure profile, observed: expected \u22652 keys, got 1" },
  { num: "02", name: "check_tests", type: "structured_json", duration: "0 ms", status: "ok" as const },
  { num: "03", name: "detect_risk", type: "structured_json", duration: "2128 ms", status: "ok" as const },
  { num: "04", name: "review_code", type: "structured_json", duration: "12444 ms", status: "ok" as const },
  { num: "05", name: "summarize", type: "structured_json", duration: "3671 ms", status: "ok" as const },
];

// Graph data for overview (failed run)
const OVERVIEW_NODES: GNode[] = [
  { id: "parse_diff", label: "parse_diff", icon: FileText, status: "failed", durationMs: 0, col: 0, row: 1 },
  { id: "detect_risk", label: "detect_risk", icon: Search, status: "succeeded", durationMs: 2128, col: 1, row: 0 },
  { id: "review_code", label: "review_code", icon: Sparkles, status: "succeeded", durationMs: 12444, col: 1, row: 1 },
  { id: "check_tests", label: "check_tests", icon: Shield, status: "succeeded", durationMs: 0, col: 1, row: 2 },
  { id: "summarize", label: "summarize", icon: Sparkles, status: "succeeded", durationMs: 3671, col: 2, row: 0 },
];

const OVERVIEW_EDGES: GEdge[] = [
  { from: "parse_diff", to: "detect_risk" },
  { from: "parse_diff", to: "review_code" },
  { from: "parse_diff", to: "check_tests" },
  { from: "detect_risk", to: "summarize" },
  { from: "review_code", to: "summarize" },
  { from: "check_tests", to: "summarize" },
];

// Graph data for compare — base (failed)
const COMPARE_BASE_NODES: GNode[] = [
  { id: "parse_diff", label: "parse_diff", icon: FileText, status: "succeeded", durationMs: 0, col: 0, row: 1 },
  { id: "detect_risk", label: "detect_risk", icon: Search, status: "failed", durationMs: 1290, col: 1, row: 0 },
  { id: "review_code", label: "review_code", icon: Sparkles, status: "succeeded", durationMs: 14081, col: 1, row: 1 },
  { id: "check_tests", label: "check_tests", icon: Shield, status: "succeeded", durationMs: 0, col: 1, row: 2 },
  { id: "summarize", label: "summarize", icon: Sparkles, status: "succeeded", durationMs: 4908, col: 2, row: 0 },
];

// Graph data for compare — replay (fixed)
const COMPARE_REPLAY_NODES: GNode[] = [
  { id: "parse_diff", label: "parse_diff", icon: FileText, status: "pending", durationMs: 0, col: 0, row: 1 },
  { id: "detect_risk", label: "detect_risk", icon: Search, status: "succeeded", durationMs: 0, col: 1, row: 0 },
  { id: "review_code", label: "review_code", icon: Sparkles, status: "succeeded", durationMs: 15531, col: 1, row: 1 },
  { id: "check_tests", label: "check_tests", icon: Shield, status: "pending", durationMs: 0, col: 1, row: 2 },
  { id: "summarize", label: "summarize", icon: Sparkles, status: "succeeded", durationMs: 5190, col: 2, row: 0 },
];

const GRAPH_EDGES: GEdge[] = [
  { from: "parse_diff", to: "detect_risk" },
  { from: "parse_diff", to: "review_code" },
  { from: "parse_diff", to: "check_tests" },
  { from: "detect_risk", to: "summarize" },
  { from: "review_code", to: "summarize" },
  { from: "check_tests", to: "summarize" },
];

const COMPARE_TABLE = [
  { num: "1", name: "parse_diff", baseMs: 0, baseStatus: "OK", replayMs: 0, replayStatus: "OK", change: "-", impact: "No change", impactType: "" as const },
  { num: "2", name: "check_tests", baseMs: 0, baseStatus: "OK", replayMs: 0, replayStatus: "OK", change: "-", impact: "No change", impactType: "" as const },
  { num: "3", name: "detect_risk", baseMs: 1290, baseStatus: "Fail", replayMs: 0, replayStatus: "OK", change: "-1.29s (-100.0%)", impact: "Improved", impactType: "ok" as const },
  { num: "4", name: "review_code", baseMs: 14081, baseStatus: "degraded_input", replayMs: 15531, replayStatus: "OK", change: "+1.45s (+10.3%)", impact: "Changed", impactType: "warn" as const },
  { num: "5", name: "summarize", baseMs: 4908, baseStatus: "degraded_input", replayMs: 5190, replayStatus: "OK", change: "+282ms (+5.7%)", impact: "Changed", impactType: "warn" as const },
];

// ═══════════════════════════════════════
//  SVG Pipeline Graph (Bézier edges)
// ═══════════════════════════════════════

const NODE_W = 150;
const NODE_H = 52;
const GAP_X = 48;
const GAP_Y = 18;
const PAD = 20;

function nPos(n: GNode) {
  return { x: PAD + n.col * (NODE_W + GAP_X), y: PAD + n.row * (NODE_H + GAP_Y) };
}

function eKind(from: GNode, to: GNode): "failed" | "active" | "idle" {
  if (from.status === "failed" || to.status === "failed") return "failed";
  if (from.status === "succeeded" && to.status === "succeeded") return "active";
  return "idle";
}

const ESTROKE = {
  failed: "var(--signal-fail)",
  active: "rgba(109,92,255,0.45)",
  idle: "var(--border)",
};

function formatMs(ms: number) {
  if (ms === 0) return "0 ms";
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(0)} ms`;
}

function PipelineGraph({ nodes, edges, compact, selectedNode, onSelectNode }: { nodes: GNode[]; edges: GEdge[]; compact?: boolean; selectedNode?: string | null; onSelectNode?: (id: string) => void }) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const maxCol = Math.max(...nodes.map((n) => n.col));
  const maxRow = Math.max(...nodes.map((n) => n.row));
  const w = PAD * 2 + (maxCol + 1) * NODE_W + maxCol * GAP_X;
  const h = PAD * 2 + (maxRow + 1) * NODE_H + maxRow * GAP_Y;

  const statusBorder: Record<NodeStatus, string> = {
    succeeded: "var(--border)",
    failed: "var(--signal-fail)",
    running: "var(--accent)",
    skipped: "var(--border)",
    pending: "var(--border)",
  };
  const statusBg: Record<NodeStatus, string> = {
    succeeded: "var(--surface-2)",
    failed: "rgba(255,90,106,0.06)",
    running: "rgba(109,92,255,0.06)",
    skipped: "var(--surface-2)",
    pending: "var(--surface-2)",
  };
  const statusIconBg: Record<NodeStatus, string> = {
    succeeded: "rgba(109,92,255,0.1)",
    failed: "rgba(255,90,106,0.15)",
    running: "rgba(109,92,255,0.15)",
    skipped: "rgba(255,255,255,0.04)",
    pending: "rgba(255,255,255,0.04)",
  };
  const statusIconColor: Record<NodeStatus, string> = {
    succeeded: "var(--accent-soft)",
    failed: "var(--signal-fail)",
    running: "var(--accent)",
    skipped: "var(--text-dim)",
    pending: "var(--text-dim)",
  };

  return (
    <div className="overflow-x-auto">
      <div className="relative mx-auto" style={{ width: w, height: h, minWidth: "100%" }}>
        {/* Dotted grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{ backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)", backgroundSize: "20px 20px" }}
        />

        {/* SVG edges */}
        <svg className="pointer-events-none absolute inset-0" width={w} height={h}>
          <defs>
            {["failed", "active", "idle"].map((k) => (
              <marker key={k} id={`arr-${k}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill={ESTROKE[k as keyof typeof ESTROKE]} />
              </marker>
            ))}
          </defs>
          {edges.map((e) => {
            const from = byId.get(e.from);
            const to = byId.get(e.to);
            if (!from || !to) return null;
            const fp = nPos(from);
            const tp = nPos(to);
            const sx = fp.x + NODE_W;
            const sy = fp.y + NODE_H / 2;
            const tx = tp.x;
            const ty = tp.y + NODE_H / 2;
            const dx = Math.max(24, (tx - sx) / 2);
            const d = `M ${sx},${sy} C ${sx + dx},${sy} ${tx - dx},${ty} ${tx},${ty}`;
            const kind = eKind(from, to);
            return (
              <path
                key={`${e.from}-${e.to}`}
                d={d}
                fill="none"
                stroke={ESTROKE[kind]}
                strokeWidth={kind === "idle" ? 1 : 1.75}
                strokeDasharray={kind === "idle" ? "3 4" : undefined}
                markerEnd={`url(#arr-${kind})`}
              />
            );
          })}
        </svg>

        {/* Node cards */}
        {nodes.map((n) => {
          const { x, y } = nPos(n);
          const Icon = n.icon;
          const isDim = n.status === "skipped" || n.status === "pending";
          const isSelected = selectedNode === n.id;
          return (
            <button
              key={n.id}
              onClick={() => onSelectNode?.(n.id)}
              className="absolute flex items-center gap-2 rounded-lg px-2.5 text-left transition-all"
              style={{
                left: x, top: y, width: NODE_W, height: NODE_H,
                border: `1.5px solid ${isSelected && n.status !== "failed" ? "var(--accent)" : statusBorder[n.status]}`,
                background: statusBg[n.status],
                boxShadow: isSelected && n.status !== "failed" ? "0 0 0 2px var(--accent), 0 0 12px -2px var(--accent)" : n.status === "failed" ? "0 0 18px -4px var(--signal-fail)" : "none",
                opacity: isDim ? 0.55 : 1,
                borderStyle: isDim ? "dashed" : "solid",
                cursor: onSelectNode ? "pointer" : "default",
              }}
            >
              <div
                className="w-7 h-7 rounded flex items-center justify-center shrink-0"
                style={{ background: statusIconBg[n.status] }}
              >
                <span style={{ color: statusIconColor[n.status] }}><Icon size={compact ? 11 : 13} /></span>
              </div>
              <div className="min-w-0 flex-1">
                <div className={`truncate font-mono font-medium text-white ${compact ? "text-[10px]" : "text-[11px]"}`}>{n.label}</div>
                <div className="flex items-center gap-1 mt-0.5">
                  {n.status === "succeeded" && <Check size={9} className="text-[var(--signal-ok)]" strokeWidth={2.5} />}
                  {n.status === "failed" && <X size={9} className="text-[var(--signal-fail)]" strokeWidth={2.5} />}
                  {n.status === "pending" && <Minus size={9} className="text-[var(--text-dim)]" strokeWidth={2.5} />}
                  <span className={`font-mono text-[var(--text-dim)] ${compact ? "text-[8px]" : "text-[9px]"}`}>
                    {n.status === "pending" ? "queued" : formatMs(n.durationMs)}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
//  Node Inspector data
// ═══════════════════════════════════════

const NODE_INSPECTOR_DATA: Record<string, { step: number; type: string; duration: string; status: string; inspection: string; semanticCheck?: { score: string; result: string; desc: string }; inputKeys: number; outputKeys: number }> = {
  parse_diff: { step: 1, type: "structured_json", duration: "0 ms", status: "Semantic Fail", inspection: "All checks passed", semanticCheck: { score: "90%", result: "Incoherent", desc: "The output references a file 'src/auth/permissions.py' which is not mentioned in the input diff, making it semantically incorrect." }, inputKeys: 3, outputKeys: 1 },
  detect_risk: { step: 3, type: "structured_json", duration: "2128 ms", status: "pass", inspection: "All checks passed", inputKeys: 2, outputKeys: 4 },
  review_code: { step: 4, type: "structured_json", duration: "12444 ms", status: "pass", inspection: "All checks passed", inputKeys: 3, outputKeys: 2 },
  check_tests: { step: 2, type: "structured_json", duration: "0 ms", status: "pass", inspection: "All checks passed", inputKeys: 1, outputKeys: 1 },
  summarize: { step: 5, type: "structured_json", duration: "3671 ms", status: "pass", inspection: "All checks passed", inputKeys: 4, outputKeys: 1 },
};

// ═══════════════════════════════════════
//  Shared helpers
// ═══════════════════════════════════════

const DOT_COLOR = { ok: "var(--signal-ok)", warn: "var(--signal-warn)", fail: "var(--signal-fail)" };

function StepDots({ colors }: { colors: StepColor[] }) {
  return (
    <div className="flex items-center gap-[3px]">
      {colors.map((c, i) => (
        <span key={i} className="w-[7px] h-[7px] rounded-full" style={{ background: DOT_COLOR[c] }} />
      ))}
      <span className="ml-1.5 font-mono text-[11px] text-[var(--text-dim)]">{colors.length}/{colors.length}</span>
    </div>
  );
}

function RunStatusBadge({ status }: { status: "clean" | "silent-failure" }) {
  const isClean = status === "clean";
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-[11px]"
      style={{ color: isClean ? "var(--signal-ok)" : "var(--signal-warn)", background: isClean ? "rgba(0,240,168,0.12)" : "rgba(245,177,60,0.12)" }}
    >
      <span className="w-[6px] h-[6px] rounded-full" style={{ background: isClean ? "var(--signal-ok)" : "var(--signal-warn)" }} />
      {isClean ? "Clean" : "Silent Failure"}
    </span>
  );
}

// ═══════════════════════════════════════
//  Runs Panel
// ═══════════════════════════════════════

function RunsPanel({ onSelectRun }: { onSelectRun: () => void }) {
  const [filter, setFilter] = useState("all");
  const runs = filter === "failed" ? FAILED_RUNS : ALL_RUNS;
  const filters = ["All", "Clean", "Failed", "Semantic", "Interrupted"];

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-[20px] font-medium text-white">Runs</h2>
          <div className="text-[12px] mt-0.5">
            <span className="text-[var(--text-dim)]">549 runs &middot; </span>
            <span className="text-[var(--signal-ok)]">363 clean</span>
            <span className="text-[var(--text-dim)]"> &middot; </span>
            <span className="text-[var(--signal-fail)]">186 failed</span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5">
          <button className="flex items-center gap-1 px-2 py-1 rounded border border-[var(--border)] text-[11px] text-[var(--text-muted)]">
            <Filter size={10} /> Filters
          </button>
          <button className="px-2 py-1 rounded border border-[var(--border)] text-[11px] text-[var(--text-muted)]">Last 1h</button>
          <button className="flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium" style={{ background: "var(--signal-ok)", color: "#000" }}>
            <RefreshCw size={10} /> Refresh
          </button>
        </div>
      </div>

      <div className="flex items-center gap-0.5 mb-3">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f.toLowerCase())}
            className={`px-2.5 py-1 rounded text-[12px] transition-colors ${
              f.toLowerCase() === filter ? "bg-white/10 text-white font-medium" : "text-[var(--text-dim)] hover:text-[var(--text-muted)]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left" style={{ minWidth: 580 }}>
          <thead>
            <tr className="border-b border-[var(--border)]">
              {["RUN", "STATUS", "STEPS", "DURATION", "TOKENS"].map((h) => (
                <th key={h} className="pb-2 pr-3 font-mono text-[9px] tracking-[0.12em] uppercase text-[var(--text-dim)] font-normal">{h}</th>
              ))}
              <th className="pb-2 w-5" />
            </tr>
          </thead>
          <tbody>
            {runs.map((run, i) => (
              <tr
                key={i}
                onClick={run.clickable ? onSelectRun : undefined}
                className={`border-b border-[var(--border)]/40 transition-colors ${
                  run.clickable ? "hover:bg-white/[0.02] cursor-pointer" : "opacity-80"
                }`}
              >
                <td className="py-2.5 pr-3">
                  <div className="text-[12px] text-white">{run.name || run.id}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-[10px] text-[var(--text-dim)]">{run.id}</span>
                    {run.failedNode && <span className="text-[10px] text-[var(--signal-fail)]">{run.failedNode}</span>}
                  </div>
                </td>
                <td className="py-2.5 pr-3"><RunStatusBadge status={run.status} /></td>
                <td className="py-2.5 pr-3"><StepDots colors={run.stepColors} /></td>
                <td className="py-2.5 pr-3">
                  <div className="font-mono text-[13px] font-semibold text-white">{run.duration}</div>
                  <div className="font-mono text-[10px] text-[var(--text-dim)]">{run.ago}</div>
                </td>
                <td className="py-2.5 pr-3 font-mono text-[12px] text-[var(--text-dim)]">&mdash;</td>
                <td className="py-2.5"><ChevronRight size={12} className="text-[var(--text-dim)]" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
//  Run Detail Panel
// ═══════════════════════════════════════

function RunDetailPanel({ onBack }: { onBack: () => void }) {
  const [subTab, setSubTab] = useState<"overview" | "pipeline" | "ai-analysis">("overview");
  const activeTabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "pipeline" as const, label: "Pipeline" },
    { id: "ai-analysis" as const, label: "AI Analysis" },
  ];
  const inactiveTabs = ["Correlations", "State", "Logs"];

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-[12px] text-[var(--text-muted)] hover:text-white mb-2 transition-colors">
        <ArrowLeft size={12} /> All runs
      </button>
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h2 className="text-[18px] font-mono font-semibold text-white">20260613-061921-080f8d</h2>
          <RunStatusBadge status="silent-failure" />
        </div>
        <div className="hidden sm:flex items-center gap-1.5">
          <button className="flex items-center gap-1 px-2 py-1 rounded border border-[var(--border)] text-[10px] text-[var(--text-muted)]">
            <Flag size={9} /> Report Issue
          </button>
          <button className="px-2 py-1 rounded border border-[var(--border)] text-[10px] text-[var(--text-muted)]">Logs</button>
          <button className="flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-medium" style={{ background: "var(--signal-ok)", color: "#000" }}>
            <Play size={9} /> Replay
          </button>
        </div>
      </div>
      <div className="font-mono text-[10px] text-[var(--text-dim)] mb-4">20260613-061 &middot; Argus v0.6.2 &middot; 5 steps &middot; 25089 ms</div>

      <div className="flex items-center gap-0.5 border-b border-[var(--border)] mb-4 overflow-x-auto">
        {activeTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className={`px-2.5 py-2 text-[12px] whitespace-nowrap border-b-2 transition-colors ${
              subTab === t.id ? "border-white text-white" : "border-transparent text-[var(--text-dim)] hover:text-[var(--text-muted)]"
            }`}
          >
            {t.label}
          </button>
        ))}
        {inactiveTabs.map((t) => (
          <span key={t} className="px-2.5 py-2 text-[12px] text-[var(--text-dim)]/40 whitespace-nowrap border-b-2 border-transparent">{t}</span>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={subTab} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.12 }}>
          {subTab === "overview" && <RunOverview />}
          {subTab === "pipeline" && <RunPipeline />}
          {subTab === "ai-analysis" && <RunAIAnalysis />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function RunOverview() {
  const [selectedNode, setSelectedNode] = useState<string | null>("parse_diff");
  const inspectorData = selectedNode ? NODE_INSPECTOR_DATA[selectedNode] : null;

  return (
    <div className="space-y-5">
      {/* Execution Graph */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium text-white">Execution Graph</span>
            <span className="px-1.5 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--border)] font-mono text-[9px] text-[var(--text-dim)]">5 nodes</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[9px] text-[var(--text-dim)]">
            {[
              { label: "Succeeded", color: "var(--signal-ok)" },
              { label: "Running", color: "#6366f1" },
              { label: "Failed", color: "var(--signal-fail)" },
              { label: "Skipped", color: "var(--text-dim)" },
            ].map((l) => (
              <span key={l.label} className="flex items-center gap-1">
                <span className="w-[6px] h-[6px] rounded-full" style={{ background: l.color }} />
                {l.label}
              </span>
            ))}
            <Maximize2 size={10} className="text-[var(--text-dim)] ml-1" />
          </div>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-2 overflow-hidden">
          <PipelineGraph nodes={OVERVIEW_NODES} edges={OVERVIEW_EDGES} selectedNode={selectedNode} onSelectNode={setSelectedNode} />
        </div>
      </div>

      {/* AI Analysis summary card */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles size={13} style={{ color: "var(--signal-warn)" }} />
            <span className="text-[13px] font-medium" style={{ color: "var(--signal-ok)" }}>AI Analysis</span>
          </div>
          <span className="px-2 py-0.5 rounded border text-[10px] font-mono" style={{ borderColor: "var(--signal-warn)", color: "var(--signal-warn)" }}>65%</span>
        </div>
        <div className="text-[12px] text-[var(--text-muted)]">
          Root cause: <span className="font-mono text-[var(--signal-fail)]">parse_diff</span> (step 1)
        </div>
        <p className="mt-1.5 text-[11px] leading-[1.6] text-[var(--text-dim)]">
          The &apos;parse_diff&apos; node experienced a semantic failure due to structural malformation in its output, which was detected as...
        </p>
        <button className="mt-2 text-[11px] flex items-center gap-1" style={{ color: "var(--signal-ok)" }}>
          View Full Analysis <ChevronRight size={10} />
        </button>
      </div>

      {/* Stats row */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] overflow-hidden">
        <div className="grid grid-cols-3 sm:grid-cols-6 divide-x divide-[var(--border)]">
          {[
            { label: "DURATION", value: "25089 ms", valueClass: "text-white" },
            { label: "STEPS", value: "5/5", valueClass: "text-[var(--signal-ok)]" },
            { label: "TOKENS", value: "\u2014", valueClass: "text-[var(--text-dim)]" },
            { label: "COST", value: "\u2014", valueClass: "text-[var(--text-dim)]" },
            { label: "VERSION", value: "v0.6.2", extra: "argus", valueClass: "text-white" },
            { label: "STARTED", value: "11:49:21", extra: "4d ago", valueClass: "text-white" },
          ].map((s) => (
            <div key={s.label} className="px-3 py-3">
              <div className="font-mono text-[8px] tracking-[0.14em] uppercase text-[var(--text-dim)]">{s.label}</div>
              <div className={`text-[14px] font-semibold mt-0.5 ${s.valueClass}`}>
                {s.value}
                {s.extra && <span className="text-[10px] font-normal text-[var(--text-dim)] ml-1">{s.extra}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Node Inspector */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4">
        <div className="flex items-center gap-2 mb-4 text-[12px] text-[var(--text-dim)]">
          <span className="w-4 h-4 rounded-full border border-[var(--border)] flex items-center justify-center text-[8px]">i</span>
          Node Inspector
        </div>

        {inspectorData && selectedNode && (
          <div>
            {/* Node header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-mono text-[16px] font-semibold text-white">{selectedNode}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-[var(--text-dim)]">Step {inspectorData.step}</span>
                  <span className="px-1.5 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--border)] font-mono text-[9px] text-[var(--accent-soft)]">{inspectorData.type}</span>
                  <span className="text-[11px] text-[var(--text-dim)]">Duration <span className="text-white font-mono">{inspectorData.duration}</span></span>
                </div>
              </div>
              {inspectorData.status === "Semantic Fail" && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-[11px]" style={{ color: "var(--signal-fail)", background: "rgba(255,90,106,0.1)" }}>
                  <span className="w-[6px] h-[6px] rounded-full" style={{ background: "var(--signal-warn)" }} />
                  Semantic Fail
                </span>
              )}
            </div>

            {/* Inspection */}
            <div className="mb-3">
              <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-dim)] uppercase tracking-wider mb-1">
                <AlertTriangle size={10} /> INSPECTION
              </div>
              <div className="text-[12px] text-white">{inspectorData.inspection}</div>
            </div>

            {/* Semantic Check (only for parse_diff) */}
            {inspectorData.semanticCheck && (
              <div className="mb-4">
                <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-dim)] uppercase tracking-wider mb-1.5">
                  <span className="w-3 h-3 rounded-full border border-[var(--border)] flex items-center justify-center text-[7px]">i</span>
                  SEMANTIC CHECK
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <X size={11} className="text-[var(--signal-fail)]" />
                  <span className="text-[12px] font-semibold text-white">{inspectorData.semanticCheck.result}</span>
                  <span className="text-[11px] text-[var(--text-dim)]">{inspectorData.semanticCheck.score}</span>
                </div>
                <p className="text-[11px] leading-[1.6] text-[var(--text-muted)]">{inspectorData.semanticCheck.desc}</p>
              </div>
            )}

            {/* Collapsible sections */}
            <div className="space-y-1 mt-3">
              <div className="flex items-center gap-2 text-[12px] text-[var(--text-muted)] py-1.5">
                <ChevronRight size={10} className="text-[var(--text-dim)]" />
                Input State <span className="text-[10px] text-[var(--text-dim)]">{inspectorData.inputKeys} keys</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-[var(--text-muted)] py-1.5">
                <ChevronRight size={10} className="text-[var(--text-dim)]" />
                Output <span className="text-[10px] text-[var(--text-dim)]">{inspectorData.outputKeys} keys</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rerun Branches */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[14px] font-semibold text-white">Rerun Branches</span>
          <button className="flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-medium" style={{ background: "var(--accent)", color: "white" }}>
            + Rerun
          </button>
        </div>
        <div className="flex items-center justify-between py-2.5 border-b border-[var(--border)]/50">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--signal-warn)" }} />
            <span className="text-[12px] font-medium text-white">Original Run</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono" style={{ color: "var(--signal-fail)", background: "rgba(255,90,106,0.1)" }}>failed</span>
          </div>
          <span className="font-mono text-[10px] text-[var(--text-dim)]">5 steps &middot; 25089 ms</span>
        </div>
        <div className="text-center py-4 text-[11px] text-[var(--text-dim)]">No reruns yet</div>
      </div>
    </div>
  );
}

// Replay animation sequence order
const REPLAY_ORDER = ["parse_diff", "check_tests", "detect_risk", "review_code", "summarize"];
const REPLAY_DURATIONS = { parse_diff: "412 ms", check_tests: "0 ms", detect_risk: "1891 ms", review_code: "13102 ms", summarize: "4210 ms" };

// Successful rerun nodes (all green)
const RERUN_NODES: GNode[] = [
  { id: "parse_diff", label: "parse_diff", icon: FileText, status: "succeeded", durationMs: 412, col: 0, row: 1 },
  { id: "detect_risk", label: "detect_risk", icon: Search, status: "succeeded", durationMs: 1891, col: 1, row: 0 },
  { id: "review_code", label: "review_code", icon: Sparkles, status: "succeeded", durationMs: 13102, col: 1, row: 1 },
  { id: "check_tests", label: "check_tests", icon: Shield, status: "succeeded", durationMs: 0, col: 1, row: 2 },
  { id: "summarize", label: "summarize", icon: Sparkles, status: "succeeded", durationMs: 4210, col: 2, row: 0 },
];

const RERUN_INSPECTOR_DATA: Record<string, { step: number; type: string; duration: string; status: string; inspection: string; inputKeys: number; outputKeys: number }> = {
  parse_diff: { step: 1, type: "structured_json", duration: "412 ms", status: "pass", inspection: "All checks passed", inputKeys: 3, outputKeys: 2 },
  detect_risk: { step: 3, type: "structured_json", duration: "1891 ms", status: "pass", inspection: "All checks passed", inputKeys: 2, outputKeys: 4 },
  review_code: { step: 4, type: "structured_json", duration: "13102 ms", status: "pass", inspection: "All checks passed", inputKeys: 3, outputKeys: 2 },
  check_tests: { step: 2, type: "structured_json", duration: "0 ms", status: "pass", inspection: "All checks passed", inputKeys: 1, outputKeys: 1 },
  summarize: { step: 5, type: "structured_json", duration: "4210 ms", status: "pass", inspection: "All checks passed", inputKeys: 4, outputKeys: 1 },
};

const RERUN_PIPELINE_STEPS = [
  { num: "01", name: "parse_diff", type: "structured_json", duration: "412 ms", status: "ok" as const },
  { num: "02", name: "check_tests", type: "structured_json", duration: "0 ms", status: "ok" as const },
  { num: "03", name: "detect_risk", type: "structured_json", duration: "1891 ms", status: "ok" as const },
  { num: "04", name: "review_code", type: "structured_json", duration: "13102 ms", status: "ok" as const },
  { num: "05", name: "summarize", type: "structured_json", duration: "4210 ms", status: "ok" as const },
];

type ReplayPhase = "idle" | "animating" | "done";

function RunPipeline() {
  const [replayPhase, setReplayPhase] = useState<ReplayPhase>("idle");
  const [animatingIdx, setAnimatingIdx] = useState(-1);
  const [completedNodes, setCompletedNodes] = useState<Set<string>>(new Set());
  const [rerunSelectedNode, setRerunSelectedNode] = useState<string | null>("parse_diff");

  const startReplay = useCallback(() => {
    setReplayPhase("animating");
    setAnimatingIdx(0);
    setCompletedNodes(new Set());
  }, []);

  useEffect(() => {
    if (replayPhase !== "animating" || animatingIdx < 0) return;
    if (animatingIdx >= REPLAY_ORDER.length) {
      // All done — transition to completed view
      const timer = setTimeout(() => setReplayPhase("done"), 400);
      return () => clearTimeout(timer);
    }
    // Animate current node: show "running" for 500ms then mark completed
    const timer = setTimeout(() => {
      setCompletedNodes((prev) => new Set([...prev, REPLAY_ORDER[animatingIdx]]));
      setAnimatingIdx((i) => i + 1);
    }, 600);
    return () => clearTimeout(timer);
  }, [replayPhase, animatingIdx]);

  // During animation, build dynamic node statuses
  const getAnimatingNodes = (): GNode[] => {
    return OVERVIEW_NODES.map((n) => {
      if (completedNodes.has(n.id)) {
        return { ...n, status: "succeeded" as NodeStatus, durationMs: (REPLAY_DURATIONS as Record<string, string>)[n.id] ? parseInt((REPLAY_DURATIONS as Record<string, string>)[n.id]) || 0 : n.durationMs };
      }
      if (animatingIdx >= 0 && animatingIdx < REPLAY_ORDER.length && REPLAY_ORDER[animatingIdx] === n.id) {
        return { ...n, status: "running" as NodeStatus };
      }
      return { ...n, status: "pending" as NodeStatus, durationMs: 0 };
    });
  };

  // ── DONE phase: show successful rerun view ──
  if (replayPhase === "done") {
    const inspectorData = rerunSelectedNode ? RERUN_INSPECTOR_DATA[rerunSelectedNode] : null;
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
        {/* Rerun header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--signal-ok)" }} />
            <span className="text-[14px] font-semibold text-white">Rerun Successful</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono" style={{ color: "var(--signal-ok)", background: "rgba(0,240,168,0.1)" }}>all passed</span>
          </div>
          <button onClick={() => { setReplayPhase("idle"); setAnimatingIdx(-1); setCompletedNodes(new Set()); }} className="flex items-center gap-1 px-2 py-1 rounded border border-[var(--border)] text-[10px] text-[var(--text-muted)]">
            <ArrowLeft size={9} /> Back to original
          </button>
        </div>
        <div className="font-mono text-[10px] text-[var(--text-dim)]">20260613-071204-a3c1f9 · Argus v0.6.2 · 5 steps · 19615 ms · rerun from parse_diff</div>

        {/* All-green pipeline graph */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[13px] font-medium text-white">Execution Graph</span>
            <span className="px-1.5 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--border)] font-mono text-[9px] text-[var(--text-dim)]">5 nodes</span>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-2 overflow-hidden">
            <PipelineGraph nodes={RERUN_NODES} edges={OVERVIEW_EDGES} selectedNode={rerunSelectedNode} onSelectNode={setRerunSelectedNode} />
          </div>
        </div>

        {/* Node Inspector for rerun */}
        {inspectorData && rerunSelectedNode && (
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4">
            <div className="flex items-center gap-2 mb-4 text-[12px] text-[var(--text-dim)]">
              <span className="w-4 h-4 rounded-full border border-[var(--border)] flex items-center justify-center text-[8px]">i</span>
              Node Inspector
            </div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-mono text-[16px] font-semibold text-white">{rerunSelectedNode}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-[var(--text-dim)]">Step {inspectorData.step}</span>
                  <span className="px-1.5 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--border)] font-mono text-[9px] text-[var(--accent-soft)]">{inspectorData.type}</span>
                  <span className="text-[11px] text-[var(--text-dim)]">Duration <span className="text-white font-mono">{inspectorData.duration}</span></span>
                </div>
              </div>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-[11px]" style={{ color: "var(--signal-ok)", background: "rgba(0,240,168,0.1)" }}>
                <Check size={9} /> Pass
              </span>
            </div>
            <div className="mb-3">
              <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-dim)] uppercase tracking-wider mb-1">
                <Check size={10} className="text-[var(--signal-ok)]" /> INSPECTION
              </div>
              <div className="text-[12px] text-white">{inspectorData.inspection}</div>
            </div>
            <div className="space-y-1 mt-3">
              <div className="flex items-center gap-2 text-[12px] text-[var(--text-muted)] py-1.5">
                <ChevronRight size={10} className="text-[var(--text-dim)]" />
                Input State <span className="text-[10px] text-[var(--text-dim)]">{inspectorData.inputKeys} keys</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-[var(--text-muted)] py-1.5">
                <ChevronRight size={10} className="text-[var(--text-dim)]" />
                Output <span className="text-[10px] text-[var(--text-dim)]">{inspectorData.outputKeys} keys</span>
              </div>
            </div>
          </div>
        )}

        {/* Rerun step list (all passing) */}
        <div className="space-y-2">
          {RERUN_PIPELINE_STEPS.map((step) => (
            <div key={step.num} className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[11px] text-[var(--text-dim)]">{step.num}</span>
                  <span className="font-mono text-[13px] font-semibold text-white">{step.name}</span>
                  <span className="px-1.5 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--border)] font-mono text-[9px] text-[var(--text-dim)]">{step.type}</span>
                  <span className="font-mono text-[10px] text-[var(--text-dim)]">{step.duration}</span>
                </div>
                <span className="flex items-center gap-1 text-[10px] text-[var(--signal-ok)]"><Check size={10} /> pass</span>
              </div>
              {step.num === "01" && (
                <div className="mt-2 pt-2 border-t border-[var(--border)]/50 flex items-center gap-2 text-[10px] text-[var(--text-dim)]">
                  <span className="px-1.5 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--border)] font-mono text-[9px]">PARALLEL</span>
                  check_tests · detect_risk · review_code
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  // ── ANIMATING phase: show live pipeline progress ──
  if (replayPhase === "animating") {
    const animNodes = getAnimatingNodes();
    const currentNodeName = animatingIdx >= 0 && animatingIdx < REPLAY_ORDER.length ? REPLAY_ORDER[animatingIdx] : null;
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: "var(--accent)" }} />
          <span className="text-[14px] font-semibold text-white">Rerunning pipeline...</span>
          <span className="font-mono text-[10px] text-[var(--text-dim)]">{completedNodes.size}/{REPLAY_ORDER.length} nodes</span>
        </div>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-2 overflow-hidden">
          <PipelineGraph nodes={animNodes} edges={OVERVIEW_EDGES} />
        </div>

        {/* Live step progress */}
        <div className="space-y-1.5">
          {REPLAY_ORDER.map((nodeId, i) => {
            const isDone = completedNodes.has(nodeId);
            const isRunning = currentNodeName === nodeId;
            return (
              <motion.div
                key={nodeId}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: isDone || isRunning ? 1 : 0.4 }}
                className="flex items-center gap-3 rounded-lg border bg-[var(--bg)] px-4 py-2.5"
                style={{ borderColor: isRunning ? "var(--accent)" : isDone ? "rgba(0,240,168,0.2)" : "var(--border)" }}
              >
                <span className="font-mono text-[11px] text-[var(--text-dim)] w-5">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-mono text-[12px] text-white flex-1">{nodeId}</span>
                {isDone && <span className="flex items-center gap-1 text-[10px] text-[var(--signal-ok)]"><Check size={10} /> pass</span>}
                {isRunning && (
                  <span className="flex items-center gap-1 text-[10px] text-[var(--accent)]">
                    <RefreshCw size={10} className="animate-spin" /> running
                  </span>
                )}
                {!isDone && !isRunning && <span className="text-[10px] text-[var(--text-dim)]">queued</span>}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // ── IDLE phase: original pipeline view ──
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4">
        <div className="text-[10px] text-[var(--text-dim)] mb-2">execution tree</div>
        <pre className="font-mono text-[11px] text-[var(--text-muted)] leading-[1.7]">{`parse_diff
  \u251C\u2500 detect_risk \u2500\u2500\u2510
  \u251C\u2500 review_code \u2500\u2500\u253C\u2500\u2500 summarize
  \u2514\u2500 check_tests \u2500\u2500\u2518`}</pre>
      </div>

      <div className="space-y-2">
        {PIPELINE_STEPS.map((step) => (
          <div key={step.num} className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[11px] text-[var(--text-dim)]">{step.num}</span>
                <span className="font-mono text-[13px] font-semibold text-white">{step.name}</span>
                <span className="px-1.5 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--border)] font-mono text-[9px] text-[var(--text-dim)]">{step.type}</span>
                <span className="font-mono text-[10px] text-[var(--text-dim)]">{step.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                {step.status === "fail" ? (
                  <span className="flex items-center gap-1 text-[10px] text-[var(--signal-fail)]"><AlertTriangle size={10} /> semantic fail</span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] text-[var(--signal-ok)]"><Check size={10} /> pass</span>
                )}
              </div>
            </div>
            {step.isRootCause && (
              <div className="mt-2 space-y-2">
                <span className="text-[10px] font-mono font-semibold text-[var(--signal-fail)]">root cause</span>
                <p className="text-[11px] text-[var(--text-muted)] leading-[1.6]">{step.error}</p>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 px-2 py-1 rounded border border-[var(--border)] text-[10px] text-[var(--text-muted)]">
                    <RotateCcw size={9} /> Rerun Node
                  </button>
                  <button onClick={startReplay} className="flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-medium" style={{ background: "var(--signal-ok)", color: "#000" }}>
                    <Play size={9} /> Rerun From Here
                  </button>
                </div>
              </div>
            )}
            {step.num === "01" && (
              <div className="mt-2 pt-2 border-t border-[var(--border)]/50 flex items-center gap-2 text-[10px] text-[var(--text-dim)]">
                <span className="px-1.5 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--border)] font-mono text-[9px]">PARALLEL</span>
                check_tests &middot; detect_risk &middot; review_code
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function RunAIAnalysis() {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 rounded-full" style={{ background: "var(--accent)" }} />
          <span className="text-[15px] font-medium text-white">AI Analysis</span>
        </div>
        <span className="px-2.5 py-1 rounded border text-[11px] font-mono" style={{ borderColor: "var(--signal-warn)", color: "var(--signal-warn)" }}>65% confidence</span>
      </div>
      <div className="space-y-4">
        <div>
          <div className="text-[12px] text-[var(--text-dim)] mb-1">Root Cause Node:</div>
          <span className="px-2 py-0.5 rounded font-mono text-[11px]" style={{ background: "rgba(255,90,106,0.12)", color: "var(--signal-fail)" }}>parse_diff</span>
        </div>
        <div>
          <div className="text-[12px] text-[var(--text-dim)] mb-1.5">Root Cause Reason:</div>
          <p className="text-[12px] leading-[1.7] text-[var(--text-muted)]">
            The &apos;parse_diff&apos; node experienced a semantic failure due to structural malformation in its output, which was detected as a behavioral anomaly. This node was responsible for parsing file differences, but the output contained malformed JSON structures, leading to a semantic failure. The &apos;check_tests&apos;, &apos;detect_risk&apos;, &apos;review_code&apos;, and &apos;summarize&apos; nodes all passed but exhibited structural malformations in their outputs, which were consistent with the anomaly pattern BA-005.
          </p>
        </div>
        <div>
          <div className="text-[12px] text-[var(--text-dim)] mb-1.5">What Happened:</div>
          <p className="text-[12px] leading-[1.7] text-[var(--text-muted)]">
            The pipeline experienced a semantic failure at the &apos;parse_diff&apos; node due to structural malformation in its JSON output, which was flagged as a behavioral anomaly. Despite this, downstream nodes completed their tasks but exhibited similar structural malformations, indicating a systemic issue rather than a propagation from &apos;parse_diff&apos;.
          </p>
        </div>
        <div>
          <div className="text-[12px] text-[var(--text-dim)] mb-2">Suggested Fixes:</div>
          <div className="flex items-start gap-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] p-3">
            <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px] font-mono font-semibold" style={{ background: "var(--accent)", color: "white" }}>1</span>
            <div>
              <div className="text-[12px] text-white">
                <span className="font-mono px-1.5 py-0.5 rounded bg-[var(--bg)] border border-[var(--border)] text-[10px] text-[var(--text-muted)] mr-1.5">parse_diff</span>
                Fix <span className="px-1 py-0.5 rounded text-[10px] font-mono" style={{ background: "rgba(245,177,60,0.15)", color: "var(--signal-warn)" }}>JSON</span> structure malformation in output.
              </div>
              <p className="text-[11px] text-[var(--text-dim)] mt-1">
                Ensuring correct <span className="px-1 py-0.5 rounded text-[10px] font-mono" style={{ background: "rgba(245,177,60,0.15)", color: "var(--signal-warn)" }}>JSON</span> structure will prevent semantic failures.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
//  Compare Panel (full page, no mask)
// ═══════════════════════════════════════

function ComparePanel() {
  return (
    <div>
      <div className="flex items-start justify-between mb-1">
        <div>
          <h2 className="text-[20px] font-medium text-white">Compare Runs</h2>
          <p className="text-[12px] text-[var(--text-dim)] mt-0.5">Side-by-side comparison of pipeline executions</p>
        </div>
        <button className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-medium" style={{ background: "var(--signal-ok)", color: "#000" }}>
          + Rerun from diff
        </button>
      </div>

      {/* Run selectors */}
      <div className="flex items-center gap-2 my-4 flex-wrap">
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-[var(--border)] bg-[var(--bg)]">
          <span className="w-2 h-2 rounded-sm" style={{ background: "var(--signal-warn)" }} />
          <span className="text-[11px] text-white font-mono">testingv</span>
          <span className="text-[10px] text-[var(--text-dim)] font-mono">20260613</span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono" style={{ color: "var(--signal-warn)", background: "rgba(245,177,60,0.1)" }}>silent failure</span>
        </div>
        <span className="text-[12px] text-[var(--text-dim)]">vs</span>
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-[var(--border)] bg-[var(--bg)]">
          <span className="w-2 h-2 rounded-sm" style={{ background: "var(--signal-ok)" }} />
          <span className="text-[11px] text-white font-mono">20260613-082958</span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono" style={{ color: "var(--signal-ok)", background: "rgba(0,240,168,0.1)" }}>rerun (fixed all)</span>
        </div>
      </div>

      {/* Overview sub-tabs */}
      <div className="flex items-center gap-0.5 border-b border-[var(--border)] mb-4 overflow-x-auto">
        {["Overview", "Node Comparison", "Diff View", "Metrics", "AI Analysis", "Execution Timeline", "Logs Comparison"].map((t, i) => (
          <span key={t} className={`px-2.5 py-2 text-[11px] whitespace-nowrap border-b-2 ${i === 0 ? "border-white text-white" : "border-transparent text-[var(--text-dim)]/60"}`}>
            {i > 0 && <span className="mr-1 opacity-40">{["", "\u2261", "\u2194", "\u2193", "\u2726", "\u23f1", "\u2263"][i]}</span>}
            {t}
          </span>
        ))}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-5">
        {[
          { label: "Overall Status", value: "Improved", sub: "\u2191 1 issue resolved", color: "var(--signal-ok)" },
          { label: "Nodes Improved", value: "1 / 5", sub: "\u2191 +20%", color: "var(--signal-ok)" },
          { label: "Failures", value: "3 \u2192 0", sub: "\u2191 -100%", color: "var(--signal-ok)" },
          { label: "Pass Rate", value: "40% \u2192 100%", sub: "\u2191 +60%", color: "var(--signal-ok)" },
          { label: "Duration", value: "20.81s \u2192 26.24s", sub: "\u2193 -26.1%", color: "var(--signal-fail)" },
          { label: "Confidence", value: "90% \u2192 0%", sub: "\u2193 -90%", color: "var(--signal-fail)" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3">
            <div className="text-[9px] text-[var(--text-dim)] uppercase tracking-wider">{s.label}</div>
            <div className="text-[13px] font-semibold text-white mt-1">{s.value}</div>
            <div className="text-[10px] mt-0.5" style={{ color: s.color }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Side-by-side graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 mb-5">
        {/* Left: graphs stacked */}
        <div className="space-y-4">
          {/* Base Run graph */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full" style={{ background: "var(--signal-fail)" }} />
              <span className="text-[12px] font-medium text-white">Base Run</span>
              <span className="font-mono text-[10px] text-[var(--text-dim)]">20260613-082</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[var(--text-muted)]">Execution Graph</span>
                <span className="px-1.5 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--border)] font-mono text-[9px] text-[var(--text-dim)]">5 nodes</span>
              </div>
              <div className="flex items-center gap-3 text-[8px] text-[var(--text-dim)]">
                {[{ l: "Succeeded", c: "var(--signal-ok)" }, { l: "Running", c: "#6366f1" }, { l: "Failed", c: "var(--signal-fail)" }, { l: "Skipped", c: "var(--text-dim)" }].map((x) => (
                  <span key={x.l} className="flex items-center gap-1"><span className="w-[5px] h-[5px] rounded-full" style={{ background: x.c }} />{x.l}</span>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-2 overflow-hidden">
              <PipelineGraph nodes={COMPARE_BASE_NODES} edges={GRAPH_EDGES} compact />
            </div>
          </div>

          {/* Replay graph */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full" style={{ background: "var(--signal-ok)" }} />
              <span className="text-[12px] font-medium text-white">Replay 1</span>
              <span className="font-mono text-[10px] text-[var(--text-dim)]">20260613-082</span>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-2 overflow-hidden">
              <PipelineGraph nodes={COMPARE_REPLAY_NODES} edges={GRAPH_EDGES} compact />
            </div>
          </div>
        </div>

        {/* Right: Key Changes Summary */}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4 lg:w-[280px]">
          <div className="text-[13px] font-medium text-white mb-3">Key Changes Summary</div>
          <div className="space-y-2">
            {[
              { node: "parse_diff", change: "No significant change", icon: <Minus size={9} className="text-[var(--text-dim)]" /> },
              { node: "check_tests", change: "No significant change", icon: <Minus size={9} className="text-[var(--text-dim)]" /> },
              { node: "detect_risk", change: "Missing required field \"risk_flags\" fixed", icon: <Check size={9} className="text-[var(--signal-ok)]" /> },
              { node: "review_code", change: "Response quality improved", icon: <Check size={9} className="text-[var(--signal-ok)]" /> },
              { node: "summarize", change: "Response quality improved", icon: <Check size={9} className="text-[var(--signal-ok)]" /> },
            ].map((c) => (
              <div key={c.node} className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0">{c.icon}</span>
                <div>
                  <span className="text-[11px] font-semibold text-white">{c.node}:</span>{" "}
                  <span className="text-[11px] text-[var(--text-muted)]">{c.change}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Change Impact donut */}
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <div className="text-[12px] font-medium text-white mb-2">Change Impact</div>
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14">
                <svg viewBox="0 0 36 36" className="w-14 h-14 -rotate-90">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="var(--surface-2)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15" fill="none" stroke="var(--signal-ok)" strokeWidth="3" strokeDasharray="18.85 75.4" strokeLinecap="round" />
                  <circle cx="18" cy="18" r="15" fill="none" stroke="var(--text-dim)" strokeWidth="3" strokeDasharray="37.7 56.55" strokeDashoffset="-18.85" strokeLinecap="round" />
                  <circle cx="18" cy="18" r="15" fill="none" stroke="var(--signal-fail)" strokeWidth="3" strokeDasharray="37.7 56.55" strokeDashoffset="-56.55" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-semibold text-white">40%</span>
                </div>
              </div>
              <div className="space-y-1">
                {[
                  { label: "Positive", pct: "20%", color: "var(--signal-ok)" },
                  { label: "No Change", pct: "40%", color: "var(--text-dim)" },
                  { label: "Negative", pct: "40%", color: "var(--signal-fail)" },
                ].map((d) => (
                  <div key={d.label} className="flex items-center gap-1.5 text-[10px]">
                    <span className="w-[6px] h-[6px] rounded-full" style={{ background: d.color }} />
                    <span className="text-[var(--text-muted)]">{d.label}</span>
                    <span className="text-white font-mono">{d.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Node Comparison table */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4 overflow-x-auto">
        <div className="text-[13px] font-medium text-white mb-3">Node Comparison</div>
        <table className="w-full text-left" style={{ minWidth: 520 }}>
          <thead>
            <tr className="border-b border-[var(--border)]">
              {["Node", "Base", "Replay", "Change", "Impact"].map((h) => (
                <th key={h} className="pb-2 pr-3 font-mono text-[9px] tracking-[0.1em] uppercase text-[var(--text-dim)] font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARE_TABLE.map((n) => (
              <tr key={n.num} className="border-b border-[var(--border)]/40">
                <td className="py-2 pr-3">
                  <span className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-[var(--text-dim)]">{n.num}</span>
                    <span className="font-mono text-[11px] text-white">{n.name}</span>
                    {n.impactType === "ok" ? <Check size={10} className="text-[var(--signal-ok)]" /> : n.impactType === "warn" ? <AlertTriangle size={10} className="text-[var(--signal-warn)]" /> : null}
                  </span>
                </td>
                <td className="py-2 pr-3">
                  <span className="font-mono text-[10px] text-[var(--text-muted)]">{n.baseMs} ms</span>{" "}
                  <span className={`text-[9px] font-mono ${n.baseStatus === "Fail" ? "text-[var(--signal-fail)]" : n.baseStatus === "degraded_input" ? "text-[var(--signal-warn)]" : "text-[var(--signal-ok)]"}`}>{n.baseStatus}</span>
                </td>
                <td className="py-2 pr-3">
                  <span className="font-mono text-[10px] text-[var(--text-muted)]">{n.replayMs} ms</span>{" "}
                  <span className="text-[9px] font-mono text-[var(--signal-ok)]">{n.replayStatus}</span>
                </td>
                <td className="py-2 pr-3 font-mono text-[10px] text-[var(--text-muted)]">{n.change}</td>
                <td className="py-2 font-mono text-[10px]" style={{ color: n.impactType === "ok" ? "var(--signal-ok)" : n.impactType === "warn" ? "var(--signal-warn)" : "var(--text-dim)" }}>{n.impact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
//  Approvals Panel
// ═══════════════════════════════════════

function ApprovalsPanel() {
  const [action, setAction] = useState<"none" | "shared" | "private">("none");

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <h2 className="text-[20px] font-medium text-white">Approvals</h2>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono" style={{ background: "rgba(0,240,168,0.12)", color: "var(--signal-ok)" }}>{action === "none" ? "1 pending" : "0 pending"}</span>
      </div>
      <p className="text-[12px] text-[var(--text-dim)] mb-4">Review AI-discovered patterns and manage your active detection library.</p>

      <div className="flex items-center gap-0.5 border-b border-[var(--border)] mb-4">
        {[
          { label: "Pending", count: action === "none" ? 1 : 0, active: true },
          { label: "Feedback", count: 12 },
          { label: "Private", count: action === "private" ? 2 : 1 },
          { label: "Shared", count: action === "shared" ? 9 : 8 },
        ].map((t) => (
          <button
            key={t.label}
            className={`px-3 py-2 text-[12px] border-b-2 transition-colors ${
              "active" in t && t.active ? "border-white text-white" : "border-transparent text-[var(--text-dim)]"
            }`}
          >
            {t.label} <span className="ml-1 text-[10px] text-[var(--text-dim)]">{t.count}</span>
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-5 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {action !== "none" ? (
            <motion.div key="confirmed" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }}>
              <div className="flex flex-col items-center text-center py-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ background: action === "shared" ? "rgba(0,240,168,0.12)" : "rgba(109,92,255,0.12)" }}>
                  {action === "shared" ? <Check size={18} style={{ color: "var(--signal-ok)" }} /> : <Shield size={18} style={{ color: "var(--accent-soft)" }} />}
                </div>
                <div className="text-[14px] font-semibold text-white mb-1">
                  {action === "shared" ? "Synced with all members" : "Saved as private"}
                </div>
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono" style={{ background: action === "shared" ? "rgba(0,240,168,0.1)" : "rgba(109,92,255,0.1)", color: action === "shared" ? "var(--signal-ok)" : "var(--accent-soft)" }}>
                    {action === "shared" ? "shared" : "private"}
                  </span>
                  <span className="font-mono text-[11px] text-[var(--text-muted)]">systemic truncation</span>
                </div>
                <p className="text-[11px] text-[var(--text-dim)] leading-[1.6] max-w-[300px]">
                  {action === "shared"
                    ? "This detection is now active for all team members. Approvals like this help Argus learn and improve its detection accuracy over time."
                    : "Only you will see this detection. Private approvals still help Argus learn your preferences and refine future suggestions."}
                </p>
                <button onClick={() => setAction("none")} className="mt-4 text-[11px] text-[var(--accent-soft)] hover:text-white transition-colors">
                  Undo
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold" style={{ background: "rgba(245,177,60,0.15)", color: "var(--signal-warn)" }}>WARNING</span>
                  <span className="px-2 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--border)] text-[9px] font-mono text-[var(--text-dim)]">contains_ci</span>
                  <span className="px-2 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--border)] text-[9px] font-mono text-[var(--text-dim)]">systemic_truncation</span>
                </div>
                <span className="text-[10px] text-[var(--text-dim)]">1x seen &middot; 2d ago</span>
              </div>
              <div className="rounded-lg bg-[var(--surface-2)] border border-[var(--border)] px-4 py-3 mb-3">
                <span className="font-mono text-[14px] text-white">systemic truncation</span>
              </div>
              <p className="text-[12px] text-[var(--text-muted)] mb-4">Detects systemic truncation of outputs across nodes.</p>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[11px] text-[var(--text-dim)]">Confidence</span>
                <div className="flex-1 h-2 rounded-full bg-[var(--surface-2)] overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: "80%", background: "linear-gradient(90deg, var(--signal-ok), #4ade80)" }} />
                </div>
                <span className="text-[11px] font-mono text-white">80%</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button className="text-[11px] text-[var(--accent-soft)] hover:text-white transition-colors">Show details</button>
                <div className="flex-1" />
                <button className="px-3 py-1.5 rounded border border-[var(--border)] text-[11px] text-[var(--text-muted)]">Reject</button>
                <button onClick={() => setAction("private")} className="px-3 py-1.5 rounded border border-[var(--border)] text-[11px] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-white transition-colors">Private</button>
                <button onClick={() => setAction("shared")} className="px-3 py-1.5 rounded text-[11px] font-medium" style={{ background: "var(--signal-ok)", color: "#000" }}>Shared</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
//  Main Component — NO gradient mask
// ═══════════════════════════════════════

export function TrialUI() {
  const [page, setPage] = useState<PageId>("runs");
  const activeNavId = page === "run-detail" ? "runs" : page;

  const mobilePages: { id: PageId; label: string }[] = [
    { id: "runs", label: "Runs" },
    { id: "compare", label: "Compare" },
    { id: "approvals", label: "Approvals" },
  ];

  return (
    <div className="trial-ui relative rounded-xl border border-[var(--border)] overflow-hidden shadow-2xl shadow-black/40" style={{ height: 720 }}>
      <div className="flex h-full bg-[var(--bg-soft)]">
        {/* ── Sidebar (desktop) — fixed, does not scroll with content ── */}
        <div className="hidden md:flex flex-col w-[190px] shrink-0 border-r border-[var(--border)] bg-[var(--bg)] overflow-y-auto">
          <div className="px-3 pt-3 pb-2 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <div className="live-dot" style={{ width: 8, height: 8 }} />
              <div>
                <div className="text-[13px] font-semibold text-white leading-tight">ARGUS</div>
                <div className="text-[9px] text-[var(--text-dim)]">Production</div>
              </div>
            </div>
          </div>
          <div className="px-2 pt-2 pb-1">
            <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md border border-[var(--border)] bg-[var(--surface-2)]">
              <Search size={11} className="text-[var(--text-dim)]" />
              <span className="text-[10px] text-[var(--text-dim)] flex-1">Search runs...</span>
              <span className="text-[9px] text-[var(--text-dim)] border border-[var(--border)] rounded px-1">/</span>
            </div>
          </div>
          <nav className="flex-1 py-1 px-1.5 overflow-y-auto">
            {SECTIONS.map((section) => (
              <div key={section.label} className="mt-2 mb-1">
                <div className="px-2 py-1 text-[9px] tracking-[0.14em] uppercase text-[var(--text-dim)] font-medium">{section.label}</div>
                {section.items.map((item) => {
                  const isActive = activeNavId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => !item.soon && item.page && setPage(item.page)}
                      disabled={item.soon}
                      className={`w-full flex items-center justify-between gap-2 px-2 py-[6px] rounded-md text-[11.5px] transition-colors ${
                        isActive ? "bg-white/[0.07] text-white font-medium" : item.soon ? "text-[var(--text-dim)]/50 cursor-default" : "text-[var(--text-muted)] hover:text-white hover:bg-white/[0.03] cursor-pointer"
                      }`}
                    >
                      <span className="flex items-center gap-2"><item.icon size={13} strokeWidth={1.5} />{item.label}</span>
                      {item.soon && <span className="text-[8px] text-[var(--text-dim)]/60">soon</span>}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
          <div className="border-t border-[var(--border)] px-1.5 py-1">
            {BOTTOM_NAV.map((item) => (
              <button key={item.id} disabled={item.soon} className={`w-full flex items-center justify-between gap-2 px-2 py-[6px] rounded-md text-[11px] transition-colors ${item.soon ? "text-[var(--text-dim)]/50 cursor-default" : "text-[var(--text-muted)] hover:text-white hover:bg-white/[0.03] cursor-pointer"}`}>
                <span className="flex items-center gap-2"><item.icon size={13} strokeWidth={1.5} />{item.label}</span>
                {item.soon && <span className="text-[8px] text-[var(--text-dim)]/60">soon</span>}
              </button>
            ))}
          </div>
          <div className="border-t border-[var(--border)] px-3 py-2.5 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0" style={{ background: "var(--signal-ok)", color: "#000" }}>V</div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-white truncate">varad durge</div>
              <div className="text-[8px] text-[var(--text-dim)] truncate">nameerror91@gmail.com</div>
            </div>
            <LogOut size={11} className="text-[var(--text-dim)] shrink-0" />
          </div>
        </div>

        {/* ── Mobile tab bar ── */}
        <div className="md:hidden flex overflow-x-auto border-b border-[var(--border)] bg-[var(--bg)] shrink-0 absolute top-0 left-0 right-0 z-10">
          {page === "run-detail" ? (
            <button onClick={() => setPage("runs")} className="flex items-center gap-1 px-3 py-2.5 text-[11px] text-[var(--text-muted)] shrink-0">
              <ArrowLeft size={11} /> Runs
            </button>
          ) : (
            mobilePages.map((p) => (
              <button key={p.id} onClick={() => setPage(p.id)} className={`px-3 py-2.5 text-[11px] whitespace-nowrap shrink-0 border-b-2 transition-colors ${page === p.id ? "border-white text-white" : "border-transparent text-[var(--text-muted)]"}`}>
                {p.label}
              </button>
            ))
          )}
        </div>

        {/* ── Content — scrolls independently ── */}
        <div className="flex-1 p-4 md:p-5 pt-11 md:pt-5 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div key={page} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.12, ease: "easeOut" }}>
              {page === "runs" && <RunsPanel onSelectRun={() => setPage("run-detail")} />}
              {page === "run-detail" && <RunDetailPanel onBack={() => setPage("runs")} />}
              {page === "compare" && <ComparePanel />}
              {page === "approvals" && <ApprovalsPanel />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
