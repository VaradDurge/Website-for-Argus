import { MonoLabel } from "../chrome";

const LINES = [
  { text: "{", hot: false },
  { text: '  "ticket_id": "T-4419",', hot: false },
  { text: '  "customer": "Northwind",', hot: false },
  { text: '  "plan": "enterprise",', hot: false },
  { text: '  "body": null', hot: true },
  { text: "}", hot: false },
];

export function UnderstandMini() {
  return (
    <div className="flex h-full flex-col bg-[var(--panel)] p-3">
      <MonoLabel>State · enrich → summarize</MonoLabel>
      <pre className="mt-2 font-mono text-[10px] leading-[1.55] text-[var(--ink-2)]">
        {LINES.map((line) => (
          <div
            key={line.text}
            className={
              line.hot
                ? "-mx-1 rounded-[4px] bg-[var(--sig-fail-subtle)] px-1 text-[var(--sig-fail)]"
                : undefined
            }
          >
            {line.text}
          </div>
        ))}
      </pre>
      <p className="mt-auto pt-2 text-[10px] leading-[1.4] text-[var(--ink-3)]">
        First bad state. <span className="font-mono">ticket.body</span> dropped
        four hops before validate failed.
      </p>
    </div>
  );
}
