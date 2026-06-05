"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ButtonColorful } from "@/components/ui/button-colorful";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { Logo } from "./Logo";
import { WaitlistModal } from "./WaitlistModal";
import { BetaAccessModal } from "./BetaAccessModal";
import { ContactModal } from "./ContactModal";
import { RiGithubFill, RiDiscordFill, RiInstagramFill } from "@remixicon/react";

export function Nav() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [betaOpen, setBetaOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <WaitlistModal open={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
      <BetaAccessModal open={betaOpen} onClose={() => setBetaOpen(false)} />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
      <div className="absolute inset-0 -z-10 backdrop-blur-xl bg-[rgba(7,7,10,0.6)] border-b border-[var(--border)]" />

      <nav className="mx-auto flex max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-10 h-14 md:h-16">
        {/* ── LEFT: logo (always visible) ── */}
        <a href="/" className="flex items-center gap-2 shrink-0">
          <Logo />
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-[var(--signal-warn)]/30 bg-[rgba(245,177,60,0.06)]">
            <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-[var(--signal-warn)]">Beta</span>
          </span>
        </a>

        {/* ── DESKTOP: social icons (hidden on mobile) ── */}
        <div className="hidden md:flex items-center gap-1 ml-3">
          <div className="w-px h-5 bg-[var(--border)] mx-1" />
          <a
            href="https://discord.gg/zW774xvS"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Discord"
            className="flex items-center justify-center w-8 h-8 rounded-md text-[var(--text-muted)] hover:text-[#5865F2] transition-colors"
          >
            <RiDiscordFill size={18} />
          </a>
          <a
            href="https://github.com/VaradDurge/ARGUS"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="flex items-center justify-center w-8 h-8 rounded-md text-[var(--text-muted)] hover:text-white transition-colors"
          >
            <RiGithubFill size={18} />
          </a>
          <a
            href="https://www.instagram.com/argus.in"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex items-center justify-center w-8 h-8 rounded-md text-[var(--text-muted)] hover:text-[#E4405F] transition-colors"
          >
            <RiInstagramFill size={18} />
          </a>
        </div>

        {/* ── DESKTOP: center nav links ── */}
        <ul className="hidden md:flex items-center gap-1 mx-auto">
          <li>
            <button
              onClick={() => setContactOpen(true)}
              className="px-3.5 py-2 text-[13.5px] text-[var(--text-muted)] hover:text-white transition-colors rounded-md"
            >
              Contact
            </button>
          </li>
          <li>
            <a
              href="#docs"
              className="px-3.5 py-2 text-[13.5px] text-[var(--text-muted)] hover:text-white transition-colors rounded-md"
            >
              Docs
            </a>
          </li>
          <li>
            <a
              href="#replay"
              className="px-3.5 py-2 text-[13.5px] text-[var(--text-muted)] hover:text-white transition-colors rounded-md"
            >
              Replay
            </a>
          </li>
        </ul>

        {/* ── DESKTOP: right CTA buttons ── */}
        <div className="hidden md:flex items-center gap-3">
          <button onClick={() => setWaitlistOpen(true)}>
            <LiquidMetalButton label="Waitlist" />
          </button>
          <button onClick={() => setBetaOpen(true)}>
            <ButtonColorful label="Beta Access" />
          </button>
        </div>

        {/* ── MOBILE: waitlist + hamburger ── */}
        <div className="flex md:hidden items-center gap-2">
          <button onClick={() => setWaitlistOpen(true)}>
            <LiquidMetalButton label="Waitlist" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-center w-9 h-9 rounded-md border border-[var(--border)] text-[var(--text-muted)] hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* ── MOBILE: slide-down menu ── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-b border-[var(--border)] ${
          mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 border-b-0"
        }`}
        style={{ background: "rgba(7,7,10,0.95)", backdropFilter: "blur(20px)" }}
      >
        <div className="px-4 py-4 flex flex-col gap-3">
          {/* nav links */}
          <button
            onClick={() => { setContactOpen(true); setMobileMenuOpen(false); }}
            className="text-left px-3 py-2.5 text-[14px] text-[var(--text-muted)] hover:text-white transition-colors rounded-md"
          >
            Contact
          </button>
          <a
            href="#docs"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2.5 text-[14px] text-[var(--text-muted)] hover:text-white transition-colors rounded-md"
          >
            Docs
          </a>
          <a
            href="#replay"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2.5 text-[14px] text-[var(--text-muted)] hover:text-white transition-colors rounded-md"
          >
            Replay
          </a>

          {/* divider */}
          <div className="h-px bg-[var(--border)] my-1" />

          {/* social icons */}
          <div className="flex items-center gap-3 px-3">
            <a
              href="https://discord.gg/zW774xvS"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
              className="flex items-center justify-center w-9 h-9 rounded-md border border-[var(--border)] text-[var(--text-muted)] hover:text-[#5865F2] transition-colors"
            >
              <RiDiscordFill size={18} />
            </a>
            <a
              href="https://github.com/VaradDurge/ARGUS"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex items-center justify-center w-9 h-9 rounded-md border border-[var(--border)] text-[var(--text-muted)] hover:text-white transition-colors"
            >
              <RiGithubFill size={18} />
            </a>
            <a
              href="https://www.instagram.com/argus.in"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex items-center justify-center w-9 h-9 rounded-md border border-[var(--border)] text-[var(--text-muted)] hover:text-[#E4405F] transition-colors"
            >
              <RiInstagramFill size={18} />
            </a>
          </div>

          {/* Beta Access button */}
          <div className="px-3 pt-1">
            <button onClick={() => { setBetaOpen(true); setMobileMenuOpen(false); }} className="w-full">
              <ButtonColorful label="Beta Access" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
