"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { Container } from "@/components/ui/section";
import { QUICKSTART_HREF } from "@/lib/site";
import { CopyInstall } from "./CopyInstall";
import { ScopeRings } from "./ScopeRings";
import { VideoModal } from "./VideoModal";
import { HeroTrace } from "./trace/HeroTrace";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

export function Hero() {
  const [filmOpen, setFilmOpen] = useState(false);

  // Pulled up under the floating nav (68px) so the scope light reaches the top edge.
  return (
    <section className="relative isolate -mt-[68px] overflow-clip pb-4">
      <VideoModal open={filmOpen} onClose={() => setFilmOpen(false)} />
      <div aria-hidden className="hero-light" />

      <Container className="relative flex flex-col items-center pt-[116px] text-center sm:pt-[132px]">
        <ScopeRings />

        <Link
          href="/docs/cli-reference"
          className="rise group inline-flex items-center gap-2.5 rounded-full bg-[color-mix(in_srgb,var(--raised)_70%,transparent)] py-1 pl-1 pr-3.5 text-[13px] text-[var(--ink-2)] shadow-[inset_0_0_0_1px_var(--line-2)] backdrop-blur-md transition-colors hover:text-[var(--ink)] hover:shadow-[inset_0_0_0_1px_var(--iris-border)]"
          style={step(0)}
        >
          <span className="rounded-full bg-[var(--iris-subtle)] px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--iris-fg)] shadow-[inset_0_0_0_1px_var(--iris-border)]">
            New
          </span>
          <span>
            <span className="font-mono text-[12.5px] text-[var(--ink)]">argus check</span> fails CI on
            silent failures
          </span>
          <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>

        <h1 className="display-1 text-sheen rise mt-6 max-w-[14ch]" style={step(1)}>
          Catch silent failures before you deploy.
        </h1>

        <p className="lede rise mt-6 max-w-[36rem]" style={step(2)}>
          Your agent finishes, but one node quietly returned nothing. ARGUS finds
          that node and fails the build before it ships.
        </p>

        <div className="rise mt-8 flex flex-wrap items-center justify-center gap-3" style={step(3)}>
          <Link href={QUICKSTART_HREF} className="btn-primary btn-lg group">
            Get started
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
          <button type="button" onClick={() => setFilmOpen(true)} className="btn-secondary btn-lg gap-2.5 pl-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--iris-subtle)] text-[var(--iris-fg)] shadow-[inset_0_0_0_1px_var(--iris-border)]">
              <Play size={11} className="translate-x-px fill-current" />
            </span>
            Watch the film
            <span className="font-mono text-[12px] text-[var(--ink-3)]">1 min</span>
          </button>
        </div>

        <div
          className="rise mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-[11.5px] tracking-[0.04em] text-[var(--ink-3)]"
          style={step(4)}
        >
          <CopyInstall plain className="h-8 px-2 text-[12.5px]" />
          <span aria-hidden className="text-[var(--line-3)] max-sm:hidden">·</span>
          <span className="inline-flex items-center gap-2 text-[var(--ink-2)]">
            <span className="rounded-[4px] bg-[var(--ink)] px-1.5 py-[3px] text-[10px] font-semibold tracking-[-0.02em] text-[var(--void)]">
              16VC
            </span>
            Founder Fellow
          </span>
          <span aria-hidden className="text-[var(--line-3)]">·</span>
          <span>Open-source core</span>
        </div>
      </Container>

      <div className="rise mt-6 sm:mt-8" style={step(6)}>
        <HeroTrace />
      </div>
    </section>
  );
}
