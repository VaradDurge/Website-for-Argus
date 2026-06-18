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
    <section id="features" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10 grid lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-24 items-start">
        {/* Left — sticky heading */}
        <div className="lg:sticky lg:top-28 lg:self-start">
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-6 text-[36px] sm:text-[46px] lg:text-[52px] leading-[0.98] tracking-[-0.03em] font-medium"
          >
            Built for
            <br />
            engineers
            <br />
            <span className="font-serif-italic text-[var(--accent-soft)]">
              who ship.
            </span>
          </motion.h2>
        </div>

        {/* Right — stacked feature items */}
        <div className="flex flex-col gap-1">
          {FEATURES.map((f, i) => {
            const isActive = activeIndex === i;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
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
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-lg text-left transition-all duration-200 cursor-default select-none"
                  style={{
                    background: isActive
                      ? "rgba(109,92,255,0.08)"
                      : "transparent",
                  }}
                >
                  <f.icon
                    size={16}
                    strokeWidth={1.5}
                    className="shrink-0 transition-colors duration-200"
                    style={{
                      color: isActive
                        ? "var(--accent-soft)"
                        : "var(--text-dim)",
                    }}
                  />
                  <span
                    className="text-[15px] sm:text-[16px] font-medium transition-colors duration-200"
                    style={{
                      color: isActive ? "white" : "var(--text-muted)",
                    }}
                  >
                    {f.title}
                  </span>
                </button>

                {/* Description — expands below */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pl-[44px] pb-3 text-[13.5px] leading-[1.6] text-[var(--text-muted)]">
                        {f.body}
                      </p>
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
