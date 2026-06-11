"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, ChevronRight } from "lucide-react";
import { Logo } from "../../components/Logo";
import { DocsMobileDrawer } from "./DocsMobileDrawer";
import { getSectionForSlug, getLabelForSlug } from "../content/sections";

export function DocsNav() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const slug = pathname === "/docs" ? "introduction" : pathname.replace("/docs/", "");
  const section = getSectionForSlug(slug);
  const label = getLabelForSlug(slug);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--border)]">
        <div className="absolute inset-0 -z-10 backdrop-blur-xl bg-[rgba(7,7,10,0.8)]" />
        <div className="flex items-center justify-between h-14 px-4 lg:px-6">
          {/* left: logo + docs badge + breadcrumbs */}
          <div className="flex items-center gap-3 min-w-0">
            {/* mobile hamburger */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-md border border-[var(--border)] text-[var(--text-muted)] hover:text-white transition-colors"
              aria-label="Open navigation"
            >
              <Menu size={16} />
            </button>

            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Logo />
            </Link>
            <span className="w-px h-5 bg-[var(--border)] hidden sm:block" />
            <Link
              href="/docs"
              className="hidden sm:block font-mono text-[11px] tracking-[0.15em] uppercase text-[var(--accent-soft)] hover:text-white transition-colors"
            >
              Docs
            </Link>

            {/* breadcrumbs (desktop) */}
            {section && label && (
              <div className="hidden md:flex items-center gap-1.5 text-[var(--text-dim)]">
                <ChevronRight size={12} />
                <span className="font-mono text-[11px] tracking-[0.1em]">
                  {section}
                </span>
                <ChevronRight size={12} />
                <span className="font-mono text-[11px] tracking-[0.1em] text-[var(--text-muted)]">
                  {label}
                </span>
              </div>
            )}
          </div>

          {/* right: search placeholder */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-dim)] cursor-not-allowed">
            <Search size={13} />
            <span className="font-mono text-[11px]">Search docs...</span>
            <span className="ml-4 font-mono text-[10px] px-1.5 py-0.5 rounded border border-[var(--border)] bg-[var(--surface-2)]">
              Cmd+K
            </span>
          </div>
        </div>
      </header>

      <DocsMobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
