import { Heading } from "../components/Heading";
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
        middle, and presentation at the top. Each layer is independent — you can swap storage
        backends, add custom detectors, or build your own UI on top of the trace API.
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
        Here&apos;s what happens during a watched execution, step by step:
      </p>
      <ol className="mt-3 space-y-3 text-[15px] leading-[1.75] text-[var(--text-muted)] list-decimal list-inside">
        <li>
          <span className="text-white font-medium">Instrumentation</span> —
          <code>watcher.watch(graph)</code> patches the graph&apos;s node callbacks to intercept
          inputs and outputs at each step
        </li>
        <li>
          <span className="text-white font-medium">Execution recording</span> — as the pipeline runs,
          each node execution creates a <code>TraceStep</code> with input state, output state,
          timing, and metadata
        </li>
        <li>
          <span className="text-white font-medium">Detection</span> —
          <code>watcher.finalize()</code> passes the collected trace through all four detection
          layers in parallel
        </li>
        <li>
          <span className="text-white font-medium">Forensics</span> — if detections are found and
          <code>investigate</code> is enabled, the forensic analyzer traces the causal chain from
          symptom to root cause
        </li>
        <li>
          <span className="text-white font-medium">Storage</span> — the complete trace (steps +
          detections + forensics) is written to the SQLite database
        </li>
        <li>
          <span className="text-white font-medium">Presentation</span> — results are available via
          CLI commands, the local UI, or the Python API
        </li>
      </ol>

      <Heading level={2} id="extension-points">
        Extension Points
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        ARGUS is designed to be extended. The main extension points:
      </p>
      <ul className="mt-4 space-y-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        <li className="flex gap-3">
          <span className="text-[var(--accent-soft)] shrink-0">&#8227;</span>
          <span>
            <span className="text-white font-medium">Custom detectors</span> — implement the
            detector interface to add domain-specific detection logic
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--accent-soft)] shrink-0">&#8227;</span>
          <span>
            <span className="text-white font-medium">Storage backends</span> — extend the base
            storage class to persist traces to PostgreSQL, S3, or any other backend
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--accent-soft)] shrink-0">&#8227;</span>
          <span>
            <span className="text-white font-medium">Validators</span> — pass custom validation
            functions via the <code>validators</code> parameter for domain-specific structural checks
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--accent-soft)] shrink-0">&#8227;</span>
          <span>
            <span className="text-white font-medium">Report formats</span> — the report generator
            supports custom templates for HTML and Markdown output
          </span>
        </li>
      </ul>

      <CodeBlock
        language="python"
        code={`# Example: Custom detector
from argus.detectors.base import BaseDetector

class MyDetector(BaseDetector):
    def detect(self, trace):
        detections = []
        for step in trace.steps:
            if self.check_something(step):
                detections.append(
                    Detection(
                        layer="custom",
                        severity="warning",
                        message="Custom check failed",
                        step_id=step.id,
                    )
                )
        return detections`}
      />
    </>
  );
}
