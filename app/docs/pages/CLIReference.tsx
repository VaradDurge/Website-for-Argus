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
        The ARGUS CLI is your interface for viewing traces, replaying executions, generating reports,
        and managing your workspace. Install it with <code>pip install argus-agents</code> — the
        CLI ships with the Python package.
      </p>

      <CodeBlock
        language="bash"
        code={`# Check installation
argus --version

# Get help on any command
argus --help
argus watch --help`}
      />

      <Heading level={2} id="argus-watch">
        argus watch
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Start a watched execution from the CLI. This runs a Python script with ARGUS instrumentation
        attached automatically.
      </p>

      <CodeBlock
        language="bash"
        code={`# Watch a script execution
argus watch run.py

# Watch with strict mode (fail on detection)
argus watch run.py --strict

# Watch with custom config
argus watch run.py --config custom-argus.yaml`}
      />

      <ParamTable
        groups={[
          {
            label: "Flags",
            params: [
              {
                name: "--strict",
                type: "flag",
                description: "Exit with non-zero code if any detection fires. Useful for CI/CD.",
              },
              {
                name: "--config",
                type: "path",
                default: '"argus.yaml"',
                description: "Path to config file. Overrides auto-discovery.",
              },
              {
                name: "--no-persist",
                type: "flag",
                description: "Don't save the trace to storage. Useful for quick checks.",
              },
              {
                name: "--verbose",
                type: "flag",
                description: "Print detection results to stdout as they run.",
              },
            ],
          },
        ]}
      />

      <Heading level={2} id="argus-trace">
        argus trace
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        View and inspect execution traces.
      </p>

      <CodeBlock
        language="bash"
        code={`# View the most recent trace
argus trace --last

# View a specific trace by ID
argus trace abc123def

# List all stored traces
argus trace --list

# List traces with detections only
argus trace --list --failed

# Show trace with full state dumps
argus trace --last --verbose`}
      />

      <ParamTable
        groups={[
          {
            label: "Flags",
            params: [
              {
                name: "--last",
                type: "flag",
                description: "Show the most recent trace.",
              },
              {
                name: "--list",
                type: "flag",
                description: "List all stored traces with summary info.",
              },
              {
                name: "--failed",
                type: "flag",
                description: "Filter to only traces that have detections.",
              },
              {
                name: "--verbose",
                type: "flag",
                description: "Include full state snapshots at each step.",
              },
              {
                name: "--json",
                type: "flag",
                description: "Output as JSON for programmatic use.",
              },
            ],
          },
        ]}
      />

      <Heading level={2} id="argus-replay">
        argus replay
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Re-execute a pipeline from a specific step in a saved trace. This lets you test fixes
        without re-running the entire pipeline from scratch.
      </p>

      <CodeBlock
        language="bash"
        code={`# Replay the last trace from step 3
argus replay --last --from-step 3

# Replay a specific trace from a named node
argus replay abc123 --from-node "retriever"

# Replay with modified input state
argus replay abc123 --from-step 2 --patch '{"query": "updated question"}'`}
      />

      <ParamTable
        groups={[
          {
            label: "Flags",
            params: [
              {
                name: "--from-step",
                type: "int",
                description: "Step number to replay from (1-indexed).",
              },
              {
                name: "--from-node",
                type: "str",
                description: "Node name to replay from.",
              },
              {
                name: "--patch",
                type: "json",
                description: "JSON patch to apply to the input state at the replay point.",
              },
              {
                name: "--last",
                type: "flag",
                description: "Use the most recent trace.",
              },
              {
                name: "--diff",
                type: "flag",
                description: "Show a diff between original and replayed outputs.",
              },
            ],
          },
        ]}
      />

      <Callout type="info" title="Replay requires persist_state">
        Replay only works on traces that were recorded with <code>persist_state=True</code>{" "}
        (the default). If state persistence was disabled, ARGUS doesn&apos;t have the intermediate
        states needed to replay.
      </Callout>

      <Heading level={2} id="argus-report">
        argus report
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Generate a formatted report from a trace.
      </p>

      <CodeBlock
        language="bash"
        code={`# HTML report (opens in browser)
argus report --last --format html

# JSON report (for CI/CD)
argus report --last --format json

# Markdown report
argus report --last --format markdown --output report.md`}
      />

      <ParamTable
        groups={[
          {
            label: "Flags",
            params: [
              {
                name: "--format",
                type: "str",
                default: '"html"',
                description: "Output format: html, json, or markdown.",
              },
              {
                name: "--output",
                type: "path",
                description: "Write report to a file instead of stdout/browser.",
              },
              {
                name: "--last",
                type: "flag",
                description: "Use the most recent trace.",
              },
            ],
          },
        ]}
      />

      <Heading level={2} id="argus-login">
        argus login
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Authenticate with the ARGUS cloud workspace. Required for syncing traces to the
        cloud dashboard and team collaboration features.
      </p>

      <CodeBlock
        language="bash"
        code={`# Interactive login (opens browser)
argus login

# Login with an API key
argus login --key YOUR_API_KEY`}
      />

      <Heading level={2} id="argus-ui">
        argus ui
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Launch the local ARGUS dashboard in your browser. The UI provides a visual trace explorer,
        detection timeline, and replay interface.
      </p>

      <CodeBlock
        language="bash"
        code={`# Launch on default port (8484)
argus ui

# Launch on a custom port
argus ui --port 9090`}
      />

      <Heading level={2} id="argus-update">
        argus update
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Check for and install ARGUS updates.
      </p>

      <CodeBlock
        language="bash"
        code={`# Check for updates
argus update --check

# Update to latest
argus update`}
      />
    </>
  );
}
