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

watcher = ArgusWatcher(
    strict=False,           # don't halt on detection
    investigate=True,       # run root cause analysis
    persist_state=True,     # save state for replay
)
watcher.watch(graph)`}
      />

      <Callout type="info">
        Each Watcher instance tracks one execution run. For concurrent pipelines,
        create separate Watcher instances per run.
      </Callout>

      <Heading level={2} id="detectors">
        Detectors
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        <span className="text-white font-medium">Detectors</span> are the analysis engines that
        examine a trace after execution. ARGUS runs four detection layers, each looking for
        different categories of failure:
      </p>
      <ul className="mt-3 space-y-2 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        <li className="flex gap-3">
          <span className="text-[var(--signal-warn)] shrink-0">1.</span>
          <span>
            <span className="text-white font-medium">Statistical</span> — anomalies in timing,
            output length, token counts, and other numerical signals
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--signal-warn)] shrink-0">2.</span>
          <span>
            <span className="text-white font-medium">Semantic</span> — meaning drift, relevance
            loss, and hallucination patterns using embedding similarity and LLM-as-judge
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--signal-warn)] shrink-0">3.</span>
          <span>
            <span className="text-white font-medium">Behavioral</span> — unexpected node
            transitions, infinite loops, skipped steps, and state corruption
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--signal-warn)] shrink-0">4.</span>
          <span>
            <span className="text-white font-medium">Structural</span> — schema violations,
            missing required fields, type mismatches, and contract breaches
          </span>
        </li>
      </ul>
      <p className="mt-4 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Detectors run automatically when you call <code>watcher.finalize()</code>. You can
        configure sensitivity thresholds and enable/disable individual layers through the{" "}
        <Link href="/docs/configuration" className="text-[var(--accent-soft)] underline decoration-dotted underline-offset-2 hover:text-white hover:decoration-solid">
          configuration
        </Link>.
      </p>

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
        <li>Wall clock and CPU timing per step</li>
        <li>Tool calls and their results</li>
        <li>Detection results from all four layers</li>
        <li>Forensic analysis if failures were detected</li>
      </ul>

      <CodeBlock
        language="bash"
        code={`# View the latest trace
argus trace --last

# View a specific trace by ID
argus trace abc123

# List all traces
argus trace --list`}
      />

      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Traces are stored locally in SQLite by default. See{" "}
        <Link href="/docs/storage" className="text-[var(--accent-soft)] underline decoration-dotted underline-offset-2 hover:text-white hover:decoration-solid">
          Storage
        </Link>{" "}
        for details on schema and export options.
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

      <p className="mt-4 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        The flow is linear and deterministic:
      </p>
      <ol className="mt-3 space-y-2 text-[15px] leading-[1.75] text-[var(--text-muted)] list-decimal list-inside">
        <li>You create a <span className="text-white">Watcher</span> and attach it to your graph</li>
        <li>Your pipeline runs normally — the Watcher records a <span className="text-white">Trace</span></li>
        <li>You call <code>finalize()</code> — <span className="text-white">Detectors</span> analyze the trace</li>
        <li>If failures are found — <span className="text-white">Forensics</span> traces back to root cause</li>
        <li>You view results via CLI, UI, or programmatic API</li>
      </ol>
    </>
  );
}
