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
        ARGUS is a <span className="text-white font-medium">production readiness platform</span> for
        AI agent pipelines. It wraps your LangGraph (or any Python-based) workflow and watches
        every node execution, state transition, and tool call — then runs a multi-layered detection
        system to catch the failures that don&apos;t throw exceptions.
      </p>
      <p className="mt-4 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Your LangGraph pipeline runs. No exception. But three nodes later something crashes with
        a <code>KeyError</code>. The node that crashed didn&apos;t cause it — some node upstream
        returned a dict with a missing field, and nothing caught it. ARGUS sits between your nodes
        and catches silent failures, semantic degradation, and contract violations before they
        reach production.
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

# Option A — pass graph to constructor (recommended)
watcher = ArgusWatcher(graph)      # attaches monitoring automatically
app = graph.compile()
result = app.invoke(initial_state) # run auto-saves when the last node finishes
print(watcher.run_id)              # access the run ID directly`}
      />

      <p className="mt-4 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        All parameters are optional. Here&apos;s a full example with customization:
      </p>

      <CodeBlock
        language="python"
        code={`watcher = ArgusWatcher(
    graph,                           # LangGraph graph to monitor
    max_field_size=50_000,           # max chars per captured state field
    strict=False,                    # True = raise on detection (useful for CI)
    investigate=True,                # run root cause analysis on failures
    redact_keys={"api_key", "token"},# scrub sensitive fields from traces
    persist_state=True,              # save state at each step for replay
    record_http=True,                # record HTTP calls for mocked replay
    semantic_judge=False,            # enable LLM-as-judge evaluation
    judge_model="gpt-4o",           # model for semantic judging
    validators={
        "summarize": lambda o: (len(o.get("summary", "")) > 10, "Summary too short"),
    },
)`}
      />

      <p className="mt-4 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Runs are saved automatically for linear and fan-out/fan-in graphs. Only cyclic graphs
        (with back-edges) need a manual <code>watcher.finalize()</code> call.
      </p>

      <figure className="my-6 max-w-[480px]">
        <Image
          src="/Argus_Arch.png"
          alt="ARGUS architecture diagram showing the watcher wrapping a pipeline, detectors analyzing the trace, and forensic output"
          width={480}
          height={270}
          className="w-full h-auto rounded-lg border border-[var(--border)]"
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
            <span className="text-white font-medium">Execution replay</span> — re-run any node
            with frozen upstream state. Only the target node onward re-executes with your fixed code.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--signal-ok)] mt-1 shrink-0">&#8227;</span>
          <span>
            <span className="text-white font-medium">Four detection layers</span> — heuristic engine
            (150+ signatures), anomaly detector, correlator, and LLM investigator
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
      <p className="mt-4 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        ARGUS also works <span className="text-white font-medium">without LangGraph</span> — use{" "}
        <code>ArgusSession</code> to wrap plain Python functions, Prefect tasks, or Temporal workflows.
      </p>

      <Callout type="info" title="Beta">
        ARGUS is currently in beta (v0.6.18). The core API is stable, but some detection layers and CLI
        commands are still being refined. Requires Python 3.9+. LangGraph 0.2+ only needed for{" "}
        <code>ArgusWatcher</code>. Join the{" "}
        <a href="https://discord.gg/nhbdZkcG" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-soft)] underline decoration-dotted underline-offset-2 hover:text-white hover:decoration-solid">
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
