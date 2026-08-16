import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { RunStatus, Signal } from "./types";

export const SIGNAL_VAR: Record<Signal, string> = {
  ok: "var(--sig-ok)",
  lime: "var(--sig-lime)",
  warn: "var(--sig-warn)",
  fail: "var(--sig-fail)",
  info: "var(--sig-info)",
};

export const SIGNAL_SUBTLE: Record<Signal, string> = {
  ok: "var(--sig-ok-subtle)",
  lime: "var(--sig-lime-subtle)",
  warn: "var(--sig-warn-subtle)",
  fail: "var(--sig-fail-subtle)",
  info: "var(--sig-info-subtle)",
};

const STATUS_META: Record<
  RunStatus,
  { signal: Signal; label: string }
> = {
  clean: { signal: "ok", label: "Clean" },
  silent: { signal: "warn", label: "Silent failure" },
  failed: { signal: "fail", label: "Failed" },
};

export function HexMark({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
      className="shrink-0"
    >
      <path
        d="M12 2.4 20.4 7.2v9.6L12 21.6 3.6 16.8V7.2L12 2.4Z"
        fill="var(--iris-subtle)"
        stroke="var(--iris)"
        strokeWidth="1.2"
      />
      <path
        d="M12 7.2 16.2 9.6v4.8L12 16.8 7.8 14.4V9.6L12 7.2Z"
        fill="var(--iris)"
        opacity="0.85"
      />
    </svg>
  );
}

export function SignalDot({
  signal,
  className,
}: {
  signal: Signal;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-block h-1.5 w-1.5 shrink-0 rounded-full", className)}
      style={{ background: SIGNAL_VAR[signal] }}
    />
  );
}

export function StatusChip({ status }: { status: RunStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-[5px] px-1.5 py-0.5 font-mono text-[10px] leading-none"
      style={{
        color: SIGNAL_VAR[meta.signal],
        background: SIGNAL_SUBTLE[meta.signal],
      }}
    >
      <SignalDot signal={meta.signal} />
      {meta.label}
    </span>
  );
}

export function StepDots({ steps }: { steps: readonly Signal[] }) {
  return (
    <span className="inline-flex items-center gap-[3px]">
      {steps.map((step, i) => (
        <SignalDot key={`${step}-${i}`} signal={step} />
      ))}
      <span className="ml-1 font-mono text-[10px] text-[var(--ink-3)]">
        {steps.length}/{steps.length}
      </span>
    </span>
  );
}

export function MonoLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-mono text-[9px] tracking-[0.16em] uppercase text-[var(--ink-3)]",
        className
      )}
    >
      {children}
    </span>
  );
}

export function formatJson(value: Record<string, unknown>): string[] {
  return JSON.stringify(value, null, 2).split("\n");
}
