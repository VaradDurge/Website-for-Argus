"use client";

import { cn } from "@/lib/utils";
import { RUNS } from "../data";
import { MonoLabel, StatusChip, StepDots } from "../chrome";
import type { RunRow, RunStatus } from "../types";

type Filter = "all" | RunStatus;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "silent", label: "Silent" },
  { id: "failed", label: "Failed" },
  { id: "clean", label: "Clean" },
];

export function RunsScreen({
  selectedId,
  filter,
  onFilter,
  onSelect,
}: {
  selectedId: string;
  filter: Filter;
  onFilter: (filter: Filter) => void;
  onSelect: (run: RunRow) => void;
}) {
  const rows = filter === "all" ? RUNS : RUNS.filter((r) => r.status === filter);
  const silent = RUNS.filter((r) => r.status === "silent").length;
  const failed = RUNS.filter((r) => r.status === "failed").length;
  const clean = RUNS.filter((r) => r.status === "clean").length;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-end justify-between gap-3 px-3 pt-3 pb-2 sm:px-4">
        <div>
          <h2 className="text-[15px] font-medium tracking-[-0.01em] text-[var(--ink)]">
            Runs
          </h2>
          <p className="mt-0.5 font-mono text-[10px] text-[var(--ink-3)]">
            {RUNS.length} ·{" "}
            <span className="text-[var(--sig-ok)]">{clean} clean</span>
            {" · "}
            <span className="text-[var(--sig-warn)]">{silent} silent</span>
            {" · "}
            <span className="text-[var(--sig-fail)]">{failed} failed</span>
          </p>
        </div>
        <div className="flex items-center gap-0.5 rounded-[var(--radius-control)] border-[length:var(--hairline)] border-[var(--line)] bg-[var(--ex)] p-0.5">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onFilter(item.id)}
              className={cn(
                "rounded-[6px] px-2 py-1 text-[11px] transition-colors",
                filter === item.id
                  ? "bg-[var(--panel)] text-[var(--ink)] shadow-[var(--shadow-control)]"
                  : "text-[var(--ink-3)] hover:text-[var(--ink)]"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full min-w-[560px] text-left">
          <thead className="sticky top-0 bg-[var(--panel)]">
            <tr className="border-b-[length:var(--hairline)] border-[var(--line)]">
              {["Run", "Status", "Steps", "Duration", "When"].map((h) => (
                <th key={h} className="px-3 py-2 sm:px-4">
                  <MonoLabel>{h}</MonoLabel>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((run) => {
              const selected = run.id === selectedId;
              return (
                <tr
                  key={run.id}
                  onClick={() => onSelect(run)}
                  className={cn(
                    "cursor-pointer border-b-[length:var(--hairline)] border-[var(--line)] transition-colors",
                    selected
                      ? "bg-[var(--iris-subtle)]"
                      : "hover:bg-[var(--ex)]"
                  )}
                >
                  <td className="px-3 py-2 sm:px-4">
                    <div className="text-[12px] font-medium text-[var(--ink)]">
                      {run.path}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 font-mono text-[10px] text-[var(--ink-3)]">
                      <span>{run.id}</span>
                      <span>{run.graph}</span>
                      {run.failedNode ? (
                        <span className="text-[var(--sig-warn)]">
                          {run.failedNode}
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-3 py-2 sm:px-4">
                    <StatusChip status={run.status} />
                  </td>
                  <td className="px-3 py-2 sm:px-4">
                    <StepDots steps={run.steps} />
                  </td>
                  <td className="px-3 py-2 sm:px-4">
                    <div className="font-mono text-[12px] text-[var(--ink)]">
                      {run.duration}
                    </div>
                    <div className="font-mono text-[10px] text-[var(--ink-3)]">
                      {run.tokens}
                    </div>
                  </td>
                  <td className="px-3 py-2 font-mono text-[11px] text-[var(--ink-3)] sm:px-4">
                    {run.ago}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
