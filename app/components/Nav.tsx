"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { RiDiscordFill, RiGithubFill } from "@remixicon/react";
import { formatStarCount, GITHUB_URL } from "@/lib/github";
import { DISCORD_URL, QUICKSTART_HREF } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { WaitlistModal } from "./WaitlistModal";
import { BetaAccessModal } from "./BetaAccessModal";

const LINKS = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Docs", href: "/docs" },
  { label: "Pricing", href: "/pricing" },
  { label: "Changelog", href: `${GITHUB_URL}/releases` },
] as const;

function NavLink({ href, label, className, onClick }: {
  href: string;
  label: string;
  className?: string;
  onClick?: () => void;
}) {
  return href.startsWith("http") ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
      {label}
    </a>
  ) : (
    <Link href={href} className={className} onClick={onClick}>
      {label}
    </Link>
  );
}

export function Nav({ stars }: { stars?: number | null }) {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const starLabel = typeof stars === "number" ? `GitHub, ${stars} stars` : "GitHub";

  return (
    <>
      <WaitlistModal open={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
      <BetaAccessModal open={callOpen} onClose={() => setCallOpen(false)} />

      <header
        className={cn(
          "sticky top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300",
          scrolled || menuOpen
            ? "bg-[color-mix(in_srgb,var(--void)_74%,transparent)] shadow-[inset_0_-1px_0_var(--line)] backdrop-blur-xl backdrop-saturate-150"
            : "bg-transparent"
        )}
      >
        <nav className="constrained flex h-16 items-center justify-between gap-6">
          <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="ArgusLabs home">
            <Logo />
            <span className="rounded-full px-2 py-[3px] font-mono text-[9.5px] uppercase tracking-[0.14em] text-[var(--ink-3)] shadow-[inset_0_0_0_1px_var(--line-2)]">
              Beta
            </span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((link) => (
              <li key={link.label}>
                <NavLink {...link} className="btn-ghost" />
              </li>
            ))}
          </ul>

          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={starLabel}
              className="btn-ghost gap-1.5 px-2"
            >
              <RiGithubFill size={16} />
              {typeof stars === "number" ? (
                <span className="font-mono text-[12px] tabular-nums">{formatStarCount(stars)}</span>
              ) : null}
            </a>
            <button type="button" onClick={() => setCallOpen(true)} className="btn-secondary">
              Book a call
            </button>
            <Link href={QUICKSTART_HREF} className="btn-primary group">
              Get started
              <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <Link href={QUICKSTART_HREF} className="btn-primary h-9">
              Get started
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="btn-secondary h-9 w-9 px-0"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="overflow-hidden lg:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="constrained flex flex-col gap-1 pb-6 pt-2">
                {LINKS.map((link) => (
                  <NavLink
                    key={link.label}
                    {...link}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-[var(--radius-control)] px-2 py-3 text-[16px] text-[var(--ink-2)] transition-colors hover:bg-[var(--band)] hover:text-[var(--ink)]"
                  />
                ))}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCallOpen(true);
                      setMenuOpen(false);
                    }}
                    className="btn-secondary h-11"
                  >
                    Book a call
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setWaitlistOpen(true);
                      setMenuOpen(false);
                    }}
                    className="btn-secondary h-11"
                  >
                    Early access
                  </button>
                </div>
                <div className="mt-2 flex gap-2">
                  <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label={starLabel} className="btn-secondary h-11 flex-1">
                    <RiGithubFill size={16} />
                    GitHub
                    {typeof stars === "number" ? (
                      <span className="font-mono text-[12px] tabular-nums text-[var(--ink-3)]">{formatStarCount(stars)}</span>
                    ) : null}
                  </a>
                  <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary h-11 flex-1">
                    <RiDiscordFill size={16} />
                    Discord
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
