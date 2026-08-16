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
            <p className="eyebrow">From a design partner</p>

            <blockquote className="mx-auto mt-8 max-w-[640px]">
              <p className="text-[22px] leading-[1.4] font-medium tracking-[-0.01em] text-[var(--ink)] md:text-[28px]">
                &ldquo;The crash annotation is the best thing in the project.
                Exact source line plus the upstream null beats most
                observability tooling I&rsquo;ve used.&rdquo;
              </p>
            </blockquote>

            <figcaption className="mt-10 flex flex-col items-center gap-1">
              <span className="text-[14px] font-medium text-[var(--ink)]">
                Nikhil Jha
              </span>
              <span className="text-[13px] text-[var(--ink-3)]">
                SDE, Pune
              </span>
            </figcaption>
          </div>
        </figure>
      </Container>
    </section>
  );
}
