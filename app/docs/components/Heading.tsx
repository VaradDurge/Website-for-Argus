"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";

interface HeadingProps {
  level: 2 | 3 | 4;
  id: string;
  children: React.ReactNode;
}

const STYLES: Record<number, string> = {
  2: "text-[24px] sm:text-[28px] tracking-[-0.02em] font-medium text-white mt-12 mb-5",
  3: "text-[18px] sm:text-[20px] tracking-[-0.01em] font-medium text-white mt-8 mb-3",
  4: "text-[15px] sm:text-[16px] font-medium text-[var(--text)] mt-6 mb-2",
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
    <Tag id={id} className={`group relative flex items-center gap-2 scroll-mt-24 ${style}`}>
      {children}
      <button
        onClick={copyLink}
        className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center justify-center w-6 h-6 rounded-md text-[var(--text-dim)] hover:text-[var(--accent-soft)]"
        aria-label="Copy link"
      >
        {copied ? <Check size={13} /> : <Link2 size={13} />}
      </button>
      {level === 2 && (
        <div className="absolute left-0 right-0 -bottom-2 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
      )}
    </Tag>
  );
}
