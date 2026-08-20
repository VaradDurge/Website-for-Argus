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
    <div className="mt-16 flex items-stretch gap-3 border-t-[length:var(--hairline)] border-[var(--line)] pt-8">
      {prevSlug && prevLabel ? (
        <Link
          href={prevSlug === "introduction" ? "/docs" : `/docs/${prevSlug}`}
          className="group flex flex-1 items-center gap-3 rounded-[var(--radius-inner)] border-[length:var(--hairline)] border-[var(--line)] bg-[var(--panel)] p-4 shadow-[var(--shadow-control)] transition-colors hover:border-[var(--line-2)] hover:bg-[var(--ex)]"
        >
          <ChevronLeft
            size={16}
            className="shrink-0 text-[var(--ink-3)] transition-colors group-hover:text-[var(--ink)]"
          />
          <div>
            <span className="eyebrow">Previous</span>
            <p className="mt-1.5 text-[14px] font-medium text-[var(--ink)]">
              {prevLabel}
            </p>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {nextSlug && nextLabel ? (
        <Link
          href={`/docs/${nextSlug}`}
          className="group flex flex-1 items-center justify-end gap-3 rounded-[var(--radius-inner)] border-[length:var(--hairline)] border-[var(--line)] bg-[var(--panel)] p-4 text-right shadow-[var(--shadow-control)] transition-colors hover:border-[var(--line-2)] hover:bg-[var(--ex)]"
        >
          <div>
            <span className="eyebrow">Next</span>
            <p className="mt-1.5 text-[14px] font-medium text-[var(--ink)]">
              {nextLabel}
            </p>
          </div>
          <ChevronRight
            size={16}
            className="shrink-0 text-[var(--ink-3)] transition-colors group-hover:text-[var(--ink)]"
          />
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
}
