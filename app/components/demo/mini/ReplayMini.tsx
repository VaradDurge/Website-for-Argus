import { Snowflake } from "lucide-react";
import { MonoLabel, SIGNAL_SUBTLE, SIGNAL_VAR } from "../chrome";

export function ReplayMini() {
  return (
    <div className="flex h-full flex-col bg-[var(--panel)] p-3">
      <div className="flex items-center justify-between">
        <MonoLabel>Replay from summarize</MonoLabel>
        <span className="inline-flex items-center gap-1 rounded-[5px] bg-[var(--iris-subtle)] px-1.5 py-0.5 font-mono text-[9px] text-[var(--iris-fg)]">
          <Snowflake size={8} />
          Frozen
        </span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <div className="rounded-[6px] bg-[var(--sig-fail-subtle)] px-2 py-1.5">
          <MonoLabel>Before</MonoLabel>
          <p className="mt-1 line-clamp-3 font-mono text-[9px] leading-[1.4] text-[var(--sig-fail)]">
            As an AI language model…
          </p>
        </div>
        <div className="rounded-[6px] bg-[var(--sig-ok-subtle)] px-2 py-1.5">
          <MonoLabel>After</MonoLabel>
          <p className="mt-1 line-clamp-3 font-mono text-[9px] leading-[1.4] text-[var(--sig-ok)]">
            Northwind reports refund T-4419 never posted.
          </p>
        </div>
      </div>
      <div
        className="mt-auto inline-flex w-fit items-center rounded-[5px] px-1.5 py-0.5 font-mono text-[9px]"
        style={{ color: SIGNAL_VAR.ok, background: SIGNAL_SUBTLE.ok }}
      >
        Verify diff · contract pass
      </div>
    </div>
  );
}
