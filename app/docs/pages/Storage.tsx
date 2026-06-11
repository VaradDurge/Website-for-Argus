import { Heading } from "../components/Heading";
import { Callout } from "../components/Callout";
import { CodeBlock } from "../components/CodeBlock";

export default function Storage() {
  return (
    <>
      <Heading level={2} id="overview">
        Overview
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        ARGUS stores all trace data locally in a SQLite database at <code>.argus/traces.db</code>{" "}
        by default. This keeps everything self-contained — no external database required, no
        cloud dependency for core functionality.
      </p>

      <Heading level={2} id="sqlite-schema">
        SQLite Schema
      </Heading>

      <Heading level={3} id="trace-storage">
        Trace Storage
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Each pipeline execution creates one trace record with associated step records.
      </p>

      <CodeBlock
        language="text"
        filename="schema"
        code={`traces
├── id              TEXT PRIMARY KEY
├── created_at      TIMESTAMP
├── pipeline_name   TEXT
├── status          TEXT (ok | warning | failed)
├── duration_ms     INTEGER
├── node_count      INTEGER
├── detection_count INTEGER
└── metadata        JSON

trace_steps
├── id              TEXT PRIMARY KEY
├── trace_id        TEXT REFERENCES traces(id)
├── step_number     INTEGER
├── node_name       TEXT
├── input_state     JSON
├── output_state    JSON
├── duration_ms     INTEGER
├── timestamp       TIMESTAMP
└── metadata        JSON`}
      />

      <Heading level={3} id="detection-storage">
        Detection Storage
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Detection results are stored separately, linked to both the trace and the specific
        step that triggered them.
      </p>

      <CodeBlock
        language="text"
        filename="schema"
        code={`detections
├── id              TEXT PRIMARY KEY
├── trace_id        TEXT REFERENCES traces(id)
├── step_id         TEXT REFERENCES trace_steps(id)
├── layer           TEXT (statistical | semantic | behavioral | structural)
├── severity        TEXT (info | warning | critical)
├── message         TEXT
├── details         JSON
└── created_at      TIMESTAMP

forensics
├── id              TEXT PRIMARY KEY
├── trace_id        TEXT REFERENCES traces(id)
├── root_cause_step TEXT REFERENCES trace_steps(id)
├── detection_ids   JSON (array of detection IDs)
├── explanation     TEXT
├── causal_chain    JSON
└── created_at      TIMESTAMP`}
      />

      <Heading level={2} id="querying">
        Querying Data
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        You can query traces programmatically through the Python API or directly via SQLite.
      </p>

      <CodeBlock
        language="python"
        code={`from argus import ArgusWatcher

# Get the most recent trace
watcher = ArgusWatcher()
trace = watcher.get_trace()

# Access trace data
print(trace.id)
print(trace.status)           # "ok", "warning", or "failed"
print(trace.duration_ms)
print(trace.detection_count)

# Iterate over steps
for step in trace.steps:
    print(f"{step.node_name}: {step.duration_ms}ms")

# Access detections
for detection in trace.detections:
    print(f"[{detection.layer}] {detection.message}")

# Access forensics
if trace.forensics:
    print(trace.forensics.explanation)
    print(trace.forensics.causal_chain)`}
      />

      <Callout type="info" title="Direct SQLite access">
        You can also query <code>.argus/traces.db</code> directly with any SQLite client. The schema
        is stable across minor versions — ARGUS uses migrations to evolve it without breaking queries.
      </Callout>

      <Heading level={2} id="export">
        Export Formats
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Export trace data for integration with external tools:
      </p>

      <CodeBlock
        language="bash"
        code={`# Export as JSON
argus report --last --format json --output trace.json

# Export as HTML report
argus report --last --format html --output trace.html

# Export as Markdown
argus report --last --format markdown --output trace.md`}
      />

      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        JSON exports include the full trace data including all steps, detections, and forensic
        analysis. Use this for CI/CD integration or feeding into your own analysis pipelines.
      </p>
    </>
  );
}
