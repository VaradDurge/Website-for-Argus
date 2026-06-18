"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const QA = [
  {
    q: "What actually causes a silent failure?",
    a: "A node technically \u201Csucceeds\u201D but returns degraded state \u2014 empty arrays, placeholder text, collapsed confidence scores, hallucinated tool outputs \u2014 that quietly poisons every downstream step.",
  },
  {
    q: "Why is root-cause detection important?",
    a: "The node that crashes is usually not the node that caused the problem. ARGUS traces where degradation first entered the graph, how it propagated, and which nodes amplified it.",
  },
  {
    q: "How does replay work?",
    a: "ARGUS snapshots execution state at every step, freezes upstream nodes, and reruns only the selected node + downstream \u2014 no recomputing expensive LLM calls or burning extra tokens.",
  },
  {
    q: "Why is replay more than just rerunning?",
    a: "Replay is a debugging workflow \u2014 fix, replay, compare, tweak. ARGUS preserves replay history, lineage, and prior fixes so debugging becomes structured experimentation, not random reruns.",
  },
  {
    q: "Can ARGUS detect issues before production?",
    a: "Yes \u2014 silent degradations, semantic inconsistencies, unstable outputs, and downstream propagation risks are surfaced before they ever reach production users.",
  },
  {
    q: "What makes semantic failures dangerous?",
    a: "The JSON parses, the schema passes, no exception is raised \u2014 but the meaning is wrong: hallucinated entities, weak summaries, missing reasoning. ARGUS catches what types alone can\u2019t.",
  },
  {
    q: "What happens when a downstream node fails?",
    a: "ARGUS walks backward through execution lineage to identify which upstream node introduced bad state \u2014 critical in multi-agent pipelines where failures fan out across branches.",
  },
  {
    q: "Does ARGUS only work with LangGraph?",
    a: "No. ARGUS is LangGraph-first but works with plain Python workflows, custom DAGs, and multi-agent pipelines \u2014 the goal is execution observability independent of framework.",
  },
  {
    q: "How much overhead does ARGUS add?",
    a: "Minimal. ARGUS observes execution without forcing architectural changes or intrusive instrumentation \u2014 wrap your graph and keep your existing logic untouched.",
  },
  {
    q: "Can I compare replay attempts?",
    a: "Yes \u2014 original vs replay, replay vs replay, degraded vs recovered state. You can verify whether a fix actually improved downstream behavior before shipping it.",
  },
  {
    q: "Why not just use logs?",
    a: "Logs show events. ARGUS shows execution lineage, state propagation, semantic degradation, and causal relationships between nodes \u2014 built for AI workflows, not generic infra.",
  },
  {
    q: "What does \u201Cdegradation propagation\u201D mean?",
    a: "One bad output silently contaminates downstream nodes. ARGUS tracks where degradation originated, how confidence changed, and which nodes inherited corrupted state.",
  },
  {
    q: "Can ARGUS help reduce LLM costs?",
    a: "Yes. Replay skips unaffected upstream nodes, saving significant inference cost, latency, and debugging time \u2014 especially across long multi-step pipelines.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10 grid lg:grid-cols-[0.9fr_1.4fr] gap-12 lg:gap-20 items-start">
        {/* sticky left column — animated entrance */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="eyebrow"
          >
            FAQ
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-[36px] sm:text-[64px] lg:text-[80px] leading-[0.95] tracking-[-0.04em] text-[var(--accent-soft)]"
          >
            Questions,
            <br />
            <span className="font-serif-italic text-white">answered.</span>
          </motion.h2>
        </div>

        {/* questions list — staggered entrance */}
        <div className="lg:pt-2">
          <ul className="border-t border-[var(--border)]">
            {QA.map((item, i) => {
              const isOpen = open === i;
              return (
                <motion.li
                  key={item.q}
                  className="border-b border-[var(--border)]"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.05, ease: "easeOut" }}
                  style={{
                    borderBottomColor: isOpen ? "rgba(109, 92, 255, 0.2)" : undefined,
                    transition: "border-color 0.3s ease",
                  }}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-6 py-5 text-left group transition-colors hover:bg-white/[0.01] rounded-sm"
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
                      className={`shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full border border-[var(--border-strong)] transition-all duration-300 ${
                        isOpen
                          ? "bg-[var(--accent)] border-[var(--accent)] text-white"
                          : "text-[var(--text-muted)] group-hover:text-white group-hover:border-[var(--accent-soft)]"
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
                        <motion.p
                          initial={{ y: 8, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          className="pb-6 pr-12 text-[14.5px] leading-[1.7] text-[var(--text-muted)]"
                        >
                          {item.a}
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
