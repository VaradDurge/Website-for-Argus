import { Heading } from "../components/Heading";
import { Callout } from "../components/Callout";
import { CodeBlock } from "../components/CodeBlock";

export default function DetectionLayers() {
  return (
    <>
      <Heading level={2} id="overview">
        Overview
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        ARGUS doesn&apos;t throw everything at an LLM. Detection runs in four layers, each more
        expensive than the last, and each only fires when needed.
      </p>

      <Heading level={2} id="heuristic-engine">
        Layer 1 — Heuristic Engine
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Pattern matching against <span className="text-white font-medium">150+ known failure
        signatures</span>. Deterministic, zero cost, catches ~80% of failures.
      </p>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        What it catches:
      </p>
      <ul className="mt-3 space-y-2 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        <li className="flex gap-3">
          <span className="text-[var(--signal-warn)] shrink-0">&#8227;</span>
          <span>Placeholder outputs — &quot;Lorem ipsum&quot;, &quot;TODO&quot;, template strings left in responses</span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--signal-warn)] shrink-0">&#8227;</span>
          <span>Empty results — a node returns <code>{`{}`}</code> or drops a required field</span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--signal-warn)] shrink-0">&#8227;</span>
          <span>Error keys — nested error objects, rate-limit responses, API error patterns</span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--signal-warn)] shrink-0">&#8227;</span>
          <span>Semantic degradation markers — refusal patterns, repeated filler text, corrupted JSON</span>
        </li>
      </ul>

      <p className="mt-4 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        The heuristic engine loads signatures from three tiers: <span className="text-white font-medium">bundled</span>{" "}
        (ships with ARGUS), <span className="text-white font-medium">private</span> (your local patterns), and{" "}
        <span className="text-white font-medium">shared</span> (community-contributed, synced from cloud). All
        merged and deduplicated at startup.
      </p>

      <Callout type="info" title="Adaptive">
        The heuristic engine grows over time. When the LLM investigator discovers a new failure
        pattern, it proposes a candidate signature. After you approve it in the Approvals page,
        the pattern is added to the heuristic engine — catching the same failure deterministically
        next time. See{" "}
        <a href="/docs/adaptive-learning" className="text-[var(--accent-soft)] underline decoration-dotted underline-offset-2 hover:text-white hover:decoration-solid">
          Adaptive Learning
        </a>.
      </Callout>

      <Heading level={2} id="anomaly-detector">
        Layer 2 — Anomaly Detector
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Statistical checks for <span className="text-white font-medium">suspicious patterns</span>{" "}
        that the heuristic engine can&apos;t catch with fixed signatures. Still deterministic, no LLM
        calls.
      </p>
      <ul className="mt-3 space-y-2 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        <li className="flex gap-3">
          <span className="text-[var(--accent-soft)] shrink-0">&#8227;</span>
          <span>Unexpected field types — <code>list[int]</code> vs <code>list[str]</code> mismatches</span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--accent-soft)] shrink-0">&#8227;</span>
          <span>Output size anomalies — a response that&apos;s dramatically shorter or longer than expected</span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--accent-soft)] shrink-0">&#8227;</span>
          <span>Timing outliers — a node that usually takes 2s now takes 30s</span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--accent-soft)] shrink-0">&#8227;</span>
          <span>Latency degradation — near-timeout nodes (&#8805;95% of limit), suspiciously fast responses (likely cached/stale), and fast completions paired with quality failures</span>
        </li>
      </ul>

      <Heading level={2} id="correlator">
        Layer 3 — Correlator
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Traces <span className="text-white font-medium">failure propagation across nodes</span>.
        This is the layer that tells you where the problem actually started, not just where it surfaced.
      </p>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        If node 3 dropped a field and node 5 crashed because of it, the correlator builds the causal
        chain and points you at node 3, not node 5.
      </p>

      <CodeBlock
        language="text"
        code={`   2  validate    12 ms    ⚠  silent failure
      └─  Field "score" is missing
      └─  process received bad state
   3  process    891 ms    ✗  crashed
      └─  KeyError: 'score'
      └─  Field 'score' was absent from the incoming state

root cause   validate`}
      />

      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        The correlator connects the <code>KeyError</code> in <code>process</code> back to the
        missing field in <code>validate</code> — so you fix the right node.
      </p>

      <Heading level={2} id="llm-investigator">
        Layer 4 — LLM Investigator
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Only triggers on <span className="text-white font-medium">ambiguous failures</span> or when
        explicitly enabled. This is the expensive layer — it calls an LLM.
      </p>
      <ul className="mt-3 space-y-2 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        <li className="flex gap-3">
          <span className="text-[var(--signal-fail)] shrink-0">&#8227;</span>
          <span>Generates root cause explanations and causal hypotheses</span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--signal-fail)] shrink-0">&#8227;</span>
          <span>Proposes new heuristic signatures so the same failure gets caught deterministically next time</span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--signal-fail)] shrink-0">&#8227;</span>
          <span>Provides debugging suggestions with specific node and field references</span>
        </li>
      </ul>

      <CodeBlock
        language="python"
        code={`# Control when the LLM investigator runs
watcher = ArgusWatcher(
    graph,
    investigate=True,        # on failure only (default)
    # investigate="always",  # every node
    # investigate=False,     # never
)`}
      />

      <Callout type="warning" title="Cost">
        The LLM investigator uses the model set by <code>judge_model</code> (default: <code>gpt-4o</code>).
        This adds API cost per run. Use <code>investigate=True</code> (default) to only run it when
        something fails.
      </Callout>

      <Heading level={2} id="semantic-judge">
        Semantic Judge
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Deterministic checks catch ~80% of production failures. For the remaining 20% — subtle quality
        issues like wrong tone, unhelpful responses, or outdated information — enable the semantic judge:
      </p>

      <CodeBlock
        language="python"
        code={`watcher = ArgusWatcher(graph, semantic_judge=True)`}
      />

      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        The judge runs <span className="text-white font-medium">after</span> deterministic checks on
        every passing node. It evaluates output quality and flags issues that pattern matching can&apos;t
        catch. It won&apos;t override a clear heuristic failure — it only steps in when the picture is
        ambiguous.
      </p>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Requires <code>OPENAI_API_KEY</code> in your environment.
      </p>

      <p className="mt-4 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        <span className="text-white font-medium">When to use:</span> complex multi-agent pipelines,
        customer-facing outputs, LLM-generated content where quality matters.
      </p>
      <p className="mt-2 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        <span className="text-white font-medium">When to skip:</span> simple pipelines, CI/CD speed
        runs, zero-cost monitoring.
      </p>
    </>
  );
}
