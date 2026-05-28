"use client";

import { motion } from "framer-motion";
import {
  Check,
  AlertTriangle,
  X,
  Clock,
  DollarSign,
  Leaf,
  Database,
  Play,
  Zap,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { ProximityGlow } from "./ProximityGlow";

type StepStatus = "ok" | "warn" | "fail" | "pending";

const STEPS: {
  n: number;
  name: string;
  status: StepStatus;
  active?: boolean;
  meta?: string;
}[] = [
  { n: 1, name: "extract", status: "ok" },
  { n: 2, name: "enrich", status: "ok" },
  {
    n: 3,
    name: "summarize",
    status: "warn",
    active: true,
    meta: "Failed output\n1.34s",
  },
  { n: 4, name: "validate", status: "fail" },
  { n: 5, name: "respond", status: "pending" },
];

export function Replay() {
  return (
    <section id="replay" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10 grid lg:grid-cols-[0.78fr_2.2fr] gap-10 lg:gap-12">
        {/* ───────── LEFT RAIL ───────── */}
        <div>
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
          <p className="mt-5 text-[14.5px] leading-[1.65] text-[var(--text-muted)] max-w-md">
            Re-run from any step. ARGUS reuses everything that&apos;s already
            correct — so you only pay for what changed.
          </p>

          {/* benefits tile row */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2">
            <BenefitTile
              icon={<Clock size={13} strokeWidth={1.8} />}
              value="10x"
              label="Faster Debugging"
              caption="Skip what already worked"
              accent="var(--accent-soft)"
            />
            <BenefitTile
              icon={<DollarSign size={13} strokeWidth={1.8} />}
              value="40%"
              label="Lower Cost"
              caption="Reuses saved state & results"
              accent="var(--signal-warn)"
            />
            <BenefitTile
              icon={<Leaf size={13} strokeWidth={1.8} />}
              value="Zero"
              label="Wasted Compute"
              caption="Only re-run what matters"
              accent="var(--signal-ok)"
            />
          </div>

          {/* how replay works */}
          <div className="mt-5 panel p-5">
            <div className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-[var(--text-dim)] mb-5">
              How Replay Works
            </div>
            <ul className="space-y-0">
              <HowStep
                icon={<Database size={16} strokeWidth={1.8} />}
                title="Execute your pipeline"
                caption="ARGUS records every node output and state"
                accent="var(--accent-soft)"
                accentBg="rgba(139,125,255,0.10)"
                accentBorder="rgba(139,125,255,0.30)"
                showConnector
              />
              <HowStep
                icon={<Play size={16} strokeWidth={1.8} />}
                title="Re-run from any step"
                caption="We load saved states up to that point"
                accent="var(--signal-warn)"
                accentBg="rgba(245,177,60,0.10)"
                accentBorder="rgba(245,177,60,0.30)"
                showConnector
              />
              <HowStep
                icon={<Zap size={16} strokeWidth={1.8} />}
                title="Only downstream runs"
                caption="Everything before stays cached and reused"
                accent="var(--signal-ok)"
                accentBg="rgba(0,240,168,0.10)"
                accentBorder="rgba(0,240,168,0.30)"
              />
            </ul>
          </div>
        </div>

        {/* ───────── RIGHT COLUMN (canvas + reused/ran stack) ───────── */}
        <div className="flex flex-col gap-4 self-center min-w-0">
        <ProximityGlow className="rounded-[16px]" proximity={5000}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="panel p-0 overflow-hidden relative"
        >
          {/* top header bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-3 sm:px-4 py-2.5 border-b border-[var(--border)] bg-[rgba(255,255,255,0.015)]">
            <div className="flex items-center gap-3 sm:gap-4 font-mono text-[10.5px] sm:text-[11.5px] text-[var(--text-muted)]">
              <span className="inline-flex items-center gap-1.5">
                <RotateCcw size={11} className="text-[var(--text-dim)]" />
                Run · <span className="text-white">8f9a-22b1</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={11} className="text-[var(--text-dim)]" />
                2.47s
              </span>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md border border-[var(--border)] bg-[rgba(255,255,255,0.02)] font-mono text-[10.5px] sm:text-[11.5px] text-white">
              Replay #2 (fixed parser)
              <ChevronDown size={11} className="text-[var(--text-dim)]" />
            </div>
          </div>

          {/* main 4-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[150px_1fr_1fr]">
            {/* execution steps */}
            <div className="border-b lg:border-b-0 lg:border-r border-[var(--border)] p-3">
              <Label>Execution Steps</Label>
              <ol className="mt-2.5 space-y-1">
                {STEPS.map((s) => (
                  <StepRow key={s.n} step={s} />
                ))}
              </ol>
            </div>

            {/* failed JSON */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="border-b lg:border-b-0 lg:border-r border-[var(--border)] p-3 overflow-hidden"
            >
              <Label>
                Step 3: summarize{" "}
                <span className="text-[var(--signal-fail)]">(Failed)</span>
              </Label>
              <pre className="mt-2.5 font-mono text-[10px] sm:text-[11px] leading-[1.55] text-[var(--text-muted)] whitespace-pre-wrap break-all sm:break-normal">
{`{
  "summary": `}<span className="text-[var(--signal-fail)]">&quot;...&quot;</span>{`,
  "key_points": `}<span className="text-[var(--signal-fail)]">[]</span>{`,
  "entities": `}<span className="text-[var(--signal-fail)]">[]</span>{`,
  "confidence": `}<span className="text-[var(--signal-fail)]">0.42</span>{`,
  "note": `}<span className="text-[var(--signal-fail)]">&quot;placeholder text&quot;</span>{`
}`}
              </pre>
            </motion.div>

            {/* replayed JSON */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="border-b lg:border-b-0 lg:border-r border-[var(--border)] p-3 overflow-hidden"
            >
              <Label>
                Replay: summarize{" "}
                <span className="text-[var(--signal-ok)]">(Replayed)</span>
              </Label>
              <pre className="mt-2.5 font-mono text-[10px] sm:text-[11px] leading-[1.55] text-[var(--text-muted)] whitespace-pre-wrap break-all sm:break-normal">
{`{
  "summary": `}<span className="text-white">&quot;AI regulation is evolving rapidly, with focus on safety and transparency.&quot;</span>{`,
  "key_points": `}<span className="text-white">[&quot;safety&quot;, &quot;transparency&quot;]</span>{`,
  "entities": `}<span className="text-white">[&quot;AI regulation&quot;]</span>{`,
  "confidence": `}<span className="text-[var(--signal-ok)]">0.93</span>{`
}`}
              </pre>
            </motion.div>

          </div>

        </motion.div>
        </ProximityGlow>

        {/* ───────── BOTTOM: reused vs ran (separate from canvas) ───────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="panel p-0 overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* what we reused */}
            <div className="p-5 border-b lg:border-b-0 lg:border-r border-[var(--border)]">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center justify-center w-7 h-7 rounded-md bg-[rgba(139,125,255,0.12)] border border-[rgba(139,125,255,0.3)] text-[var(--accent-soft)]">
                  <Database size={13} />
                </span>
                <span className="font-mono text-[12px] font-semibold tracking-[0.08em] uppercase text-white">
                  What we reused
                </span>
              </div>
              <p className="mt-3 text-[13px] leading-[1.5] text-[var(--text-muted)]">
                States &amp; outputs from completed steps
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Pill status="ok" label="extract" />
                <Pill status="ok" label="enrich" />
                <span className="font-mono text-[12px] text-[var(--signal-ok)] ml-1">
                  2.47s saved
                </span>
              </div>
            </div>

            {/* what we ran */}
            <div className="p-5">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center justify-center w-7 h-7 rounded-md bg-[rgba(245,177,60,0.12)] border border-[rgba(245,177,60,0.3)] text-[var(--signal-warn)]">
                  <Zap size={13} />
                </span>
                <span className="font-mono text-[12px] font-semibold tracking-[0.08em] uppercase text-white">
                  What we ran
                </span>
              </div>
              <p className="mt-3 text-[13px] leading-[1.5] text-[var(--text-muted)]">
                Only steps after the selected point
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Pill status="warn" label="summarize" highlight />
                <span className="font-mono text-[12px] text-[var(--signal-warn)] ml-1">
                  1.34s compute
                </span>
              </div>
            </div>
          </div>
        </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ───────── helpers ───────── */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--text-dim)]">
      {children}
    </div>
  );
}

function StepRow({
  step,
}: {
  step: { n: number; name: string; status: StepStatus; active?: boolean; meta?: string };
}) {
  const isActive = step.active;
  return (
    <li
      className={`relative rounded-md px-2 py-1.5 font-mono text-[12px] ${
        isActive
          ? "border border-[var(--signal-warn)]/55 bg-[rgba(245,177,60,0.06)]"
          : "border border-transparent"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-[var(--text-dim)] w-3 text-right">{step.n}</span>
        <span
          className={`flex-1 ${
            isActive ? "text-white" : "text-[var(--text-muted)]"
          }`}
        >
          {step.name}
        </span>
        <StepIcon status={step.status} />
      </div>
      {step.meta && (
        <div className="mt-0.5 ml-[20px] text-[10.5px] leading-[1.4] text-[var(--text-dim)] whitespace-pre-line">
          {step.meta}
        </div>
      )}
    </li>
  );
}

function StepIcon({ status }: { status: StepStatus }) {
  if (status === "ok")
    return <Check size={12} className="text-[var(--signal-ok)]" />;
  if (status === "warn")
    return <AlertTriangle size={12} className="text-[var(--signal-warn)]" />;
  if (status === "fail")
    return <X size={12} className="text-[var(--signal-fail)]" />;
  return (
    <span className="w-2 h-2 rounded-full border border-[var(--text-dim)]" />
  );
}

function BenefitTile({
  icon,
  value,
  label,
  caption,
  accent,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  caption: string;
  accent: string;
}) {
  return (
    <div className="panel-tight p-2.5">
      <div style={{ color: accent }}>{icon}</div>
      <div
        className="mt-1.5 text-[22px] font-medium leading-none tracking-[-0.02em]"
        style={{ color: accent }}
      >
        {value}
      </div>
      <div
        className="mt-1 text-[10.5px] leading-[1.25] font-medium"
        style={{ color: accent }}
      >
        {label}
      </div>
      <div className="mt-0.5 text-[9.5px] leading-[1.35] text-[var(--text-dim)]">
        {caption}
      </div>
    </div>
  );
}

function HowStep({
  icon,
  title,
  caption,
  accent,
  accentBg,
  accentBorder,
  showConnector = false,
}: {
  icon: React.ReactNode;
  title: string;
  caption: string;
  accent: string;
  accentBg: string;
  accentBorder: string;
  showConnector?: boolean;
}) {
  return (
    <li className="flex items-start gap-3 pb-4 last:pb-0 relative">
      <div className="relative shrink-0">
        <span
          className="flex items-center justify-center w-9 h-9 rounded-md"
          style={{
            background: accentBg,
            border: `1px solid ${accentBorder}`,
            color: accent,
          }}
        >
          {icon}
        </span>
        {showConnector && (
          <span
            aria-hidden
            className="absolute left-1/2 top-9 -translate-x-1/2 w-px h-[calc(100%-12px)]"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, var(--border-strong) 50%, transparent 50%)",
              backgroundSize: "1px 4px",
              backgroundRepeat: "repeat-y",
            }}
          />
        )}
      </div>
      <div className="min-w-0 pt-1">
        <div className="text-[13.5px] text-white font-medium leading-[1.3]">
          {title}
        </div>
        <div className="text-[12px] leading-[1.5] text-[var(--text-muted)] mt-0.5">
          {caption}
        </div>
      </div>
    </li>
  );
}


function Pill({
  status,
  label,
  highlight = false,
}: {
  status: StepStatus;
  label: string;
  highlight?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border font-mono text-[11.5px] ${
        highlight
          ? "border-[var(--signal-warn)]/55 bg-[rgba(245,177,60,0.07)] text-white"
          : "border-[var(--border)] bg-[rgba(255,255,255,0.02)] text-[var(--text-muted)]"
      }`}
    >
      {label}
      <StepIcon status={status} />
    </span>
  );
}

