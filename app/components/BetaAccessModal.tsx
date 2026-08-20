"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Cal from "@calcom/embed-react";
import { ModalPortal } from "./ModalPortal";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function BetaAccessModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);

    // Lock body scroll while modal is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return (
    <ModalPortal>
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto relative w-full max-w-[880px] h-[min(90vh,760px)] overflow-hidden rounded-xl">
              <div className="panel relative h-full overflow-hidden">
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center rounded-md text-[var(--text-dim)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)] transition-colors"
                  aria-label="Close"
                >
                  <X size={15} />
                </button>

                <Cal
                  calLink="varaaddurgaay/argus-onboarding"
                  config={{
                    theme: "dark",
                    hideEventTypeDetails: "false",
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    overflow: "scroll",
                  }}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </ModalPortal>
  );
}
