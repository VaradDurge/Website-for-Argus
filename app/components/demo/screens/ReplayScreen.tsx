"use client";

import { Check, Play, Snowflake } from "lucide-react";
import { cn } from "@/lib/utils";
import { REPLAY_FIELDS } from "../data";
import { MonoLabel, SIGNAL_SUBTLE, SIGNAL_VAR } from "../chrome";

export type ReplayPhase = "idle" | "running" | "done";

export function ReplayScreen({
  phase,
  onReplay,
}: {
  phase: ReplayPhase;
  onReplay: () => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-start justify-between gap-3 px-3 pt-3 pb-2 sm:px-4">
        <div>
          <h2 className="text-[15px] font-medium tracking-[-0.01em] text-[var(--ink)]">
            Replay{" "}
            <span className="font-mono text-[13px] text-[var(--ink-2)]">
              summarize
            </span>
          </h2>
          <p className="mt-1 flex flex-wrap items-center gap-2 font-mono text-[10px] text-[var(--ink-3)]">
            <span className="inline-flex items-center gap-1 rounded-[5px] bg-[var(--iris-subtle)] px-1.5 py-0.5 text-[var(--iris-fg)]">
              <Snowflake size={9} />
              Frozen upstream
            </span>
            extract · enrich reused · HTTP mocked
          </p>
        </div>
        <button
          type="button"
          onClick={onReplay}
          disabled={phase === "running"}
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] bg-[var(--inverted)] px-2.5 py-1.5 text-[11px] font-medium text-[var(--on-inverted)] transition-transform active:scale-[0.97] disabled:opacity-60"
        >
          {phase === "done" ? (
            <>
              <Check size={11} />
              Verified
            </>
          ) : phase === "running" ? (
            "Replaying…"
          ) : (
            <>
              <Play size={11} />
              Replay node
            </>
          )}
        </button>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 overflow-auto px-3 pb-3 sm:grid-cols-2 sm:px-4">
        <DiffPane
          title="Original"
          tone="fail"
          caption="Placeholder · marked succeeded"
          phase={phase}
          side="before"
        />
        <DiffPane
          title="Replayed"
          tone="ok"
          caption={
            phase === "done"
              ? "Grounded · contract pass"
              : "Waiting for frozen inputs"
          }
          phase={phase}
          side="after"
        />
      </div>
    </div>
  );
}

function DiffPane({
  title,
  tone,
  caption,
  phase,
  side,
}: {
  title: string;
  tone: "ok" | "fail";
  caption: string;
  phase: ReplayPhase;
  side: "before" | "after";
}) {
  const pending = side === "after" && phase !== "done";

  return (
    <div className="flex min-h-0 flex-col rounded-[var(--radius-inner)] border-[length:var(--hairline)] border-[var(--line)] bg-[var(--ex)]">
      <div className="flex items-center justify-between border-b-[length:var(--hairline)] border-[var(--line)] px-3 py-2">
        <div>
          <MonoLabel>{title}</MonoLabel>
          <div className="mt-0.5 text-[11px] text-[var(--ink-2)]">{caption}</div>
        </div>
        <span
          className="rounded-[5px] px-1.5 py-0.5 font-mono text-[10px]"
          style={{
            color: SIGNAL_VAR[tone],
            background: SIGNAL_SUBTLE[tone],
          }}
        >
          {tone === "ok" ? "pass" : "silent"}
        </span>
      </div>
      <div className="min-h-0 flex-1 space-y-1.5 overflow-auto p-3">
        {REPLAY_FIELDS.map((field) => {
          const value = side === "before" ? field.before : field.after;
          return (
            <div key={field.key}>
              <MonoLabel>{field.key}</MonoLabel>
              <div
                className={cn(
                  "mt-1 rounded-[6px] border-[length:var(--hairline)] px-2 py-1.5 font-mono text-[11px] leading-[1.45]",
                  pending
                    ? "border-dashed border-[var(--line-2)] text-[var(--ink-3)]"
                    : field.changed && side === "before"
                      ? "border-transparent bg-[var(--sig-fail-subtle)] text-[var(--sig-fail)]"
                      : field.changed && side === "after"
                        ? "border-transparent bg-[var(--sig-ok-subtle)] text-[var(--sig-ok)]"
                        : "border-[var(--line)] bg-[var(--panel)] text-[var(--ink-2)]"
                )}
              >
                {pending ? "—" : value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
