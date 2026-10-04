import Link from "next/link";
import { Plus } from "lucide-react";
import { Container } from "@/components/ui/section";
import { DISCORD_URL } from "@/lib/site";

const QA = [
  {
    q: "What is a silent failure?",
    a: "A node finishes without raising, but what it returned is wrong: an empty update, a dropped field, a swallowed tool error, placeholder text. The damage shows up later, usually on a different node.",
  },
  {
    q: "How is this different from tracing tools?",
    a: "Tracing shows you what happened, span by span, usually after it shipped. ARGUS judges each run: it decides whether the run was clean, names the node where it went wrong, and fails your CI when it wasn't.",
  },
  {
    q: "Does it only work with LangGraph?",
    a: "LangGraph is first-class: ARGUS rides its callback stream without patching your graph. Plain Python pipelines and custom DAGs work too. The docs show the entry point that fits yours.",
  },
  {
    q: "Does anything leave my machine?",
    a: "No. Runs are saved to .argus/ in your project. The LLM judge is optional and calls OpenAI, Anthropic or Gemini with your own key. Without one, ARGUS runs on heuristics alone.",
  },
  {
    q: "What does it cost?",
    a: "The core is open source under Apache-2.0. Hosted plans are free while ARGUS is in beta.",
  },
] as const;

export function FAQ() {
  return (
    <section id="faq" className="relative py-24 md:py-32">
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.4fr] lg:gap-20">
        <div className="reveal">
          <p className="kicker">FAQ</p>
          <h2 className="display-2 text-sheen mt-6">Questions, answered.</h2>
          <p className="mt-5 text-[14.5px] text-[var(--ink-2)]">
            Anything else?{" "}
            <Link href="/docs" className="docs-link">
              Read the docs
            </Link>{" "}
            or ask in{" "}
            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="docs-link">
              Discord
            </a>
            .
          </p>
        </div>

        <div className="reveal shadow-[inset_0_1px_0_var(--line)]">
          {QA.map((item, i) => (
            <details key={item.q} name="faq" open={i === 0} className="faq group shadow-[inset_0_-1px_0_var(--line)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[16.5px] tracking-[-0.015em] text-[var(--ink-2)] transition-colors hover:text-[var(--ink)] group-open:text-[var(--ink)] [&::-webkit-details-marker]:hidden">
                {item.q}
                <Plus
                  size={16}
                  aria-hidden
                  className="shrink-0 text-[var(--ink-3)] transition-transform duration-300 group-open:rotate-45 group-open:text-[var(--ink)]"
                />
              </summary>
              <p className="max-w-[40rem] pb-7 pr-10 text-[15px] leading-[1.65] text-[var(--ink-2)]">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
