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
        <code>ArgusWatcher</code> is the main class you interact with. It instruments your graph,
        records execution data, runs detectors, and produces traces. One watcher per execution run.
      </p>

      <Heading level={2} id="basic-usage">
        Basic Usage
      </Heading>

      <CodeBlock
        language="python"
        code={`from argus import ArgusWatcher

# Minimal — all defaults
watcher = ArgusWatcher()
watcher.watch(graph)
app = graph.compile()
result = app.invoke(state)
watcher.finalize()

# Access results
trace = watcher.get_trace()
print(trace.summary)`}
      />

      <Heading level={2} id="parameters">
        Parameters
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        All parameters are optional. Pass them to the <code>ArgusWatcher()</code> constructor
        to override config file and environment variable values.
      </p>

      <Heading level={3} id="core-params">
        Core
      </Heading>
      <ParamTable
        groups={[
          {
            label: "Core parameters",
            params: [
              {
                name: "max_field_size",
                type: "int",
                default: "50_000",
                description: "Maximum characters to capture per state field. Fields exceeding this are truncated with a marker.",
              },
              {
                name: "strict",
                type: "bool",
                default: "False",
                description: "When True, raises an exception if any detector fires during finalize(). Useful for CI/CD quality gates.",
              },
              {
                name: "investigate",
                type: 'bool | "always"',
                default: "True",
                description: 'Run forensic root cause analysis when detections are found. Set to "always" to analyze every trace regardless.',
              },
            ],
          },
        ]}
      />

      <Heading level={3} id="security-params">
        Security
      </Heading>
      <ParamTable
        groups={[
          {
            label: "Security parameters",
            params: [
              {
                name: "redact_keys",
                type: "list[str]",
                default: "None",
                description: "List of state field names to redact in traces. Values are replaced with [REDACTED]. Supports glob patterns.",
              },
              {
                name: "validators",
                type: "dict",
                default: "{}",
                description: "Custom validation functions keyed by field name. Each function receives the field value and returns True/False.",
              },
            ],
          },
        ]}
      />

      <CodeBlock
        language="python"
        code={`# Redact sensitive fields
watcher = ArgusWatcher(
    redact_keys=["api_key", "password", "*.secret"],
)

# Custom validators
watcher = ArgusWatcher(
    validators={
        "output": lambda v: len(str(v)) > 10,
        "confidence": lambda v: 0 <= v <= 1,
    }
)`}
      />

      <Heading level={3} id="replay-eval-params">
        Replay & Eval
      </Heading>
      <ParamTable
        groups={[
          {
            label: "Replay & evaluation parameters",
            params: [
              {
                name: "persist_state",
                type: "bool",
                default: "True",
                description: "Save full state at each step to enable replay. Disable to reduce storage usage when replay isn't needed.",
              },
              {
                name: "record_http",
                type: "bool",
                default: "False",
                description: "Record HTTP requests made during execution. Enables replaying with mocked external calls.",
              },
              {
                name: "semantic_judge",
                type: "bool",
                default: "False",
                description: "Enable LLM-as-judge semantic evaluation. Adds latency and cost but catches subtle quality issues.",
              },
              {
                name: "judge_model",
                type: "str",
                default: '"gpt-4o"',
                description: "Which LLM to use for semantic judging. Any OpenAI-compatible model string.",
              },
            ],
          },
        ]}
      />

      <Callout type="warning" title="Cost warning">
        Enabling <code>semantic_judge</code> sends node outputs to an LLM for evaluation. This adds
        API cost and latency proportional to the number of nodes in your graph. Use it selectively
        in staging/CI rather than on every production run.
      </Callout>

      <Heading level={2} id="lifecycle">
        Lifecycle
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        A Watcher goes through four phases:
      </p>
      <ol className="mt-3 space-y-3 text-[15px] leading-[1.75] text-[var(--text-muted)] list-decimal list-inside">
        <li>
          <span className="text-white font-medium">Created</span> — constructor called, parameters loaded, storage initialized
        </li>
        <li>
          <span className="text-white font-medium">Watching</span> — <code>watch()</code> called, graph instrumented, ready for execution
        </li>
        <li>
          <span className="text-white font-medium">Recording</span> — pipeline is running, watcher is capturing node inputs/outputs/timing
        </li>
        <li>
          <span className="text-white font-medium">Finalized</span> — <code>finalize()</code> called, detectors run, forensics generated, trace stored
        </li>
      </ol>

      <CodeBlock
        language="python"
        code={`# Full lifecycle
watcher = ArgusWatcher(strict=True)    # Created
watcher.watch(graph)                    # Watching
app = graph.compile()
result = app.invoke(state)              # Recording (happens during invoke)
watcher.finalize()                      # Finalized

# After finalize, access everything
trace = watcher.get_trace()
detections = trace.detections
forensics = trace.forensics`}
      />

      <Callout type="danger" title="Do not reuse">
        A Watcher instance is single-use. After <code>finalize()</code>, create a new
        Watcher for the next execution. Calling <code>watch()</code> on a finalized
        Watcher raises <code>WatcherStateError</code>.
      </Callout>
    </>
  );
}
