export type Signal = "ok" | "lime" | "warn" | "fail" | "info";

export type RunStatus = "clean" | "silent" | "failed";

export type DemoTab = "runs" | "trace" | "replay";

export type NodeId =
  | "extract"
  | "enrich"
  | "summarize"
  | "validate"
  | "respond";

export type NodeStatus = Signal;

export interface RunRow {
  id: string;
  graph: string;
  path: string;
  status: RunStatus;
  failedNode?: string;
  steps: readonly Signal[];
  duration: string;
  ago: string;
  tokens: string;
}

export interface PipelineNode {
  id: NodeId;
  label: string;
  step: string;
  type: string;
  status: NodeStatus;
  duration: string;
  finding: string;
  input: Record<string, string | number | boolean | null>;
  output: Record<string, string | number | boolean | null>;
}

export interface ReplayField {
  key: string;
  before: string;
  after: string;
  changed: boolean;
}
