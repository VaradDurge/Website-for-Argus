"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { DocsSidebar } from "./DocsSidebar";

interface DocsMobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function DocsMobileDrawer({ open, onClose }: DocsMobileDrawerProps) {
  /* lock body scroll when open */
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

  /* close on Escape */
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
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* drawer panel */}
      <div className="absolute inset-y-0 left-0 w-[280px] bg-[var(--bg)] border-r border-[var(--border)] flex flex-col">
        {/* header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-[var(--border)]">
          <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-[var(--accent-soft)]">
            Navigation
          </span>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-[var(--border)] text-[var(--text-muted)] hover:text-white transition-colors"
            aria-label="Close navigation"
          >
            <X size={14} />
          </button>
        </div>

        {/* sidebar content */}
        <div className="flex-1 overflow-y-auto scroll-pretty px-2 py-4">
          <DocsSidebar onNavigate={onClose} />
        </div>
      </div>
    </div>
  );
}
