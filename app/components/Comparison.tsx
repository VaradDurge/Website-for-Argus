"use client";

import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";

const POINTS = [
  {
    capability: "Silent failures",
    argus: "Detects hallucinations, empty outputs, semantic degradation automatically",
    others: "Logs successful calls — silent failures go unnoticed",
  },
  {
    capability: "Root cause",
    argus: "Walks backward through the graph to the exact node that broke",
    others: "Manual trace inspection",
  },
  {
    capability: "Replay",
    argus: "Re-run any node with recorded inputs and frozen upstream state",
    others: "Not available",
  },
  {
    capability: "Setup",
    argus: "argus.wrap(graph) — 2 lines, no account needed",
    others: "SDK + cloud platform + dashboard config",
  },
  {
    capability: "CI/CD gating",
    argus: "Built-in — fail pipelines on detected regressions",
    others: "Requires custom integration",
  },
];

export function Comparison() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        {/* Header */}
        <div className="mb-14 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="eyebrow"
          >
            Why Argus
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-5 text-[38px] sm:text-[46px] lg:text-[52px] leading-[1.05] tracking-[-0.03em] font-medium"
          >
            They trace.{" "}
            <span className="font-serif-italic text-[var(--accent-soft)]">
              We detect.
            </span>
          </motion.h2>
        </div>

        {/* Comparison cards */}
        <div className="space-y-3">
          {POINTS.map((point, i) => (
            <motion.div
              key={point.capability}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="rounded-xl overflow-hidden"
              style={{ background: "var(--surface)" }}
            >
              {/* Capability label */}
              <div className="px-6 pt-5 pb-1">
                <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--text-dim)]">
                  {String(i + 1).padStart(2, "0")} — {point.capability}
                </span>
              </div>

              {/* Two columns */}
              <div className="grid sm:grid-cols-2 gap-px px-5 pb-5">
                {/* Argus */}
                <div className="flex items-start gap-3 p-3 rounded-lg">
                  <span
                    className="mt-0.5 w-5 h-5 rounded-md shrink-0 flex items-center justify-center"
                    style={{ background: "rgba(0,240,168,0.1)" }}
                  >
                    <Check size={12} style={{ color: "var(--signal-ok)" }} strokeWidth={2.5} />
                  </span>
                  <div>
                    <span className="block text-[11px] font-mono tracking-[0.1em] uppercase text-[var(--signal-ok)] mb-1">
                      Argus
                    </span>
                    <span className="text-[13.5px] leading-[1.6] text-white">
                      {point.argus}
                    </span>
                  </div>
                </div>

                {/* Others */}
                <div className="flex items-start gap-3 p-3 rounded-lg">
                  <span
                    className="mt-0.5 w-5 h-5 rounded-md shrink-0 flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    <Minus size={12} style={{ color: "var(--text-dim)" }} strokeWidth={2} />
                  </span>
                  <div>
                    <span className="block text-[11px] font-mono tracking-[0.1em] uppercase text-[var(--text-dim)] mb-1">
                      LangSmith / Langfuse
                    </span>
                    <span className="text-[13.5px] leading-[1.6] text-[var(--text-dim)]">
                      {point.others}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
