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
  /** Taller panel so the execution graph reads like the dashboard. */
  tall?: boolean;
}

/**
 * Copy + a 15:8 product panel that bleeds off the container edge.
 * The panel is the Argus instrument dashboard on a neutral ground.
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
  tall = false,
}: FeatureBleedProps) {
  const copyFirst = align === "start";

  return (
    <section className="relative overflow-x-clip py-16 md:py-24">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-12">
          <div
            className={cn(
              "reveal flex max-w-[480px] flex-col justify-center",
              tall ? "md:min-h-[760px]" : "md:min-h-[640px]",
              !copyFirst && "md:order-2 md:mx-auto"
            )}
          >
            <p className="step-num">{num}</p>
            <h2 className="heading-4 mt-4 text-[var(--ink)]">{title}</h2>
            <p className="body-base mt-4">{body}</p>
            <TagList label={capability} items={tags} className="mt-8" />
          </div>

          <div
            className={cn(
              "relative aspect-[15/8] md:aspect-auto",
              tall ? "md:h-[760px]" : "md:h-[640px]",
              !copyFirst && "md:order-1"
            )}
          >
            <div
              className={cn(
                "h-full md:absolute md:inset-y-0 md:w-[1200px]",
                copyFirst ? "md:left-0" : "md:right-0"
              )}
            >
              <div
                data-demo-slot={slotId}
                role="img"
                aria-label={label}
                className="relative h-full overflow-hidden rounded-[var(--radius-panel)] border-[length:var(--hairline)] border-[var(--line)] bg-[var(--rail)] shadow-[var(--shadow-demo)]"
              >
                <div
                className={cn(
                  "absolute overflow-hidden rounded-[12px] border-[length:var(--hairline)] border-[var(--line-2)] bg-[var(--panel)] shadow-[var(--shadow-demo)]",
                  tall ? "inset-[3%]" : "inset-[6%]"
                )}
                >
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
