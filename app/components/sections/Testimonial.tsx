import { Container } from "@/components/ui/section";

const CORNERS = [
  "left-0 top-0 -translate-x-1/2 -translate-y-1/2",
  "right-0 top-0 translate-x-1/2 -translate-y-1/2",
  "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
  "bottom-0 right-0 translate-x-1/2 translate-y-1/2",
] as const;

export function Testimonial() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <figure className="reveal relative mx-auto max-w-[54rem] px-6 py-12 text-center sm:px-14 sm:py-16">
          {/* ARGUS's selection frame, the same one the hero trace locks with */}
          <span aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(139,125,255,0.08),transparent_70%)] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--iris)_40%,transparent),0_0_60px_-20px_rgba(139,125,255,0.5)]" />
          {CORNERS.map((pos) => (
            <span
              key={pos}
              aria-hidden
              className={`pointer-events-none absolute h-2 w-2 bg-[var(--void)] shadow-[inset_0_0_0_1px_var(--iris)] ${pos}`}
            />
          ))}
          <span className="absolute left-0 top-0 -translate-y-[calc(100%+6px)] rounded-[4px] bg-[var(--iris)] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--iris-on)]">
            Design partner
          </span>

          <blockquote>
            <p className="text-[clamp(22px,2.9vw,34px)] font-medium leading-[1.3] tracking-[-0.03em] text-[var(--ink)]">
              &ldquo;The crash annotation is the best thing in the project. Exact
              source line plus the upstream null beats most observability tooling
              I&rsquo;ve used.&rdquo;
            </p>
          </blockquote>
          <figcaption className="mt-10 text-[14px]">
            <span className="font-medium text-[var(--ink)]">Nikhil Jha</span>
            <span className="mx-2 text-[var(--line-3)]">·</span>
            <span className="text-[var(--ink-3)]">Software engineer, Pune</span>
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
