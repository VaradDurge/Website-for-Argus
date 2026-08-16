import Image from "next/image";
import { cn } from "@/lib/utils";
import { Container, TagList } from "@/components/ui/section";

export interface FeatureBleedProps {
  num: string;
  title: string;
  body: string;
  capability: string;
  tags: readonly string[];
  slotId: string;
  /** Copy on the left (start) or right (end). Alternates per Interfere cadence. */
  align?: "start" | "end";
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  glow?: boolean;
}

/**
 * Copy + a 15:8 product panel that bleeds off the container edge.
 * The panel is a cropped demo-UI still on a rainbow wash — not a live slot.
 */
export function FeatureBleed({
  num,
  title,
  body,
  capability,
  tags,
  slotId,
  align = "start",
  image,
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
                className="relative h-full overflow-hidden rounded-[var(--radius-panel)] border-[length:var(--hairline)] border-[var(--line)] bg-[var(--ex)] shadow-[var(--shadow-demo)]"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  className="h-full w-full object-cover object-left"
                  sizes="(max-width: 768px) 100vw, 1200px"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
