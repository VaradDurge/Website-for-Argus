"use client";

import { useState } from "react";
import Link from "next/link";
import { RiDiscordFill, RiGithubFill, RiInstagramFill } from "@remixicon/react";
import { Container } from "@/components/ui/section";
import { GITHUB_URL } from "@/lib/github";
import { DISCORD_URL, INSTAGRAM_URL, QUICKSTART_HREF } from "@/lib/site";
import { ContactModal } from "./ContactModal";
import { Logo, LogoMark } from "./Logo";

type FooterLink = { label: string; href: string } | { label: string; action: "contact" };

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "Pricing", href: "/pricing" },
      { label: "Changelog", href: `${GITHUB_URL}/releases` },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Quickstart", href: QUICKSTART_HREF },
      { label: "CLI reference", href: "/docs/cli-reference" },
      { label: "Storage & privacy", href: "/docs/storage" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "GitHub", href: GITHUB_URL },
      { label: "Discord", href: DISCORD_URL },
      { label: "Contact", action: "contact" },
    ],
  },
];

const LINK_CLASS =
  "text-[14px] text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]";

export function Footer() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <footer id="footer" className="relative overflow-hidden shadow-[inset_0_1px_0_var(--line)]">
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />

      <Container className="grid grid-cols-2 gap-x-8 gap-y-12 pb-12 pt-16 md:grid-cols-[1.5fr_repeat(3,1fr)] md:pt-20">
        <div className="col-span-2 md:col-span-1">
          <Logo />
          <p className="mt-4 max-w-[26ch] text-[14px] leading-[1.6] text-[var(--ink-2)]">
            Pre-deploy checks for AI agents. All eyes on your pipeline.
          </p>
          <div className="mt-6 flex items-center gap-1">
            {[
              { href: GITHUB_URL, label: "GitHub", Icon: RiGithubFill },
              { href: DISCORD_URL, label: "Discord", Icon: RiDiscordFill },
              { href: INSTAGRAM_URL, label: "Instagram", Icon: RiInstagramFill },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="btn-ghost h-9 w-9 justify-center px-0"
              >
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>

        {COLUMNS.map((column) => (
          <div key={column.title}>
            <p className="eyebrow">{column.title}</p>
            <ul className="mt-5 flex flex-col gap-3">
              {column.links.map((link) => (
                <li key={link.label}>
                  {"action" in link ? (
                    <button type="button" onClick={() => setContactOpen(true)} className={LINK_CLASS}>
                      {link.label}
                    </button>
                  ) : link.href.startsWith("http") ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className={LINK_CLASS}>
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div aria-hidden className="footer-mark select-none">
        <Container className="flex items-end gap-[0.06em]">
          {/* the wordmark is clipped gradient text, so the mark needs its own colour */}
          <LogoMark className="h-[0.74em] w-auto shrink-0 -translate-y-[0.06em] stroke-[2.2] text-[#b8913a]" />
          <span>ARGUS</span>
        </Container>
      </div>

      <div className="relative shadow-[inset_0_1px_0_var(--line)]">
        <Container className="flex flex-col items-start justify-between gap-2 py-6 sm:flex-row sm:items-center">
          <span className="font-mono text-[11px] tracking-[0.08em] text-[var(--ink-3)]">
            © 2026 ArgusLabs
          </span>
          <span className="font-mono text-[11px] tracking-[0.08em] text-[var(--ink-3)]">
            Open-source core · Apache-2.0
          </span>
        </Container>
      </div>
    </footer>
  );
}
