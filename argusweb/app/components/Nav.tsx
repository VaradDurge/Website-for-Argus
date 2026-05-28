"use client";

import { useState } from "react";
import { ButtonColorful } from "@/components/ui/button-colorful";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { Logo } from "./Logo";
import { WaitlistModal } from "./WaitlistModal";
import { BetaAccessModal } from "./BetaAccessModal";
import { ContactModal } from "./ContactModal";
import { RiGithubFill, RiDiscordFill } from "@remixicon/react";

export function Nav() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [betaOpen, setBetaOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <WaitlistModal open={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
      <BetaAccessModal open={betaOpen} onClose={() => setBetaOpen(false)} />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
      <div className="absolute inset-0 -z-10 backdrop-blur-xl bg-[rgba(7,7,10,0.6)] border-b border-[var(--border)]" />
      <nav className="mx-auto flex max-w-[1280px] items-center justify-between px-3 sm:px-6 lg:px-10 h-16">
        {/* left: logo + divider + social icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a href="/" className="flex items-center gap-2">
            <Logo />
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-[var(--signal-warn)]/30 bg-[rgba(245,177,60,0.06)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--signal-warn)] animate-pulse" />
              <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-[var(--signal-warn)]">Beta</span>
            </span>
          </a>
          <div className="hidden sm:block w-px h-5 bg-[var(--border)] mx-1" />
          <a
            href="https://discord.gg/zW774xvS"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Discord"
            className="hidden sm:flex items-center justify-center w-8 h-8 rounded-md text-[var(--text-muted)] hover:text-[#5865F2] transition-colors"
          >
            <RiDiscordFill size={18} />
          </a>
          <a
            href="https://github.com/VaradDurge/ARGUS"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hidden sm:flex items-center justify-center w-8 h-8 rounded-md text-[var(--text-muted)] hover:text-white transition-colors"
          >
            <RiGithubFill size={18} />
          </a>
        </div>

        <ul className="hidden md:flex items-center gap-1">
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

        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={() => setWaitlistOpen(true)} className="hidden sm:block">
            <LiquidMetalButton label="Waitlist" />
          </button>
          <button onClick={() => setBetaOpen(true)}>
            <ButtonColorful label="Beta Access" />
          </button>
        </div>
      </nav>
    </header>
  );
}
