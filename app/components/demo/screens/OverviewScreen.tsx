"use client";

import { CRASHED_ID, RUN_META } from "../data";
import { ExecutionGraph } from "./ExecutionGraph";

export function OverviewScreen({
  selectedNode,
  onSelectNode,
}: {
  runId: string;
  selectedNode: string | null;
  onSelectNode: (id: string | null) => void;
  onOpenPipeline: () => void;
}) {
  const run = RUN_META[CRASHED_ID];

  return (
    <div className="wc">
      <div>
        <p className="finding">
          <span className="who">enrich_account</span> reported <code>pass</code> while omitting{" "}
          <code>csat_history</code>. Its <code>stripe_api</code> call was rate-limited and the
          handler swallowed the error, so the crash surfaced three nodes later in{" "}
          <code>policy_check</code>.
        </p>
        <p className="finding-sub">
          Root cause · confidence 0.91 <span className="arrow">·</span>{" "}
          <span className="n">enrich_account</span> <span className="arrow">→</span>{" "}
          <span className="n">draft_reply</span> <span className="arrow">→</span>{" "}
          <span className="n">policy_check</span>
        </p>
      </div>

      <div>
        <p className="cap">
          <span>Execution graph · 7 nodes</span>
        </p>
        <ExecutionGraph selectedId={selectedNode} onSelect={onSelectNode} />
      </div>

      <p className="facts">
        {run.facts.map(([label, value]) => (
          <span key={label}>
            {label}
            <b>{value}</b>
          </span>
        ))}
      </p>
    </div>
  );
}
