"use client";

import { PIPELINE } from "../data";

export function PipelineScreen({
  selectedStep,
  onSelectStep,
}: {
  selectedStep: string | null;
  onSelectStep: (name: string) => void;
}) {
  return (
    <div className="wc">
      <div>
        <p className="cap">
          <span>Execution tree</span>
        </p>
        <pre className="tree">{`__start__
  └─ ingest_ticket
       └─ classify_intent
            ├─ retrieve_context
            └─ `}
          <span style={{ color: "var(--tool)" }}>enrich_account</span>
          {`
                 └─ `}
          <span style={{ color: "var(--semantic)" }}>draft_reply</span>
          {`
                      └─ `}
          <span style={{ color: "var(--tool)" }}>policy_check</span>
        </pre>
      </div>
      <div className="slist">
        {PIPELINE.map((row) => (
          <button
            key={row.num}
            type="button"
            className={`srow${row.flag === "tool" ? " flag" : ""}${row.flag === "sem" ? " flag-sem" : ""}${selectedStep === row.name ? " on" : ""}`}
            onClick={() => onSelectStep(row.name)}
          >
            <span className="srow-n">{row.num}</span>
            <div>
              <div className="srow-nm">{row.name}</div>
              {row.detail ? (
                <div className="srow-d">
                  {row.detail.split(/(csat_history|stripe_api|placeholder_outputs)/).map((part, i) =>
                    ["csat_history", "stripe_api", "placeholder_outputs"].includes(part) ? (
                      <em key={`${part}-${i}`}>{part}</em>
                    ) : (
                      <span key={`${part}-${i}`}>{part}</span>
                    )
                  )}
                </div>
              ) : null}
            </div>
            <div className="srow-r">
              <span className={`stat ${row.status}`}>
                <i />
                {row.statusLabel}
              </span>
              <span className="srow-t">{row.duration}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
