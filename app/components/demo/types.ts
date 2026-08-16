export type Signal = "ok" | "lime" | "warn" | "fail" | "info";
export type RunStatus = "clean" | "silent" | "failed";

export type SignalTone = "ok" | "bad" | "warn" | "sem" | "live" | "mute";

export type WorkspaceTab = "overview" | "pipeline" | "analysis" | "correlations" | "state" | "logs";

export type RailId = "runs" | "compare" | "approvals" | "datasets" | "graphs";

export type ExplorerTone = "ok" | "bad" | "warn" | "sem" | "live" | "plain";

export interface ExplorerRun {
  id: string;
  ago: string;
  tone: ExplorerTone;
  nest?: boolean;
  label?: string;
}

export interface WorkspaceItem {
  id: string;
  kind: "run" | "compare";
  label: string;
  tone: ExplorerTone;
}

export interface PipelineRow {
  num: string;
  name: string;
  detail?: string;
  status: SignalTone;
  statusLabel: string;
  duration: string;
  flag?: "tool" | "sem";
}
