import { Heading } from "../components/Heading";
import { Callout } from "../components/Callout";
import { CodeBlock } from "../components/CodeBlock";
import { ParamTable } from "../components/ParamTable";

export default function CLIReference() {
  return (
    <>
      <Heading level={2} id="overview">
        Overview
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        The ARGUS CLI is your interface for viewing runs, replaying executions, generating reports,
        and managing your workspace. Install it with <code>pip install argus-agents</code> — the
        CLI ships with the Python package.
      </p>

      <CodeBlock
        language="bash"
        code={`argus list                          # all runs
argus show last                     # most recent run
argus show run <id>                 # by full id or 8-char prefix
argus replay <id> <node>            # re-run from a node
argus replay <id> <node> --only     # re-run just that one node
argus inspect <id> --step <node>    # raw input/output for a node
argus diff <id>                     # rerun vs original
argus diff <id-a> <id-b>            # any two runs
argus ui                            # open web dashboard
argus doctor                        # check your setup
argus login                         # sign in for cloud sync
argus logout                        # clear credentials
argus whoami                        # check login status
argus update                        # check for new release`}
      />

      <Heading level={2} id="argus-list">
        argus list
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        List all stored runs.
      </p>

      <CodeBlock
        language="bash"
        code={`# List all runs
argus list`}
      />

      <Heading level={2} id="argus-show">
        argus show
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        View a specific run in your terminal. Shows the full trace with node statuses,
        timing, detections, and root cause analysis.
      </p>

      <CodeBlock
        language="bash"
        code={`# View the most recent run
argus show last

# View a specific run by ID (full or 8-char prefix)
argus show run abc12345`}
      />

      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Example output:
      </p>

      <CodeBlock
        language="text"
        code={`argus  run-abc12345  ·  2024-04-05 12:30  ·  1243 ms
status  ●  silent_failure

   1  fetch       43 ms    ✓  pass
   2  validate    12 ms    ⚠  silent failure
      └─  Field "score" is missing
      └─  process received bad state
   3  process    891 ms    ✗  crashed
      └─  KeyError: 'score'
      └─  Field 'score' was absent from the incoming state

root cause   validate`}
      />

      <Heading level={3} id="node-statuses">
        Node Statuses
      </Heading>
      <ul className="mt-3 space-y-1.5 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        <li><code className="text-[var(--signal-ok)]">✓</code> — pass</li>
        <li><code className="text-[var(--signal-warn)]">~</code> — pass with warnings (empty optional fields)</li>
        <li><code className="text-[var(--signal-warn)]">⚠</code> — silent failure (missing required fields)</li>
        <li><code className="text-[var(--signal-fail)]">⊗</code> — semantic fail (validator returned False)</li>
        <li><code className="text-[var(--text-muted)]">⏸</code> — interrupted (human-in-the-loop pause)</li>
        <li><code className="text-[var(--signal-fail)]">✗</code> — crashed</li>
      </ul>

      <Heading level={2} id="argus-inspect">
        argus inspect
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        View the raw input/output state for a specific node in a run.
      </p>

      <CodeBlock
        language="bash"
        code={`# Inspect a specific node's raw data
argus inspect <id> --step <node>`}
      />

      <Heading level={2} id="argus-replay">
        argus replay
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Re-execute a pipeline from a specific node. ARGUS restores the exact state at that node
        from disk and runs from there. Upstream outputs stay frozen — only the target node onward
        re-executes with your fixed code.
      </p>

      <CodeBlock
        language="bash"
        code={`# Replay from a specific node
argus replay <run-id> node_7

# Re-run just one node in isolation
argus replay <run-id> node_7 --only`}
      />

      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        All external HTTP calls (OpenAI, search tools, databases) are recorded by default.
        During replay, the recorded responses are served back — same data, zero extra cost,
        fully reproducible.
      </p>

      <Callout type="info" title="Replay requires persist_state">
        Replay only works on runs recorded with <code>persist_state=True</code>{" "}
        (the default). If state persistence was disabled, ARGUS doesn&apos;t have the intermediate
        states needed to replay.
      </Callout>

      <Heading level={2} id="argus-diff">
        argus diff
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Compare two runs side by side. When a replay finishes, ARGUS automatically compares it
        against the original using an LLM — showing per-node diffs of what changed, what improved,
        and whether the fix actually worked.
      </p>

      <CodeBlock
        language="bash"
        code={`# Compare a rerun against its original
argus diff <rerun-id>

# Compare any two runs
argus diff <id-a> <id-b>`}
      />

      <Heading level={2} id="argus-ui">
        argus ui
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Launch the local web dashboard in your browser. Serves runs from{" "}
        <code>.argus/runs/</code> in your current directory — no account needed.
      </p>

      <CodeBlock
        language="bash"
        code={`# Launch the dashboard
argus ui`}
      />

      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Opens at <code>http://localhost:7842</code>. The UI includes:
      </p>
      <ul className="mt-3 space-y-1.5 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        <li>Runs List — all stored runs with status, timing, and detection counts</li>
        <li>Run Detail — node-by-node trace with inputs, outputs, and detections</li>
        <li>Compare Runs — side-by-side diff between any two runs</li>
        <li>Approvals — review and approve AI-discovered failure signatures</li>
        <li>Report Board — submit diagnostic reports for bugs or issues</li>
        <li>Settings — configure Linear integration and cloud sync</li>
      </ul>

      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        From the Run Detail page, hover any step and click <code>↺ Rerun From Here</code> to
        trigger a replay. After rerun, the diff view opens automatically.
      </p>

      <Heading level={2} id="argus-doctor">
        argus doctor
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Diagnose setup issues. Checks Python version, LangGraph compatibility, storage health,
        rerun readiness, and optional dependencies.
      </p>

      <CodeBlock
        language="bash"
        code={`argus doctor`}
      />

      <CodeBlock
        language="text"
        code={`✓  python           Python 3.9.6
✓  langgraph        langgraph 0.6.11
✓  storage          312 runs stored, all healthy
✓  replay           all 7 node functions importable for rerun
✓  optional deps    openai (key set), dotenv`}
      />

      <Heading level={2} id="argus-login">
        argus login / logout / whoami
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Manage authentication for cloud sync features (shared signatures, team collaboration).
      </p>

      <CodeBlock
        language="bash"
        code={`# Sign in for cloud sync
argus login

# Clear credentials
argus logout

# Check login status
argus whoami`}
      />

      <Heading level={2} id="argus-update">
        argus update
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Check for and install ARGUS updates.
      </p>

      <CodeBlock
        language="bash"
        code={`# Check for a new release
argus update`}
      />
    </>
  );
}
