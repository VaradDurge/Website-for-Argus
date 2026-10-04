import { RiClaudeFill, RiGeminiFill, RiGithubFill, RiOpenaiFill } from "@remixicon/react";
import { cn } from "@/lib/utils";

/* Everything here is a real integration (see the ARGUS README): the graph
   frameworks it records, the BYOK judge providers, the CI hooks, and the
   editors `argus init` writes skills for. */
const ITEMS: { name: string; Icon?: typeof RiOpenaiFill; mono?: boolean }[] = [
  { name: "LangGraph" },
  { name: "LangChain" },
  { name: "OpenAI", Icon: RiOpenaiFill },
  { name: "Anthropic", Icon: RiClaudeFill },
  { name: "Gemini", Icon: RiGeminiFill },
  { name: "pytest --argus", mono: true },
  { name: "GitHub Actions", Icon: RiGithubFill },
  { name: "Cursor" },
  { name: "Claude Code", Icon: RiClaudeFill },
];

/** The strip is two copies end to end; the second is for the loop only. */
function Row({ copy = false }: { copy?: boolean }) {
  return (
    <ul aria-hidden={copy || undefined} className="flex shrink-0 items-center">
      {ITEMS.map(({ name, Icon, mono }) => (
        <li
          key={name}
          className={cn(
            "flex items-center gap-2.5 px-8 text-[17px] font-medium tracking-[-0.02em] text-[var(--ink-3)] transition-colors hover:text-[var(--ink)]",
            mono && "font-mono text-[14.5px] font-normal tracking-normal"
          )}
        >
          {Icon ? <Icon size={19} aria-hidden /> : null}
          {name}
        </li>
      ))}
    </ul>
  );
}

export function WorksWith() {
  return (
    <section aria-label="Works with" className="relative py-14 md:py-20">
      <p className="text-center font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-3)]">
        Fits the stack you already ship
      </p>
      <div className="marquee-mask mt-8 overflow-hidden">
        <div className="marquee">
          <Row />
          <Row copy />
        </div>
      </div>
    </section>
  );
}
