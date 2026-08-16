import { MonoLabel, SIGNAL_SUBTLE, SIGNAL_VAR } from "../chrome";

export function DetectMini() {
  return (
    <div className="flex h-full flex-col bg-[var(--panel)] p-3">
      <div className="flex items-center justify-between">
        <MonoLabel>Detection</MonoLabel>
        <span
          className="rounded-[5px] px-1.5 py-0.5 font-mono text-[9px]"
          style={{
            color: SIGNAL_VAR.warn,
            background: SIGNAL_SUBTLE.warn,
          }}
        >
          Medium
        </span>
      </div>
      <div className="mt-2 text-[12px] font-medium text-[var(--ink)]">
        Silent failure in <span className="font-mono">summarize</span>
      </div>
      <p className="mt-1 text-[11px] leading-[1.45] text-[var(--ink-2)]">
        Placeholder summary returned. Pipeline marked the node succeeded.
      </p>
      <div className="mt-3 space-y-1.5">
        {[
          { label: "Heuristic", value: 92 },
          { label: "Anomaly", value: 74 },
          { label: "Judge", value: 88 },
        ].map((bar) => (
          <div key={bar.label}>
            <div className="flex items-center justify-between font-mono text-[9px] text-[var(--ink-3)]">
              <span>{bar.label}</span>
              <span>{bar.value}%</span>
            </div>
            <div className="mt-1 h-1 overflow-hidden rounded-full bg-[var(--line)]">
              <div
                className="h-full rounded-full bg-[var(--sig-warn)]"
                style={{ width: `${bar.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
