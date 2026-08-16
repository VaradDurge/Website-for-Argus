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
    glow: true,
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
    preset: "graph",
    tall: true,
    glow: true,
    label:
      "ARGUS execution graph highlighting enrich_account as the root cause of the support-triage crash.",
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
