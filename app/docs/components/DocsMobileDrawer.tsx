"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { DocsSidebar } from "./DocsSidebar";

interface DocsMobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function DocsMobileDrawer({ open, onClose }: DocsMobileDrawerProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Documentation navigation"
        className="absolute inset-y-0 left-0 flex w-[280px] flex-col border-r-[length:var(--hairline)] border-[var(--line)] bg-[var(--void)]"
      >
        <div className="flex h-14 items-center justify-between border-b-[length:var(--hairline)] border-[var(--line)] px-4">
          <span className="eyebrow">Navigation</span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-control)] border-[length:var(--hairline)] border-[var(--line)] text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]"
            aria-label="Close navigation"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scroll-pretty px-3 py-5">
          <DocsSidebar onNavigate={onClose} />
        </div>
      </div>
    </div>
  );
}
