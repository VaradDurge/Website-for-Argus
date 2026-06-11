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
        The main class for instrumenting and monitoring pipeline executions. Import from the
        top-level package:
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
                name: "strict",
                type: "bool",
                default: "False",
                description: "Raise an exception during finalize() if any detector fires.",
              },
              {
                name: "investigate",
                type: 'bool | "always"',
                default: "True",
                description: 'Run forensic analysis on detected failures. "always" runs forensics even without detections.',
              },
              {
                name: "max_field_size",
                type: "int",
                default: "50_000",
                description: "Maximum characters per captured state field before truncation.",
              },
              {
                name: "redact_keys",
                type: "list[str] | None",
                default: "None",
                description: "Field names to redact from traces. Supports glob patterns (e.g., \"*.secret\").",
              },
              {
                name: "validators",
                type: "dict | None",
                default: "None",
                description: "Custom validation functions keyed by field name. fn(value) → bool.",
              },
              {
                name: "persist_state",
                type: "bool",
                default: "True",
                description: "Save full state at each step for replay capability.",
              },
              {
                name: "record_http",
                type: "bool",
                default: "False",
                description: "Record HTTP requests made during execution for mocked replay.",
              },
              {
                name: "semantic_judge",
                type: "bool",
                default: "False",
                description: "Enable LLM-as-judge semantic evaluation.",
              },
              {
                name: "judge_model",
                type: "str",
                default: '"gpt-4o"',
                description: "Model to use for semantic judging.",
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
        Instrument a graph for monitoring. Must be called before <code>graph.compile()</code>.
      </p>

      <CodeBlock
        language="python"
        code={`watcher.watch(graph: StateGraph) -> None`}
      />

      <ParamTable
        groups={[
          {
            label: "Parameters",
            params: [
              {
                name: "graph",
                type: "StateGraph",
                description: "The LangGraph StateGraph instance to instrument. ARGUS patches the graph's node callbacks to intercept execution data.",
              },
            ],
          },
        ]}
      />

      <Callout type="warning">
        Call <code>watch()</code> before <code>graph.compile()</code>. If you compile first,
        ARGUS won&apos;t be able to instrument the nodes.
      </Callout>

      <Heading level={3} id="finalize">
        .finalize()
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Complete the trace, run all detection layers, execute forensic analysis if needed, and
        persist results to storage.
      </p>

      <CodeBlock
        language="python"
        code={`watcher.finalize() -> Trace`}
      />

      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Returns the completed <code>Trace</code> object. If <code>strict=True</code> and any
        detections fire, raises <code>DetectionError</code> after storing the trace.
      </p>

      <Heading level={3} id="get-trace">
        .get_trace()
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Retrieve the trace after finalization. Returns the same object as <code>finalize()</code>.
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
        All data models are fully typed with Python type hints. If you&apos;re using an IDE with
        type checking, you&apos;ll get autocomplete and type validation throughout.
      </Callout>
    </>
  );
}
