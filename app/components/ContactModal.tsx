"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail } from "lucide-react";
import { RiTwitterXFill, RiDiscordFill } from "@remixicon/react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ContactModal({ open, onClose }: Props) {
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
            <div className="pointer-events-auto w-full max-w-[380px] mx-4">
              <div className="panel p-7 relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-md text-[var(--text-dim)] hover:text-white hover:bg-[var(--surface-2)] transition-colors"
                  aria-label="Close"
                >
                  <X size={15} />
                </button>

                <h3 className="text-[22px] font-medium tracking-[-0.02em]">
                  <span className="contact-gradient-text">Get in touch.</span>
                </h3>
                <p className="mt-2 text-[13px] text-[var(--text-muted)] leading-[1.6]">
                  Reach out anywhere — happy to chat.
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  {/* X / Twitter */}
                  <a
                    href="https://x.com/VaraadDurgaay"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] border border-[var(--border)] hover:border-white/20 bg-[var(--surface-2)] hover:bg-[rgba(255,255,255,0.04)] transition-colors group"
                  >
                    <RiTwitterXFill size={17} className="text-white shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-[13px] text-white font-medium">@VaraadDurgaay</span>
                      <span className="text-[11px] text-[var(--text-dim)]">X / Twitter</span>
                    </div>
                  </a>

                  {/* Email */}
                  <a
                    href="mailto:varaddurge@gmail.com"
                    className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] border border-[var(--border)] hover:border-white/20 bg-[var(--surface-2)] hover:bg-[rgba(255,255,255,0.04)] transition-colors group"
                  >
                    <Mail size={17} className="text-[#f5b13c] shrink-0" strokeWidth={1.6} />
                    <div className="flex flex-col">
                      <span className="text-[13px] text-white font-medium">varaddurge@gmail.com</span>
                      <span className="text-[11px] text-[var(--text-dim)]">Email</span>
                    </div>
                  </a>

                  {/* Discord */}
                  <a
                    href="https://discord.gg/6D7gezer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3.5 px-4 py-3 rounded-[10px] border border-[#5865F2]/25 hover:border-[#5865F2]/50 bg-[rgba(88,101,242,0.06)] hover:bg-[rgba(88,101,242,0.12)] transition-colors group"
                  >
                    <RiDiscordFill size={17} className="text-[#5865F2] shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-[13px] text-white font-medium">Argus Labs</span>
                      <span className="text-[11px] text-[var(--text-dim)]">Discord Server</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
