"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import { DemoModal } from "../DemoModal";

/* Each step plays a Remotion clip rendered from the real run (see
   video/argus-site in the ARGUS repo). When one ends the next begins. */
const STEPS = [
  {
    id: "attach",
    title: "Attach in one line",
    body: (
      <>
        Wrap your compiled graph with <code>ArgusRecorder().attach(graph)</code>.
        Nothing in it is patched: ARGUS listens to LangGraph&rsquo;s own
        callbacks and keeps the update every node returned.
      </>
    ),
    label: "Attaching ARGUS to a LangGraph app; the next run prints a finding in the terminal.",
  },
  {
    id: "trace",
    title: "Get the node that broke",
    body: (
      <>
        When a run goes wrong, ARGUS walks back from the crash to the node that
        caused it and shows the evidence: the empty update, the missing field,
        the confidence.
      </>
    ),
    label: "The ARGUS UI on the crashed run, tracing the crash back to merge_summaries.",
  },
  {
    id: "gate",
    title: "Block the deploy, prove the fix",
    body: (
      <>
        <code>argus check</code> exits 1 in CI. Fix the node, then{" "}
        <code>argus replay</code> reruns from it with every upstream output
        frozen.
      </>
    ),
    label: "argus check failing the build, then argus replay showing the fixed run come back clean.",
  },
] as const;

const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (onChange: () => void) => {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};
const readReduced = () => window.matchMedia(REDUCED).matches;

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const [demoOpen, setDemoOpen] = useState(false);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const stage = useRef<HTMLDivElement>(null);
  const motionOk = !useSyncExternalStore(subscribeReduced, readReduced, () => false);

  // Play the active clip only while the player is on screen.
  useEffect(() => {
    if (!motionOk) return;
    const el = stage.current;
    if (!el) return;
    let visible = false;
    let raf = 0;

    const tick = () => {
      const v = videos.current[active];
      const bar = bars.current[active];
      if (v && bar && v.duration) {
        bar.style.transform = `scaleX(${v.currentTime / v.duration})`;
      }
      raf = requestAnimationFrame(tick);
    };

    const play = () => {
      videos.current.forEach((v, i) => {
        if (!v) return;
        if (i === active && visible) {
          void v.play().catch(() => undefined);
        } else {
          v.pause();
        }
      });
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver((entries) => {
      visible = entries[entries.length - 1].isIntersecting;
      play();
    }, { threshold: 0.35 });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [active, motionOk]);

  function select(i: number) {
    const v = videos.current[i];
    if (v) v.currentTime = 0;
    bars.current.forEach((bar) => {
      if (bar) bar.style.transform = "scaleX(0)";
    });
    setActive(i);
  }

  return (
    <section id="how-it-works" className="relative scroll-mt-20 py-24 md:py-36">
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
      <Container>
        <div className="reveal flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">How it works</p>
            <h2 className="display-2 mt-6 max-w-[15ch] text-[var(--ink)]">
              Attach once. Get the root cause on every run.
            </h2>
          </div>
          <p className="lede max-w-[25rem] lg:pb-1.5">
            ARGUS judges every run before it ships, and stops the deploy when
            one goes wrong.
          </p>
        </div>

        <div className="mt-14 grid items-start gap-8 lg:mt-20 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-14">
          <ol aria-label="How ARGUS works" className="order-2 flex flex-col lg:order-1">
            {STEPS.map((s, i) => {
              const on = i === active;
              return (
                <li
                  key={s.id}
                  className="relative shadow-[inset_0_-1px_0_var(--line)] first:shadow-[inset_0_1px_0_var(--line),inset_0_-1px_0_var(--line)]"
                >
                  <button
                    type="button"
                    aria-current={on ? "step" : undefined}
                    aria-controls="hiw-stage"
                    onClick={() => select(i)}
                    className="group flex w-full items-baseline gap-4 pt-6 text-left"
                  >
                    <span className={cn("step-num transition-colors", on && "text-[var(--iris-fg)]")}>
                      0{i + 1}
                    </span>
                    <span
                      className={cn(
                        "text-[17px] font-medium tracking-[-0.02em] transition-colors",
                        on ? "text-[var(--ink)]" : "text-[var(--ink-3)] group-hover:text-[var(--ink-2)]"
                      )}
                    >
                      {s.title}
                    </span>
                  </button>
                  <div
                    aria-hidden={!on}
                    className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ gridTemplateRows: on ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="ident pl-[calc(2ch+1rem)] pt-3 text-[14.5px] leading-[1.6] text-[var(--ink-2)]">
                        {s.body}
                      </p>
                    </div>
                  </div>
                  <div className="h-6" />
                  <span aria-hidden className="absolute inset-x-0 bottom-0 h-px overflow-hidden">
                    <span
                      ref={(el) => {
                        bars.current[i] = el;
                      }}
                      className={cn(
                        "block h-full origin-left bg-[var(--iris)]",
                        on ? "opacity-100" : "opacity-0"
                      )}
                      style={{ transform: "scaleX(0)" }}
                    />
                  </span>
                </li>
              );
            })}
            <li className="pt-6">
              <button
                type="button"
                onClick={() => setDemoOpen(true)}
                className="group inline-flex items-center gap-1.5 text-[13.5px] text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]"
              >
                Click around the real run yourself
                <ArrowUpRight size={14} className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
            </li>
          </ol>

          <div ref={stage} id="hiw-stage" className="order-1 lg:order-2">
            <div className="frame p-1.5 sm:p-2">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[11px] bg-[var(--rail)]">
                {STEPS.map((s, i) => (
                  <video
                    key={s.id}
                    ref={(el) => {
                      videos.current[i] = el;
                    }}
                    className={cn(
                      "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
                      i === active ? "opacity-100" : "pointer-events-none opacity-0"
                    )}
                    aria-hidden={i !== active}
                    src={`/clips/${s.id}.mp4`}
                    poster={`/clips/${s.id}.jpg`}
                    muted
                    playsInline
                    preload={i === active ? "auto" : "metadata"}
                    controls={!motionOk && i === active}
                    aria-label={s.label}
                    onEnded={() => select((i + 1) % STEPS.length)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
