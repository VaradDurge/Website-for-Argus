"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ButtonColorful } from "@/components/ui/button-colorful";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { Logo } from "./Logo";
import { WaitlistModal } from "./WaitlistModal";
import { BetaAccessModal } from "./BetaAccessModal";
import { ContactModal } from "./ContactModal";
import { RiGithubFill, RiDiscordFill, RiInstagramFill } from "@remixicon/react";

const menuItemVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3, ease: "easeOut" as const },
  }),
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

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
        {/* ── LEFT: logo ── */}
        <a href="/" className="flex items-center gap-2 shrink-0">
          <Logo />
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-[var(--signal-warn)]/30 bg-[rgba(245,177,60,0.06)]">
            <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-[var(--signal-warn)]">Beta</span>
          </span>
        </a>

        {/* ── DESKTOP: social icons ── */}
        <div className="hidden md:flex items-center gap-1 ml-3">
          <div className="w-px h-5 bg-[var(--border)] mx-1" />
          <a
            href="https://discord.gg/nhbdZkcG"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Discord"
            className="flex items-center justify-center w-8 h-8 rounded-md text-[var(--text-muted)] hover:text-[#5865F2] hover:scale-110 transition-all duration-200"
          >
            <RiDiscordFill size={18} />
          </a>
          <a
            href="https://github.com/VaradDurge/ARGUS"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="flex items-center justify-center w-8 h-8 rounded-md text-[var(--text-muted)] hover:text-white hover:scale-110 transition-all duration-200"
          >
            <RiGithubFill size={18} />
          </a>
          <a
            href="https://www.instagram.com/argus.in"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex items-center justify-center w-8 h-8 rounded-md text-[var(--text-muted)] hover:text-[#E4405F] hover:scale-110 transition-all duration-200"
          >
            <RiInstagramFill size={18} />
          </a>
        </div>

        {/* ── DESKTOP: center nav links with hover underlines ── */}
        <ul className="hidden md:flex items-center gap-1 mx-auto">
          <li>
            <button
              onClick={() => setContactOpen(true)}
              className="nav-link px-3.5 py-2 text-[13.5px] text-[var(--text-muted)] hover:text-white transition-colors rounded-md"
            >
              Contact
            </button>
          </li>
          <li>
            <a
              href="/docs"
              className="nav-link px-3.5 py-2 text-[13.5px] text-[var(--text-muted)] hover:text-white transition-colors rounded-md"
            >
              Docs
            </a>
          </li>
          <li>
            <a
              href="#replay"
              className="nav-link px-3.5 py-2 text-[13.5px] text-[var(--text-muted)] hover:text-white transition-colors rounded-md"
            >
              Replay
            </a>
          </li>
          <li>
            <a
              href="#features"
              className="nav-link px-3.5 py-2 text-[13.5px] text-[var(--text-muted)] hover:text-white transition-colors rounded-md"
            >
              Features
            </a>
          </li>
        </ul>

        {/* ── DESKTOP: right CTA buttons ── */}
        <div className="hidden md:flex items-center gap-3">
          <button onClick={() => setWaitlistOpen(true)}>
            <LiquidMetalButton label="Waitlist" />
          </button>
          <button onClick={() => setBetaOpen(true)}>
            <ButtonColorful label="Book a Call" />
          </button>
        </div>

        {/* ── MOBILE: waitlist + hamburger ── */}
        <div className="flex md:hidden items-center gap-2">
          <button onClick={() => setWaitlistOpen(true)}>
            <LiquidMetalButton label="Waitlist" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-center w-9 h-9 rounded-md border border-[var(--border)] text-[var(--text-muted)] hover:text-white transition-all duration-200"
            aria-label="Toggle menu"
          >
            <motion.div
              animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </motion.div>
          </button>
        </div>
      </nav>

      {/* ── MOBILE: slide-down menu with staggered items ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden overflow-hidden border-b border-[var(--border)]"
            style={{ background: "rgba(7,7,10,0.95)", backdropFilter: "blur(20px)" }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {[
                { type: "button" as const, label: "Contact", action: () => { setContactOpen(true); setMobileMenuOpen(false); } },
                { type: "link" as const, label: "Docs", href: "/docs" },
                { type: "link" as const, label: "Replay", href: "#replay" },
                { type: "link" as const, label: "Features", href: "#features" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  custom={i}
                  variants={menuItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {item.type === "button" ? (
                    <button
                      onClick={item.action}
                      className="text-left w-full px-3 py-2.5 text-[14px] text-[var(--text-muted)] hover:text-white transition-colors rounded-md"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <a
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2.5 text-[14px] text-[var(--text-muted)] hover:text-white transition-colors rounded-md"
                    >
                      {item.label}
                    </a>
                  )}
                </motion.div>
              ))}

              {/* divider */}
              <motion.div
                className="h-px bg-[var(--border)] my-1"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                style={{ transformOrigin: "left" }}
              />

              {/* social icons */}
              <motion.div
                className="flex items-center gap-3 px-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.3 }}
              >
                <a
                  href="https://discord.gg/nhbdZkcG"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Discord"
                  className="flex items-center justify-center w-9 h-9 rounded-md border border-[var(--border)] text-[var(--text-muted)] hover:text-[#5865F2] hover:scale-110 transition-all duration-200"
                >
                  <RiDiscordFill size={18} />
                </a>
                <a
                  href="https://github.com/VaradDurge/ARGUS"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="flex items-center justify-center w-9 h-9 rounded-md border border-[var(--border)] text-[var(--text-muted)] hover:text-white hover:scale-110 transition-all duration-200"
                >
                  <RiGithubFill size={18} />
                </a>
                <a
                  href="https://www.instagram.com/argus.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex items-center justify-center w-9 h-9 rounded-md border border-[var(--border)] text-[var(--text-muted)] hover:text-[#E4405F] hover:scale-110 transition-all duration-200"
                >
                  <RiInstagramFill size={18} />
                </a>
              </motion.div>

              {/* Book a Call button */}
              <motion.div
                className="px-3 pt-1"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <button onClick={() => { setBetaOpen(true); setMobileMenuOpen(false); }} className="w-full">
                  <ButtonColorful label="Book a Call" />
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
