import { Heading } from "../components/Heading";
import { Callout } from "../components/Callout";
import { CodeBlock } from "../components/CodeBlock";
import Image from "next/image";
import Link from "next/link";

export default function CoreConcepts() {
  return (
    <>
      <Heading level={2} id="watchers">
        Watchers
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        A <span className="text-white font-medium">Watcher</span> is the core instrumentation
        primitive. It attaches to your pipeline graph and records everything that happens during
        execution — node inputs, outputs, state transitions, timing, and tool calls.
      </p>
      <p className="mt-4 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        The Watcher doesn&apos;t modify your pipeline&apos;s behavior. It&apos;s a passive observer
        that hooks into execution callbacks. Your pipeline runs exactly as it would without ARGUS —
        the Watcher just records what happened.
      </p>

      <CodeBlock
        language="python"
        code={`from argus import ArgusWatcher

watcher = ArgusWatcher(graph)      # attaches monitoring automatically
app = graph.compile()
result = app.invoke(initial_state) # run auto-saves when the last node finishes
print(watcher.run_id)              # access the run ID directly`}
      />

      <Callout type="info">
        Each Watcher instance tracks one execution run. For concurrent pipelines,
        create separate Watcher instances per run.
      </Callout>

      <Heading level={2} id="detection-layers">
        Detection Layers
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        ARGUS doesn&apos;t throw everything at an LLM. Detection runs in four layers, each more
        expensive than the last, and each only fires when needed:
      </p>
      <ul className="mt-3 space-y-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        <li className="flex gap-3">
          <span className="text-[var(--signal-warn)] shrink-0">1.</span>
          <span>
            <span className="text-white font-medium">Heuristic engine</span> — pattern matching
            against 150+ known failure signatures (placeholder outputs, empty results, error keys,
            semantic degradation markers). Deterministic, zero cost, catches ~80% of failures.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--signal-warn)] shrink-0">2.</span>
          <span>
            <span className="text-white font-medium">Anomaly detector</span> — statistical checks
            for suspicious patterns (unexpected field types, output size anomalies, timing outliers).
            Still deterministic.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--signal-warn)] shrink-0">3.</span>
          <span>
            <span className="text-white font-medium">Correlator</span> — traces failure propagation
            across nodes. If node 3 dropped a field and node 5 crashed because of it, the correlator
            builds the causal chain and points you at node 3, not node 5.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--signal-warn)] shrink-0">4.</span>
          <span>
            <span className="text-white font-medium">LLM investigator</span> — only triggers on
            ambiguous failures or when explicitly enabled. Generates root cause explanations,
            causal hypotheses, and debugging suggestions. Also proposes new heuristic signatures
            so the same failure gets caught deterministically next time.
          </span>
        </li>
      </ul>

      <Heading level={2} id="traces">
        Traces
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        A <span className="text-white font-medium">Trace</span> is the complete record of a
        single pipeline execution. It contains:
      </p>
      <ul className="mt-3 space-y-1.5 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        <li>Every node that executed, in order</li>
        <li>Input and output state at each node</li>
        <li>Wall clock timing per step</li>
        <li>Tool calls and their results</li>
        <li>Detection results from all four layers</li>
        <li>Forensic analysis if failures were detected</li>
      </ul>

      <CodeBlock
        language="bash"
        code={`# View the latest run
argus show last

# View a specific run by ID (or 8-char prefix)
argus show run abc12345

# List all runs
argus list`}
      />

      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Runs are stored locally in <code>.argus/runs/</code> by default. See{" "}
        <Link href="/docs/storage" className="text-[var(--accent-soft)] underline decoration-dotted underline-offset-2 hover:text-white hover:decoration-solid">
          Storage
        </Link>{" "}
        for details.
      </p>

      <Heading level={2} id="forensics">
        Forensics
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        When detectors flag a failure, the <span className="text-white font-medium">Forensics</span>{" "}
        engine kicks in. It traces the failure backward through the execution graph to find the
        root cause — which node, which input, which state transition caused the downstream
        degradation.
      </p>
      <p className="mt-4 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Forensic analysis answers three questions:
      </p>
      <ul className="mt-3 space-y-2 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        <li className="flex gap-3">
          <span className="text-[var(--signal-fail)] shrink-0">&#8227;</span>
          <span><span className="text-white font-medium">What failed?</span> — the specific detection that fired and what it found</span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--signal-fail)] shrink-0">&#8227;</span>
          <span><span className="text-white font-medium">Where did it fail?</span> — the node and step in the execution graph</span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--signal-fail)] shrink-0">&#8227;</span>
          <span><span className="text-white font-medium">Why did it fail?</span> — the causal chain from the root cause to the observed symptom</span>
        </li>
      </ul>

      <Callout type="info" title="Investigate mode">
        Forensics only runs when <code>investigate=True</code> (the default). Set it to{" "}
        <code>&quot;always&quot;</code> to run forensic analysis even when no detections fire — useful
        for catching near-misses.
      </Callout>

      <Heading level={2} id="how-they-connect">
        How They Connect
      </Heading>

      <figure className="my-6 max-w-[480px]">
        <Image
          src="/Argus_Core.png"
          alt="Diagram showing the flow: Watcher instruments pipeline → Trace captures execution → Detectors analyze trace → Forensics explains failures"
          width={480}
          height={270}
          className="w-full h-auto rounded-lg border border-[var(--border)]"
        />
        <figcaption className="mt-2 text-center text-[12px] text-[var(--text-dim)]">
          Watcher → Trace → Detectors → Forensics: the ARGUS pipeline
        </figcaption>
      </figure>

      <ol className="mt-3 space-y-2 text-[15px] leading-[1.75] text-[var(--text-muted)] list-decimal list-inside">
        <li>You create a <span className="text-white">Watcher</span> and attach it to your graph</li>
        <li>Your pipeline runs normally — the Watcher records a <span className="text-white">Trace</span></li>
        <li><span className="text-white">Detectors</span> analyze the trace (auto-runs for linear/fan-out graphs)</li>
        <li>If failures are found — <span className="text-white">Forensics</span> traces back to root cause</li>
        <li>You view results via CLI, UI, or programmatic API</li>
      </ol>

      <Callout type="info" title="Finalize">
        Runs are saved automatically for linear and fan-out/fan-in graphs. Only cyclic graphs
        (with back-edges) need a manual <code>watcher.finalize()</code> call.
      </Callout>
    </>
  );
}
