"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SIDEBAR_SECTIONS } from "../content/sections";

export function DocsSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const currentSlug =
    pathname === "/docs" ? "introduction" : pathname.replace("/docs/", "");

  return (
    <nav className="flex flex-col gap-6" aria-label="Documentation sidebar">
      {SIDEBAR_SECTIONS.map((section) => (
        <div key={section.title}>
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--text-dim)] mb-2 px-3">
            {section.title}
          </p>
          <ul className="flex flex-col gap-0.5">
            {section.items.map((item) => {
              const isActive = currentSlug === item.slug;
              const Icon = item.icon;
              return (
                <li key={item.slug}>
                  <Link
                    href={item.slug === "introduction" ? "/docs" : `/docs/${item.slug}`}
                    onClick={onNavigate}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all duration-200 ${
                      isActive
                        ? "text-[var(--accent-soft)] bg-[rgba(109,92,255,0.07)] border-l-2 border-[var(--accent-soft)] -ml-[1px] shadow-[inset_0_0_20px_rgba(109,92,255,0.06)]"
                        : "text-[var(--text-muted)] hover:text-white hover:bg-[rgba(255,255,255,0.025)] hover:shadow-[inset_0_0_12px_rgba(255,255,255,0.02)]"
                    }`}
                  >
                    <Icon size={15} strokeWidth={1.6} className="shrink-0" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
