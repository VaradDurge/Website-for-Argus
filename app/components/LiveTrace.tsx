"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ProximityGlow } from "./ProximityGlow";

type LogEntry = {
  t: string;
  level: "INFO" | "WARN";
  msg: string;
  detail?: string;
};

const SCRIPT: LogEntry[] = [
  { t: "00:00:01", level: "INFO", msg: "Init extraction pipeline" },
  { t: "00:00:02", level: "INFO", msg: "Fetching data from source" },
  { t: "00:00:04", level: "INFO", msg: "Parsing document" },
  {
    t: "00:00:07",
    level: "WARN",
    msg: "Semantic degradation detected",
    detail: "Entity ‘summary’ returned placeholder",
  },
  { t: "00:00:09", level: "INFO", msg: "Validating output" },
  {
    t: "00:00:11",
    level: "WARN",
    msg: "Downstream impact detected",
    detail: "Validation confidence below threshold",
  },
  { t: "00:00:13", level: "INFO", msg: "Pipeline completed with issues" },
];

export function LiveTrace() {
  const [visible, setVisible] = useState<LogEntry[]>([]);
  const [tick, setTick] = useState(0);

  // play the script on a loop
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let i = 0;

    setVisible([]);

    const schedule = (fn: () => void, ms: number) => {
      timer = setTimeout(() => {
        if (cancelled) return;
        fn();
      }, ms);
    };

    const step = () => {
      if (cancelled) return;
      if (i >= SCRIPT.length) {
        schedule(() => {
          if (cancelled) return;
          setVisible([]);
          i = 0;
          setTick((t) => t + 1);
          step();
        }, 2400);
        return;
      }
      const next = SCRIPT[i];
      if (!next) return;
      setVisible((prev) => [...prev, next]);
      i += 1;
      schedule(step, 850);
    };

    schedule(step, 400);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  const sequenceComplete = visible.length === SCRIPT.length;

  return (
    <ProximityGlow className="rounded-[16px]" proximity={5000}>

      <div className="panel overflow-hidden relative">
        {/* card header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]">
          <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--text-muted)]">
            <span className="live-dot" style={{ width: 6, height: 6 }} />
            Argus Live Trace
          </span>
          <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--signal-ok)]">
            <span className="live-dot" />
            Live
          </span>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px]">
        {/* log column */}
        <div className="px-5 py-4 min-h-[360px] font-mono text-[12.5px] leading-[1.85] border-b lg:border-b-0 lg:border-r border-[var(--border)]">
          <AnimatePresence initial={false}>
            {visible.filter(Boolean).map((l, idx) => (
              <motion.div
                key={`${tick}-${idx}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-[78px_56px_1fr] gap-2 items-start"
              >
                <span className="text-[var(--text-dim)]">{l.t}</span>
                <span
                  className={
                    l.level === "WARN"
                      ? "text-[var(--signal-warn)]"
                      : "text-[var(--text-muted)]"
                  }
                >
                  [{l.level}]
                </span>
                <span
                  className={
                    l.level === "WARN" ? "text-[var(--signal-warn)]" : "text-white"
                  }
                >
                  {l.msg}
                  {l.detail && (
                    <span className="block text-[11.5px] mt-0.5 text-[var(--text-dim)]">
                      ↳ {l.detail}
                    </span>
                  )}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>

          {!sequenceComplete && (
            <div className="text-[var(--text-dim)] caret pl-[140px]" />
          )}
        </div>

        {/* sidebar facts */}
        <aside className="px-5 py-4 space-y-4 bg-[rgba(255,255,255,0.015)]">
          <Fact label="Root Cause" value={
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--signal-fail)]" />
              <span className="font-mono text-[12.5px] text-[var(--signal-fail)]">summarize</span>
            </span>
          } />
          <Fact label="Silent Failure" value={
            <span className="font-mono text-[12.5px] text-[var(--signal-warn)]">placeholder_detected</span>
          } />
          <div>
            <Label>Confidence</Label>
            <div className="mt-1.5 flex items-center gap-3">
              <div className="flex-1 h-[3px] bg-[var(--border)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "87%" }}
                  transition={{ duration: 1.6, ease: "easeOut", delay: 0.6 }}
                  className="h-full bg-[var(--signal-ok)]"
                />
              </div>
              <span className="font-mono text-[12px] text-white">87%</span>
            </div>
          </div>
          <Fact
            label="Propagation"
            value={
              <a
                href="#"
                className="font-mono text-[12.5px] text-white underline decoration-dotted underline-offset-2 hover:decoration-solid"
              >
                2 downstream steps
              </a>
            }
          />
          <Fact
            label="Replay Available"
            value={
              <a
                href="#replay"
                className="inline-flex items-center gap-1 font-mono text-[12.5px] text-[var(--accent-soft)] hover:text-white"
              >
                View in replay <ArrowRight size={12} />
              </a>
            }
          />
        </aside>
      </div>
      </div>
    </ProximityGlow>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--text-dim)]">
      {children}
    </div>
  );
}

function Fact({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-1">{value}</div>
    </div>
  );
}
