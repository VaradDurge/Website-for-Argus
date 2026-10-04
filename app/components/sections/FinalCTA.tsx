"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/section";
import { QUICKSTART_HREF } from "@/lib/site";
import { cn } from "@/lib/utils";
import { BetaAccessModal } from "../BetaAccessModal";
import { WaitlistModal } from "../WaitlistModal";
import { CopyInstall } from "../CopyInstall";

/* The hero ends on a blocked deploy (exit 1). The page ends on the same
   spine run clean: every node passes and the gate stays open (exit 0).
   Positions are percentages so it spans any width; phones drop every
   other node. */
const NODES = [6, 16, 26, 36, 46, 56, 66];

function CleanRun() {
  return (
    <div aria-hidden className="clean-run">
      <span className="clean-run__line" />
      {NODES.map((x, i) => (
        <span key={x} className={cn("clean-run__node", i % 2 === 1 && "max-sm:hidden")} style={{ left: `${x}%` }} />
      ))}
      <span className="clean-run__gate">
        <span className="clean-run__post" />
        <span className="clean-run__label">DEPLOY</span>
        <span className="clean-run__exit">exit 0</span>
      </span>
    </div>
  );
}

export function FinalCTA() {
  const [callOpen, setCallOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);

  return (
    <section className="relative isolate overflow-clip pt-28 md:pt-40">
      <BetaAccessModal open={callOpen} onClose={() => setCallOpen(false)} />
      <WaitlistModal open={listOpen} onClose={() => setListOpen(false)} />
      <div aria-hidden className="paper-grid" />
      <div aria-hidden className="cta-light" />

      <Container className="relative">
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
          <CopyInstall plain className="mt-4" />
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
