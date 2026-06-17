"use client";

import { motion } from "framer-motion";
import { ShieldOff, Crosshair, Activity, GitCompareArrows, GitMerge, Layers } from "lucide-react";

const FEATURES = [
  {
    icon: ShieldOff,
    title: "Silent failure detection",
    body: "Catches issues that look successful but are actually wrong.",
  },
  {
    icon: Crosshair,
    title: "Root cause analysis",
    body: "Traces degradation back to the exact step that caused it.",
  },
  {
    icon: Activity,
    title: "Semantic degradation signals",
    body: "Understands meaning, not just errors.",
  },
  {
    icon: GitCompareArrows,
    title: "Replay + diff",
    body: "Re-run, compare, and verify every change.",
  },
  {
    icon: GitMerge,
    title: "Multi-agent tracing",
    body: "Follow degradation across agent boundaries, not just within a single graph.",
  },
  {
    icon: Layers,
    title: "Framework agnostic",
    body: "Works with LangGraph, plain Python DAGs, and any multi-step pipeline.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative pt-24 lg:pt-32 pb-10 lg:pb-14">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="eyebrow inline-block">Features</div>
          <h2 className="mt-5 text-[38px] sm:text-[46px] lg:text-[52px] leading-[1.05] tracking-[-0.03em] font-medium">
            Built for engineers who ship.
          </h2>
          <p className="mt-4 text-[15px] leading-[1.65] text-[var(--text-muted)] max-w-lg mx-auto">
            Detect failures, trace root causes, and fix your pipeline —
            <br className="hidden sm:block" />
            all before a single user is affected.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border)] rounded-xl overflow-hidden border border-[var(--border)]">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="bg-[var(--bg)] p-5 lg:p-6 flex items-start gap-4"
            >
              <div className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center text-[var(--accent-soft)]" style={{ background: "rgba(109,92,255,0.08)" }}>
                <f.icon size={17} strokeWidth={1.6} />
              </div>
              <div className="min-w-0">
                <h3 className="text-[14px] text-white font-medium leading-[1.3]">{f.title}</h3>
                <p className="mt-1.5 text-[13px] leading-[1.55] text-[var(--text-muted)]">{f.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
