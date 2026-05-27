"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const QA = [
  {
    q: "What actually causes a silent failure?",
    a: "A node technically “succeeds” but returns degraded state — empty arrays, placeholder text, collapsed confidence scores, hallucinated tool outputs — that quietly poisons every downstream step.",
  },
  {
    q: "Why is root-cause detection important?",
    a: "The node that crashes is usually not the node that caused the problem. ARGUS traces where degradation first entered the graph, how it propagated, and which nodes amplified it.",
  },
  {
    q: "How does replay work?",
    a: "ARGUS snapshots execution state at every step, freezes upstream nodes, and reruns only the selected node + downstream — no recomputing expensive LLM calls or burning extra tokens.",
  },
  {
    q: "Why is replay more than just rerunning?",
    a: "Replay is a debugging workflow — fix, replay, compare, tweak. ARGUS preserves replay history, lineage, and prior fixes so debugging becomes structured experimentation, not random reruns.",
  },
  {
    q: "Can ARGUS detect issues before production?",
    a: "Yes — silent degradations, semantic inconsistencies, unstable outputs, and downstream propagation risks are surfaced before they ever reach production users.",
  },
  {
    q: "What makes semantic failures dangerous?",
    a: "The JSON parses, the schema passes, no exception is raised — but the meaning is wrong: hallucinated entities, weak summaries, missing reasoning. ARGUS catches what types alone can’t.",
  },
  {
    q: "What happens when a downstream node fails?",
    a: "ARGUS walks backward through execution lineage to identify which upstream node introduced bad state — critical in multi-agent pipelines where failures fan out across branches.",
  },
  {
    q: "Does ARGUS only work with LangGraph?",
    a: "No. ARGUS is LangGraph-first but works with plain Python workflows, custom DAGs, and multi-agent pipelines — the goal is execution observability independent of framework.",
  },
  {
    q: "How much overhead does ARGUS add?",
    a: "Minimal. ARGUS observes execution without forcing architectural changes or intrusive instrumentation — wrap your graph and keep your existing logic untouched.",
  },
  {
    q: "Can I compare replay attempts?",
    a: "Yes — original vs replay, replay vs replay, degraded vs recovered state. You can verify whether a fix actually improved downstream behavior before shipping it.",
  },
  {
    q: "Why not just use logs?",
    a: "Logs show events. ARGUS shows execution lineage, state propagation, semantic degradation, and causal relationships between nodes — built for AI workflows, not generic infra.",
  },
  {
    q: "What does “degradation propagation” mean?",
    a: "One bad output silently contaminates downstream nodes. ARGUS tracks where degradation originated, how confidence changed, and which nodes inherited corrupted state.",
  },
  {
    q: "Can ARGUS help reduce LLM costs?",
    a: "Yes. Replay skips unaffected upstream nodes, saving significant inference cost, latency, and debugging time — especially across long multi-step pipelines.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative py-24 lg:py-36">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10 grid lg:grid-cols-[0.9fr_1.4fr] gap-12 lg:gap-20 items-start">
        {/* sticky left column */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="eyebrow">FAQ</div>
          <h2 className="mt-6 text-[48px] sm:text-[64px] lg:text-[80px] leading-[0.95] tracking-[-0.04em] text-[var(--accent-soft)]">
            Questions,
            <br />
            <span className="font-serif-italic text-white">answered.</span>
          </h2>
        </div>

        {/* questions list */}
        <div className="lg:pt-2">
          <ul className="border-t border-[var(--border)]">
            {QA.map((item, i) => {
              const isOpen = open === i;
              return (
                <li key={item.q} className="border-b border-[var(--border)]">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-6 py-5 text-left group"
                    aria-expanded={isOpen}
                  >
                    <span
                      className={`text-[16px] sm:text-[17px] tracking-[-0.01em] transition-colors ${
                        isOpen ? "text-white" : "text-[var(--text)]"
                      } group-hover:text-white`}
                    >
                      {item.q}
                    </span>
                    <span
                      className={`shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full border border-[var(--border-strong)] transition-colors ${
                        isOpen
                          ? "bg-[var(--accent)] border-[var(--accent)] text-white"
                          : "text-[var(--text-muted)] group-hover:text-white"
                      }`}
                    >
                      <Plus
                        size={14}
                        className={`transition-transform duration-300 ${
                          isOpen ? "rotate-45" : ""
                        }`}
                      />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 pr-12 text-[14.5px] leading-[1.7] text-[var(--text-muted)]">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
