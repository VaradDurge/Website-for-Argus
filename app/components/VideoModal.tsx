"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ModalPortal } from "./ModalPortal";
import { useDialogFocus } from "./useDialogFocus";

interface Props {
  open: boolean;
  onClose: () => void;
}

/** The ARGUS film (Argus_Improvised), self-hosted so it plays without a third-party embed. */
export function VideoModal({ open, onClose }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  useDialogFocus(open, panel);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);

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
              key="film-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm"
              onClick={onClose}
            />

            <motion.div
              key="film-panel"
              ref={panel}
              role="dialog"
              aria-modal="true"
              aria-label="ARGUS launch film"
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none fixed inset-0 z-[101] flex items-center justify-center"
            >
              <div className="pointer-events-auto mx-4 w-full max-w-[1100px]">
                <div className="relative overflow-hidden rounded-[14px] bg-black shadow-[0_0_0_1px_var(--line-2),0_40px_120px_-20px_rgba(0,0,0,0.9)]">
                  <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white/80 transition-colors hover:bg-black/80 hover:text-white"
                    aria-label="Close film"
                  >
                    <X size={16} />
                  </button>
                  <video
                    className="block aspect-video w-full"
                    src="/film/argus-improvised.mp4"
                    poster="/film/argus-improvised.jpg"
                    controls
                    autoPlay
                    playsInline
                    preload="none"
                  >
                    Your browser cannot play this video.
                  </video>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </ModalPortal>
  );
}
