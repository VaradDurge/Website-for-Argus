import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ALL_SLUGS, getLabelForSlug } from "../content/sections";

interface DocsPrevNextProps {
  currentSlug: string;
}

export function DocsPrevNext({ currentSlug }: DocsPrevNextProps) {
  const idx = ALL_SLUGS.indexOf(currentSlug);
  const prevSlug = idx > 0 ? ALL_SLUGS[idx - 1] : null;
  const nextSlug = idx < ALL_SLUGS.length - 1 ? ALL_SLUGS[idx + 1] : null;

  const prevLabel = prevSlug ? getLabelForSlug(prevSlug) : null;
  const nextLabel = nextSlug ? getLabelForSlug(nextSlug) : null;

  return (
    <div className="mt-16 pt-6 border-t border-[var(--border)] flex items-stretch gap-4">
      {prevSlug && prevLabel ? (
        <Link
          href={prevSlug === "introduction" ? "/docs" : `/docs/${prevSlug}`}
          className="flex-1 group flex items-center gap-3 p-4 rounded-lg border border-[var(--border)] bg-[rgba(255,255,255,0.01)] hover:border-[var(--border-strong)] hover:bg-[rgba(255,255,255,0.02)] transition-colors"
        >
          <ChevronLeft
            size={16}
            className="text-[var(--text-dim)] group-hover:text-[var(--accent-soft)] transition-colors shrink-0"
          />
          <div>
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--text-dim)]">
              Previous
            </span>
            <p className="text-[14px] text-white mt-0.5">{prevLabel}</p>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {nextSlug && nextLabel ? (
        <Link
          href={`/docs/${nextSlug}`}
          className="flex-1 group flex items-center justify-end gap-3 p-4 rounded-lg border border-[var(--border)] bg-[rgba(255,255,255,0.01)] hover:border-[var(--border-strong)] hover:bg-[rgba(255,255,255,0.02)] transition-colors text-right"
        >
          <div>
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--text-dim)]">
              Next
            </span>
            <p className="text-[14px] text-white mt-0.5">{nextLabel}</p>
          </div>
          <ChevronRight
            size={16}
            className="text-[var(--text-dim)] group-hover:text-[var(--accent-soft)] transition-colors shrink-0"
          />
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
}
