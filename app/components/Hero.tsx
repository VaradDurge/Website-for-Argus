"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Check, Copy } from "lucide-react";
import { MorphingText } from "@/components/ui/morphing-text";
import { Container } from "@/components/ui/section";
import { BetaAccessModal } from "./BetaAccessModal";
import { VideoModal } from "./VideoModal";

const HERO_VERBS = ["work?", "succeed?", "deliver?", "reason?", "hold up?"];

const INSTALL_CMD = "pip install argus-agents";

const TRUST_ITEMS = [
  "LangGraph",
  "LangChain",
  "Plain Python DAGs",
  "Multi-agent pipelines",
];

export function Hero() {
  const [betaOpen, setBetaOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyRef = useRef<HTMLButtonElement>(null);

  function copyInstall() {
    navigator.clipboard.writeText(INSTALL_CMD);
    setCopied(true);
    if (copyRef.current) {
      copyRef.current.classList.remove("copy-pulse");
      void copyRef.current.offsetWidth;
      copyRef.current.classList.add("copy-pulse");
    }
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <section className="relative pt-12 pb-10 lg:pt-28 lg:pb-12">
      <BetaAccessModal open={betaOpen} onClose={() => setBetaOpen(false)} />
      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />

      <div aria-hidden className="hero-atmos" />

      <Container className="relative z-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          {/* headline */}
          <div className="max-w-[620px]">
            <p className="eyebrow">Forensic observability for AI agents</p>
            <h1 className="heading-1 mt-5 text-[var(--ink)]">
              Your agent finished.
              <br />
              But did it actually{" "}
              <MorphingText
                words={HERO_VERBS}
                interval={2800}
                className="text-[var(--ink-3)]"
              />
            </h1>
          </div>

          {/* subhead + CTAs */}
          <div className="max-w-[420px] lg:pb-2 lg:text-right">
            <p className="body-lg">
              ARGUS catches silent failures and traces root cause through your
              graph{" "}
              <span className="font-medium text-[var(--ink)]">
                before you deploy
              </span>
              , so broken pipelines never reach production.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2.5 lg:justify-end">
              <button
                type="button"
                onClick={() => setBetaOpen(true)}
                className="btn-primary"
              >
                Book a call
              </button>
              <button
                type="button"
                onClick={() => setVideoOpen(true)}
                className="btn-secondary"
              >
                Watch the demo
              </button>
              <Link href="/docs" className="btn-secondary">
                Read the docs
              </Link>
            </div>
          </div>
        </div>

        {/* trust strip */}
        <div className="mt-12 flex flex-col gap-4 border-t-[length:var(--hairline)] border-[var(--line)] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="eyebrow">Instruments</span>
            {TRUST_ITEMS.map((item) => (
              <span
                key={item}
                className="text-[13px] text-[var(--ink-2)]"
              >
                {item}
              </span>
            ))}
          </div>

          <button
            ref={copyRef}
            type="button"
            onClick={copyInstall}
            className="group inline-flex w-fit items-center gap-2 rounded-[var(--radius-control)] border-[length:var(--hairline)] border-[var(--line)] bg-[var(--ex)] px-2.5 py-1.5 font-mono text-[12px] text-[var(--ink-2)] transition-colors hover:border-[var(--line-2)] hover:text-[var(--ink)]"
            aria-label="Copy install command"
          >
            <span className="text-[var(--ink-3)]">$</span>
            <span>{INSTALL_CMD}</span>
            {copied ? (
              <Check size={12} className="text-[var(--sig-ok)]" />
            ) : (
              <Copy size={12} className="text-[var(--ink-3)]" />
            )}
          </button>
        </div>
      </Container>
    </section>
  );
}
