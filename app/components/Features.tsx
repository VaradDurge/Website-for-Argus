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
    body: "Catches issues that look successful but are actually wrong — empty arrays, placeholder text, hallucinated outputs.",
  },
  {
    icon: Crosshair,
    title: "Root cause analysis",
    body: "Traces degradation back to the exact step that caused it. The node that crashes is rarely the node that broke.",
  },
  {
    icon: Activity,
    title: "Semantic degradation",
    body: "Understands meaning, not just errors. Collapsed confidence, weak summaries, missing reasoning.",
  },
  {
    icon: GitCompareArrows,
    title: "Replay + diff",
    body: "Re-run any node with frozen upstream state. Compare original vs replayed output. Verify before shipping.",
  },
  {
    icon: GitMerge,
    title: "Multi-agent tracing",
    body: "Follow degradation across agent boundaries. See how bad state fans out through branches.",
  },
  {
    icon: Layers,
    title: "Framework agnostic",
    body: "Works with LangGraph, plain Python DAGs, and any multi-step pipeline.",
  },
];

export function Features() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="features" className="relative pt-24 lg:pt-32 pb-10 lg:pb-14">
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

        {/* Feature names — inline with tooltip */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {FEATURES.map((f, i) => {
            const isActive = activeIndex === i;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative"
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={() => setActiveIndex(isActive ? null : i)}
              >
                <button
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[14px] sm:text-[15px] font-medium transition-all duration-200 cursor-default select-none"
                  style={{
                    color: isActive ? "white" : "var(--text-muted)",
                    background: isActive
                      ? "rgba(109,92,255,0.1)"
                      : "rgba(255,255,255,0.03)",
                  }}
                >
                  <f.icon
                    size={15}
                    strokeWidth={1.5}
                    className="transition-colors duration-200"
                    style={{
                      color: isActive
                        ? "var(--accent-soft)"
                        : "var(--text-dim)",
                    }}
                  />
                  {f.title}
                </button>

                {/* Tooltip — inline, pushes content down on mobile */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.97 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute left-0 top-full mt-2 z-20 w-[260px] sm:w-[280px] px-4 py-3 rounded-lg text-[13px] leading-[1.6] text-[var(--text-muted)]"
                      style={{
                        background: "var(--surface-2)",
                        border: "1px solid var(--border)",
                        boxShadow: "0 8px 32px -8px rgba(0,0,0,0.6)",
                      }}
                    >
                      {f.body}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
