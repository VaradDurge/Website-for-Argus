"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { RiDiscordFill, RiGithubFill } from "@remixicon/react";
import { Logo } from "./Logo";
import { WaitlistModal } from "./WaitlistModal";
import { BetaAccessModal } from "./BetaAccessModal";
import { ContactModal } from "./ContactModal";

const LINKS = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Features", href: "/#features" },
  { label: "Security", href: "/#security" },
  { label: "Changelog", href: "/#changelog" },
  { label: "Docs", href: "/docs" },
  { label: "Pricing", href: "/pricing" },
] as const;

export function Nav() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [betaOpen, setBetaOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <WaitlistModal open={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
      <BetaAccessModal open={betaOpen} onClose={() => setBetaOpen(false)} />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />

      <header className="sticky top-0 z-50 border-b-[length:var(--hairline)] border-[var(--line)]/60 bg-[var(--void)]/35 backdrop-blur-2xl backdrop-saturate-150">
        <nav className="constrained flex h-14 items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Logo />
            <span className="rounded-[5px] border-[length:var(--hairline)] border-[var(--line)] bg-[var(--ex)] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--ink-3)]">
              Beta
            </span>
          </Link>

          <ul className="hidden items-center gap-0.5 lg:flex">
            {LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="btn-ghost">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <a
              href="https://github.com/VaradDurge/ARGUS"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="btn-ghost px-1.5"
            >
              <RiGithubFill size={16} />
            </a>
            <a
              href="https://discord.gg/yVuGDCX54K"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
              className="btn-ghost px-1.5"
            >
              <RiDiscordFill size={16} />
            </a>
            <button
              type="button"
              onClick={() => setWaitlistOpen(true)}
              className="btn-secondary"
            >
              Join waitlist
            </button>
            <button
              type="button"
              onClick={() => setBetaOpen(true)}
              className="btn-primary"
            >
              Book a call
            </button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setBetaOpen(true)}
              className="btn-primary"
            >
              Book a call
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-control)] border-[length:var(--hairline)] border-[var(--line)] text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]"
            >
              {mobileOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="overflow-hidden border-t-[length:var(--hairline)] border-[var(--line)] bg-[var(--void)] lg:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
            >
              <div className="constrained flex flex-col gap-1 py-4">
                {LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-[var(--radius-control)] px-2 py-2.5 text-[14px] text-[var(--ink-2)] transition-colors hover:bg-[var(--band)] hover:text-[var(--ink)]"
                  >
                    {link.label}
                  </Link>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    setContactOpen(true);
                    setMobileOpen(false);
                  }}
                  className="rounded-[var(--radius-control)] px-2 py-2.5 text-left text-[14px] text-[var(--ink-2)] transition-colors hover:bg-[var(--component)] hover:text-[var(--ink)]"
                >
                  Contact
                </button>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setWaitlistOpen(true);
                      setMobileOpen(false);
                    }}
                    className="btn-secondary flex-1"
                  >
                    Join waitlist
                  </button>
                  <a
                    href="https://github.com/VaradDurge/ARGUS"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="btn-secondary px-2.5"
                  >
                    <RiGithubFill size={16} />
                  </a>
                  <a
                    href="https://discord.gg/yVuGDCX54K"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Discord"
                    className="btn-secondary px-2.5"
                  >
                    <RiDiscordFill size={16} />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
