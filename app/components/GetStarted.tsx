"use client";

import { useEffect, useState } from "react";
import {
  Check,
  ChevronRight,
  Code2,
  Copy,
  Download,
  type LucideIcon,
  Lock,
  Play,
  Settings2,
  X,
} from "lucide-react";

const WATCHER_CODE = `from argus import ArgusWatcher

watcher = ArgusWatcher()
watcher.watch(graph)
app = graph.compile()
app.invoke(initial_state)
watcher.finalize()`;

type CliCard = {
  kind: "cli";
  n: string;
  title: string;
  caption: string;
  icon: LucideIcon;
  command: string;
  highlight: string;
};

type CodeCard = {
  kind: "code";
  n: string;
  title: string;
  caption: string;
  icon: LucideIcon;
  raw: string;
  lang: string;
};

type Card = CliCard | CodeCard;

const CARDS: Card[] = [
  {
    kind: "cli",
    n: "01",
    title: "Install Argus",
    caption: "Install the forensic observer.",
    icon: Download,
    command: "pip install argus-agents",
    highlight: "argus-agents",
  },
  {
    kind: "code",
    n: "02",
    title: "Wrap your graph",
    caption: "Wrap your graph with the watcher harness.",
    icon: Code2,
    raw: WATCHER_CODE,
    lang: "python",
  },
  {
    kind: "cli",
    n: "03",
    title: "Login",
    caption: "Authenticate your workspace.",
    icon: Lock,
    command: "argus login",
    highlight: "login",
  },
  {
    kind: "cli",
    n: "04",
    title: "Launch replay",
    caption: "Launch the replay dashboard.",
    icon: Play,
    command: "argus ui",
    highlight: "ui",
  },
];

export function GetStarted() {
  return (
    <section id="get-started" className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <div className="relative panel p-8 lg:p-12 overflow-hidden">
          {/* top accent spark */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-px flex flex-col items-center">
            <span
              className="w-px h-10"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, rgba(139,125,255,0.55))",
              }}
            />
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-soft)] shadow-[0_0_12px_4px_rgba(139,125,255,0.45)] -mt-0.5" />
          </div>

          {/* heading */}
          <div className="text-center pt-2">
            <h2 className="font-serif-italic text-white text-[34px] sm:text-[44px] lg:text-[52px] leading-[1.05] tracking-[-0.02em]">
              Get started in 4 steps
            </h2>
            <p className="mt-3 font-mono text-[11.5px] tracking-[0.22em] uppercase text-[var(--text-muted)]">
              Install · Instrument · Observe · Debug
            </p>
          </div>

          {/* 4-column grid */}
          <div className="mt-10 lg:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5">
            {CARDS.map((card, i) => (
              <div key={card.n} className="relative">
                {card.kind === "cli" ? (
                  <CliCardEl card={card} />
                ) : (
                  <CodeCardEl card={card} />
                )}
                {i < CARDS.length - 1 && (
                  <ChevronRight
                    aria-hidden
                    size={18}
                    strokeWidth={1.6}
                    className="hidden lg:block absolute -right-4 top-[64px] text-[var(--text-dim)]"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────── pieces ──────────── */

function StepBadge({ n }: { n: string }) {
  return (
    <span
      className="inline-flex items-center justify-center font-mono text-[11px] tracking-[0.15em] rounded-full px-2.5 py-1 text-[var(--accent-soft)]"
      style={{
        border: "1px solid rgba(139,125,255,0.35)",
        background: "rgba(109,92,255,0.08)",
        boxShadow: "inset 0 0 8px rgba(139,125,255,0.06)",
      }}
    >
      {n}
    </span>
  );
}

function CardHead({
  n,
  title,
  caption,
  Icon,
}: {
  n: string;
  title: string;
  caption: string;
  Icon: LucideIcon;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <StepBadge n={n} />
      </div>
      <div className="flex items-center gap-3">
        <span
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg"
          style={{
            background: "rgba(109,92,255,0.08)",
            border: "1px solid rgba(139,125,255,0.18)",
            color: "var(--accent-soft)",
            boxShadow: "inset 0 0 12px rgba(139,125,255,0.08)",
          }}
        >
          <Icon size={18} strokeWidth={1.8} />
        </span>
        <h3 className="text-[17px] tracking-[-0.01em] text-white">{title}</h3>
      </div>
      <p className="text-[12.5px] leading-[1.5] text-[var(--text-muted)] min-h-[38px]">
        {caption}
      </p>
    </div>
  );
}

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <article
      className="flex flex-col gap-4 rounded-2xl p-5 border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--border-strong)] transition-colors"
    >
      {children}
    </article>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      }}
      className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-md border border-[var(--border)] text-[var(--text-muted)] hover:text-white hover:border-[var(--border-strong)] transition-colors"
      aria-label="Copy"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
    </button>
  );
}

function CodeTile({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)]">
      {children}
    </div>
  );
}

function CliCardEl({ card }: { card: CliCard }) {
  const idx = card.command.lastIndexOf(card.highlight);
  const head = idx >= 0 ? card.command.slice(0, idx) : card.command;
  const tail = idx >= 0 ? card.highlight : "";

  return (
    <CardShell>
      <CardHead
        n={card.n}
        title={card.title}
        caption={card.caption}
        Icon={card.icon}
      />
      <CodeTile>
        <div className="flex items-center gap-3 px-3.5 py-3">
          <code className="flex-1 min-w-0 font-mono text-[12.5px] truncate">
            <span className="text-[var(--accent-soft)]">$</span>{" "}
            <span className="text-white">{head}</span>
            <span className="text-[var(--signal-ok)]">{tail}</span>
          </code>
          <CopyButton text={card.command} />
        </div>
      </CodeTile>
    </CardShell>
  );
}

const PARAM_GROUPS: {
  label: string;
  params: { name: string; default: string; type: string }[];
}[] = [
  {
    label: "Core",
    params: [
      { name: "max_field_size", default: "50_000", type: "int" },
      { name: "strict", default: "False", type: "bool" },
      { name: "investigate", default: "True", type: "bool | \"always\"" },
    ],
  },
  {
    label: "Security",
    params: [
      { name: "redact_keys", default: "None", type: "list[str]" },
      { name: "validators", default: "{}", type: "dict" },
    ],
  },
  {
    label: "Replay & eval",
    params: [
      { name: "persist_state", default: "True", type: "bool" },
      { name: "record_http", default: "False", type: "bool" },
      { name: "semantic_judge", default: "False", type: "bool" },
      { name: "judge_model", default: "\"gpt-4o\"", type: "str" },
    ],
  },
];

function WatcherParamsPopup({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)]">
          <span className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-[var(--text-muted)]">
            ArgusWatcher kwargs
          </span>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center w-6 h-6 rounded-md text-[var(--text-dim)] hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={13} />
          </button>
        </div>

        {/* grouped params */}
        <div className="px-5 py-4 space-y-4 max-h-[60vh] overflow-y-auto scroll-pretty">
          {PARAM_GROUPS.map((group) => (
            <div key={group.label}>
              <span className="font-mono text-[9.5px] tracking-[0.2em] uppercase text-[var(--text-dim)]">
                {group.label}
              </span>
              <div className="mt-2 space-y-0">
                {group.params.map((p) => (
                  <div
                    key={p.name}
                    className="flex items-baseline justify-between gap-4 py-[5px] border-b border-[var(--border)]/40 last:border-0"
                  >
                    <code className="font-mono text-[11.5px] text-white whitespace-nowrap">
                      {p.name}
                    </code>
                    <div className="flex items-baseline gap-2 shrink-0">
                      <span className="font-mono text-[10.5px] text-[var(--text-dim)]">
                        {p.type}
                      </span>
                      <span className="font-mono text-[11px] text-[var(--signal-ok)]">
                        {p.default}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CodeCardEl({ card }: { card: CodeCard }) {
  const [paramsOpen, setParamsOpen] = useState(false);

  return (
    <CardShell>
      <CardHead
        n={card.n}
        title={card.title}
        caption={card.caption}
        Icon={card.icon}
      />
      <CodeTile>
        <div className="flex items-center justify-between px-3.5 py-2 border-b border-[var(--border)]">
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--text-dim)]">
            {card.lang}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setParamsOpen(true)}
              className="shrink-0 inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-[var(--border)] font-mono text-[10px] tracking-[0.1em] text-[var(--accent-soft)] hover:border-[var(--accent-soft)]/40 hover:bg-[rgba(109,92,255,0.06)] transition-colors"
              aria-label="View watcher parameters"
            >
              <Settings2 size={11} />
              Params
            </button>
            <CopyButton text={card.raw} />
          </div>
        </div>
        <pre className="px-3.5 py-3 font-mono text-[11.5px] leading-[1.7] overflow-x-auto scroll-pretty">
          <code>
            <PythonHighlight code={card.raw} />
          </code>
        </pre>
      </CodeTile>
      <WatcherParamsPopup open={paramsOpen} onClose={() => setParamsOpen(false)} />
    </CardShell>
  );
}

function PythonHighlight({ code }: { code: string }) {
  const KEYWORDS = new Set(["from", "import", "as", "def", "return", "class"]);
  const CLASSES = new Set(["ArgusWatcher"]);
  const lines = code.split("\n");

  return (
    <>
      {lines.map((line, li) => {
        const hashIdx = line.indexOf("#");
        const codePart = hashIdx >= 0 ? line.slice(0, hashIdx) : line;
        const comment = hashIdx >= 0 ? line.slice(hashIdx) : "";
        const parts = codePart.split(/(\s+|[().,=])/);

        return (
          <span key={li}>
            {parts.map((p, i) => {
              if (!p) return null;
              if (/^\s+$/.test(p)) return <span key={i}>{p}</span>;
              if (KEYWORDS.has(p))
                return (
                  <span key={i} className="text-[var(--signal-warn)]">
                    {p}
                  </span>
                );
              if (CLASSES.has(p))
                return (
                  <span key={i} className="text-[var(--accent-soft)]">
                    {p}
                  </span>
                );
              if ([".", ",", "(", ")", "="].includes(p))
                return (
                  <span key={i} className="text-[var(--text-muted)]">
                    {p}
                  </span>
                );
              return (
                <span key={i} className="text-white">
                  {p}
                </span>
              );
            })}
            {comment && (
              <span className="text-[var(--text-dim)]">{comment}</span>
            )}
            {li < lines.length - 1 ? "\n" : null}
          </span>
        );
      })}
    </>
  );
}
