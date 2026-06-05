"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Check } from "lucide-react";
import { RiGithubFill, RiDiscordFill, RiInstagramFill } from "@remixicon/react";

interface Props {
  open: boolean;
  onClose: () => void;
}

type Status = "idle" | "loading" | "success" | "error";

export function WaitlistModal({ open, onClose }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const nameRef = useRef<HTMLInputElement>(null);

  // focus name field when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => nameRef.current?.focus(), 120);
    } else {
      setName("");
      setEmail("");
      setStatus("idle");
    }
  }, [open]);

  // close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });

      if (!res.ok) throw new Error("Failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-[420px] mx-4">
              <div className={`relative rounded-[14px] ${status === "success" ? "modal-glow-border" : ""}`}>
              <div className={`relative p-7 rounded-[14px] bg-[var(--surface)] ${status === "success" ? "" : "panel"}`}>
                {/* close */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-md text-[var(--text-dim)] hover:text-white hover:bg-[var(--surface-2)] transition-colors"
                  aria-label="Close"
                >
                  <X size={15} />
                </button>

                {status === "success" ? (
                  <div className="py-4 flex flex-col items-center gap-4 text-center">
                    <span className="w-12 h-12 rounded-full bg-[rgba(0,240,168,0.08)] border border-[var(--signal-ok)]/30 flex items-center justify-center text-[var(--signal-ok)]">
                      <Check size={22} />
                    </span>
                    <h3 className="text-[22px] font-medium text-white tracking-[-0.02em]">
                      You&apos;re in.
                    </h3>
                    <p className="text-[14px] leading-[1.65] text-[var(--text-muted)] max-w-[280px]">
                      <span className="font-serif-italic text-[var(--accent-soft)]">Thank you</span>{" "}for believing in what we&apos;re building. We&apos;ll reach out soon.
                    </p>
                    <p className="text-[12px] text-[var(--text-dim)] leading-[1.6] max-w-[260px]">
                      — Varad &amp; the Argus Labs team
                    </p>

                    {/* socials */}
                    <div className="mt-2 flex items-center gap-3">
                      <a
                        href="https://discord.gg/zW774xvS"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-[#5865F2]/30 bg-[rgba(88,101,242,0.08)] text-[#5865F2] hover:bg-[rgba(88,101,242,0.15)] transition-colors"
                      >
                        <RiDiscordFill size={15} />
                        <span className="text-[13px] text-white/80">
                          You&apos;ve been invited to join our{" "}
                          <span className="text-[#5865F2] font-medium">Discord</span>
                        </span>
                      </a>
                      <a
                        href="https://github.com/VaradDurge/ARGUS"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className="flex items-center justify-center w-9 h-9 rounded-lg border border-white/15 bg-[rgba(255,255,255,0.04)] text-[var(--text-muted)] hover:text-white hover:bg-[rgba(255,255,255,0.08)] transition-colors shrink-0"
                      >
                        <RiGithubFill size={17} />
                      </a>
                      <a
                        href="https://www.instagram.com/argus.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="flex items-center justify-center w-9 h-9 rounded-lg border border-white/15 bg-[rgba(255,255,255,0.04)] text-[var(--text-muted)] hover:text-[#E4405F] hover:bg-[rgba(255,255,255,0.08)] transition-colors shrink-0"
                      >
                        <RiInstagramFill size={17} />
                      </a>
                    </div>

                    <button
                      onClick={onClose}
                      className="mt-3 font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--text-dim)] hover:text-white transition-colors"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <>
                    {/* header */}
                    <div className="mb-6">
                      <div className="eyebrow mb-3">Early Access</div>
                      <h3 className="text-[22px] font-medium tracking-[-0.02em] text-white">
                        Join the waitlist.
                      </h3>
                      <p className="mt-1.5 text-[13px] leading-[1.6] text-[var(--text-muted)]">
                        Be among the first engineers to get access to ARGUS.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-[var(--text-dim)]">
                          Name
                        </label>
                        <input
                          ref={nameRef}
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          placeholder="Your name"
                          className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-[10px] px-3.5 py-2.5 text-[14px] text-white placeholder:text-[var(--text-dim)] outline-none focus:border-[var(--accent-soft)] transition-colors"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-[var(--text-dim)]">
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="you@company.com"
                          className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-[10px] px-3.5 py-2.5 text-[14px] text-white placeholder:text-[var(--text-dim)] outline-none focus:border-[var(--accent-soft)] transition-colors"
                        />
                      </div>

                      {status === "error" && (
                        <p className="text-[12px] text-[var(--signal-fail)]">
                          Something went wrong. Please try again.
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="mt-1 w-full flex items-center justify-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-soft)] text-white rounded-[10px] py-2.5 text-[14px] font-medium transition-colors disabled:opacity-60"
                      >
                        {status === "loading" ? (
                          <span className="font-mono text-[12px] tracking-[0.1em]">Submitting…</span>
                        ) : (
                          <>
                            Request Access
                            <ArrowRight size={15} />
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
