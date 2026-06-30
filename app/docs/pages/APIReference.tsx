import { Heading } from "../components/Heading";
import { Callout } from "../components/Callout";
import { CodeBlock } from "../components/CodeBlock";
import { ParamTable } from "../components/ParamTable";

export default function APIReference() {
  return (
    <>
      <Heading level={2} id="arguswatcher">
        ArgusWatcher
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        The main class for instrumenting LangGraph pipelines. Import from the top-level package:
      </p>

      <CodeBlock
        language="python"
        code={`from argus import ArgusWatcher`}
      />

      <ParamTable
        groups={[
          {
            label: "Constructor parameters",
            params: [
              {
                name: "graph",
                type: "StateGraph",
                default: "None",
                description: "LangGraph graph to monitor. If passed, watch() is called automatically.",
              },
              {
                name: "max_field_size",
                type: "int",
                default: "50_000",
                description: "Max characters per captured state field before truncation.",
              },
              {
                name: "validators",
                type: "dict | None",
                default: "None",
                description: 'Per-node semantic validators. Use "*" as key to run on every node. Each validator is a (bool, str) callable.',
              },
              {
                name: "strict",
                type: "bool",
                default: "False",
                description: "Enable extra checks: nested error keys, rate-limit responses, empty lists, type mismatches. Recommended for CI/staging.",
              },
              {
                name: "investigate",
                type: 'bool | "always"',
                default: "True",
                description: 'LLM root-cause investigation. True = on failure only, "always" = every node, False = off.',
              },
              {
                name: "redact_keys",
                type: "set[str] | None",
                default: "None",
                description: 'Field names to redact from stored outputs (e.g. {"password", "api_key"}).',
              },
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
                description: "LLM-powered quality judge on every node output. Requires OPENAI_API_KEY.",
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

      <Heading level={2} id="methods">
        Methods
      </Heading>

      <Heading level={3} id="watch">
        .watch()
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Instrument a graph for monitoring. Call before <code>graph.compile()</code>.
        Not needed if you passed <code>graph</code> to the constructor.
      </p>

      <CodeBlock
        language="python"
        code={`watcher.watch(graph: StateGraph) -> None`}
      />

      <Callout type="warning">
        Call <code>watch()</code> before <code>graph.compile()</code>. If you compile first,
        ARGUS can&apos;t instrument the nodes.
      </Callout>

      <Heading level={3} id="watch-compiled">
        .watch_compiled()
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Instrument an already-compiled graph. Use when you can&apos;t call{" "}
        <code>watch()</code> before compilation (e.g. when using a checkpointer).
      </p>

      <CodeBlock
        language="python"
        code={`app = graph.compile(checkpointer=memory)
app = watcher.watch_compiled(app) -> CompiledGraph`}
      />

      <Heading level={3} id="finalize">
        .finalize()
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Run all detection layers, execute forensic analysis, and persist results.
        Only needed for cyclic graphs — linear and fan-out graphs auto-save.
      </p>

      <CodeBlock
        language="python"
        code={`watcher.finalize() -> Trace`}
      />

      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Returns the completed <code>Trace</code> object. If <code>strict=True</code> and
        detections fire, raises <code>DetectionError</code> after storing the trace.
      </p>

      <Heading level={3} id="get-trace">
        .get_trace()
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Retrieve the trace after the run. Returns the same object as <code>finalize()</code>.
      </p>

      <CodeBlock
        language="python"
        code={`trace = watcher.get_trace() -> Trace

# Trace properties
trace.id                # str — unique trace identifier
trace.status            # "ok" | "warning" | "failed"
trace.duration_ms       # int — total execution time
trace.steps             # list[TraceStep]
trace.detections        # list[Detection]
trace.forensics         # Forensics | None
trace.summary           # str — human-readable summary`}
      />

      <Heading level={3} id="run-id">
        .run_id
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Access the run ID directly after execution.
      </p>

      <CodeBlock
        language="python"
        code={`print(watcher.run_id)   # e.g. "run-abc12345"`}
      />

      <Heading level={2} id="argus-session">
        ArgusSession (without LangGraph)
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        For plain Python functions, Prefect, Temporal, or any non-LangGraph pipeline:
      </p>

      <CodeBlock
        language="python"
        code={`from argus import ArgusSession

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

      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Works with any Python callable. <code>ArgusWatcher</code> requires LangGraph 0.2+;{" "}
        <code>ArgusSession</code> has no framework dependency.
      </p>

      <Heading level={2} id="data-models">
        Data Models
      </Heading>

      <CodeBlock
        language="python"
        code={`# TraceStep — one node execution
class TraceStep:
    id: str
    step_number: int
    node_name: str
    input_state: dict
    output_state: dict
    duration_ms: int
    timestamp: datetime

# Detection — one detected issue
class Detection:
    id: str
    layer: str            # "statistical" | "semantic" | "behavioral" | "structural"
    severity: str         # "info" | "warning" | "critical"
    message: str
    details: dict
    step_id: str          # which step triggered this

# Forensics — root cause analysis
class Forensics:
    root_cause_step: str  # step ID of the root cause
    explanation: str      # human-readable explanation
    causal_chain: list    # ordered list of steps from cause to symptom
    detection_ids: list   # which detections this explains`}
      />

      <Callout type="info" title="Type hints">
        All data models are fully typed. Your IDE will give you autocomplete and type
        validation throughout.
      </Callout>
    </>
  );
}
