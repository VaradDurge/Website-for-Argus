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
    image: {
      src: "/images/demo/feat-01-detection.png",
      alt: "ARGUS detections list showing a silent failure on the summarize node of support-triage.",
      width: 2400,
      height: 1280,
    },
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
    image: {
      src: "/images/demo/feat-02-root-cause.png",
      alt: "Execution graph walkback highlighting enrich as the root cause and summarize as the silent failure.",
      width: 2400,
      height: 1280,
    },
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
    image: {
      src: "/images/demo/feat-03-replay.png",
      alt: "Replay workspace comparing the original placeholder summary against a grounded replayed output.",
      width: 2400,
      height: 1280,
    },
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
