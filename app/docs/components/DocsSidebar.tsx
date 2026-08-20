"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SIDEBAR_SECTIONS } from "../content/sections";

export function DocsSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const currentSlug =
    pathname === "/docs" ? "introduction" : pathname.replace("/docs/", "");

  return (
    <nav className="flex flex-col gap-7" aria-label="Documentation sidebar">
      {SIDEBAR_SECTIONS.map((section) => (
        <div key={section.title}>
          <p className="eyebrow mb-2.5 px-2.5">{section.title}</p>
          <ul className="flex flex-col gap-0.5">
            {section.items.map((item) => {
              const isActive = currentSlug === item.slug;
              const Icon = item.icon;
              return (
                <li key={item.slug}>
                  <Link
                    href={item.slug === "introduction" ? "/docs" : `/docs/${item.slug}`}
                    onClick={onNavigate}
                    className={`flex items-center gap-2.5 rounded-[var(--radius-control)] px-2.5 py-1.5 text-[13px] transition-colors duration-200 ${
                      isActive
                        ? "bg-[var(--band)] font-medium text-[var(--ink)]"
                        : "text-[var(--ink-2)] hover:bg-[var(--ex)] hover:text-[var(--ink)]"
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
