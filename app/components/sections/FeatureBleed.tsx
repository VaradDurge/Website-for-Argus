import { Container, TagList } from "@/components/ui/section";
import { DemoSlot } from "../demo/DemoSlot";

export interface FeatureBleedProps {
  num: string;
  title: string;
  body: string;
  capability: string;
  tags: readonly string[];
  slotId: string;
}

/**
 * Copy on the left, a 15:8 product panel on the right that bleeds off the
 * right edge of the 1200px container and is clipped by the section.
 */
export function FeatureBleed({
  num,
  title,
  body,
  capability,
  tags,
  slotId,
}: FeatureBleedProps) {
  return (
    <section className="relative overflow-x-clip py-16 md:py-24">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-12">
          <div className="reveal max-w-[480px] md:py-12">
            <p className="step-num">{num}</p>
            <h2 className="heading-4 mt-4 text-[var(--ink)]">{title}</h2>
            <p className="body-base mt-4">{body}</p>
            <TagList label={capability} items={tags} className="mt-8" />
          </div>

          <div className="relative aspect-[15/8] md:aspect-auto md:h-[640px]">
            <div className="h-full md:absolute md:inset-y-0 md:left-0 md:w-[1200px]">
              <DemoSlot
                id={slotId}
                aspect="15/8"
                className="aspect-auto h-full shadow-[var(--shadow-control)]"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
