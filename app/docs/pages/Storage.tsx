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
        ARGUS stores all run data locally in <code>.argus/runs/</code> inside your project
        directory. No external database required, no cloud dependency for core functionality.
      </p>

      <Heading level={2} id="what-gets-stored">
        What Gets Stored
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Each pipeline execution creates a run record containing:
      </p>
      <ul className="mt-3 space-y-1.5 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        <li>Node inputs and outputs at each step</li>
        <li>Timing data per node</li>
        <li>Detection results from all four layers</li>
        <li>Forensic analysis (root cause, causal chain)</li>
        <li>Recorded HTTP calls (when <code>record_http=True</code>)</li>
      </ul>

      <Heading level={2} id="persist-state">
        Controlling Storage
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Storage is on by default. To disable it for ephemeral monitoring:
      </p>

      <CodeBlock
        language="python"
        code={`watcher = ArgusWatcher(graph, persist_state=False)`}
      />

      <Callout type="warning" title="Replay requires persist_state">
        Replay only works on runs recorded with <code>persist_state=True</code>{" "}
        (the default). Without stored state, ARGUS doesn&apos;t have the intermediate data
        needed to replay from a specific node.
      </Callout>

      <Heading level={2} id="http-recording">
        HTTP Recording
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        All external HTTP calls (OpenAI, search tools, databases) are{" "}
        <span className="text-white font-medium">recorded by default</span>. Every API response
        is saved to disk alongside the run. During replay, the recorded responses are served back —
        same data, zero extra cost, fully reproducible.
      </p>

      <CodeBlock
        language="python"
        code={`# Disable HTTP recording for lightweight monitoring
watcher = ArgusWatcher(graph, record_http=False)`}
      />

      <Heading level={2} id="redaction">
        Redaction
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        ARGUS captures full state at every step. Use <code>redact_keys</code> to scrub sensitive
        fields from stored outputs:
      </p>

      <CodeBlock
        language="python"
        code={`watcher = ArgusWatcher(
    graph,
    redact_keys={"api_key", "token", "password", "authorization"},
)`}
      />

      <Callout type="warning" title="Security">
        Without redaction, API keys and secrets will appear in your stored runs.
        Always add sensitive field names to <code>redact_keys</code> before using ARGUS
        with production credentials.
      </Callout>

      <Heading level={2} id="viewing-runs">
        Viewing Runs
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Access stored runs through the CLI or the web dashboard:
      </p>

      <CodeBlock
        language="bash"
        code={`# List all runs
argus list

# View the most recent run
argus show last

# View a specific run by ID (or 8-char prefix)
argus show run abc12345

# Inspect raw input/output for a specific node
argus inspect <id> --step <node>

# Launch the web dashboard
argus ui`}
      />

      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        The web dashboard at <code>http://localhost:7842</code> serves runs from{" "}
        <code>.argus/runs/</code> in your current directory — no account needed.
      </p>

      <Heading level={2} id="programmatic-access">
        Programmatic Access
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Access trace data directly from Python:
      </p>

      <CodeBlock
        language="python"
        code={`trace = watcher.get_trace()

trace.id                # unique trace identifier
trace.status            # "ok" | "warning" | "failed"
trace.duration_ms       # total execution time
trace.steps             # list[TraceStep]
trace.detections        # list[Detection]
trace.forensics         # Forensics | None
trace.summary           # human-readable summary`}
      />
    </>
  );
}
