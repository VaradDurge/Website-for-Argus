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
    <nav aria-label="Table of contents" className="flex flex-col gap-1">
      <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--text-dim)] mb-2">
        On this page
      </p>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={`block text-[12px] leading-[1.5] py-1 border-l transition-colors ${
            item.level === 3 ? "pl-5" : "pl-3"
          } ${
            activeId === item.id
              ? "text-[var(--accent-soft)] border-[var(--accent-soft)]"
              : "text-[var(--text-dim)] border-transparent hover:text-[var(--text-muted)] hover:border-[var(--border-strong)]"
          }`}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
