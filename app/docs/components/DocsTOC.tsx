"use client";

import { useState, useEffect } from "react";
import type { TOCItem } from "../content/registry";

interface DocsTOCProps {
  items: TOCItem[];
}

export function DocsTOC({ items }: DocsTOCProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="flex flex-col gap-0.5">
      <p className="eyebrow mb-3">On this page</p>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={`block border-l-[length:var(--hairline)] py-1 text-[12px] leading-[1.5] transition-colors duration-200 ${
            item.level === 3 ? "pl-5" : "pl-3"
          } ${
            activeId === item.id
              ? "border-[var(--ink)] text-[var(--ink)]"
              : "border-[var(--line)] text-[var(--ink-3)] hover:border-[var(--line-3)] hover:text-[var(--ink-2)]"
          }`}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
