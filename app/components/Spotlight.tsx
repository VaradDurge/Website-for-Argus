"use client";

import { cn } from "@/lib/utils";

/** A surface lit by the cursor: tracks the pointer into --mx/--my for the
    .spotlight glow. One style write per move, no React state. */
export function Spotlight({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn("spotlight", className)}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      {children}
    </div>
  );
}
