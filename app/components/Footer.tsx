"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  const [copied, setCopied] = useState(false);
  const cmd = "pip install argus-agent";

  return (
    <footer className="relative border-t border-[var(--border)] mt-10">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--accent-soft), transparent)",
          opacity: 0.4,
        }}
      />
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1.2fr] gap-8 items-start">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-[13px] leading-[1.6] text-[var(--text-muted)]">
            Forensic observability for AI pipelines.
            <br />
            <span className="font-serif-italic text-[var(--accent-soft)]">
              See every failure. Fix the right thing.
            </span>
          </p>
        </div>

        <ul className="flex items-center gap-6 text-[13px] text-[var(--text-muted)] lg:justify-center">
          <li><a href="/docs" className="hover:text-white transition-colors">Docs</a></li>
          <li><a href="#replay" className="hover:text-white transition-colors">Replay</a></li>
          <li><a href="#github" className="hover:text-white transition-colors">GitHub</a></li>
        </ul>

        <div className="lg:justify-self-end">
          <button
            onClick={() => {
              navigator.clipboard.writeText(cmd);
              setCopied(true);
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
        </div>
      </div>

      {/* giant outlined wordmark — fills with gradient on hover */}
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10 overflow-hidden select-none">
        <h2
          data-text="ARGUS LABS"
          className="argus-wordmark text-center whitespace-nowrap font-medium leading-[0.85] tracking-[-0.05em]"
        >
          ARGUS LABS
        </h2>
      </div>

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
