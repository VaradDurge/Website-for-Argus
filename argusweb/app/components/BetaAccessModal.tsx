"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowDown } from "lucide-react";
import { RiDiscordFill } from "@remixicon/react";

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
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
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
            className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-[400px] mx-4">
              <div className="panel p-7 relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-md text-[var(--text-dim)] hover:text-white hover:bg-[var(--surface-2)] transition-colors"
                  aria-label="Close"
                >
                  <X size={15} />
                </button>

                {/* Beta badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[var(--signal-warn)]/30 bg-[rgba(245,177,60,0.08)] mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--signal-warn)] animate-pulse" />
                  <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--signal-warn)]">
                    Beta
                  </span>
                </div>

                <h3 className="text-[20px] font-medium tracking-[-0.02em] text-white">
                  Get early access to ARGUS.
                </h3>
                <p className="mt-3 text-[13.5px] leading-[1.65] text-[var(--text-muted)]">
                  ARGUS is in closed beta. The fastest way to get access is through our Discord — chat directly with the dev, submit requests, and get hands-on support.
                </p>

                {/* Discord CTA */}
                <a
                  href="https://discord.gg/zW774xvS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-[10px] bg-[#5865F2] hover:bg-[#4752C4] text-white text-[14px] font-medium transition-colors"
                >
                  <RiDiscordFill size={18} />
                  Join Discord for Access
                </a>

                <p className="mt-2.5 text-center text-[11.5px] text-[var(--text-dim)]">
                  Talk to the dev directly · get priority access · share feedback
                </p>

                {/* Divider */}
                <div className="flex items-center gap-3 mt-5">
                  <div className="flex-1 h-px bg-[var(--border)]" />
                  <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--text-dim)]">or</span>
                  <div className="flex-1 h-px bg-[var(--border)]" />
                </div>

                {/* Installation link */}
                <button
                  onClick={() => {
                    onClose();
                    const el = document.getElementById("get-started");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-[10px] border border-[var(--border)] text-[var(--text-muted)] hover:text-white hover:border-[var(--accent-soft)] transition-colors text-[13.5px]"
                >
                  <ArrowDown size={14} />
                  Skip to Installation
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
