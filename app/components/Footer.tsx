"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Check, Copy } from "lucide-react";
import { RiDiscordFill, RiGithubFill, RiInstagramFill } from "@remixicon/react";
import { Container } from "@/components/ui/section";
import { Logo } from "./Logo";

const INSTALL_CMD = "pip install argus-agents";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "Features", href: "/#features" },
      { label: "Security", href: "/#security" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Quickstart", href: "/docs/quickstart" },
      { label: "Configuration", href: "/docs/configuration" },
      { label: "Changelog", href: "/#changelog" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "GitHub", href: "https://github.com/VaradDurge/ARGUS" },
      { label: "Discord", href: "https://discord.gg/yVuGDCX54K" },
      { label: "Instagram", href: "https://www.instagram.com/argus.in" },
    ],
  },
] as const;

export function Footer() {
  const [copied, setCopied] = useState(false);
  const copyRef = useRef<HTMLButtonElement>(null);

  function copyInstall() {
    navigator.clipboard.writeText(INSTALL_CMD);
    setCopied(true);
    if (copyRef.current) {
      copyRef.current.classList.remove("copy-pulse");
      void copyRef.current.offsetWidth;
      copyRef.current.classList.add("copy-pulse");
    }
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <footer
      id="footer"
      className="border-t-[length:var(--hairline)] border-[var(--line)]"
    >
      <Container className="py-16 md:py-24">
        {/* closing echo of the hero */}
        <h2 className="heading-2 max-w-[16ch] text-[var(--ink)]">
          Ship agents you can{" "}
          <span className="text-[var(--ink-3)]">
            actually trust.
          </span>
        </h2>

        <div className="mt-14 grid grid-cols-2 gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="body-sm mt-4 max-w-[30ch]">
              Forensic observability for AI agent pipelines. See every failure,
              fix the right thing.
            </p>

            <button
              ref={copyRef}
              type="button"
              onClick={copyInstall}
              className="mt-5 inline-flex items-center gap-2 rounded-[var(--radius-control)] border-[length:var(--hairline)] border-[var(--line)] bg-[var(--ex)] px-2.5 py-1.5 font-mono text-[12px] text-[var(--ink-2)] transition-colors hover:border-[var(--line-2)] hover:text-[var(--ink)]"
              aria-label="Copy install command"
            >
              <span className="text-[var(--ink-3)]">$</span>
              <span>{INSTALL_CMD}</span>
              {copied ? (
                <Check size={12} className="text-[var(--sig-ok)]" />
              ) : (
                <Copy size={12} className="text-[var(--ink-3)]" />
              )}
            </button>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="eyebrow">{column.title}</p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {column.links.map((link) => {
                  const className =
                    "text-[13px] text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]";
                  return (
                    <li key={link.label}>
                      {link.href.startsWith("http") ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={className}
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link href={link.href} className={className}>
                          {link.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </Container>

      <Container className="overflow-hidden py-10 select-none md:py-14">
        <p className="text-center text-[clamp(40px,9vw,112px)] font-medium leading-none tracking-[-0.06em] text-[var(--ink)] opacity-[0.07]">
          ArgusLabs
        </p>
      </Container>

      <div className="border-t-[length:var(--hairline)] border-[var(--line)]">
        <Container className="flex flex-col items-center justify-between gap-3 py-5 sm:flex-row">
          <span className="eyebrow-dim">
            © 2026 ARGUS Labs · All eyes on your pipeline
          </span>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/VaradDurge/ARGUS"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-[var(--ink-3)] transition-colors hover:text-[var(--ink)]"
            >
              <RiGithubFill size={16} />
            </a>
            <a
              href="https://discord.gg/yVuGDCX54K"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
              className="text-[var(--ink-3)] transition-colors hover:text-[var(--ink)]"
            >
              <RiDiscordFill size={16} />
            </a>
            <a
              href="https://www.instagram.com/argus.in"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-[var(--ink-3)] transition-colors hover:text-[var(--ink)]"
            >
              <RiInstagramFill size={16} />
            </a>
          </div>
        </Container>
      </div>
    </footer>
  );
}
