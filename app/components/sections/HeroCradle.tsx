import { Container } from "@/components/ui/section";
import { DemoSlot } from "../demo/DemoSlot";

/**
 * Primary product demo, directly under the hero copy. Frosted cradle at ~9:5
 * (1440x800 artboard). Elevation is neutral depth, not a tinted glow — the
 * cradle sits on `ex` above the `void` page ground.
 */
export function HeroCradle() {
  return (
    <section className="relative pb-16 lg:pb-24">
      <Container>
        <div className="demo-cradle p-1.5 sm:p-2">
          <DemoSlot id="hero-cradle-runs" aspect="9/5" />
        </div>
      </Container>
    </section>
  );
}
