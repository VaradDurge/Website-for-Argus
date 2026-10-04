"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { ModalPortal } from "./ModalPortal";
import { useDialogFocus } from "./useDialogFocus";

// The instrument is heavy and only matters once someone asks for it.
const ArgusDemo = dynamic(() => import("./demo/ArgusDemo").then((m) => m.ArgusDemo), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center font-mono text-[12px] text-[var(--ink-3)]">
      Loading the run…
    </div>
  ),
});

export function DemoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  useDialogFocus(open, panel);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      // Esc inside the demo's search box closes the search (the demo handles it)
      if (e.key === "Escape" && !(e.target instanceof HTMLInputElement)) onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <ModalPortal>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="demo-backdrop"
              className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={onClose}
            />
            <motion.div
              key="demo-panel"
              ref={panel}
              role="dialog"
              aria-modal="true"
              aria-label="Interactive ARGUS run"
              className="pointer-events-none fixed inset-0 z-[101] flex items-center justify-center p-3 sm:p-6"
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="pointer-events-auto relative flex h-[min(88vh,820px)] w-full max-w-[1400px] flex-col overflow-hidden rounded-[14px] bg-[var(--panel)] shadow-[0_0_0_1px_var(--line-2),0_40px_120px_-20px_rgba(0,0,0,0.9)]">
                <div className="flex items-center justify-between gap-4 px-4 py-3 shadow-[inset_0_-1px_0_var(--line)]">
                  <p className="font-mono text-[12px] text-[var(--ink-2)]">
                    A crashed run, as the ARGUS UI shows it
                    <span className="ml-2 hidden text-[var(--ink-3)] sm:inline">· click around</span>
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="btn-ghost h-8 w-8 justify-center px-0"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="relative min-h-0 flex-1">
                  <div className="absolute inset-0">
                    <ArgusDemo />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </ModalPortal>
  );
}
