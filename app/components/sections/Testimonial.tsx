import { Container } from "@/components/ui/section";

export function Testimonial() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <figure className="relative overflow-hidden rounded-[var(--radius-block)] border-[length:var(--hairline)] border-[var(--line)] bg-[var(--panel)] px-6 py-20 text-center md:px-16 md:py-28">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-[-40%] h-[55%] blur-[100px]"
            style={{ background: "var(--gradient-section-glow)" }}
          />
          <div className="relative">
            <p className="eyebrow">From an early design partner</p>

            <blockquote className="mx-auto mt-8 max-w-[720px]">
              <p className="text-[24px] leading-[1.35] font-medium tracking-[-0.01em] text-[var(--ink)] md:text-[32px]">
                &ldquo;We had a summarisation step quietly returning boilerplate
                for eleven days. Every dashboard was green. ARGUS flagged it on
                the first run and pointed at the enrichment node that dropped the
                field.&rdquo;
              </p>
            </blockquote>

            <figcaption className="mt-10 flex flex-col items-center gap-1">
              <span className="text-[14px] font-medium text-[var(--ink)]">
                Platform engineering lead
              </span>
              <span className="text-[13px] text-[var(--ink-3)]">
                Series B logistics AI · design partner
              </span>
            </figcaption>
          </div>
        </figure>
      </Container>
    </section>
  );
}
