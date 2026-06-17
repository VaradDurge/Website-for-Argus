"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { ButtonColorful } from "@/components/ui/button-colorful";
import { StarButton } from "@/components/ui/star-button";
import { MorphingText } from "@/components/ui/morphing-text";
import { BetaAccessModal } from "./BetaAccessModal";
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
  const [copied, setCopied] = useState(false);

  return (
    <section className="relative">
      <BetaAccessModal open={betaOpen} onClose={() => setBetaOpen(false)} />

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
          <div className="eyebrow inline-block">
            ❍ Forensic Observability for AI Agents
          </div>

          <h1 className="mt-6 font-medium text-[36px] sm:text-[64px] lg:text-[80px] xl:text-[92px] leading-[1.05] tracking-[-0.04em]">
            Your agent finished.
            <br />
            But did it actually{" "}
            <MorphingText
              words={HERO_VERBS}
              interval={2800}
              gradient
              className="font-serif-italic"
            />
          </h1>

          <p className="mt-6 mx-auto max-w-[480px] text-[15px] sm:text-[17px] leading-[1.65] text-[var(--text-muted)]">
            ARGUS catches silent failures and traces root causes{" "}
            <span className="text-white font-medium">before you deploy</span> —
            so broken pipelines never reach production.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
            <button onClick={() => setBetaOpen(true)}>
              <ButtonColorful label="Book a Call" />
            </button>
            <span className="text-[11px] text-[var(--text-dim)] tracking-wide">
              ~1 min setup
            </span>
            <a href="/docs">
              <StarButton lightColor="#8b7dff" backgroundColor="transparent">
                Read the docs
              </StarButton>
            </a>
          </div>

          {/* pip install line */}
          <div className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] sm:text-[12px] text-[var(--text-dim)]">
            <span className="text-[var(--accent-soft)]">$</span>
            <span className="text-[var(--text-muted)]">pip install argus-agents</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText("pip install argus-agents");
                setCopied(true);
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
          </div>
        </div>

        {/* Trial UI — full width like Linear */}
        <div className="mt-14 lg:mt-20 max-w-[1200px] mx-auto">
          <TrialUI />
        </div>
      </div>
    </section>
  );
}
