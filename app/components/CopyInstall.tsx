"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { INSTALL_CMD } from "@/lib/site";
import { cn } from "@/lib/utils";

export function CopyInstall({
  className,
  plain = false,
}: {
  className?: string;
  /** Text-only, for sitting under a row of buttons. */
  plain?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(INSTALL_CMD);
      setCopied(true);
    } catch {
      // Clipboard can be blocked (insecure origin, permissions); the command
      // stays visible and selectable, so there is nothing else to do.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : `Copy: ${INSTALL_CMD}`}
      className={cn(
        plain
          ? "group inline-flex h-9 items-center gap-2.5 rounded-full px-3 font-mono text-[13px] text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]"
          : "btn-secondary group gap-2.5 font-mono text-[13px] font-normal tracking-normal",
        copied && "copy-pulse",
        className
      )}
    >
      <span className="text-[var(--ink-3)]">$</span>
      <span className="select-all">{INSTALL_CMD}</span>
      {copied ? (
        <Check size={14} className="text-[var(--sig-ok)]" />
      ) : (
        <Copy size={14} className="text-[var(--ink-3)] transition-colors group-hover:text-[var(--ink-2)]" />
      )}
    </button>
  );
}
