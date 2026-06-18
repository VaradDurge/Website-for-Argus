"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  const [copied, setCopied] = useState(false);
  const copyRef = useRef<HTMLButtonElement>(null);
  const cmd = "pip install argus-agent";

  return (
    <footer id="footer" className="relative border-t border-[var(--border)] mt-16">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--accent-soft), transparent)",
          opacity: 0.4,
        }}
      />
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1.2fr] gap-8 items-start">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
        >
          <Logo />
          <p className="mt-4 max-w-xs text-[13px] leading-[1.6] text-[var(--text-muted)]">
            Forensic observability for AI pipelines.
            <br />
            <span className="font-serif-italic text-[var(--accent-soft)]">
              See every failure. Fix the right thing.
            </span>
          </p>
        </motion.div>

        <motion.ul
          className="flex items-center gap-6 text-[13px] text-[var(--text-muted)] lg:justify-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <li><a href="/docs" className="nav-link hover:text-white transition-colors">Docs</a></li>
          <li><a href="#replay" className="nav-link hover:text-white transition-colors">Replay</a></li>
          <li><a href="https://github.com/VaradDurge/ARGUS" target="_blank" rel="noopener noreferrer" className="nav-link hover:text-white transition-colors">GitHub</a></li>
        </motion.ul>

        <motion.div
          className="lg:justify-self-end"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <button
            ref={copyRef}
            onClick={() => {
              navigator.clipboard.writeText(cmd);
              setCopied(true);
              if (copyRef.current) {
                copyRef.current.classList.remove("copy-pulse");
                void copyRef.current.offsetWidth;
                copyRef.current.classList.add("copy-pulse");
              }
              setTimeout(() => setCopied(false), 1400);
            }}
            className="group inline-flex items-center gap-3 panel-tight px-3.5 py-2.5 font-mono text-[12.5px] hover:border-[var(--accent)] transition-colors"
          >
            <span className="text-[var(--text-dim)]">$</span>
            <span className="text-white">{cmd}</span>
            <span className="ml-2 text-[var(--text-muted)] group-hover:text-white">
              {copied ? <Check size={13} /> : <Copy size={13} />}
            </span>
          </button>
        </motion.div>
      </div>

      {/* giant outlined wordmark */}
      <motion.div
        className="mx-auto max-w-[1280px] px-6 lg:px-10 overflow-hidden select-none"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2
          data-text="ARGUS LABS"
          className="argus-wordmark text-center whitespace-nowrap font-medium leading-[0.85] tracking-[-0.05em]"
        >
          ARGUS LABS
        </h2>
      </motion.div>

      <div className="border-t border-[var(--border)]">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--text-dim)]">
            © 2026 ARGUS · All Eyes On Your Pipeline
          </span>
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--text-dim)]">
            Built for engineers · v0.1.0
          </span>
        </div>
      </div>
    </footer>
  );
}
