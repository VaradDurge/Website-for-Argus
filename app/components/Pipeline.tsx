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
    <section id="pipeline" className="relative py-24 lg:py-32 overflow-hidden">
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
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="eyebrow inline-block"
          >
            ▸ Watch ARGUS catch a failure
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 text-[36px] sm:text-[46px] lg:text-[54px] leading-[1.05] tracking-[-0.03em] font-medium"
          >
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
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 text-[14.5px] leading-[1.65] text-[var(--text-muted)] max-w-xl mx-auto"
          >
            ARGUS watches every step of your agent pipeline during development and testing,
            <br className="hidden sm:block" />
            catching silent failures before they ever reach production.
          </motion.p>
        </div>

        {/* node strip — desktop */}
        <div className="mt-14 hidden md:flex items-start">
          {NODES.map((n, i) => (
            <div key={n.name} className="flex items-start flex-1 min-w-0">
              <div className="flex-1 min-w-0">
                <NodeCard node={n} delay={i * 0.2} index={i} />
              </div>
              {i < NODES.length - 1 && (
                <DashConnector delay={i * 0.2 + 0.15} status={n.status} />
              )}
            </div>
          ))}
        </div>

        {/* node strip — mobile */}
        <div className="mt-12 md:hidden flex flex-col gap-3">
          {NODES.map((n, i) => (
            <div key={n.name} className="flex flex-col items-start gap-2">
              {n.rootCause ? (
                <div className="flex items-start gap-3 w-full">
                  <div className="flex-1 min-w-0">
                    <NodeCard node={n} delay={i * 0.1} index={i} />
                  </div>
                  <motion.div
                    className="shrink-0 flex items-center self-center gap-0"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 + 0.3, type: "spring", stiffness: 150 }}
                  >
                    <svg width="24" height="2" className="shrink-0" aria-hidden>
                      <line x1="0" y1="1" x2="24" y2="1" stroke="var(--signal-warn)" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
                    </svg>
                    <div className="flex flex-col items-center">
                      <span className="px-1.5 py-0.5 rounded-[4px] border border-[var(--signal-warn)]/60 bg-[rgba(245,177,60,0.06)] text-[9px] tracking-[0.16em] uppercase text-[var(--signal-warn)] whitespace-nowrap">
                        Root Cause
                      </span>
                      <svg width="2" height="6" className="mt-0.5" aria-hidden>
                        <line x1="1" y1="0" x2="1" y2="6" stroke="var(--signal-warn)" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
                      </svg>
                      <div className="mt-0.5 w-[110px] rounded-md border border-[var(--signal-warn)]/30 bg-[rgba(245,177,60,0.04)] px-2 py-1.5">
                        <p className="text-[9px] leading-[1.4] text-[var(--signal-warn)] text-center">
                          ARGUS detected this before it degraded downstream
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <NodeCard node={n} delay={i * 0.1} index={i} />
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
  index,
}: {
  node: PipelineNode;
  delay: number;
  index: number;
}) {
  const cls = statusClasses(node.status);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay,
        scale: { type: "spring", stiffness: 200, damping: 20, delay },
      }}
      className="relative z-10"
    >
      <div
        className={`relative panel-tight pipeline-node px-3.5 py-3 ${
          node.status === "warn" ? "glow-warn" : ""
        }`}
        style={{
          background: "var(--surface-2)",
        }}
      >
        {/* header row */}
        <div className="flex items-center gap-2.5">
          <motion.span
            className={`flex items-center justify-center w-6 h-6 rounded-md ${cls.iconBg}`}
            initial={{ scale: 0, rotate: -45 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: delay + 0.2,
              type: "spring",
              stiffness: 300,
              damping: 15,
            }}
          >
            <StatusIcon status={node.status} />
          </motion.span>
          <span className="text-[13px] text-white font-medium truncate">
            {node.name}
          </span>
          <span className="ml-auto text-[11px] text-[var(--text-dim)] tabular-nums shrink-0">
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

      {/* root cause callout — desktop */}
      {node.rootCause && (
        <motion.div
          className="hidden md:flex mt-3 flex-col items-center"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.4, duration: 0.4, type: "spring", stiffness: 150 }}
        >
          <span className="w-px h-3 bg-[var(--signal-warn)]/50" />
          <span className="px-2 py-0.5 rounded-[4px] border border-[var(--signal-warn)]/60 bg-[rgba(245,177,60,0.06)] text-[10px] tracking-[0.18em] uppercase text-[var(--signal-warn)]">
            Root Cause
          </span>
          <svg width="2" height="10" className="mt-0.5" aria-hidden>
            <line x1="1" y1="0" x2="1" y2="10" stroke="var(--signal-warn)" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
          </svg>
          <div className="mt-1 max-w-[180px] rounded-md border border-[var(--signal-warn)]/30 bg-[rgba(245,177,60,0.04)] px-3 py-2">
            <p className="text-[10.5px] leading-[1.5] text-[var(--signal-warn)] text-center">
              ARGUS detected this failure before it degraded downstream nodes
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function statusClasses(s: NodeStatus) {
  switch (s) {
    case "ok":
      return { iconBg: "bg-[rgba(0,240,168,0.1)] text-[var(--signal-ok)]" };
    case "warn":
      return { iconBg: "bg-[rgba(245,177,60,0.12)] text-[var(--signal-warn)]" };
    case "fail":
      return { iconBg: "bg-[rgba(255,90,106,0.12)] text-[var(--signal-fail)]" };
    default:
      return { iconBg: "bg-[rgba(255,255,255,0.04)] text-[var(--text-dim)]" };
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

function DashConnector({ delay, status }: { delay: number; status: NodeStatus }) {
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
          stroke={status === "ok" ? "rgba(0,240,168,0.3)" : "var(--border-strong)"}
          strokeWidth="1.2"
          strokeDasharray="2 3"
          className="arrow-flow"
        />
        <path
          d="M20 1 L26 4 L20 7"
          stroke={status === "ok" ? "rgba(0,240,168,0.3)" : "var(--border-strong)"}
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  );
}
