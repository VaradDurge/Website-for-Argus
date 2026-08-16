import { cn } from "@/lib/utils";

export type DemoSlotAspect = "9/5" | "15/8" | "mini";

export interface DemoSlotProps {
  /** Stable slot id from docs-redesign/DEMO_SLOT_CONTRACT.md. */
  id: string;
  aspect?: DemoSlotAspect;
  className?: string;
  /** Real demo UI. When omitted a placeholder frame is rendered. */
  children?: React.ReactNode;
}

const ASPECT_CLASS: Record<DemoSlotAspect, string> = {
  "9/5": "aspect-[9/5]",
  "15/8": "aspect-[15/8]",
  mini: "h-[200px]",
};

/**
 * Seam between the marketing layout and the demo UI components.
 *
 * The layout owns the frame — size, aspect ratio, radius, hairline. The demo
 * agent owns what goes inside it, passed as `children`. Demo UI must be built
 * from the Argus Instrument token layer (light active): panel / raised / rail
 * / ex / band grounds, line hairlines, ink text, iris for interaction, and
 * the five signal hues for run state. See docs-redesign/DEMO_SLOT_CONTRACT.md
 * for the palette and the rendered pixel size of every slot id.
 */
export function DemoSlot({
  id,
  aspect = "15/8",
  className,
  children,
}: DemoSlotProps) {
  return (
    <div
      data-demo-slot={id}
      className={cn(
        "relative w-full overflow-hidden rounded-[var(--radius-panel)]",
        "border-[length:var(--hairline)] border-[var(--line)] bg-[var(--panel)]",
        ASPECT_CLASS[aspect],
        className
      )}
    >
      {children ? (
        <div className="absolute inset-0 min-h-0">{children}</div>
      ) : (
        <DemoPlaceholder id={id} aspect={aspect} />
      )}
    </div>
  );
}

function DemoPlaceholder({
  id,
  aspect,
}: {
  id: string;
  aspect: DemoSlotAspect;
}) {
  const isMini = aspect === "mini";

  return (
    <div className="absolute inset-0 flex flex-col bg-[var(--panel)]">
      {/* title band */}
      <div className="flex shrink-0 items-center gap-2 border-b-[length:var(--hairline)] border-[var(--line)] bg-[var(--band)] px-3 py-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--line-3)]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--line-3)]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--line-3)]" />
        <span className="ml-2 truncate font-mono text-[9px] tracking-[0.16em] uppercase text-[var(--ink-3)]">
          {id}
        </span>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* icon rail */}
        {!isMini && (
          <div className="hidden w-10 shrink-0 flex-col items-center gap-3 border-r-[length:var(--hairline)] border-[var(--line)] bg-[var(--rail)] py-3 sm:flex">
            {Array.from({ length: 4 }).map((_, i) => (
              <span
                key={i}
                className="h-4 w-4 rounded-[var(--radius-swatch)] bg-[var(--line-2)]"
              />
            ))}
          </div>
        )}

        {/* explorer */}
        {!isMini && (
          <div className="hidden w-32 shrink-0 flex-col gap-2 border-r-[length:var(--hairline)] border-[var(--line)] bg-[var(--ex)] p-3 md:flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className="h-2 rounded-full bg-[var(--line-2)]"
                style={{ width: `${88 - i * 12}%` }}
              />
            ))}
          </div>
        )}

        {/* workspace */}
        <div className="flex min-w-0 flex-1 flex-col gap-2 p-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-24 rounded-full bg-[var(--line-2)]" />
            <span className="h-2.5 w-12 rounded-full bg-[var(--line)]" />
          </div>
          <div className="min-h-0 flex-1 rounded-[var(--radius-inner)] border-[length:var(--hairline)] border-[var(--line)] bg-[var(--raised)] p-3">
            <div className="flex flex-col gap-2">
              {Array.from({ length: isMini ? 3 : 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--line-2)]" />
                  <span
                    className="h-2 rounded-full bg-[var(--line-2)]"
                    style={{ width: `${72 - i * 11}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-[var(--panel)]" />

      <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-3">
        <span className="rounded-full border-[length:var(--hairline)] border-[var(--line)] bg-[var(--panel)] px-2.5 py-1 font-mono text-[9px] tracking-[0.16em] uppercase text-[var(--ink-3)]">
          demo slot · {aspect === "mini" ? "16:10" : aspect}
        </span>
      </div>
    </div>
  );
}
