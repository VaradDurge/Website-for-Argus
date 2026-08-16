"use client";

import { ExecutionGraph } from "./ExecutionGraph";

export function GraphScreen({
  selectedNode,
  onSelectNode,
}: {
  selectedNode: string | null;
  onSelectNode: (id: string | null) => void;
}) {
  return (
    <div className="graph-fill">
      <ExecutionGraph selectedId={selectedNode} onSelect={onSelectNode} />
    </div>
  );
}
