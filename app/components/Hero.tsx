"use client";

import { useState } from "react";
import { LiveTrace } from "./LiveTrace";
import { ButtonColorful } from "@/components/ui/button-colorful";
import { StarButton } from "@/components/ui/star-button";
import { MorphingText } from "@/components/ui/morphing-text";
import { BetaAccessModal } from "./BetaAccessModal";

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

  return (
    <section className="relative">
      <BetaAccessModal open={betaOpen} onClose={() => setBetaOpen(false)} />
      {/* Background atmosphere */}
      <div
        className="absolute inset-0 -z-10 dots-bg opacity-[0.55]"
        style={{
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, black, transparent)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, black, transparent)",
        }}
      />

      <div className="mx-auto max-w-[1280px] px-6 lg:px-10 pt-16 lg:pt-24 pb-20">
        <div className="grid lg:grid-cols-[1.05fr_1.1fr] gap-10 lg:gap-14 items-start">
          {/* LEFT */}
          <div>
            <div className="eyebrow">
              ❍ Forensic Observability for AI Agents
            </div>

            <h1 className="mt-6 font-medium text-[32px] sm:text-[58px] lg:text-[72px] leading-[1.05] tracking-[-0.035em]">
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

            <p className="mt-6 max-w-[520px] text-[16.5px] leading-[1.65] text-[var(--text-muted)]">
              ARGUS catches silent failures and traces root causes{" "}
              <span className="text-white font-medium">before you deploy</span> — so
              broken pipelines never reach production.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <button onClick={() => setBetaOpen(true)}>
                <ButtonColorful label="Beta Access" />
              </button>
              <a href="/docs">
                <StarButton lightColor="#8b7dff" backgroundColor="transparent">
                  Read the docs
                </StarButton>
              </a>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:pt-2">
            <LiveTrace />
          </div>
        </div>
      </div>
    </section>
  );
}
