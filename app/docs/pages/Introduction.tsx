import { Heading } from "../components/Heading";
import { Callout } from "../components/Callout";
import { CodeBlock } from "../components/CodeBlock";
import Image from "next/image";
import Link from "next/link";

export default function Introduction() {
  return (
    <>
      <Heading level={2} id="what-is-argus">
        What is ARGUS?
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        ARGUS is a <span className="text-white font-medium">forensic observability layer</span> for
        AI agent pipelines. It wraps your LangGraph (or any Python-based) workflow and watches
        every node execution, state transition, and tool call — then runs a multi-layered detection
        system to catch the failures that don&apos;t throw exceptions.
      </p>
      <p className="mt-4 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Think of it as a flight recorder for your AI pipeline. When something goes wrong — and in
        agent systems, it&apos;s almost always <span className="text-white font-medium">silent</span> —
        ARGUS gives you the trace, the root cause, and the replay ability to fix it.
      </p>

      <Heading level={2} id="the-problem">
        The Problem
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        AI agent pipelines fail differently from traditional software. They don&apos;t crash — they
        degrade. A retrieval step returns irrelevant documents. A planning node generates a
        reasonable-looking but wrong plan. A tool call succeeds with bad parameters. The pipeline
        finishes, returns a result, and nobody knows it&apos;s garbage until a human reads it.
      </p>
      <p className="mt-4 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        These are <span className="text-white font-medium">silent failures</span> — the pipeline
        technically succeeds while the output quality collapses. Standard monitoring (latency,
        error rates, uptime) is blind to them. You need something that understands what your
        pipeline is <em>supposed</em> to do and can tell when it stops doing it.
      </p>

      <Heading level={2} id="how-argus-works">
        How ARGUS Works
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        ARGUS wraps your pipeline with a single call and instruments every execution step automatically.
        No manual tracing. No decorators on every function. One wrapper, full visibility.
      </p>

      <CodeBlock
        language="python"
        code={`from argus import ArgusWatcher

watcher = ArgusWatcher()
watcher.watch(graph)           # instrument your LangGraph
app = graph.compile()
result = app.invoke(state)
watcher.finalize()             # run detectors, generate trace`}
      />

      <p className="mt-4 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        After <code>finalize()</code>, ARGUS has captured every node&apos;s input/output, timed each
        step, and run four layers of detection against the trace. If something went wrong — even
        something subtle — you&apos;ll know about it.
      </p>

      <figure className="my-6">
        <Image
          src="/Argus_Arch.png"
          alt="ARGUS architecture diagram showing the watcher wrapping a pipeline, detectors analyzing the trace, and forensic output"
          width={720}
          height={405}
          className="rounded-lg border border-[var(--border)]"
        />
        <figcaption className="mt-2 text-center text-[12px] text-[var(--text-dim)]">
          ARGUS wraps your pipeline, runs multi-layer detection, and produces forensic traces
        </figcaption>
      </figure>

      <Heading level={3} id="key-capabilities">
        Key Capabilities
      </Heading>
      <ul className="mt-3 space-y-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        <li className="flex gap-3">
          <span className="text-[var(--signal-ok)] mt-1 shrink-0">&#8227;</span>
          <span>
            <span className="text-white font-medium">Silent failure detection</span> — catches
            semantic degradation, hallucinated outputs, and logic errors that don&apos;t raise
            exceptions
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--signal-ok)] mt-1 shrink-0">&#8227;</span>
          <span>
            <span className="text-white font-medium">Root cause analysis</span> — traces failures
            back through the execution graph to the node that caused the problem
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--signal-ok)] mt-1 shrink-0">&#8227;</span>
          <span>
            <span className="text-white font-medium">Execution replay</span> — re-run any trace
            from any step with modified inputs to test fixes
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--signal-ok)] mt-1 shrink-0">&#8227;</span>
          <span>
            <span className="text-white font-medium">Four detection layers</span> — statistical,
            semantic, behavioral, and structural analysis working together
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--signal-ok)] mt-1 shrink-0">&#8227;</span>
          <span>
            <span className="text-white font-medium">Zero-config instrumentation</span> — one
            wrapper call, no decorators, no manual span creation
          </span>
        </li>
      </ul>

      <Heading level={2} id="who-is-it-for">
        Who Is It For?
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        ARGUS is built for engineers shipping AI agent pipelines to production. If you&apos;re
        building with LangGraph, LangChain, or any Python-based agent framework and you need to
        know when your pipeline is silently producing bad output — ARGUS is for you.
      </p>

      <Callout type="info" title="Beta">
        ARGUS is currently in beta. The core API is stable, but some detection layers and CLI
        commands are still being refined. Join the{" "}
        <a href="https://discord.gg/zW774xvS" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-soft)] underline decoration-dotted underline-offset-2 hover:text-white hover:decoration-solid">
          Discord
        </a>{" "}
        for early access and to shape the roadmap.
      </Callout>

      <p className="mt-6 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Ready to try it?{" "}
        <Link href="/docs/quickstart" className="text-[var(--accent-soft)] underline decoration-dotted underline-offset-2 hover:text-white hover:decoration-solid">
          Jump to the Quickstart
        </Link>
        .
      </p>
    </>
  );
}
