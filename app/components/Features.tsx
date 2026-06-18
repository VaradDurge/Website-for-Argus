"use client";

import { motion } from "framer-motion";
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
  },
  {
    icon: Crosshair,
    title: "Root cause analysis",
    body: "Traces degradation back to the exact step that caused it. The node that crashes is rarely the node that broke.",
  },
  {
    icon: Activity,
    title: "Semantic degradation",
    body: "Understands meaning, not just errors. Collapsed confidence, weak summaries, missing reasoning — caught before they propagate.",
  },
  {
    icon: GitCompareArrows,
    title: "Replay + diff",
    body: "Re-run any node with frozen upstream state. Compare original vs replayed output. Verify fixes before shipping.",
  },
  {
    icon: GitMerge,
    title: "Multi-agent tracing",
    body: "Follow degradation across agent boundaries, not just within a single graph. See how bad state fans out.",
  },
  {
    icon: Layers,
    title: "Framework agnostic",
    body: "Works with LangGraph, plain Python DAGs, and any multi-step pipeline. Wrap your graph — keep your logic.",
  },
];

export function Features() {
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

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative rounded-xl p-6 lg:p-7 transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: "var(--surface)" }}
            >
              {/* Icon */}
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-5 transition-colors duration-300 group-hover:text-[var(--accent-soft)]"
                style={{
                  background: "rgba(109,92,255,0.06)",
                  color: "var(--text-dim)",
                }}
              >
                <f.icon size={17} strokeWidth={1.5} />
              </div>

              {/* Text */}
              <h3 className="text-[15px] text-white font-medium leading-[1.3] mb-2">
                {f.title}
              </h3>
              <p className="text-[13.5px] leading-[1.65] text-[var(--text-muted)]">
                {f.body}
              </p>

              {/* Hover glow — very subtle */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  boxShadow: "inset 0 0 0 1px rgba(109,92,255,0.1), 0 4px 24px -8px rgba(109,92,255,0.08)",
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
