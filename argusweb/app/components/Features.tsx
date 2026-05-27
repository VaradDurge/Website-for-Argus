"use client";

import { motion } from "framer-motion";
import { ShieldOff, Crosshair, Activity, GitCompareArrows } from "lucide-react";

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
];

export function Features() {
  return (
    <section className="relative pt-20 lg:pt-28 pb-10 lg:pb-14">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        {/* centered header */}
        <div className="text-center">
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

        {/* 4-column card grid */}
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="relative panel-tight p-5 lg:p-6 flex flex-col"
            >
              {/* badge number */}
              <span className="absolute top-4 right-4 font-mono text-[11px] text-[var(--text-dim)]">
                0{i + 1}
              </span>

              {/* icon */}
              <div className="w-10 h-10 rounded-lg border border-[var(--accent-soft)]/30 bg-[rgba(109,92,255,0.08)] flex items-center justify-center text-[var(--accent-soft)]">
                <f.icon size={18} strokeWidth={1.6} />
              </div>

              {/* title */}
              <h3 className="mt-5 text-[15px] tracking-[-0.01em] text-white font-medium leading-[1.3]">
                {f.title}
              </h3>

              {/* divider */}
              <span className="mt-3 block w-5 h-px bg-[var(--accent-soft)]/40" />

              {/* body */}
              <p className="mt-3 text-[13px] leading-[1.6] text-[var(--text-muted)]">
                {f.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
