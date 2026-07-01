"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { ButtonColorful } from "@/components/ui/button-colorful";
import { StarButton } from "@/components/ui/star-button";
import { MorphingText } from "@/components/ui/morphing-text";
import { BetaAccessModal } from "./BetaAccessModal";
import { VideoModal } from "./VideoModal";
import { TrialUI } from "./TrialUI";

const HERO_VERBS = [
  "work?",
  "succeed?",
  "deliver?",
  "reason?",
  "think?",
  "hold?",
];

export function Hero() {
  const [betaOpen, setBetaOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyRef = useRef<HTMLButtonElement>(null);

  return (
    <section className="relative">
      <BetaAccessModal open={betaOpen} onClose={() => setBetaOpen(false)} />
      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />

      {/* Background atmosphere */}
      <div
        className="absolute inset-0 -z-10 dots-bg opacity-[0.35]"
        style={{
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, black, transparent)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, black, transparent)",
        }}
      />

      <div className="mx-auto max-w-[1280px] px-6 lg:px-10 pt-20 lg:pt-28 pb-0">
        {/* Centered stack */}
        <div className="text-center max-w-[800px] mx-auto">
          {/* Eyebrow — fade up + blur */}
          <motion.div
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="eyebrow inline-block"
          >
            ❍ Forensic Observability for AI Agents
          </motion.div>

          {/* H1 — staggered lines */}
          <h1 className="mt-6 font-medium text-[36px] sm:text-[64px] lg:text-[80px] xl:text-[92px] leading-[1.05] tracking-[-0.04em]">
            <motion.span
              className="inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              Your agent finished.
            </motion.span>
            <br />
            <motion.span
              className="inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              But did it actually{" "}
              <MorphingText
                words={HERO_VERBS}
                interval={2800}
                gradient
                className="font-serif-italic"
              />
            </motion.span>
          </h1>

          {/* Subtitle — fade + blur */}
          <motion.p
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
            className="mt-5 sm:mt-6 mx-auto max-w-[340px] sm:max-w-[480px] text-[14px] sm:text-[17px] leading-[1.65] text-[var(--text-muted)]"
          >
            ARGUS catches silent failures and traces root causes{" "}
            <span className="text-white font-medium">before you deploy</span> —
            so broken pipelines never reach production.
          </motion.p>

          {/* CTA buttons — scale in */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6, type: "spring", stiffness: 150, damping: 20 }}
            className="mt-8 flex items-center justify-center gap-3 flex-wrap"
          >
            <button onClick={() => setBetaOpen(true)}>
              <ButtonColorful label="Book a Call" />
            </button>
            <button
              onClick={() => setVideoOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--border)] text-[13px] font-medium text-[var(--text-muted)] hover:text-white hover:border-[var(--border-strong)] transition-colors"
            >
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/10">
                <svg width="8" height="10" viewBox="0 0 8 10" fill="currentColor">
                  <path d="M0 0l8 5-8 5V0z" />
                </svg>
              </span>
              Watch Demo
            </button>
            <a href="/docs">
              <StarButton lightColor="#8b7dff" backgroundColor="transparent">
                Read the docs
              </StarButton>
            </a>
          </motion.div>

          {/* pip install line — fade in */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.75 }}
            className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] sm:text-[12px] text-[var(--text-dim)]"
          >
            <span className="text-[var(--accent-soft)]">$</span>
            <span className="text-[var(--text-muted)]">pip install argus-agents</span>
            <button
              ref={copyRef}
              onClick={() => {
                navigator.clipboard.writeText("pip install argus-agents");
                setCopied(true);
                if (copyRef.current) {
                  copyRef.current.classList.remove("copy-pulse");
                  void copyRef.current.offsetWidth;
                  copyRef.current.classList.add("copy-pulse");
                }
                setTimeout(() => setCopied(false), 1400);
              }}
              className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-md border border-[var(--border)] text-[var(--text-muted)] hover:text-white hover:border-[var(--border-strong)] transition-colors"
              aria-label="Copy install command"
            >
              {copied ? <Check size={10} /> : <Copy size={10} />}
            </button>
            <span className="text-[var(--text-dim)]/60 hidden sm:inline">
              · 4 lines to integrate
            </span>
          </motion.div>
        </div>

        {/* Trial UI — the big reveal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 lg:mt-20 max-w-[1200px] mx-auto"
        >
          <TrialUI />
        </motion.div>
      </div>
    </section>
  );
}
