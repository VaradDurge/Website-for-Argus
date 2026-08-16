"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  BookOpen,
  ClipboardCheck,
  Clock,
  Database,
  FileText,
  GitCompare,
  Info,
  Network,
  Plus,
  RotateCcw,
  Search,
  Settings,
  X,
} from "lucide-react";
import {
  CRASHED_ID,
  FAILING,
  INITIAL_TABS,
  LOG_LINES,
  RECENT,
  RUN_META,
} from "./data";
import { OverviewScreen } from "./screens/OverviewScreen";
import { PipelineScreen } from "./screens/PipelineScreen";
import { StateScreen } from "./screens/StateScreen";
import type { ExplorerRun, ExplorerTone, RailId, WorkspaceTab } from "./types";
import "./instrument.css";

const RAIL: { id: RailId; label: string; icon: typeof Activity }[] = [
  { id: "runs", label: "Runs", icon: Activity },
  { id: "compare", label: "Compare", icon: GitCompare },
  { id: "approvals", label: "Approvals", icon: ClipboardCheck },
  { id: "datasets", label: "Datasets", icon: Database },
  { id: "graphs", label: "Graphs", icon: Network },
];

const INNER: { id: WorkspaceTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "pipeline", label: "Pipeline" },
  { id: "analysis", label: "AI Analysis" },
  { id: "correlations", label: "Correlations" },
  { id: "state", label: "State" },
  { id: "logs", label: "Logs" },
];

function HexMark() {
  return (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M9 1.5 16.5 5.5v7L9 16.5 1.5 12.5v-7L9 1.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="9" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="9" cy="9" r=".9" fill="currentColor" />
    </svg>
  );
}

function toneClass(tone: ExplorerTone) {
  if (tone === "plain") return "fg";
  return `fg ${tone}`;
}

export function ArgusDemo() {
  const [rail, setRail] = useState<RailId>("runs");
  const [live, setLive] = useState(true);
  const [noteOpen, setNoteOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState({
    failing: true,
    recent: true,
    pipelines: true,
    saved: false,
  });
  const tabs = INITIAL_TABS;
  const [activeId, setActiveId] = useState(CRASHED_ID);
  const [inner, setInner] = useState<WorkspaceTab>("overview");
  const [selectedNode, setSelectedNode] = useState<string | null>("enrich_account");
  const [replayPhase, setReplayPhase] = useState<"idle" | "running" | "done">("idle");

  const runId = CRASHED_ID;
  const meta = RUN_META[CRASHED_ID];
  const lockedRail = rail === "compare" || rail === "approvals" || rail === "datasets" || rail === "graphs";

  function replay() {
    if (replayPhase !== "idle") return;
    setReplayPhase("running");
  }

  useEffect(() => {
    if (replayPhase !== "running") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setReplayPhase("done"), reduced ? 0 : 900);
    return () => window.clearTimeout(timer);
  }, [replayPhase]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setQuery("");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function onExplorer(item: ExplorerRun) {
    if (item.id !== CRASHED_ID) return;
    setActiveId(CRASHED_ID);
    setRail("runs");
    setInner("overview");
  }

  const filter = (items: readonly ExplorerRun[]) =>
    items.filter((item) => {
      const label = item.label ?? item.id;
      return !query || label.toLowerCase().includes(query.toLowerCase());
    });

  return (
    <div className="argus-instrument">
      <div className="ide">
        <nav className="irail" aria-label="Instrument">
          <span className="irail-mark">
            <HexMark />
          </span>
          {RAIL.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                title={item.label}
                aria-label={item.label}
                className={rail === item.id ? "on" : undefined}
                onClick={() => setRail(item.id)}
              >
                <Icon strokeWidth={1.7} />
              </button>
            );
          })}
          <span className="sp" />
          <button type="button" title="Guide" aria-label="Guide">
            <BookOpen strokeWidth={1.7} />
          </button>
          <button type="button" title="Settings" aria-label="Settings">
            <Settings strokeWidth={1.7} />
          </button>
        </nav>

        <aside className="explorer">
          {searchOpen ? (
            <label className="ex-search">
              <Search />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onBlur={() => !query && setSearchOpen(false)}
                placeholder="Search runs"
                style={{
                  flex: 1,
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  font: "inherit",
                  color: "var(--ink)",
                  minWidth: 0,
                }}
              />
              <span className="kbd">esc</span>
            </label>
          ) : (
            <button type="button" className="ex-search" onClick={() => setSearchOpen(true)}>
              <Search />
              Search runs
              <span className="kbd">⌘K</span>
            </button>
          )}
          <div className="ex-title">
            Run Explorer <Info />
          </div>
          <div className="ex-scroll">
            <ExplorerGroup
              title="Failing now"
              count={FAILING.length}
              open={openGroups.failing}
              onToggle={() => setOpenGroups((g) => ({ ...g, failing: !g.failing }))}
              items={filter(FAILING)}
              activeId={activeId}
              onSelect={onExplorer}
            />
            <ExplorerGroup
              title="Recent"
              count={RECENT.length}
              open={openGroups.recent}
              onToggle={() => setOpenGroups((g) => ({ ...g, recent: !g.recent }))}
              items={filter(RECENT)}
              activeId={activeId}
              onSelect={onExplorer}
            />
            <div className="ex-group">
              <button
                type="button"
                className={`ex-head${openGroups.pipelines ? "" : " closed"}`}
                onClick={() => setOpenGroups((g) => ({ ...g, pipelines: !g.pipelines }))}
              >
                <span className="tri" />
                Pipelines
                <span className="add" aria-hidden>
                  <Plus />
                </span>
              </button>
              {openGroups.pipelines ? (
                <div className="ex-body">
                  <div className="ex-item">
                    <Network className="fg ok" />
                    <span className="lb">support-triage</span>
                    <span className="ago">7n</span>
                  </div>
                  <div className="ex-item">
                    <Network className="fg warn" />
                    <span className="lb">doc-indexer</span>
                    <span className="ago">6n</span>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="ex-group">
              <button
                type="button"
                className={`ex-head${openGroups.saved ? "" : " closed"}`}
                onClick={() => setOpenGroups((g) => ({ ...g, saved: !g.saved }))}
              >
                <span className="tri" />
                Saved views
                <span className="n">4</span>
              </button>
            </div>
          </div>
        </aside>

        <div className="ws">
          <div className="ws-top">
            <div className="ws-vp">
              <button
                type="button"
                className={live ? "on" : undefined}
                title="Live tail"
                onClick={() => setLive(true)}
              >
                <Activity />
              </button>
              <button
                type="button"
                className={live ? undefined : "on"}
                title="Paused"
                onClick={() => setLive(false)}
              >
                <Clock />
              </button>
            </div>
            <span className="ws-live">Production · {live ? "live" : "paused"}</span>
            {noteOpen ? (
              <div className="ws-note">
                <Info />
                4 nodes lack type annotations
                <button type="button" aria-label="Dismiss" onClick={() => setNoteOpen(false)}>
                  <X />
                </button>
              </div>
            ) : null}
          </div>

          <div className="tabbar">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`tab${tab.id === activeId ? " on" : ""}`}
                role="tab"
                tabIndex={0}
                aria-selected={tab.id === activeId}
              >
                <FileText className={toneClass(tab.tone)} />
                <span className="lb">{tab.label}</span>
              </div>
            ))}
          </div>

          <div className="ws-body">
            {lockedRail ? (
              <LockedPane label={rail} />
            ) : (
              <>
                <div className="run-head">
                  <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                    <span className="run-id">{meta.fullId}</span>
                    <span className={`stat ${meta.status}`}>
                      <i />
                      {meta.statusLabel}
                    </span>
                    <span style={{ flex: 1 }} />
                    <button type="button" className="btn btn-sm btn-ghost">
                      Export
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={replay}
                      disabled={replayPhase === "running"}
                    >
                      <RotateCcw />
                      {replayPhase === "running"
                        ? "Replaying…"
                        : replayPhase === "done"
                          ? "Verified"
                          : "Replay"}
                    </button>
                  </div>
                  <div className="run-meta">{meta.meta}</div>
                  <div className="tabs" role="tablist">
                    {INNER.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={inner === tab.id}
                        onClick={() => setInner(tab.id)}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
                {inner === "overview" ? (
                  <OverviewScreen
                    runId={runId}
                    selectedNode={selectedNode}
                    onSelectNode={setSelectedNode}
                    onOpenPipeline={() => setInner("pipeline")}
                  />
                ) : null}
                {inner === "pipeline" ? (
                  <PipelineScreen selectedStep={selectedNode} onSelectStep={setSelectedNode} />
                ) : null}
                {inner === "state" ? <StateScreen /> : null}
                {inner === "analysis" ? <AnalysisPane /> : null}
                {inner === "correlations" ? <CorrelationsPane /> : null}
                {inner === "logs" ? <LogsPane /> : null}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExplorerGroup({
  title,
  count,
  open,
  onToggle,
  items,
  activeId,
  onSelect,
}: {
  title: string;
  count: number;
  open: boolean;
  onToggle: () => void;
  items: readonly ExplorerRun[];
  activeId: string;
  onSelect: (item: ExplorerRun) => void;
}) {
  return (
    <div className="ex-group">
      <button type="button" className={`ex-head${open ? "" : " closed"}`} onClick={onToggle}>
        <span className="tri" />
        {title}
        <span className="n">{count}</span>
      </button>
      {open ? (
        <div className="ex-body">
          {items.map((item) => {
            const locked = item.id !== CRASHED_ID;
            return (
            <button
              key={item.label ?? item.id}
              type="button"
              className={`ex-item${item.nest ? " nest" : ""}${activeId === item.id ? " on" : ""}${locked ? " locked" : ""}`}
              aria-disabled={locked}
              onClick={() => {
                if (!locked) onSelect(item);
              }}
            >
              {item.nest ? (
                <RotateCcw className="fg" />
              ) : (
                <FileText className={toneClass(item.tone)} />
              )}
              <span className="lb">{item.label ?? item.id}</span>
              <span className="ago">{item.ago}</span>
            </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function AnalysisPane() {
  return (
    <div className="wc">
      <div>
        <p className="finding">
          <span className="who">enrich_account</span> is the first hop that introduced bad state.
          The investigator scores this 0.91: <code>stripe_api</code> returned 429, the handler
          omitted <code>csat_history</code>, and <code>policy_check</code> crashed on the missing
          field.
        </p>
        <p className="finding-sub">
          Heuristic 0.94 <span className="arrow">·</span> anomaly 0.71{" "}
          <span className="arrow">·</span> judge 0.91
        </p>
      </div>
    </div>
  );
}

function CorrelationsPane() {
  return (
    <div className="wc">
      <div>
        <p className="finding">
          Same signature on <span className="who">3 runs</span> in the last hour: swallowed 429
          from <code>stripe_api</code>, then a crash in <code>policy_check</code>.
        </p>
        <p className="finding-sub">
          <span className="n">2e8a3c</span>
          <span className="arrow">·</span>
          <span className="n">990422</span>
          <span className="arrow">·</span>
          <span className="n">5a9592</span>
        </p>
      </div>
    </div>
  );
}

function LogsPane() {
  return (
    <div className="wc">
      <pre className="log">
        {LOG_LINES.map((line) => (
          <div key={line.t} className={line.err ? "err" : undefined}>
            {line.t}  {line.msg}
          </div>
        ))}
      </pre>
    </div>
  );
}

function LockedPane({ label }: { label: string }) {
  return (
    <div className="wc">
      <p className="finding" style={{ color: "var(--ink-3)" }}>
        {label[0].toUpperCase() + label.slice(1)} is part of the instrument. This demo stays on
        the run that crashed.
      </p>
    </div>
  );
}
