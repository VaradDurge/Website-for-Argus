"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldOff,
  Crosshair,
  Activity,
  GitCompareArrows,
  GitMerge,
  Layers,
} from "lucide-react";

const FEATURES = [
  {
    icon: ShieldOff,
    title: "Silent failure detection",
    body: "Catches issues that look successful but are actually wrong — empty arrays, placeholder text, hallucinated outputs that pass every schema check.",
    tag: "detection",
  },
  {
    icon: Crosshair,
    title: "Root cause analysis",
    body: "Traces degradation back to the exact step that caused it. The node that crashes is rarely the node that broke — ARGUS finds where it started.",
    tag: "tracing",
  },
  {
    icon: Activity,
    title: "Semantic degradation signals",
    body: "Understands meaning, not just errors. Collapsed confidence, weak summaries, missing reasoning — caught before they propagate downstream.",
    tag: "semantics",
  },
  {
    icon: GitCompareArrows,
    title: "Replay + diff",
    body: "Re-run any node with frozen upstream state. Compare original vs replayed output side-by-side. Verify fixes before shipping.",
    tag: "replay",
  },
  {
    icon: GitMerge,
    title: "Multi-agent tracing",
    body: "Follow degradation across agent boundaries, not just within a single graph. See how bad state fans out through branches.",
    tag: "multi-agent",
  },
  {
    icon: Layers,
    title: "Framework agnostic",
    body: "Works with LangGraph, plain Python DAGs, and any multi-step pipeline. Wrap your graph — keep your existing logic untouched.",
    tag: "integration",
  },
];

export function Features() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="features" className="relative pt-24 lg:pt-32 pb-10 lg:pb-14">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        {/* Header */}
        <div className="mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="eyebrow"
          >
            Features
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
            Built for engineers who ship.
          </motion.h2>
        </div>

        {/* Feature rows */}
        <div className="border-t border-[var(--border)]">
          {FEATURES.map((f, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group border-b border-[var(--border)] relative"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Accent line — left edge */}
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-[2px]"
                  style={{ background: "var(--accent)", transformOrigin: "top" }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                />

                <div className="flex items-start gap-6 sm:gap-10 lg:gap-16 py-6 lg:py-8 pl-4 lg:pl-6 pr-2 cursor-default">
                  {/* Number */}
                  <span
                    className="font-mono text-[13px] tracking-[0.1em] shrink-0 w-8 pt-0.5 transition-colors duration-300"
                    style={{
                      color: isHovered
                        ? "var(--accent-soft)"
                        : "var(--text-dim)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="transition-colors duration-300"
                        animate={{
                          color: isHovered
                            ? "var(--accent-soft)"
                            : "var(--text-dim)",
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <f.icon size={16} strokeWidth={1.5} />
                      </motion.div>
                      <h3
                        className="text-[17px] sm:text-[19px] lg:text-[21px] font-medium tracking-[-0.01em] transition-colors duration-300"
                        style={{
                          color: isHovered ? "white" : "var(--text-muted)",
                        }}
                      >
                        {f.title}
                      </h3>
                    </div>

                    <AnimatePresence>
                      {isHovered && (
                        <motion.p
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="overflow-hidden text-[14px] leading-[1.65] text-[var(--text-muted)] max-w-xl mt-2 pl-[28px]"
                        >
                          {f.body}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Tag */}
                  <span
                    className="hidden sm:inline-block font-mono text-[11px] tracking-[0.12em] uppercase shrink-0 pt-1 transition-colors duration-300"
                    style={{
                      color: isHovered
                        ? "var(--accent-soft)"
                        : "var(--text-dim)",
                    }}
                  >
                    {f.tag}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
