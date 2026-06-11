"use client";

import { usePathname } from "next/navigation";
import { DocsSidebar } from "./DocsSidebar";
import { DocsTOC } from "./DocsTOC";
import { DocsPrevNext } from "./DocsPrevNext";
import { DOCS_REGISTRY } from "../content/registry";

export function DocsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const slug = pathname === "/docs" ? "introduction" : pathname.replace("/docs/", "");
  const page = DOCS_REGISTRY[slug];

  return (
    <div className="mx-auto max-w-[1400px] flex">
      {/* ── sidebar (desktop) ── */}
      <aside
        className="hidden lg:block w-[240px] shrink-0 sticky top-14 h-[calc(100vh-56px)] overflow-y-auto scroll-pretty border-r border-[var(--border)] px-2 py-6"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(109,92,255,0.02) 0%, transparent 40%, rgba(0,240,168,0.01) 100%)",
        }}
      >
        <DocsSidebar />
      </aside>

      {/* ── main content ── */}
      <main className="flex-1 min-w-0">
        <div className="max-w-[720px] mx-auto px-6 lg:px-8 py-8 lg:py-12">
          {/* page title */}
          {page && (
            <div className="mb-10 pb-8 relative">
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--accent-soft)] mb-2">
                {page.title === "Introduction" ? "Getting Started" : ""}
              </p>
              <h1 className="text-[28px] sm:text-[34px] tracking-[-0.02em] font-medium text-white leading-[1.15]">
                {page.title}
              </h1>
              <p className="mt-3 text-[15px] leading-[1.7] text-[var(--text-muted)]">
                <span className="font-serif-italic">{page.description}</span>
              </p>
              {/* gradient divider */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(109,92,255,0.3), rgba(139,125,255,0.15), transparent)",
                }}
              />
            </div>
          )}

          {/* page content */}
          <article className="docs-prose">
            {children}
          </article>

          {/* prev/next */}
          <DocsPrevNext currentSlug={slug} />
        </div>
      </main>

      {/* ── table of contents (desktop) ── */}
      <aside className="hidden xl:block w-[200px] shrink-0 sticky top-14 h-[calc(100vh-56px)] overflow-y-auto scroll-pretty py-6 pr-4">
        {page && <DocsTOC items={page.toc} />}
      </aside>
    </div>
  );
}
