import Link from "next/link";
import { Container } from "@/components/ui/section";

const BLOCKS = [
  {
    title: "Your traces stay yours",
    body: "ARGUS runs inside your environment. Execution state, prompts and tool payloads are written to storage you control — nothing is shipped to us by default.",
  },
  {
    title: "Redaction before persistence",
    body: "Configurable field-level redaction runs before any state snapshot is written, so secrets and PII never land in a trace you later share with your team.",
  },
  {
    title: "Never trained on your code",
    body: "Customer pipelines, prompts and outputs are never used to train models. Investigator calls are scoped to the run being analysed and nothing else.",
  },
];

export function Security() {
  return (
    <section id="security" className="py-16 md:py-24">
      <Container>
        <div className="rounded-[var(--radius-block)] border-[length:var(--hairline)] border-[var(--line)] bg-[var(--panel)] px-6 py-14 md:px-14 md:py-20">
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-20">
            <div className="lg:w-[38%]">
              <p className="eyebrow">Security</p>
              <h2 className="heading-3 mt-5 text-[var(--ink)]">
                Secure by design.
                <br />
                <span className="text-[var(--ink-3)]">
                  Safe by default.
                </span>
              </h2>
              <Link
                href="/docs/storage"
                className="mt-6 inline-flex text-[13px] font-medium text-[var(--iris-fg)] underline decoration-[var(--iris-border)] underline-offset-4 transition-colors hover:decoration-[var(--iris-fg)]"
              >
                Read how storage and redaction work
              </Link>
            </div>

            <div className="grid flex-1 grid-cols-1 gap-8 sm:grid-cols-3">
              {BLOCKS.map((block) => (
                <div key={block.title}>
                  <h3 className="text-[14px] font-medium text-[var(--ink)]">
                    {block.title}
                  </h3>
                  <p className="body-sm mt-2.5">{block.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
