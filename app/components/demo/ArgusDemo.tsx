"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  GitBranch,
  RotateCcw,
  Search,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HexMark, MonoLabel } from "./chrome";
import { SELECTED_RUN_ID } from "./data";
import { RunsScreen } from "./screens/RunsScreen";
import { TraceScreen } from "./screens/TraceScreen";
import { ReplayScreen, type ReplayPhase } from "./screens/ReplayScreen";
import type { DemoTab, NodeId, RunRow, RunStatus } from "./types";

const RAIL = [
  { id: "runs" as const, icon: Activity, label: "Runs" },
  { id: "trace" as const, icon: GitBranch, label: "Trace" },
  { id: "replay" as const, icon: RotateCcw, label: "Replay" },
];

const EXPLORE = [
  {
    label: "Observe",
    items: [
      { id: "runs" as const, label: "Runs" },
      { id: "runs" as const, label: "Detections", filter: "silent" as const },
    ],
  },
  {
    label: "Analyze",
    items: [
      { id: "trace" as const, label: "Trace" },
      { id: "replay" as const, label: "Replay" },
    ],
  },
];

const TABS: { id: DemoTab; label: string }[] = [
  { id: "runs", label: "Runs" },
  { id: "trace", label: "Trace" },
  { id: "replay", label: "Replay" },
];

export function ArgusDemo() {
  const [tab, setTab] = useState<DemoTab>("runs");
  const [filter, setFilter] = useState<"all" | RunStatus>("all");
  const [selectedId, setSelectedId] = useState(SELECTED_RUN_ID);
  const [selectedNode, setSelectedNode] = useState<NodeId>("summarize");
  const [replayPhase, setReplayPhase] = useState<ReplayPhase>("idle");

  function openTab(next: DemoTab, nextFilter?: "all" | RunStatus) {
    setTab(next);
    if (nextFilter) setFilter(nextFilter);
  }

  function selectRun(run: RunRow) {
    setSelectedId(run.id);
    if (run.failedNode === "summarize" || run.failedNode === "parse_diff") {
      setSelectedNode(run.failedNode === "parse_diff" ? "extract" : "summarize");
    }
  }

  function replay() {
    if (replayPhase === "running") return;
    if (replayPhase === "done") {
      setReplayPhase("idle");
      return;
    }
    setReplayPhase("running");
  }

  useEffect(() => {
    if (replayPhase !== "running") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setReplayPhase("done"), reduced ? 0 : 900);
    return () => window.clearTimeout(timer);
  }, [replayPhase]);

  return (
    <div className="trial-ui flex h-full min-h-0 bg-[var(--panel)] text-[var(--ink)]">
      <aside className="hidden w-10 shrink-0 flex-col items-center border-r-[length:var(--hairline)] border-[var(--line)] bg-[var(--rail)] py-2.5 sm:flex">
        <HexMark size={18} />
        <nav className="mt-4 flex flex-1 flex-col items-center gap-1" aria-label="Instrument">
          {RAIL.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                title={item.label}
                aria-label={item.label}
                onClick={() => openTab(item.id)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-[7px] transition-colors",
                  active
                    ? "bg-[var(--iris-subtle)] text-[var(--iris)]"
                    : "text-[var(--ink-3)] hover:bg-[var(--band)] hover:text-[var(--ink)]"
                )}
              >
                <Icon size={14} strokeWidth={1.75} />
              </button>
            );
          })}
        </nav>
        <Settings size={14} className="text-[var(--ink-3)]" />
      </aside>

      <aside className="hidden w-[168px] shrink-0 flex-col border-r-[length:var(--hairline)] border-[var(--line)] bg-[var(--ex)] md:flex">
        <div className="border-b-[length:var(--hairline)] border-[var(--line)] px-3 py-2.5">
          <div className="text-[12px] font-medium tracking-[-0.01em] text-[var(--ink)]">
            ARGUS
          </div>
          <MonoLabel className="mt-0.5 block">Instrument · live</MonoLabel>
        </div>
        <div className="flex-1 space-y-4 overflow-auto px-2 py-3">
          {EXPLORE.map((group) => (
            <div key={group.label}>
              <MonoLabel className="px-1.5">{group.label}</MonoLabel>
              <div className="mt-1.5 space-y-0.5">
                {group.items.map((item) => {
                  const active =
                    tab === item.id &&
                    (!("filter" in item) || filter === item.filter);
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() =>
                        openTab(item.id, "filter" in item ? item.filter : "all")
                      }
                      className={cn(
                        "flex w-full items-center rounded-[6px] px-1.5 py-1 text-left text-[12px] transition-colors",
                        active
                          ? "bg-[var(--panel)] text-[var(--ink)] shadow-[var(--shadow-control)]"
                          : "text-[var(--ink-2)] hover:bg-[var(--band)] hover:text-[var(--ink)]"
                      )}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center gap-2 border-b-[length:var(--hairline)] border-[var(--line)] bg-[var(--band)] px-3 py-1.5">
          <span className="live-dot" />
          <MonoLabel>support-triage</MonoLabel>
          <span className="text-[var(--line-3)]">/</span>
          <span className="truncate font-mono text-[10px] text-[var(--ink-2)]">
            {selectedId}
          </span>
          <div className="ml-auto hidden items-center gap-1.5 sm:flex">
            <Search size={11} className="text-[var(--ink-3)]" />
            <span className="font-mono text-[10px] text-[var(--ink-3)]">
              ⌕ node, run, field
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-0.5 border-b-[length:var(--hairline)] border-[var(--line)] px-2">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => openTab(item.id)}
              className={cn(
                "border-b-2 px-2.5 py-2 text-[12px] transition-colors",
                tab === item.id
                  ? "border-[var(--iris)] text-[var(--ink)]"
                  : "border-transparent text-[var(--ink-3)] hover:text-[var(--ink)]"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">
          {tab === "runs" ? (
            <RunsScreen
              selectedId={selectedId}
              filter={filter}
              onFilter={setFilter}
              onSelect={selectRun}
            />
          ) : null}
          {tab === "trace" ? (
            <TraceScreen
              selectedNode={selectedNode}
              onSelectNode={setSelectedNode}
            />
          ) : null}
          {tab === "replay" ? (
            <ReplayScreen phase={replayPhase} onReplay={replay} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
