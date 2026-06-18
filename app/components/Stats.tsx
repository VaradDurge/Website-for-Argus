"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
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
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="eyebrow text-center mb-8"
        >
          By the numbers
        </motion.div>
        <div className="grid grid-cols-2 gap-6 sm:flex sm:items-center sm:justify-center sm:gap-10 lg:gap-14 sm:flex-wrap">
          {STATS.map((s, i) => (
            <Counter key={s.label} {...s} index={i} />
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
  index,
}: {
  value: number;
  suffix: string;
  label: string;
  icon: typeof Activity;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => Math.round(v).toString());
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (inView) {
      const controls = animate(mv, value, {
        duration: 1.6,
        ease: [0.2, 0.6, 0.2, 1],
        onComplete: () => setDone(true),
      });
      return () => controls.stop();
    }
  }, [inView, mv, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2.5"
    >
      <div className="flex items-center gap-2">
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: index * 0.15 + 0.1,
            type: "spring",
            stiffness: 300,
            damping: 15,
          }}
        >
          <Icon size={16} strokeWidth={1.6} className="text-[#f5b13c]" />
        </motion.div>
        <div className="flex items-baseline gap-0.5">
          <motion.span
            className="text-[28px] sm:text-[32px] font-semibold tracking-[-0.02em] text-white tabular-nums"
            animate={done ? { scale: [1, 1.06, 1] } : {}}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
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
    </motion.div>
  );
}
