"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { Activity, ShieldOff, Crosshair, RotateCcw } from "lucide-react";

const STATS: { value: number; suffix: string; label: string; icon: typeof Activity }[] = [
  { value: 847, suffix: "", label: "Pipelines Analyzed", icon: Activity },
  { value: 213, suffix: "", label: "Silent Failures Caught", icon: ShieldOff },
  { value: 580, suffix: "", label: "Root Causes Identified", icon: Crosshair },
  { value: 34, suffix: "", label: "Replay Recoveries", icon: RotateCcw },
];

export function Stats() {
  return (
    <section id="stats" className="relative pt-16 lg:pt-20 pb-10 lg:pb-14">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <div className="eyebrow text-center mb-8">By the numbers</div>
        <div className="grid grid-cols-2 gap-6 sm:flex sm:items-center sm:justify-center sm:gap-10 lg:gap-14 sm:flex-wrap">
          {STATS.map((s) => (
            <Counter key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Counter({
  value,
  suffix,
  label,
  icon: Icon,
}: {
  value: number;
  suffix: string;
  label: string;
  icon: typeof Activity;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => Math.round(v).toString());

  useEffect(() => {
    if (inView) {
      const controls = animate(mv, value, {
        duration: 1.6,
        ease: [0.2, 0.6, 0.2, 1],
      });
      return () => controls.stop();
    }
  }, [inView, mv, value]);

  return (
    <div ref={ref} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2.5">
      <div className="flex items-center gap-2">
        <Icon size={16} strokeWidth={1.6} className="text-[#f5b13c]" />
        <div className="flex items-baseline gap-0.5">
          <motion.span className="text-[28px] sm:text-[32px] font-semibold tracking-[-0.02em] text-white">
            {display}
          </motion.span>
          <span className="text-[16px] sm:text-[18px] font-semibold text-[#f5b13c] tracking-[-0.01em]">
            {suffix}
          </span>
        </div>
      </div>
      <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[var(--text-dim)] sm:ml-0.5">
        {label}
      </span>
    </div>
  );
}
