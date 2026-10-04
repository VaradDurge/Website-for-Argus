import { Heading } from "../components/Heading";
import { Callout } from "../components/Callout";
import { CodeBlock } from "../components/CodeBlock";
import { ParamTable } from "../components/ParamTable";

export default function Watchers() {
  return (
    <>
      <Heading level={2} id="overview">
        Overview
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        <code>ArgusWatcher</code> is what you interact with. It hooks into your graph,
        records every node&apos;s execution, runs detectors, and produces traces.
        One watcher per run.
      </p>

      <Heading level={2} id="basic-usage">
        Basic Usage
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        One call covers StateGraph and already-compiled apps:
      </p>

      <CodeBlock
        language="python"
        code={`from argus import ArgusWatcher

watcher = ArgusWatcher()
app = watcher.attach(graph)         # StateGraph or compiled app
result = app.invoke(initial_state)  # persisted automatically

# Constructor form still works if you compile yourself:
watcher = ArgusWatcher(graph)       # uncompiled StateGraph
app = graph.compile()
result = app.invoke(initial_state)`}
      />

      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Runs persist when <code>invoke()</code> returns, including cyclic graphs.{" "}
        <code>finalize()</code> is an optional idempotent flush, not required.
      </p>

      <Heading level={2} id="parameters">
        Parameters
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Everything is optional. Pass to the constructor to override config file
        and environment variable values.
      </p>

      <ParamTable
        groups={[
          {
            label: "Core",
            params: [
              {
                name: "graph",
                type: "StateGraph",
                default: "None",
                description: "Uncompiled StateGraph to monitor. Or omit and call attach() on a StateGraph or compiled app.",
              },
              {
                name: "max_field_size",
                type: "int",
                default: "50_000",
                description: "Max characters per captured state field. Fields exceeding this get truncated.",
              },
              {
                name: "strict",
                type: "bool",
                default: "False",
                description: "Raise an exception if any detector fires. Use in CI/CD to fail builds on quality regressions.",
              },
              {
                name: "investigate",
                type: 'bool | "always"',
                default: "True",
                description: 'LLM root-cause investigation. True = on failure only, "always" = every node, False = off.',
              },
            ],
          },
        ]}
      />

      <ParamTable
        groups={[
          {
            label: "Security",
            params: [
              {
                name: "redact_keys",
                type: "set[str]",
                default: "None",
                description: 'Field names to redact from stored outputs (e.g. {"password", "api_key"}).',
              },
              {
                name: "validators",
                type: "dict",
                default: "None",
                description: 'Per-node semantic validators. Use "*" as key to run on every node. Each validator is a (bool, str) callable.',
              },
            ],
          },
        ]}
      />

      <CodeBlock
        language="python"
        code={`# Validators — catch semantic failures
watcher = ArgusWatcher(graph, validators={
    "classify": lambda o: (o.get("label") in ["yes", "no"], "unexpected label"),
    "*":        lambda o: ("error" not in o, "error key present"),
})`}
      />
      <p className="mt-2 text-[13px] text-[var(--text-dim)]">
        <code>&quot;*&quot;</code> runs on every node.
      </p>

      <ParamTable
        groups={[
          {
            label: "Replay & Eval",
            params: [
              {
                name: "persist_state",
                type: "bool",
                default: "True",
                description: "Save run records to .argus/runs/. Set False for ephemeral monitoring.",
              },
              {
                name: "record_http",
                type: "bool",
                default: "True",
                description: "Record all external HTTP/API calls for deterministic replay.",
              },
              {
                name: "semantic_judge",
                type: "bool",
                default: "False",
                description: "LLM-powered quality judge on every node output. Requires a provider key (OpenAI, Anthropic, or Google).",
              },
              {
                name: "judge_model",
                type: "str",
                default: '"gpt-4o"',
                description: "Model for the semantic judge and investigation.",
              },
            ],
          },
        ]}
      />

      <CodeBlock
        language="python"
        code={`# Full example with multiple options
watcher = ArgusWatcher(
    graph,
    semantic_judge=True,
    judge_model="gpt-4o-mini",
    strict=True,
    record_http=True,
    redact_keys={"api_key", "token"},
    validators={
        "summarize": lambda o: (len(o.get("summary", "")) > 10, "Summary too short"),
    },
)`}
      />

      <Callout type="warning" title="Cost">
        <code>semantic_judge</code> sends node outputs to an LLM. This adds API cost
        proportional to the number of nodes. Use it in staging/CI, not every production run.
      </Callout>

      <Heading level={2} id="lifecycle">
        Lifecycle
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        A Watcher goes through four phases:
      </p>
      <ol className="mt-3 space-y-3 text-[15px] leading-[1.75] text-[var(--text-muted)] list-decimal list-inside">
        <li>
          <span className="text-[var(--ink)] font-medium">Created</span> — constructor called, parameters loaded
        </li>
        <li>
          <span className="text-[var(--ink)] font-medium">Watching</span> — graph instrumented, ready for execution
        </li>
        <li>
          <span className="text-[var(--ink)] font-medium">Recording</span> — pipeline running, capturing node data
        </li>
        <li>
          <span className="text-[var(--ink)] font-medium">Finalized</span> — detectors run, forensics generated, trace stored
        </li>
      </ol>

      <Callout type="info" title="One run per Watcher">
        A Watcher instance tracks one execution run. Create a new Watcher for the next run.
      </Callout>
    </>
  );
}
