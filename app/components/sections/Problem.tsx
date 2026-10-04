import { Container } from "@/components/ui/section";

/* The real bug from the launch film: demo/research_agent/nodes.py:168. */
const CHAIN = [
  {
    label: "No exception",
    body: (
      <>
        <code>merge_summaries</code> exits cleanly with an empty update. Nothing
        raises, so the run looks fine.
      </>
    ),
  },
  {
    label: "Wrong suspect",
    body: (
      <>
        {/* explicit space: SWC drops the leading space of text after an
            element when that text contains an HTML entity */}
        Downstream, <code>synthesize_report</code>{" "}crashes on the missing
        field. That&rsquo;s the node every trace points at.
      </>
    ),
  },
  {
    label: "It ships",
    body: (
      <>
        The real bug sits one hop upstream, and nothing in your CI knows to look
        there.
      </>
    ),
  },
] as const;

export function Problem() {
  return (
    <section className="relative py-24 md:py-36">
      <Container>
        <div className="reveal mx-auto flex max-w-[46rem] flex-col items-center text-center">
          <p className="kicker">The problem</p>
          <h2 className="display-2 text-sheen mt-6">
            Your agent didn&rsquo;t crash. It just returned nothing.
          </h2>
          <p className="lede mt-6 max-w-[34rem]">
            A node can return an empty dict, drop a field or swallow a tool
            error and still exit cleanly. The crash, if one comes, lands
            somewhere else.
          </p>
        </div>

        <figure
          className="reveal relative mx-auto mt-16 max-w-[56rem] md:mt-20"
          aria-label="nodes.py line 168: return {}"
        >
          <div className="exhibit">
            <span className="exhibit-tab">Exhibit A</span>
            <div className="flex items-center justify-between gap-4 px-5 pb-3.5 pt-5 shadow-[inset_0_-1px_0_var(--exhibit-line)]">
              <span className="font-mono text-[12px] text-[var(--exhibit-ink-2)]">research_agent/nodes.py</span>
              <span className="font-mono text-[11.5px] text-[var(--exhibit-ink-2)] opacity-70">merge_summaries()</span>
            </div>
            <div className="px-5 pb-9 pt-7 font-mono sm:px-8">
              <CodeLine n={167} className="pl-[2ch]">
                if not collected:
              </CodeLine>
              <div className="relative my-3 flex items-baseline gap-4 sm:my-5 sm:gap-6">
                <span aria-hidden className="absolute -inset-x-5 -inset-y-2 bg-[linear-gradient(90deg,rgba(255,150,60,0.14),transparent_70%)] shadow-[inset_2px_0_0_#ff8a3d] sm:-inset-x-8" />
                <span className="relative w-[3ch] shrink-0 text-right text-[13px] text-[#ff9a52]">168</span>
                <span className="caret relative whitespace-nowrap text-[clamp(40px,7vw,104px)] leading-none tracking-[-0.04em] text-[var(--exhibit-ink)]">
                  return{" "}
                  <span className="relative text-[#ff9a52]">
                    {"{}"}
                    {/* the red pen, ringing the evidence */}
                    <svg aria-hidden viewBox="0 0 120 80" className="pen-ring -left-[18%] -top-[22%] h-[144%] w-[136%]" preserveAspectRatio="none">
                      <path pathLength={1} d="M 70 6 C 30 2, 4 18, 6 42 C 8 66, 44 78, 78 74 C 108 70, 118 46, 110 26 C 102 8, 74 2, 52 8" />
                    </svg>
                  </span>
                </span>
              </div>
              <CodeLine n={169} />
              <CodeLine n={170} className="opacity-60">
                return {"{"}&quot;merged_summaries&quot;: collected{"}"}
              </CodeLine>
            </div>
          </div>
          {/* margin note, in the investigator's hand */}
          <figcaption className="pen-note absolute -right-4 top-[46%] hidden max-w-[12rem] translate-x-full rotate-[-3deg] xl:block">
            ← returns nothing.
            <br />
            Nothing raises.
          </figcaption>
        </figure>

        <ol className="mx-auto mt-14 grid max-w-[56rem] grid-cols-1 gap-px overflow-clip rounded-[var(--radius-panel)] bg-[var(--line)] shadow-[0_0_0_1px_var(--line)] md:mt-16 md:grid-cols-3">
          {CHAIN.map((item, i) => (
            <li key={item.label} className="reveal bg-[var(--void)] p-7">
              <p className="step-num">
                0{i + 1} <span className="mx-1 text-[var(--line-3)]">/</span> {item.label}
              </p>
              <p className="ident mt-5 text-[15px] leading-[1.6] text-[var(--ink-2)]">{item.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

function CodeLine({
  n,
  className,
  children,
}: {
  n: number;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline gap-4 text-[13.5px] leading-[1.9] text-[var(--exhibit-ink-2)] sm:gap-6">
      <span className="w-[3ch] shrink-0 text-right opacity-70">{n}</span>
      <span className={className}>{children}</span>
    </div>
  );
}
