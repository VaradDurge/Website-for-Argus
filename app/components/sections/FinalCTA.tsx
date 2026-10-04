"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/section";
import { QUICKSTART_HREF } from "@/lib/site";
import { BetaAccessModal } from "../BetaAccessModal";
import { WaitlistModal } from "../WaitlistModal";
import { CopyInstall } from "../CopyInstall";

/* The hero ends on a blocked deploy (exit 1). The page ends on the same
   spine run clean: every node passes and the gate stays open (exit 0). */
const NODES = [80, 230, 380, 530, 680, 830, 980];
const GATE = 1160;

function CleanRun() {
  return (
    <svg
      viewBox="0 0 1440 120"
      preserveAspectRatio="xMidYMid slice"
      className="clean-run h-[120px] w-full"
      aria-hidden
    >
      <line className="clean-run__line" x1="0" y1="60" x2="1440" y2="60" pathLength={1} />
      {NODES.map((x) => (
        <g key={x} className="clean-run__node">
          <circle cx={x} cy={60} r={7} />
          <circle cx={x} cy={60} r={2.6} className="clean-run__dot" />
        </g>
      ))}
      <path className="clean-run__gate" d={`M ${GATE} 14 L ${GATE} 46 M ${GATE} 74 L ${GATE} 106`} />
      <text x={GATE} y={8} textAnchor="middle" className="clean-run__label">
        DEPLOY
      </text>
      <text x={GATE + 16} y={92} className="clean-run__exit">
        exit 0
      </text>
    </svg>
  );
}

export function FinalCTA() {
  const [callOpen, setCallOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);

  return (
    <section className="relative isolate overflow-hidden pt-28 md:pt-40">
      <BetaAccessModal open={callOpen} onClose={() => setCallOpen(false)} />
      <WaitlistModal open={listOpen} onClose={() => setListOpen(false)} />
      <div aria-hidden className="cta-light" />

      <Container>
        <div className="reveal mx-auto flex max-w-[48rem] flex-col items-center text-center">
          <h2 className="display-1 text-sheen">Ship agents you can trust.</h2>
          <p className="lede mt-6 max-w-[30rem]">
            Catch the silent failure in CI, not in your users&rsquo; inbox.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href={QUICKSTART_HREF} className="btn-primary btn-lg group">
              Get started
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <button type="button" onClick={() => setCallOpen(true)} className="btn-secondary btn-lg">
              Book a call
            </button>
          </div>
          <CopyInstall className="mt-4 border-0 bg-transparent shadow-none hover:bg-transparent hover:shadow-none" />
          <button
            type="button"
            onClick={() => setListOpen(true)}
            className="mt-2 text-[13px] text-[var(--ink-3)] underline decoration-[var(--line-3)] underline-offset-4 transition-colors hover:text-[var(--ink-2)]"
          >
            Or join the early-access list
          </button>
        </div>
      </Container>

      <div className="mt-20 md:mt-28">
        <CleanRun />
      </div>
    </section>
  );
}
