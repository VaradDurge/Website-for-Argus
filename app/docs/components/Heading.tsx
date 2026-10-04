"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";

interface HeadingProps {
  level: 2 | 3 | 4;
  id: string;
  children: React.ReactNode;
}

const STYLES: Record<number, string> = {
  2: "mt-12 mb-4 text-[22px] sm:text-[26px] font-medium tracking-[-0.01em] text-[var(--ink)]",
  3: "mt-8 mb-3 text-[17px] sm:text-[18px] font-medium tracking-[-0.01em] text-[var(--ink)]",
  4: "mt-6 mb-2 text-[15px] font-medium text-[var(--ink)]",
};

export function Heading({ level, id, children }: HeadingProps) {
  const [copied, setCopied] = useState(false);
  const Tag = `h${level}` as const;
  const style = STYLES[level];

  const copyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <Tag id={id} className={`group relative flex scroll-mt-28 items-center gap-2 lg:scroll-mt-20 ${style}`}>
      {children}
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex h-6 w-6 items-center justify-center rounded-md text-[var(--ink-3)] opacity-0 transition-opacity hover:text-[var(--ink)] group-hover:opacity-100"
        aria-label="Copy link"
      >
        {copied ? <Check size={13} /> : <Link2 size={13} />}
      </button>
    </Tag>
  );
}
