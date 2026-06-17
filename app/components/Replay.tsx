"use client";

import { motion } from "framer-motion";
import {
  Check,
  AlertTriangle,
  X,
  Clock,
  Database,
  Play,
  Zap,
  RotateCcw,
  ArrowDown,
} from "lucide-react";

type StepStatus = "ok" | "warn" | "fail" | "pending";

interface Step {
  n: number;
  name: string;
  status: StepStatus;
  active?: boolean;
}

const STEPS: Step[] = [
  { n: 1, name: "extract", status: "ok" },
  { n: 2, name: "enrich", status: "ok" },
  { n: 3, name: "summarize", status: "warn", active: true },
  { n: 4, name: "validate", status: "fail" },
  { n: 5, name: "respond", status: "pending" },
];

const CLR: Record<StepStatus, string> = {
  ok: "var(--signal-ok)",
  warn: "var(--signal-warn)",
  fail: "var(--signal-fail)",
  pending: "var(--text-dim)",
};

const BG: Record<StepStatus, string> = {
  ok: "rgba(0,240,168,0.08)",
  warn: "rgba(245,177,60,0.08)",
  fail: "rgba(255,90,106,0.08)",
  pending: "rgba(255,255,255,0.03)",
};

export function Replay() {
  return (
    <section id="replay" className="relative py-28 lg:py-40">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">

        {/* ─── Header ─── */}
        <div className="text-center max-w-[640px] mx-auto mb-16">
          <div className="eyebrow">↺ Replay any run</div>
          <h2 className="mt-5 text-[40px] sm:text-[48px] lg:text-[56px] leading-[1.02] tracking-[-0.035em] font-medium">
            See the{" "}
            <span
              className="font-serif-italic"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #a78bff 0%, #c084fc 35%, #ec4899 75%, #fb923c 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              truth.
            </span>
          </h2>
          <p className="mt-5 text-[15px] leading-[1.65] text-[var(--text-muted)] max-w-md mx-auto">
            Re-run from any step. ARGUS reuses everything that&apos;s already
            correct — so you only pay for what changed.
          </p>
        </div>

        <div className="max-w-[900px] mx-auto space-y-6">

          {/* ─── 1. Pipeline flow ─── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            {/* Run header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-4 text-[13px] text-[var(--text-muted)]">
                <span className="flex items-center gap-1.5">
                  <RotateCcw size={12} className="text-[var(--text-dim)]" />
                  Run · <span className="text-white font-medium">8f9a-22b1</span>
                </span>
                <span className="flex items-center gap-1.5 text-[var(--text-dim)]">
                  <Clock size={12} /> 2.47s
                </span>
              </div>
              <Badge status="ok" icon={<Play size={10} />}>Replay #2</Badge>
            </div>

            {/* Desktop pipeline */}
            <div className="hidden sm:flex items-start justify-between">
              {STEPS.map((s, i) => (
                <div key={s.n} className="flex items-start flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center mb-2.5"
                      style={{
                        border: `1.5px ${s.status === "pending" ? "dashed" : "solid"} ${CLR[s.status]}`,
                        background: s.active ? BG.warn : "transparent",
                        boxShadow: s.active ? "0 0 24px -4px rgba(245,177,60,0.35)" : "none",
                      }}
                    >
                      <SIcon status={s.status} />
                    </div>
                    <span className="text-[14px] text-white font-medium mb-1">{s.name}</span>
                    <Badge status={s.status}>{s.status === "pending" ? "Queued" : s.status === "ok" ? "Passed" : "Failed"}</Badge>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="flex items-center pt-5 shrink-0 -mx-1">
                      <svg width="40" height="2" viewBox="0 0 40 2">
                        <line x1="0" y1="1" x2="40" y2="1" stroke={s.status === "ok" ? "rgba(0,240,168,0.25)" : "var(--border)"} strokeWidth="1" strokeDasharray={s.status === "ok" ? "none" : "3 3"} />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile pipeline */}
            <div className="sm:hidden space-y-2">
              {STEPS.map((s) => (
                <div
                  key={s.n}
                  className="flex items-center gap-3 py-2.5 px-3 rounded-lg"
                  style={{ background: s.active ? BG.warn : "transparent" }}
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: CLR[s.status] }} />
                  <span className="text-[14px] text-white flex-1">{s.name}</span>
                  <Badge status={s.status} small>{s.status === "pending" ? "Queued" : s.status === "ok" ? "Passed" : "Failed"}</Badge>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ─── Arrow connector ─── */}
          <div className="flex justify-center py-2">
            <ArrowDown size={18} className="text-[var(--text-dim)]" />
          </div>

          {/* ─── 2. Before / After comparison ─── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {/* Before */}
            <div className="panel p-5">
              <div className="flex items-center gap-2.5 mb-5">
                <Badge status="fail" icon={<X size={10} />}>Before</Badge>
                <span className="ml-auto text-[12px] text-[var(--text-dim)]">step 3: summarize</span>
              </div>
              <Row label="confidence" value="0.42" status="fail" />
              <Row label="key_points" value="[]" status="fail" />
              <Row label="entities" value="[]" status="fail" />
              <Row label="output" value='"placeholder text"' status="fail" last />
            </div>

            {/* After */}
            <div className="panel p-5">
              <div className="flex items-center gap-2.5 mb-5">
                <Badge status="ok" icon={<Check size={10} />}>After</Badge>
                <span className="ml-auto text-[12px] text-[var(--text-dim)]">replayed</span>
              </div>
              <Row label="confidence" value="0.93" status="ok" />
              <Row label="key_points" value='["safety", "transparency"]' status="ok" />
              <Row label="entities" value='["AI regulation"]' status="ok" />
              <Row label="output" value="Full structured summary" status="ok" last />
            </div>
          </motion.div>

          {/* ─── 3. Reused / Ran ─── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            <div className="panel p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <Database size={14} className="text-[var(--accent-soft)]" />
                <span className="text-[14px] font-medium text-white">Reused</span>
              </div>
              <p className="text-[13px] text-[var(--text-muted)] mb-3">States & outputs from completed steps</p>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge status="ok" icon={<Check size={9} />} small>extract</Badge>
                <Badge status="ok" icon={<Check size={9} />} small>enrich</Badge>
                <span className="text-[12px] text-[var(--signal-ok)] ml-1">2.47s saved</span>
              </div>
            </div>

            <div className="panel p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <Zap size={14} className="text-[var(--signal-warn)]" />
                <span className="text-[14px] font-medium text-white">Ran</span>
              </div>
              <p className="text-[13px] text-[var(--text-muted)] mb-3">Only steps after the selected point</p>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge status="warn" icon={<AlertTriangle size={9} />} small>summarize</Badge>
                <span className="text-[12px] text-[var(--signal-warn)] ml-1">1.34s compute</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── Stats ─── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-14 flex items-center justify-center gap-12 sm:gap-20 flex-wrap"
        >
          <Stat value="10x" label="Faster debugging" accent="var(--accent-soft)" />
          <Stat value="40%" label="Lower cost" accent="var(--signal-warn)" />
          <Stat value="Zero" label="Wasted compute" accent="var(--signal-ok)" />
        </motion.div>
      </div>
    </section>
  );
}

/* ── Badge (dark tinted) ── */

function Badge({ status, children, icon, small }: { status: StepStatus; children: React.ReactNode; icon?: React.ReactNode; small?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg font-medium ${small ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-[13px]"}`}
      style={{ background: BG[status], color: CLR[status] }}
    >
      {icon || <span className="w-[6px] h-[6px] rounded-full" style={{ background: CLR[status] }} />}
      {children}
    </span>
  );
}

/* ── Compare row ── */

function Row({ label, value, status, last }: { label: string; value: string; status: "ok" | "fail"; last?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-3 ${last ? "" : "border-b border-[var(--border)]/40"}`}>
      <span className="text-[13px] text-[var(--text-dim)]">{label}</span>
      <span className="text-[13px] font-medium truncate ml-4 text-right" style={{ color: CLR[status] }}>{value}</span>
    </div>
  );
}

/* ── Stat ── */

function Stat({ value, label, accent }: { value: string; label: string; accent: string }) {
  return (
    <div className="text-center">
      <div className="text-[32px] font-semibold tracking-[-0.03em]" style={{ color: accent }}>{value}</div>
      <div className="text-[13px] text-[var(--text-muted)] mt-1">{label}</div>
    </div>
  );
}

/* ── Step icon ── */

function SIcon({ status }: { status: StepStatus }) {
  if (status === "ok") return <Check size={16} className="text-[var(--signal-ok)]" strokeWidth={2.5} />;
  if (status === "warn") return <AlertTriangle size={16} className="text-[var(--signal-warn)]" strokeWidth={2} />;
  if (status === "fail") return <X size={16} className="text-[var(--signal-fail)]" strokeWidth={2.5} />;
  return <span className="w-3 h-3 rounded-full border-[1.5px] border-[var(--text-dim)]" />;
}
