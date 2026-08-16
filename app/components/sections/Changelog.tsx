import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/section";

const ENTRIES = [
  {
    date: "2026-08-16",
    title: "argus init",
    excerpt:
      "Writes Cursor and Claude skills that attach ArgusWatcher and debug from .argus/runs. Commit them and ask your editor to wire ARGUS.",
    href: "/docs/quickstart",
  },
  {
    date: "2026-08-16",
    title: "argus fix",
    excerpt:
      "Paste-ready prompt for the root-cause node — exact source line and why it failed.",
    href: "/docs/cli-reference",
  },
  {
    date: "2026-08-04",
    title: "Strict mode for CI",
    excerpt:
      "Fail a build when any detector fires above a configured severity.",
    href: "/docs/configuration",
  },
];

export function Changelog() {
  return (
    <section id="changelog" className="py-24 md:py-30">
      <Container>
        <p className="eyebrow">Changelog</p>
        <h2 className="heading-3 mt-5 text-[var(--ink)]">The latest</h2>

        <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-3">
          {ENTRIES.map((entry) => (
            <Link
              key={entry.title}
              href={entry.href}
              className="group border-t-[length:var(--hairline)] border-[var(--line)] pt-6 transition-colors hover:border-[var(--line-3)]"
            >
              <time className="step-num" dateTime={entry.date}>
                {entry.date}
              </time>
              <h3 className="mt-4 flex items-start gap-1.5 text-[15px] font-medium text-[var(--ink)]">
                {entry.title}
                <ArrowUpRight
                  size={14}
                  className="mt-0.5 shrink-0 text-[var(--ink-3)] transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                />
              </h3>
              <p className="body-sm mt-2">{entry.excerpt}</p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
