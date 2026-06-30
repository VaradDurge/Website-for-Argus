import { Heading } from "../components/Heading";
import { Callout } from "../components/Callout";
import { CodeBlock } from "../components/CodeBlock";
import Image from "next/image";

export default function Architecture() {
  return (
    <>
      <Heading level={2} id="system-overview">
        System Overview
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        ARGUS is structured as a layered system: instrumentation at the bottom, detection in the
        middle, and presentation at the top. Each layer is independent — you can add custom
        validators, extend detection, or build your own tooling on top of the trace API.
      </p>

      <figure className="my-6 max-w-[480px]">
        <Image
          src="/Argus_Arch.png"
          alt="ARGUS system architecture: instrumentation layer → storage → detection engine → forensics → presentation (CLI, UI, API)"
          width={480}
          height={270}
          className="w-full h-auto rounded-lg border border-[var(--border)]"
        />
        <figcaption className="mt-2 text-center text-[12px] text-[var(--text-dim)]">
          Layered architecture: instrumentation → detection → presentation
        </figcaption>
      </figure>

      <Heading level={2} id="data-flow">
        Data Flow
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Here&apos;s what happens during a watched execution:
      </p>
      <ol className="mt-3 space-y-3 text-[15px] leading-[1.75] text-[var(--text-muted)] list-decimal list-inside">
        <li>
          <span className="text-white font-medium">Instrumentation</span> — the Watcher patches
          the graph&apos;s node callbacks to intercept inputs and outputs at each step
        </li>
        <li>
          <span className="text-white font-medium">Execution recording</span> — as the pipeline runs,
          each node creates a <code>TraceStep</code> with input state, output state, timing, and metadata
        </li>
        <li>
          <span className="text-white font-medium">Detection</span> — four layers run against the
          trace: heuristic engine, anomaly detector, correlator, and (when needed) LLM investigator
        </li>
        <li>
          <span className="text-white font-medium">Forensics</span> — if detections are found and
          <code> investigate</code> is enabled, the forensic analyzer traces the causal chain from
          symptom to root cause
        </li>
        <li>
          <span className="text-white font-medium">Storage</span> — the complete run (steps +
          detections + forensics + HTTP recordings) is written to <code>.argus/runs/</code>
        </li>
        <li>
          <span className="text-white font-medium">Presentation</span> — results are available via
          CLI, the web dashboard, or the Python API
        </li>
      </ol>

      <Callout type="info" title="Auto-save">
        For linear and fan-out/fan-in graphs, detection and storage happen automatically when the
        last node finishes. Only cyclic graphs need a manual <code>watcher.finalize()</code> call.
      </Callout>

      <Heading level={2} id="two-entry-points">
        Two Entry Points
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        ARGUS works with LangGraph pipelines and plain Python functions:
      </p>
      <ul className="mt-4 space-y-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        <li className="flex gap-3">
          <span className="text-[var(--accent-soft)] shrink-0">&#8227;</span>
          <span>
            <span className="text-white font-medium">ArgusWatcher</span> — for LangGraph pipelines.
            Hooks into the graph&apos;s execution callbacks automatically. Requires LangGraph 0.2+.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--accent-soft)] shrink-0">&#8227;</span>
          <span>
            <span className="text-white font-medium">ArgusSession</span> — for everything else.
            Works with plain Python functions, Prefect tasks, Temporal workflows, or any callable.
            No framework dependency.
          </span>
        </li>
      </ul>

      <CodeBlock
        language="python"
        code={`# ArgusSession — no LangGraph needed
from argus import ArgusSession

session = ArgusSession()
session.set_edges({"fetch": ["classify"], "classify": ["process"]})

fetch    = session.wrap("fetch",    fetch_fn)
classify = session.wrap("classify", classify_fn)
process  = session.wrap("process",  process_fn)

state = fetch(initial_state)
state = classify(state)
state = process(state)
session.finalize()`}
      />

      <Heading level={2} id="extension-points">
        Extension Points
      </Heading>
      <ul className="mt-4 space-y-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        <li className="flex gap-3">
          <span className="text-[var(--accent-soft)] shrink-0">&#8227;</span>
          <span>
            <span className="text-white font-medium">Validators</span> — pass custom validation
            functions via the <code>validators</code> parameter for domain-specific checks.
            Use <code>&quot;*&quot;</code> to run on every node.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--accent-soft)] shrink-0">&#8227;</span>
          <span>
            <span className="text-white font-medium">Adaptive signatures</span> — the LLM
            investigator proposes new heuristic patterns. Approve them in the Approvals page to
            extend the detection engine.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--accent-soft)] shrink-0">&#8227;</span>
          <span>
            <span className="text-white font-medium">Linear integration</span> — connect your
            Linear workspace from the Settings page. Reports create labeled issues with full
            diagnostics.
          </span>
        </li>
      </ul>
    </>
  );
}
