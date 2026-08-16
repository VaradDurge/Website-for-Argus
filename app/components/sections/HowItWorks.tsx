"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/section";
import { DemoSlot } from "../demo/DemoSlot";
import { DetectMini } from "../demo/mini/DetectMini";
import { UnderstandMini } from "../demo/mini/UnderstandMini";
import { FixMini } from "../demo/mini/FixMini";

const STEPS = [
  {
    num: "01",
    clause: "detects",
    slot: "hiw-01-detect",
    title: "Detects silent failures",
    body: "Heuristics, anomaly scoring and a semantic judge run on every node output — so a step that returns a placeholder instead of a summary gets flagged, not marked green.",
    Mini: DetectMini,
  },
  {
    num: "02",
    clause: "explains",
    slot: "hiw-02-understand",
    title: "Explains the root cause",
    body: "ARGUS walks the graph backwards to the node that actually introduced bad state, and shows the state diff that proves it.",
    Mini: UnderstandMini,
  },
  {
    num: "03",
    clause: "fixes",
    slot: "hiw-03-fix",
    title: "Hands you the fix",
    body: "argus fix writes a paste-ready prompt for the node that dropped the field — exact source line, no hunting through traces.",
    Mini: FixMini,
  },
] as const;

const AUTOPLAY_MS = 3000;

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Desktop: autoplay the highlight. Mobile: the most-visible card wins.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let timer: ReturnType<typeof setInterval> | undefined;
    let observer: IntersectionObserver | undefined;

    function teardown() {
      if (timer) clearInterval(timer);
      timer = undefined;
      observer?.disconnect();
      observer = undefined;
    }

    function setup() {
      teardown();

      if (desktop.matches) {
        if (reduced.matches) return;
        timer = setInterval(
          () => setActive((i) => (i + 1) % STEPS.length),
          AUTOPLAY_MS
        );
        return;
      }

      const cards = containerRef.current?.querySelectorAll<HTMLElement>(
        "[data-hiw-index]"
      );
      if (!cards?.length) return;

      const ratios = new Map<number, number>();
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const index = Number(
              (entry.target as HTMLElement).dataset.hiwIndex
            );
            ratios.set(index, entry.intersectionRatio);
          }
          let best = 0;
          let bestRatio = -1;
          for (const [index, ratio] of ratios) {
            if (ratio > bestRatio) {
              bestRatio = ratio;
              best = index;
            }
          }
          setActive(best);
        },
        { threshold: [0.2, 0.4, 0.6, 0.8, 1] }
      );
      cards.forEach((card) => observer?.observe(card));
    }

    setup();
    desktop.addEventListener("change", setup);
    reduced.addEventListener("change", setup);

    return () => {
      teardown();
      desktop.removeEventListener("change", setup);
      reduced.removeEventListener("change", setup);
    };
  }, []);

  return (
    <section id="how-it-works" className="py-16 md:py-36">
      <Container>
        <h2 className="heading-3 max-w-[900px] text-[var(--ink)]">
          {STEPS.map((step, i) => (
            <span key={step.num}>
              {i === 0 ? "ARGUS " : i === 1 ? ", " : ", and "}
              <Highlight active={active === i}>{step.clause}</Highlight>
              <span className="step-num ml-1.5 align-super">{step.num}</span>
              {i === 0
                ? " silent failures in your agent pipeline"
                : i === 1
                  ? " where the state actually broke"
                  : " the node that actually failed."}
            </span>
          ))}
        </h2>

        <div
          ref={containerRef}
          className="mt-12 grid grid-cols-1 gap-10 md:mt-16 lg:grid-cols-3"
        >
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              data-hiw-index={i}
              className="transition-opacity duration-300 ease-out motion-reduce:transition-none"
              style={{ opacity: active === i ? 1 : 0.6 }}
            >
              <div className="rounded-[var(--radius-panel)] border-[length:var(--hairline)] border-[var(--line)] bg-[var(--ex)] p-1">
                <DemoSlot id={step.slot} aspect="mini">
                  <step.Mini />
                </DemoSlot>
              </div>
              <p className="step-num mt-6">{step.num}</p>
              <h3 className="mt-3 text-[15px] font-medium text-[var(--ink)]">
                {step.title}
              </h3>
              <p className="body-base mt-2 max-w-[36ch]">{step.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Highlight({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className="rounded-[6px] px-1.5 py-0.5 transition-colors duration-300 ease-out motion-reduce:transition-none"
      style={{
        background: active ? "var(--iris-subtle)" : "transparent",
        color: active ? "var(--iris-fg)" : "inherit",
      }}
    >
      {children}
    </span>
  );
}
