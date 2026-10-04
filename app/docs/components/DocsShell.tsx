"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { DocsSidebar } from "./DocsSidebar";
import { DocsTOC } from "./DocsTOC";
import { DocsPrevNext } from "./DocsPrevNext";
import { DocsMobileDrawer } from "./DocsMobileDrawer";
import { DOCS_REGISTRY } from "../content/registry";
import { getSectionForSlug, getLabelForSlug } from "../content/sections";

export function DocsShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const slug = pathname === "/docs" ? "introduction" : pathname.replace("/docs/", "");
  const page = DOCS_REGISTRY[slug];
  const section = getSectionForSlug(slug);
  const label = getLabelForSlug(slug);

  return (
    <div className="mx-auto flex max-w-[1400px]">
      <aside className="sticky top-14 hidden h-[calc(100vh-56px)] w-[240px] shrink-0 overflow-y-auto scroll-pretty border-r-[length:var(--hairline)] border-[var(--line)] bg-[var(--void)] px-3 py-8 lg:block">
        <DocsSidebar />
      </aside>

      <main className="min-w-0 flex-1">
        <div className="sticky top-14 z-30 flex h-12 items-center gap-3 border-b-[length:var(--hairline)] border-[var(--line)] bg-[var(--void)]/80 px-4 backdrop-blur-xl lg:hidden">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-control)] border-[length:var(--hairline)] border-[var(--line)] text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]"
            aria-label="Open documentation navigation"
          >
            <Menu size={16} />
          </button>
          {section && label && (
            <p className="truncate font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--ink-3)]">
              {section}
              <span className="mx-1.5 text-[var(--ink-3)]">/</span>
              <span className="text-[var(--ink-2)]">{label}</span>
            </p>
          )}
        </div>

        <div className="mx-auto max-w-[720px] px-6 py-10 lg:px-10 lg:py-14">
          {page && (
            <div className="mb-10 border-b-[length:var(--hairline)] border-[var(--line)] pb-8">
              {section && (
                <p className="eyebrow mb-3">{section}</p>
              )}
              <h1 className="heading-3 text-[var(--ink)]">{page.title}</h1>
              <p className="body-base mt-3">
                <span className="font-serif-italic">{page.description}</span>
              </p>
            </div>
          )}

          <article className="docs-prose">{children}</article>

          <DocsPrevNext currentSlug={slug} />
        </div>
      </main>

      <aside className="sticky top-14 hidden h-[calc(100vh-56px)] w-[200px] shrink-0 overflow-y-auto scroll-pretty py-8 pr-6 xl:block">
        {page && <DocsTOC items={page.toc} />}
      </aside>

      <DocsMobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
