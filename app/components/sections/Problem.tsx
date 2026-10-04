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
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="reveal lg:col-span-5">
            <p className="eyebrow">The problem</p>
            <h2 className="display-2 mt-6 text-[var(--ink)]">
              Your agent didn&rsquo;t crash.{" "}
              <span className="text-[var(--ink-3)]">It just returned nothing.</span>
            </h2>
            <p className="lede mt-6 max-w-[30rem]">
              A node can return an empty dict, drop a field or swallow a tool
              error and still exit cleanly. The crash, if one comes, lands
              somewhere else.
            </p>
          </div>

          <figure className="reveal lg:col-span-7" aria-label="nodes.py line 168: return {}">
            <div className="frame overflow-hidden">
              <div className="flex items-center justify-between gap-4 px-5 py-3.5 shadow-[inset_0_-1px_0_var(--line)]">
                <span className="font-mono text-[12px] text-[var(--ink-2)]">
                  research_agent/nodes.py
                </span>
                <span className="font-mono text-[11.5px] text-[var(--ink-3)]">
                  merge_summaries()
                </span>
              </div>
              <div className="px-5 pb-8 pt-6 font-mono sm:px-7">
                <CodeLine n={167} className="pl-[2ch]">
                  if not collected:
                </CodeLine>
                <div className="my-3 flex items-baseline gap-4 sm:my-4 sm:gap-6">
                  <span className="w-[3ch] shrink-0 text-right text-[13px] text-[var(--sig-warn)]">
                    168
                  </span>
                  <span className="caret whitespace-nowrap text-[clamp(40px,6.3vw,92px)] leading-none tracking-[-0.04em] text-[var(--ink)]">
                    return <span className="text-[var(--sig-warn)]">{"{}"}</span>
                  </span>
                </div>
                <CodeLine n={169} />
                <CodeLine n={170} className="opacity-60">
                  return {"{"}&quot;merged_summaries&quot;: collected{"}"}
                </CodeLine>
              </div>
            </div>
          </figure>
        </div>

        <ol className="mt-16 grid grid-cols-1 gap-px overflow-clip rounded-[var(--radius-panel)] bg-[var(--line)] shadow-[0_0_0_1px_var(--line)] md:mt-24 md:grid-cols-3">
          {CHAIN.map((item, i) => (
            <li key={item.label} className="reveal bg-[var(--void)] p-7 md:p-8">
              <p className="step-num">
                0{i + 1} <span className="mx-1 text-[var(--line-3)]">/</span> {item.label}
              </p>
              <p className="ident mt-5 text-[15px] leading-[1.6] text-[var(--ink-2)]">
                {item.body}
              </p>
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
    <div className="flex items-baseline gap-4 text-[13.5px] leading-[1.9] text-[var(--ink-3)] sm:gap-6">
      <span className="w-[3ch] shrink-0 text-right opacity-70">{n}</span>
      <span className={className}>{children}</span>
    </div>
  );
}
