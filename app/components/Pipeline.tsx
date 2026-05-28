"use client";

import { motion } from "framer-motion";
import { Check, AlertTriangle, X, Circle } from "lucide-react";

type NodeStatus = "ok" | "warn" | "fail" | "pending";

type PipelineNode = {
  name: string;
  caption: string;
  highlight?: string;
  status: NodeStatus;
  time: string;
  rootCause?: boolean;
};

const NODES: PipelineNode[] = [
  {
    name: "extract",
    caption: "Data extracted successfully",
    status: "ok",
    time: "128ms",
  },
  {
    name: "enrich",
    caption: "Entities enriched and structured",
    status: "ok",
    time: "218ms",
  },
  {
    name: "summarize",
    caption: "Silent failure:",
    highlight: "placeholder returned",
    status: "warn",
    time: "1.34s",
    rootCause: true,
  },
  {
    name: "validate",
    caption: "Degradation detected in downstream step",
    status: "fail",
    time: "87ms",
  },
  {
    name: "respond",
    caption: "Output at risk",
    status: "pending",
    time: "--",
  },
];

export function Pipeline() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* corner mesh */}
      <div
        className="absolute right-0 bottom-0 w-[40vw] h-[60%] -z-10 dots-bg opacity-40"
        style={{
          maskImage: "linear-gradient(225deg, black 10%, transparent 70%)",
          WebkitMaskImage:
            "linear-gradient(225deg, black 10%, transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <div className="eyebrow">▸ Watch ARGUS catch a failure</div>

        <h2 className="mt-5 max-w-3xl text-[36px] sm:text-[46px] lg:text-[54px] leading-[1.05] tracking-[-0.03em] font-medium">
          Every node, traced.
          <br />
          <span
            className="font-serif-italic"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #f5b13c 0%, #f97316 28%, #ec4899 60%, #c084fc 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Every silence, surfaced.
          </span>
        </h2>

        <p className="mt-5 max-w-xl text-[14.5px] leading-[1.65] text-[var(--text-muted)]">
          ARGUS watches every step of your agent pipeline during development and testing,
          <br className="hidden sm:block" />
          catching silent failures before they ever reach production.
        </p>

        {/* node strip — desktop */}
        <div className="mt-14 hidden md:flex items-start">
          {NODES.map((n, i) => (
            <div key={n.name} className="flex items-start flex-1 min-w-0">
              <div className="flex-1 min-w-0">
                <NodeCard node={n} delay={i * 0.12} />
              </div>
              {i < NODES.length - 1 && (
                <DashConnector delay={i * 0.12 + 0.08} />
              )}
            </div>
          ))}
        </div>

        {/* node strip — mobile */}
        <div className="mt-12 md:hidden flex flex-col gap-3">
          {NODES.map((n, i) => (
            <div key={n.name} className="flex flex-col items-start gap-2">
              {n.rootCause ? (
                /* summarize node + root cause side by side */
                <div className="flex items-start gap-3 w-full">
                  <div className="flex-1 min-w-0">
                    <NodeCard node={n} delay={i * 0.1} />
                  </div>
                  <div className="shrink-0 flex flex-col items-center pt-2">
                    <span className="w-px h-4 bg-[var(--signal-warn)]/50" />
                    <span className="px-1.5 py-0.5 rounded-[4px] border border-[var(--signal-warn)]/60 bg-[rgba(245,177,60,0.06)] font-mono text-[9px] tracking-[0.16em] uppercase text-[var(--signal-warn)] whitespace-nowrap">
                      Root Cause
                    </span>
                    <svg width="2" height="8" className="mt-0.5" aria-hidden>
                      <line x1="1" y1="0" x2="1" y2="8" stroke="var(--signal-warn)" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
                    </svg>
                    <div className="mt-1 w-[120px] rounded-md border border-[var(--signal-warn)]/30 bg-[rgba(245,177,60,0.04)] px-2 py-1.5">
                      <p className="text-[9px] leading-[1.4] text-[var(--signal-warn)] text-center">
                        ARGUS detected this before it degraded downstream
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <NodeCard node={n} delay={i * 0.1} />
              )}
              {i < NODES.length - 1 && (
                <div className="ml-7 h-6 w-px bg-[var(--border)]" />
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

function NodeCard({
  node,
  delay,
}: {
  node: PipelineNode;
  delay: number;
}) {
  const cls = statusClasses(node.status);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      className="relative z-10"
    >
      <div
        className={`relative panel-tight px-3.5 py-3 ${
          node.status === "warn" ? "glow-warn" : ""
        }`}
        style={{
          background: "var(--surface-2)",
        }}
      >
        {/* header row */}
        <div className="flex items-center gap-2.5">
          <span
            className={`flex items-center justify-center w-6 h-6 rounded-md ${cls.iconBg}`}
          >
            <StatusIcon status={node.status} />
          </span>
          <span className="font-mono text-[13px] text-white truncate">
            {node.name}
          </span>
          <span className="ml-auto font-mono text-[11px] text-[var(--text-dim)] tabular-nums shrink-0">
            {node.time}
          </span>
        </div>

        {/* caption */}
        <p className="mt-2.5 text-[12px] leading-[1.5] text-[var(--text-muted)]">
          {node.caption}
          {node.highlight && (
            <>
              <br />
              <span className="text-[var(--signal-warn)]">
                {node.highlight}
              </span>
            </>
          )}
        </p>
      </div>

      {/* root cause callout — below on desktop, right side on mobile */}
      {node.rootCause && (
        <>
          {/* desktop: below the card */}
          <div className="hidden md:flex mt-3 flex-col items-center">
            <span className="w-px h-3 bg-[var(--signal-warn)]/50" />
            <span className="px-2 py-0.5 rounded-[4px] border border-[var(--signal-warn)]/60 bg-[rgba(245,177,60,0.06)] font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--signal-warn)]">
              Root Cause
            </span>
            <svg
              width="2"
              height="10"
              className="mt-0.5"
              aria-hidden
            >
              <line
                x1="1"
                y1="0"
                x2="1"
                y2="10"
                stroke="var(--signal-warn)"
                strokeWidth="1"
                strokeDasharray="2 2"
                opacity="0.4"
              />
            </svg>
            <div className="mt-1 max-w-[180px] rounded-md border border-[var(--signal-warn)]/30 bg-[rgba(245,177,60,0.04)] px-3 py-2">
              <p className="text-[10.5px] leading-[1.5] text-[var(--signal-warn)] text-center">
                ARGUS detected this failure before it degraded downstream nodes
              </p>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}

function statusClasses(s: NodeStatus) {
  switch (s) {
    case "ok":
      return {
        iconBg: "bg-[rgba(0,240,168,0.1)] text-[var(--signal-ok)]",
      };
    case "warn":
      return {
        iconBg: "bg-[rgba(245,177,60,0.12)] text-[var(--signal-warn)]",
      };
    case "fail":
      return {
        iconBg: "bg-[rgba(255,90,106,0.12)] text-[var(--signal-fail)]",
      };
    default:
      return {
        iconBg: "bg-[rgba(255,255,255,0.04)] text-[var(--text-dim)]",
      };
  }
}

function StatusIcon({ status }: { status: NodeStatus }) {
  switch (status) {
    case "ok":
      return <Check size={13} strokeWidth={2.5} />;
    case "warn":
      return <AlertTriangle size={13} strokeWidth={2.2} />;
    case "fail":
      return <X size={13} strokeWidth={2.5} />;
    default:
      return <Circle size={11} strokeWidth={2} />;
  }
}

function DashConnector({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className="shrink-0 px-2"
      style={{ marginTop: "20px" }}
      aria-hidden
    >
      <svg width="28" height="8" viewBox="0 0 28 8" fill="none">
        <line
          x1="0"
          y1="4"
          x2="22"
          y2="4"
          stroke="var(--border-strong)"
          strokeWidth="1.2"
          strokeDasharray="2 3"
        />
        <path
          d="M20 1 L26 4 L20 7"
          stroke="var(--border-strong)"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  );
}

