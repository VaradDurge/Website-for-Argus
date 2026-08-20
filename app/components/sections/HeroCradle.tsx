import { Container } from "@/components/ui/section";
import { ArgusDemo } from "../demo/ArgusDemo";
import { DemoSlot } from "../demo/DemoSlot";

/**
 * Primary product demo, directly under the hero copy. Frosted cradle at ~9:5
 * (1440x800 artboard).
 */
export function HeroCradle() {
  return (
    <section className="relative pb-16 lg:pb-24">
      <Container>
        <div className="relative">
          <div className="demo-cradle relative p-1.5 sm:p-2">
            <DemoSlot
              id="hero-cradle-runs"
              aspect="9/5"
              className="aspect-auto h-[22rem] sm:h-[28rem] md:h-[36rem] lg:h-[40rem]"
            >
              <ArgusDemo />
            </DemoSlot>
          </div>
        </div>
      </Container>
    </section>
  );
}
