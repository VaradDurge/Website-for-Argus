import { FeatureBleed, type FeatureBleedProps } from "./FeatureBleed";

const FEATURES: readonly FeatureBleedProps[] = [
  {
    num: "01",
    title: "Catch failures before they ship",
    body: "A node can return valid JSON, exit cleanly and still be wrong. ARGUS scores every output for emptiness, placeholder text, collapsed confidence and hallucinated entities, then fails the run instead of marking it green.",
    capability: "Multi-layer detection",
    tags: [
      "Heuristic signatures",
      "Anomaly detection",
      "Semantic judge",
      "Contract validators",
      "Regression baselines",
      "CI gating",
    ],
    slotId: "feat-01-detection-shell",
    align: "start",
    preset: "pipeline",
    label:
      "ARGUS pipeline view showing a silent failure on enrich_account, a placeholder in draft_reply, and a crash in policy_check.",
  },
  {
    num: "02",
    title: "Know which node actually broke",
    body: "The node that raises is rarely the node that failed. ARGUS walks execution lineage backwards to the first step that introduced bad state, and shows the field-level diff that caused everything downstream.",
    capability: "Forensic root cause",
    tags: [
      "Graph walkback",
      "State diffs",
      "Tool-call forensics",
      "Downstream impact",
      "Confidence tracking",
      "Multi-agent lineage",
    ],
    slotId: "feat-02-root-cause",
    align: "end",
    preset: "overview",
    label:
      "ARGUS overview with root-cause walkback highlighting enrich_account and the execution graph for support-triage.",
  },
  {
    num: "03",
    title: "Replay and verify with confidence",
    body: "Freeze upstream state, re-run only the node you changed, and diff the new output against the original. No recomputed LLM calls, no guessing whether the fix actually worked.",
    capability: "Built for engineers who ship",
    tags: [
      "Frozen upstream state",
      "Node replay",
      "Output diff",
      "HTTP record & mock",
      "Replay history",
      "Strict mode",
    ],
    slotId: "feat-03-replay-verify",
    align: "start",
    glow: true,
    preset: "compare",
    label:
      "ARGUS replay compare showing the original placeholder body against a grounded replayed output.",
  },
];

export function FeatureSections() {
  return (
    <div id="features" className="divide-y-[length:var(--hairline)] divide-[var(--line)]">
      {FEATURES.map((feature) => (
        <FeatureBleed key={feature.num} {...feature} />
      ))}
    </div>
  );
}
