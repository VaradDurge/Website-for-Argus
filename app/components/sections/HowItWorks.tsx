"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import { DemoModal } from "../DemoModal";

/* A pinned scroll-story: the clip stays in view while the three steps
   scroll past; whichever step crosses the middle of the screen owns the
   clip. Clips are Remotion renders of the real run (ARGUS/video/argus-site). */
const STEPS = [
  {
    id: "attach",
    tab: "Exhibit B · agent.py",
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
    tab: "Exhibit C · argus ui",
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
    tab: "Exhibit D · CI",
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
  const steps = useRef<(HTMLLIElement | null)[]>([]);
  const bar = useRef<HTMLSpanElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const motionOk = !useSyncExternalStore(subscribeReduced, readReduced, () => false);

  // The step crossing the middle band of the viewport is the active one.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step));
        }
      },
      { rootMargin: "-46% 0px -46% 0px" }
    );
    steps.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  // Play the active clip while the stage is on screen; mirror its progress.
  useEffect(() => {
    if (!motionOk) return;
    const el = stage.current;
    if (!el) return;
    let visible = false;
    let raf = 0;

    const tick = () => {
      const v = videos.current[active];
      if (v && bar.current && v.duration) {
        bar.current.style.transform = `scaleX(${v.currentTime / v.duration})`;
      }
      raf = requestAnimationFrame(tick);
    };
    const sync = () => {
      videos.current.forEach((v, i) => {
        if (!v) return;
        if (i === active && visible) void v.play().catch(() => undefined);
        else v.pause();
      });
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(tick);
    };

    const v = videos.current[active];
    if (v) v.currentTime = 0;
    const io = new IntersectionObserver((entries) => {
      visible = entries[entries.length - 1].isIntersecting;
      sync();
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [active, motionOk]);

  const goTo = (i: number) =>
    steps.current[i]?.scrollIntoView({ behavior: motionOk ? "smooth" : "auto", block: "center" });

  return (
    <section id="how-it-works" className="relative scroll-mt-20 pt-24 md:pt-36">
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
      <Container>
        <div className="reveal mx-auto flex max-w-[44rem] flex-col items-center text-center">
          <p className="kicker">How it works</p>
          <h2 className="display-2 text-sheen mt-6">Attach once. Get the root cause on every run.</h2>
          <p className="lede mt-5 max-w-[30rem]">
            ARGUS judges every run before it ships, and stops the deploy when one
            goes wrong.
          </p>
        </div>

        <div className="mt-12 grid gap-x-16 lg:mt-20 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
          {/* the stage: pinned while the steps scroll past */}
          <div className="sticky top-[76px] z-10 -mx-5 bg-[var(--void)] px-5 pb-4 pt-2 lg:static lg:order-2 lg:mx-0 lg:bg-transparent lg:p-0">
            <div ref={stage} id="hiw-stage" className="lg:sticky lg:top-[calc(50vh-15rem)]">
              <div className="exhibit relative p-1.5 sm:p-2">
                <span className="exhibit-tab">{STEPS[active].tab}</span>
                <div className="relative aspect-[16/10] overflow-hidden rounded-[11px] bg-[var(--rail)]">
                  {STEPS.map((s, i) => (
                    <video
                      key={s.id}
                      ref={(el) => {
                        videos.current[i] = el;
                      }}
                      className={cn(
                        "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
                        i === active ? "opacity-100" : "pointer-events-none opacity-0"
                      )}
                      aria-hidden={i !== active}
                      src={`/clips/${s.id}.mp4`}
                      poster={`/clips/${s.id}.jpg`}
                      muted
                      loop
                      playsInline
                      preload={i === active ? "auto" : "metadata"}
                      controls={!motionOk && i === active}
                      aria-label={s.label}
                    />
                  ))}
                </div>
                <span aria-hidden className="absolute inset-x-6 bottom-0 h-px overflow-hidden">
                  <span
                    ref={bar}
                    className="block h-full origin-left bg-[linear-gradient(90deg,var(--iris-indigo),var(--iris),var(--iris-orchid))]"
                    style={{ transform: "scaleX(0)" }}
                  />
                </span>
              </div>
              <div className="mt-4 hidden items-center justify-center gap-2 lg:flex" aria-hidden>
                {STEPS.map((s, i) => (
                  <span
                    key={s.id}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-500",
                      i === active ? "w-6 bg-[var(--iris)]" : "w-1.5 bg-[var(--line-3)]"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          <ol aria-label="How ARGUS works" className="lg:order-1">
            {STEPS.map((s, i) => {
              const on = i === active;
              return (
                <li
                  key={s.id}
                  data-step={i}
                  ref={(el) => {
                    steps.current[i] = el;
                  }}
                  className="relative flex min-h-[46vh] flex-col justify-center py-10 pl-7 lg:min-h-[78vh]"
                >
                  {/* the rail: lit for the step that owns the clip */}
                  <span aria-hidden className="absolute bottom-0 left-0 top-0 w-[2px] bg-[var(--line)]">
                    <span
                      className={cn(
                        "absolute inset-0 origin-top bg-[linear-gradient(180deg,#ecd896,#a8842a)] transition-transform duration-700",
                        on ? "scale-y-100" : "scale-y-0"
                      )}
                    />
                  </span>
                  <button
                    type="button"
                    aria-current={on ? "step" : undefined}
                    aria-controls="hiw-stage"
                    onClick={() => goTo(i)}
                    className="text-left"
                  >
                    <span className={cn("step-num transition-colors duration-500", on && "text-[var(--iris-fg)]")}>
                      Step 0{i + 1}
                    </span>
                    <span
                      className={cn(
                        "mt-4 block text-[clamp(24px,2.4vw,32px)] font-medium leading-[1.15] tracking-[-0.03em] transition-colors duration-500",
                        on ? "text-[var(--ink)]" : "text-[var(--ink-3)]"
                      )}
                    >
                      {s.title}
                    </span>
                  </button>
                  <p
                    className={cn(
                      "ident mt-4 max-w-[26rem] text-[15.5px] leading-[1.65] transition-colors duration-500",
                      on ? "text-[var(--ink-2)]" : "text-[var(--ink-3)]"
                    )}
                  >
                    {s.body}
                  </p>
                  {s.id === "trace" ? (
                    <button
                      type="button"
                      onClick={() => setDemoOpen(true)}
                      className="group mt-6 inline-flex w-fit items-center gap-1.5 text-[13.5px] text-[var(--iris-fg)] transition-colors hover:text-[var(--ink)]"
                    >
                      Click around the real run yourself
                      <ArrowUpRight size={14} className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </button>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
