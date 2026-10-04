"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { Container } from "@/components/ui/section";
import { QUICKSTART_HREF } from "@/lib/site";
import { CopyInstall } from "./CopyInstall";
import { VideoModal } from "./VideoModal";
import { HeroTrace } from "./trace/HeroTrace";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

export function Hero() {
  const [filmOpen, setFilmOpen] = useState(false);

  // Pulled up under the floating nav (68px) so the sheet runs to the top edge.
  return (
    <section className="relative isolate -mt-[68px] overflow-clip pb-4">
      <VideoModal open={filmOpen} onClose={() => setFilmOpen(false)} />
      <div aria-hidden className="paper-grid" />
      <div aria-hidden className="hero-light" />

      <Container className="relative pt-[96px] sm:pt-[104px]">
        {/* the case file's header rule */}
        <div
          className="rise flex items-center justify-between gap-4 pb-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--ink-3)] shadow-[inset_0_-1px_0_var(--line-2)]"
          style={step(0)}
        >
          <span>
            <span className="foil font-semibold">ARGUS</span> · Case file 58c376
          </span>
          <span className="hidden sm:inline">Fig. 1 — a silent failure, traced</span>
        </div>

        <div className="flex flex-col items-center pt-9 text-center sm:pt-10">
          <Link
            href="/docs/cli-reference"
            className="rise group inline-flex items-center gap-2.5 rounded-full bg-[var(--raised)] py-1 pl-1 pr-3.5 text-[13px] text-[var(--ink-2)] shadow-[inset_0_0_0_1px_var(--line-2),0_1px_2px_rgba(20,20,22,0.05)] transition-shadow hover:text-[var(--ink)] hover:shadow-[inset_0_0_0_1px_var(--iris)]"
            style={step(1)}
          >
            <span className="rounded-full bg-[var(--ink)] px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[#e6cf8a]">
              New
            </span>
            <span>
              <span className="font-mono text-[12.5px] text-[var(--ink)]">argus check</span> fails CI on
              silent failures
            </span>
            <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>

          <h1 className="display-1 rise mt-6 max-w-[14ch] text-[var(--ink)]" style={step(2)}>
            Catch <span className="marker">silent failures</span> before you deploy.
          </h1>

          <p className="lede rise mt-5 max-w-[36rem]" style={step(3)}>
            Your agent finishes, but one node quietly returned nothing. ARGUS finds
            that node and fails the build before it ships.
          </p>

          <div className="rise mt-7 flex flex-wrap items-center justify-center gap-3" style={step(4)}>
            <Link href={QUICKSTART_HREF} className="btn-primary btn-lg group">
              Get started
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <button type="button" onClick={() => setFilmOpen(true)} className="btn-secondary btn-lg gap-2.5 pl-2.5">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--ink)] text-[#e6cf8a]">
                <Play size={11} className="translate-x-px fill-current" />
              </span>
              Watch the film
              <span className="font-mono text-[12px] text-[var(--ink-3)]">1 min</span>
            </button>
          </div>

          <div
            className="rise mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-[11.5px] tracking-[0.04em] text-[var(--ink-3)]"
            style={step(5)}
          >
            <CopyInstall plain className="h-8 px-2 text-[12.5px]" />
            <span aria-hidden className="text-[var(--line-3)] max-sm:hidden">·</span>
            <span className="inline-flex items-center gap-2 text-[var(--ink-2)]">
              <span className="rounded-[4px] bg-[var(--ink)] px-1.5 py-[3px] text-[10px] font-semibold tracking-[-0.02em] text-[#e6cf8a]">
                16VC
              </span>
              Founder Fellow
            </span>
            <span aria-hidden className="text-[var(--line-3)]">·</span>
            <span>Open-source core</span>
          </div>
        </div>
      </Container>

      <div className="rise mt-4 sm:mt-6" style={step(6)}>
        <HeroTrace />
      </div>
    </section>
  );
}
