"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function VideoModal({ open, onClose }: Props) {
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
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="video-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            key="video-panel"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-[900px] mx-4">
              <div className="relative rounded-xl overflow-hidden border border-[var(--border)] bg-black">
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 text-white/70 hover:text-white hover:bg-black/80 transition-colors"
                  aria-label="Close video"
                >
                  <X size={16} />
                </button>

                <iframe
                  src={`https://www.youtube.com/embed/vrt9i4cD2us?autoplay=1&rel=0`}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  className="w-full aspect-video"
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
