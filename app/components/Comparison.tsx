"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const ROWS = [
  {
    capability: "Silent failures",
    argus: "Auto-detects hallucinations, empty outputs, semantic degradation",
    others: "Logs calls as successful — silent failures invisible",
  },
  {
    capability: "Root cause",
    argus: "Walks backward through the graph to the node that broke",
    others: "Manual trace inspection",
  },
  {
    capability: "Replay",
    argus: "Re-run any node with frozen inputs and recorded state",
    others: "Not available",
  },
  {
    capability: "Setup",
    argus: "argus.wrap(graph) — 2 lines, no account needed",
    others: "SDK + cloud platform + dashboard config",
  },
  {
    capability: "CI/CD gating",
    argus: "Built-in — fail pipelines on regressions",
    others: "Requires custom integration",
  },
];

export function Comparison() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative py-20 lg:py-24">
      <div className="mx-auto max-w-[960px] px-6 lg:px-10">
        {/* Header */}
        <div className="mb-14 lg:mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="eyebrow inline-block"
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

        {/* Column labels */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="hidden lg:grid grid-cols-[36px_0.8fr_1fr_1fr] gap-4 pb-2 border-b border-[var(--border)]"
        >
          <span />
          <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--text-dim)]">
            Capability
          </span>
          <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--accent-soft)]">
            Argus
          </span>
          <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--text-dim)]">
            LangSmith / Langfuse
          </span>
        </motion.div>

        {/* Rows */}
        <div className="border-t border-[var(--border)] lg:border-t-0">
          {ROWS.map((row, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <motion.div
                key={row.capability}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative border-b border-[var(--border)]"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Accent line */}
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-[2px]"
                  style={{
                    background: "var(--signal-ok)",
                    transformOrigin: "top",
                  }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                />

                {/* Desktop layout */}
                <div className="hidden lg:grid grid-cols-[36px_0.8fr_1fr_1fr] gap-4 py-3.5 pl-3 pr-2 cursor-default">
                  <span
                    className="font-mono text-[12px] tracking-[0.1em] pt-px transition-colors duration-300"
                    style={{
                      color: isHovered
                        ? "var(--accent-soft)"
                        : "var(--text-dim)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span
                    className="text-[13.5px] font-medium tracking-[-0.01em] transition-colors duration-300"
                    style={{
                      color: isHovered ? "white" : "var(--text-muted)",
                    }}
                  >
                    {row.capability}
                  </span>

                  <div className="flex items-start gap-2">
                    <span
                      className="mt-[6px] w-1 h-1 rounded-full shrink-0 transition-colors duration-300"
                      style={{
                        background: isHovered
                          ? "var(--signal-ok)"
                          : "var(--text-dim)",
                      }}
                    />
                    <span
                      className="text-[13px] leading-[1.5] transition-colors duration-300"
                      style={{
                        color: isHovered ? "white" : "var(--text-muted)",
                      }}
                    >
                      {row.argus}
                    </span>
                  </div>

                  <span className="text-[13px] leading-[1.5] text-[var(--text-dim)]">
                    {row.others}
                  </span>
                </div>

                {/* Mobile layout */}
                <div className="lg:hidden py-3.5 pl-3 pr-2 space-y-1.5 cursor-default">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[12px] tracking-[0.1em] text-[var(--text-dim)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[13.5px] font-medium text-[var(--text-muted)]">
                      {row.capability}
                    </span>
                  </div>
                  <div className="pl-8 flex items-start gap-1.5">
                    <span className="mt-[5px] w-1 h-1 rounded-full shrink-0 bg-[var(--signal-ok)]" />
                    <span className="text-[12.5px] leading-[1.5] text-white">
                      {row.argus}
                    </span>
                  </div>
                  <div className="pl-8">
                    <span className="text-[12px] leading-[1.5] text-[var(--text-dim)]">
                      {row.others}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
