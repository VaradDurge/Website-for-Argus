import { cn } from "@/lib/utils";
import { Container, TagList } from "@/components/ui/section";
import { ArgusDemo, type DemoPreset } from "../demo/ArgusDemo";

export interface FeatureBleedProps {
  num: string;
  title: string;
  body: string;
  capability: string;
  tags: readonly string[];
  slotId: string;
  /** Copy on the left (start) or right (end). Alternates per Interfere cadence. */
  align?: "start" | "end";
  preset: DemoPreset;
  label: string;
  glow?: boolean;
}

const WASH =
  "radial-gradient(1200px 700px at 20% 80%, rgba(255,59,0,.55), transparent 60%)," +
  "radial-gradient(1000px 640px at 75% 20%, rgba(0,142,255,.5), transparent 58%)," +
  "radial-gradient(900px 600px at 55% 60%, rgba(246,0,157,.42), transparent 55%)," +
  "linear-gradient(115deg,#ff3b00 0%,#f6009d 32%,#973ec6 58%,#5a46e0 82%,#00c2a8 100%)";

/**
 * Copy + a 15:8 product panel that bleeds off the container edge.
 * The panel is the Argus instrument dashboard on a rainbow wash.
 */
export function FeatureBleed({
  num,
  title,
  body,
  capability,
  tags,
  slotId,
  align = "start",
  preset,
  label,
  glow = false,
}: FeatureBleedProps) {
  const copyFirst = align === "start";

  return (
    <section className="relative overflow-x-clip py-16 md:py-24">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-12">
          <div
            className={cn(
              "reveal max-w-[480px] md:py-12",
              !copyFirst && "md:order-2"
            )}
          >
            <p className="step-num">{num}</p>
            <h2 className="heading-4 mt-4 text-[var(--ink)]">{title}</h2>
            <p className="body-base mt-4">{body}</p>
            <TagList label={capability} items={tags} className="mt-8" />
          </div>

          <div
            className={cn(
              "relative aspect-[15/8] md:aspect-auto md:h-[640px]",
              !copyFirst && "md:order-1"
            )}
          >
            <div
              className={cn(
                "h-full md:absolute md:inset-y-0 md:w-[1200px]",
                copyFirst ? "md:left-0" : "md:right-0"
              )}
            >
              {glow ? (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-[-12%] rounded-[300px] blur-[100px]"
                  style={{ background: "var(--gradient-section-glow)" }}
                />
              ) : null}
              <div
                data-demo-slot={slotId}
                role="img"
                aria-label={label}
                className="relative h-full overflow-hidden rounded-[var(--radius-panel)] border-[length:var(--hairline)] border-[var(--line)] shadow-[var(--shadow-demo)]"
              >
                <div aria-hidden className="absolute inset-0" style={{ background: WASH }} />
                <div className="absolute inset-[6%] overflow-hidden rounded-[12px] border border-black/10 bg-[var(--panel)] shadow-[0_40px_80px_-24px_rgba(0,0,0,0.35)]">
                  <ArgusDemo preset={preset} frozen />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
