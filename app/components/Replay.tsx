"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
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

const CLR_RAW: Record<StepStatus, string> = {
  ok: "#00f0a8",
  warn: "#f5b13c",
  fail: "#ff5a6a",
  pending: "#4a4a5a",
};

/* ═══════════════════════════════════════
   Main component
   ═══════════════════════════════════════ */

export function Replay() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="replay"
      className="relative py-24 lg:py-32"
      style={{ fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif" }}
    >
      <div ref={sectionRef} className="mx-auto max-w-[1280px] px-6 lg:px-10">

        {/* ─── Header ─── */}
        <div className="text-center max-w-[640px] mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="eyebrow"
          >
            ↺ Replay any run
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 text-[40px] sm:text-[48px] lg:text-[56px] leading-[1.02] tracking-[-0.035em] font-medium"
          >
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
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 text-[15px] leading-[1.65] text-[var(--text-muted)] max-w-md mx-auto"
          >
            Re-run from any step. ARGUS reuses everything that&apos;s already
            correct — so you only pay for what changed.
          </motion.p>
        </div>

        <div className="max-w-[900px] mx-auto space-y-6">

          {/* ─── 1. Pipeline flow ─── */}
          <div>
            {/* Run header */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-between mb-5"
            >
              <div className="flex items-center gap-4 text-[13px] text-[var(--text-muted)]">
                <span className="flex items-center gap-1.5">
                  <RotateCcw size={12} className="text-[var(--text-dim)]" />
                  Run · <span className="text-white font-medium">8f9a-22b1</span>
                </span>
                <span className="flex items-center gap-1.5 text-[var(--text-dim)]">
                  <Clock size={12} /> 2.47s
                </span>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3, type: "spring", stiffness: 200 }}
              >
                <Badge status="ok" icon={<Play size={10} />}>Replay #2</Badge>
              </motion.div>
            </motion.div>

            {/* Desktop pipeline — sequential draw-on */}
            <div className="hidden sm:flex items-start justify-between">
              {STEPS.map((s, i) => (
                <div key={s.n} className="flex items-start flex-1">
                  <motion.div
                    className="flex flex-col items-center flex-1"
                    initial={{ opacity: 0, y: 20, scale: 0.85 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.15,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {/* SVG circle with draw-on stroke */}
                    <div className="relative w-10 h-10 mb-2.5">
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 40 40"
                        fill="none"
                        className="absolute inset-0"
                      >
                        <motion.circle
                          cx="20"
                          cy="20"
                          r="18.5"
                          stroke={CLR_RAW[s.status]}
                          strokeWidth="1.5"
                          strokeDasharray={s.status === "pending" ? "4 4" : "none"}
                          fill={s.active ? "rgba(245,177,60,0.08)" : "transparent"}
                          initial={{ pathLength: 0, opacity: 0 }}
                          whileInView={{ pathLength: 1, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            pathLength: { duration: 0.6, delay: i * 0.15 + 0.1, ease: "easeOut" },
                            opacity: { duration: 0.2, delay: i * 0.15 },
                          }}
                          style={{
                            filter: s.active ? "drop-shadow(0 0 12px rgba(245,177,60,0.4))" : "none",
                          }}
                        />
                      </svg>
                      {/* Icon appears after circle draws */}
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.3,
                          delay: i * 0.15 + 0.4,
                          type: "spring",
                          stiffness: 300,
                          damping: 15,
                        }}
                      >
                        <SIcon status={s.status} />
                      </motion.div>
                    </div>
                    <motion.span
                      className="text-[14px] text-white font-medium mb-1"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.15 + 0.3 }}
                    >
                      {s.name}
                    </motion.span>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.15 + 0.45, type: "spring", stiffness: 200 }}
                    >
                      <Badge status={s.status}>
                        {s.status === "pending" ? "Queued" : s.status === "ok" ? "Passed" : "Failed"}
                      </Badge>
                    </motion.div>
                  </motion.div>
                  {/* Connector line draws left→right */}
                  {i < STEPS.length - 1 && (
                    <div className="flex items-center pt-5 shrink-0 -mx-1">
                      <svg width="40" height="2" viewBox="0 0 40 2">
                        <motion.line
                          x1="0" y1="1" x2="40" y2="1"
                          stroke={s.status === "ok" ? "rgba(0,240,168,0.25)" : "var(--border)"}
                          strokeWidth="1"
                          strokeDasharray={s.status === "ok" ? "none" : "3 3"}
                          initial={{ pathLength: 0 }}
                          whileInView={{ pathLength: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: i * 0.15 + 0.5, ease: "easeOut" }}
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile pipeline */}
            <div className="sm:hidden space-y-2">
              {STEPS.map((s, i) => (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex items-center gap-3 py-2.5 px-3 rounded-lg"
                  style={{ background: s.active ? BG.warn : "transparent" }}
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: CLR[s.status] }} />
                  <span className="text-[14px] text-white flex-1">{s.name}</span>
                  <Badge status={s.status} small>
                    {s.status === "pending" ? "Queued" : s.status === "ok" ? "Passed" : "Failed"}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ─── Arrow connector (bouncing) ─── */}
          <motion.div
            className="flex justify-center py-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.8 }}
          >
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown size={18} className="text-[var(--text-dim)]" />
            </motion.div>
          </motion.div>

          {/* ─── 2. Before / After comparison — centered, fit content ─── */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {/* Before */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="replay-card rounded-xl border border-[var(--border)] p-4 w-full sm:w-auto sm:min-w-[320px]"
              style={{ background: "#0a0a0f" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Badge status="fail" icon={<X size={10} />}>Before</Badge>
                <span className="ml-auto text-[11px] text-[var(--text-dim)]">step 3: summarize</span>
              </div>
              <StaggeredRow label="confidence" value="0.42" status="fail" delay={0.1} />
              <StaggeredRow label="key_points" value="[]" status="fail" delay={0.15} />
              <StaggeredRow label="entities" value="[]" status="fail" delay={0.2} />
              <StaggeredRow label="output" value='"placeholder text"' status="fail" delay={0.25} last />
            </motion.div>

            {/* After */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="replay-card rounded-xl border border-[var(--border)] p-4 w-full sm:w-auto sm:min-w-[320px]"
              style={{ background: "#0a0a0f" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Badge status="ok" icon={<Check size={10} />}>After</Badge>
                <span className="ml-auto text-[11px] text-[var(--text-dim)]">replayed</span>
              </div>
              <StaggeredRow label="confidence" value="0.93" status="ok" delay={0.15} />
              <StaggeredRow label="key_points" value='["safety", "transparency"]' status="ok" delay={0.2} />
              <StaggeredRow label="entities" value='["AI regulation"]' status="ok" delay={0.25} />
              <StaggeredRow label="output" value="Full structured summary" status="ok" delay={0.3} last />
            </motion.div>
          </div>

          {/* ─── 3. Reused / Ran — inline horizontal breakdown ─── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 pt-2"
          >
            {/* Reused indicator */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Database size={13} className="text-[var(--accent-soft)]" />
                <span className="text-[12px] text-[var(--text-dim)] uppercase tracking-[0.1em]">Reused</span>
              </div>
              <div className="w-px h-4 bg-[var(--border)]" />
              <div className="flex items-center gap-1.5">
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 15 }}
                >
                  <Badge status="ok" icon={<Check size={9} />} small>extract</Badge>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 15 }}
                >
                  <Badge status="ok" icon={<Check size={9} />} small>enrich</Badge>
                </motion.div>
              </div>
              <motion.span
                className="text-[11px] text-[var(--signal-ok)]"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                2.47s saved
              </motion.span>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-5 bg-[var(--border)]" />

            {/* Ran indicator */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Zap size={13} className="text-[var(--signal-warn)]" />
                <span className="text-[12px] text-[var(--text-dim)] uppercase tracking-[0.1em]">Ran</span>
              </div>
              <div className="w-px h-4 bg-[var(--border)]" />
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 15 }}
              >
                <Badge status="warn" icon={<AlertTriangle size={9} />} small>summarize</Badge>
              </motion.div>
              <motion.span
                className="text-[11px] text-[var(--signal-warn)]"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                1.34s compute
              </motion.span>
            </div>
          </motion.div>
        </div>

        {/* ─── Stats with counter animation ─── */}
        <div className="mt-14 flex items-center justify-center gap-12 sm:gap-20 flex-wrap">
          <AnimatedStat value="10" suffix="x" label="Faster debugging" accent="var(--accent-soft)" />
          <AnimatedStat value="40" suffix="%" label="Lower cost" accent="var(--signal-warn)" />
          <StaticStat value="Zero" label="Wasted compute" accent="var(--signal-ok)" />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   Badge (dark tinted)
   ═══════════════════════════════════════ */

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

/* ═══════════════════════════════════════
   Staggered compare row (slides in)
   ═══════════════════════════════════════ */

function StaggeredRow({ label, value, status, delay, last }: { label: string; value: string; status: "ok" | "fail"; delay: number; last?: boolean }) {
  return (
    <motion.div
      className={`flex items-center justify-between py-2 ${last ? "" : "border-b border-[var(--border)]/40"}`}
      initial={{ opacity: 0, x: status === "fail" ? -12 : 12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      <span className="text-[12px] text-[var(--text-dim)]">{label}</span>
      <motion.span
        className="text-[12px] font-medium truncate ml-4 text-right"
        style={{ color: CLR[status] }}
        initial={{ opacity: 0, filter: "blur(4px)" }}
        whileInView={{ opacity: 1, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: delay + 0.1 }}
      >
        {value}
      </motion.span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   Animated counter stat
   ═══════════════════════════════════════ */

function AnimatedStat({ value, suffix, label, accent }: { value: string; suffix: string; label: string; accent: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [count, setCount] = useState(0);
  const target = parseInt(value, 10);

  useEffect(() => {
    if (!isInView) return;
    let frame: number;
    const duration = 1200;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, target]);

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-[32px] font-semibold tracking-[-0.03em] tabular-nums" style={{ color: accent }}>
        {count}{suffix}
      </div>
      <div className="text-[13px] text-[var(--text-muted)] mt-1">{label}</div>
    </motion.div>
  );
}

function StaticStat({ value, label, accent }: { value: string; label: string; accent: string }) {
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="text-[32px] font-semibold tracking-[-0.03em]" style={{ color: accent }}>{value}</div>
      <div className="text-[13px] text-[var(--text-muted)] mt-1">{label}</div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   Step icon
   ═══════════════════════════════════════ */

function SIcon({ status }: { status: StepStatus }) {
  if (status === "ok") return <Check size={16} className="text-[var(--signal-ok)]" strokeWidth={2.5} />;
  if (status === "warn") return <AlertTriangle size={16} className="text-[var(--signal-warn)]" strokeWidth={2} />;
  if (status === "fail") return <X size={16} className="text-[var(--signal-fail)]" strokeWidth={2.5} />;
  return <span className="w-3 h-3 rounded-full border-[1.5px] border-[var(--text-dim)]" />;
}
