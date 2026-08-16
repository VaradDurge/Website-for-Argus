"use client";

import { cn } from "@/lib/utils";
import { NODES, RUN_STATS, SELECTED_RUN_ID } from "../data";
import {
  MonoLabel,
  SIGNAL_SUBTLE,
  SIGNAL_VAR,
  StatusChip,
  formatJson,
} from "../chrome";
import type { NodeId, PipelineNode } from "../types";

export function TraceScreen({
  selectedNode,
  onSelectNode,
}: {
  selectedNode: NodeId;
  onSelectNode: (id: NodeId) => void;
}) {
  const node = NODES.find((n) => n.id === selectedNode) ?? NODES[0];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-start justify-between gap-3 px-3 pt-3 pb-2 sm:px-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-mono text-[13px] font-medium text-[var(--ink)]">
              {SELECTED_RUN_ID}
            </h2>
            <StatusChip status="silent" />
          </div>
          <p className="mt-1 font-mono text-[10px] text-[var(--ink-3)]">
            support-triage · Argus {RUN_STATS.version} · {RUN_STATS.steps} ·{" "}
            {RUN_STATS.duration}
          </p>
        </div>
        <div className="hidden gap-px overflow-hidden rounded-[var(--radius-control)] border-[length:var(--hairline)] border-[var(--line)] sm:grid sm:grid-cols-4">
          {(
            [
              ["Duration", RUN_STATS.duration],
              ["Tokens", RUN_STATS.tokens],
              ["Cost", RUN_STATS.cost],
              ["Started", RUN_STATS.started],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="bg-[var(--ex)] px-2.5 py-1.5">
              <MonoLabel>{label}</MonoLabel>
              <div className="mt-0.5 font-mono text-[11px] text-[var(--ink)]">
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="shrink-0 px-3 pb-2 sm:px-4">
        <div className="overflow-x-auto rounded-[var(--radius-inner)] border-[length:var(--hairline)] border-[var(--line)] bg-[var(--ex)] px-3 py-3">
          <div className="flex min-w-[560px] items-center">
            {NODES.map((n, i) => (
              <div key={n.id} className="flex flex-1 items-center">
                <button
                  type="button"
                  onClick={() => onSelectNode(n.id)}
                  className={cn(
                    "flex min-w-0 flex-1 flex-col items-start gap-1 rounded-[8px] border-[length:var(--hairline)] px-2 py-1.5 text-left transition-colors",
                    selectedNode === n.id
                      ? "border-[var(--iris-border)] bg-[var(--panel)] shadow-[var(--shadow-control)]"
                      : "border-transparent bg-[var(--panel)]/70 hover:border-[var(--line-2)]"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: SIGNAL_VAR[n.status] }}
                    />
                    <span className="font-mono text-[11px] text-[var(--ink)]">
                      {n.label}
                    </span>
                  </span>
                  <span className="font-mono text-[9px] text-[var(--ink-3)]">
                    {n.step} · {n.duration}
                  </span>
                </button>
                {i < NODES.length - 1 ? (
                  <span
                    className="mx-1 h-px w-3 shrink-0 sm:w-4"
                    style={{ background: SIGNAL_VAR[n.status] }}
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden px-3 pb-3 sm:px-4">
        <Inspector node={node} />
      </div>
    </div>
  );
}

function Inspector({ node }: { node: PipelineNode }) {
  const lines = formatJson(node.output);

  return (
    <div className="grid h-full min-h-0 grid-cols-1 gap-2 overflow-auto md:grid-cols-[1fr_1.1fr]">
      <div className="rounded-[var(--radius-inner)] border-[length:var(--hairline)] border-[var(--line)] bg-[var(--ex)] p-3">
        <MonoLabel>Finding</MonoLabel>
        <div className="mt-2 flex items-center justify-between gap-2">
          <div>
            <div className="font-mono text-[14px] font-medium text-[var(--ink)]">
              {node.label}
            </div>
            <div className="mt-0.5 font-mono text-[10px] text-[var(--ink-3)]">
              Step {node.step} · {node.type} · {node.duration}
            </div>
          </div>
          <span
            className="rounded-[5px] px-1.5 py-0.5 font-mono text-[10px]"
            style={{
              color: SIGNAL_VAR[node.status],
              background: SIGNAL_SUBTLE[node.status],
            }}
          >
            {node.status === "warn"
              ? "Silent"
              : node.status === "fail"
                ? "Contract"
                : node.status === "info"
                  ? "Skipped"
                  : "Passed"}
          </span>
        </div>
        <p className="mt-3 text-[12px] leading-[1.55] text-[var(--ink-2)]">
          {node.finding}
        </p>
        {node.id === "enrich" || node.id === "summarize" ? (
          <p className="mt-2 text-[11px] leading-[1.5] text-[var(--ink-3)]">
            Root-cause walkback lands on{" "}
            <span className="font-mono text-[var(--sig-warn)]">enrich</span>
            {" — "}
            the first hop that introduced bad state.
          </p>
        ) : null}
      </div>

      <div className="rounded-[var(--radius-inner)] border-[length:var(--hairline)] border-[var(--line)] bg-[var(--raised)] p-3">
        <MonoLabel>Output state</MonoLabel>
        <pre className="mt-2 font-mono text-[10px] leading-[1.55] text-[var(--ink-2)]">
          {lines.map((line) => {
            const hot =
              line.includes("body") ||
              line.includes("placeholder") ||
              line.includes("As an AI") ||
              line.includes("null") ||
              line.includes("false");
            return (
              <div
                key={line}
                className={cn(
                  "-mx-1 rounded-[4px] px-1",
                  hot && "bg-[var(--sig-fail-subtle)] text-[var(--sig-fail)]"
                )}
              >
                {line}
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}
