import { Heading } from "../components/Heading";
import { Callout } from "../components/Callout";
import { CodeBlock } from "../components/CodeBlock";
import { StepList } from "../components/StepList";
import { VideoPlaceholder } from "../components/VideoPlaceholder";
import Link from "next/link";

export default function Quickstart() {
  return (
    <>
      <Heading level={2} id="how-to-use">
        How to use ARGUS
      </Heading>
      <StepList
        steps={[
          {
            title: "Install",
            content: <p><code>pip install argus-agents</code></p>,
          },
          {
            title: "Init",
            content: (
              <p>
                <code>argus init</code> — writes{" "}
                <code>.cursor/skills/argus-debug/</code> and{" "}
                <code>.claude/skills/argus-debug/</code>. Commit them. The skill
                already contains the setup prompt.
              </p>
            ),
          },
          {
            title: "Attach",
            content: (
              <p>
                Ask your editor agent to wire ARGUS. (The skill already
                contains this AI setup prompt; the homepage copy is just a
                fallback.) <code>ArgusWatcher.attach(graph)</code>
              </p>
            ),
          },
          {
            title: "Run",
            content: (
              <p>
                Same as always. Failures print <code>[argus]</code> in the
                terminal; clean runs stay silent.
              </p>
            ),
          },
          {
            title: "Inspect",
            content: (
              <p>
                <code>argus show last</code>, <code>argus fix &lt;id&gt;</code>,
                or <code>argus ui</code>
              </p>
            ),
          },
        ]}
      />
      <Callout type="info" title="Optional — smarter detection">
        Run <code>argus key set</code> if you want the LLM judge. Skip it and you still get
        heuristics.
      </Callout>

      <Heading level={2} id="prerequisites">
        Prerequisites
      </Heading>
      <Callout type="info" title="Requirements">
        <ul className="space-y-1 mt-1">
          <li>Python 3.9 or higher</li>
          <li>pip (or any Python package manager)</li>
          <li>A LangGraph pipeline (or any Python callable to test with)</li>
        </ul>
      </Callout>

      <Heading level={2} id="installation">
        Installation
      </Heading>
      <CodeBlock language="bash" code={`pip install argus-agents`} />
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        This is the full product — the <code>argus</code> CLI, the LangGraph adapter, and the
        local UI (<code>argus ui</code>). No account, no config files, no cloud: ARGUS runs fully
        local, runs are stored in <code>.argus/runs/</code>, and heuristic detection works out
        of the box. LLM-powered features stay optional: run{" "}
        <code>argus key set</code> when you want the semantic judge.
      </p>

      <Heading level={2} id="bring-your-own-key">
        Bring Your Own Key (BYOK)
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        AI-powered detection (semantic judge, LLM investigator, learned trends) uses your own
        key from the provider of your choice — OpenAI, Anthropic (Claude), or Google (Gemini).
        Set it once — it&apos;s saved locally and reused every session. No key is fine too:
        ARGUS falls back to heuristic-only detection.
      </p>
      <CodeBlock
        language="bash"
        code={`argus key set                       # OpenAI by default — prompts (hidden), saved to ~/.argus/config.json
argus key set --provider anthropic  # or Anthropic / --provider google for Gemini
# or an env var:  export OPENAI_API_KEY=sk-...  (ANTHROPIC_API_KEY / GEMINI_API_KEY)

argus key use anthropic   # switch active provider   ·   argus doctor  # confirm mode`}
      />

      <Heading level={2} id="instrument-your-graph">
        Setup — Pick Whichever Fits Your Code
      </Heading>

      <Heading level={3} id="option-a">
        One call — attach (recommended)
      </Heading>
      <CodeBlock
        language="python"
        code={`from argus import ArgusWatcher

watcher = ArgusWatcher()
app = watcher.attach(graph)         # StateGraph or already-compiled app
result = app.invoke(initial_state)  # run is persisted automatically
print(watcher.run_id)`}
      />

      <Heading level={3} id="option-b">
        Constructor form
      </Heading>
      <CodeBlock
        language="python"
        code={`from argus import ArgusWatcher

watcher = ArgusWatcher(graph)       # uncompiled StateGraph
app = graph.compile()
result = app.invoke(initial_state)  # persisted automatically`}
      />

      <p className="mt-4 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Both work. No changes to your node functions.
      </p>

      <Callout type="info" title="finalize() is optional">
        <code>attach()</code> wraps <code>invoke()</code> / <code>ainvoke()</code> so the run is
        written when the call returns — including cyclic graphs.{" "}
        <code>watcher.finalize()</code> is an optional idempotent flush, not required.
      </Callout>

      <Heading level={2} id="run-your-pipeline">
        Full Example
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Here&apos;s a complete example — a simple LangGraph pipeline with ARGUS instrumentation:
      </p>

      <CodeBlock
        language="python"
        filename="example.py"
        showLineNumbers
        highlights={[1, 13, 14]}
        code={`from argus import ArgusWatcher
from langgraph.graph import StateGraph

# 1. Define your graph (your existing code)
graph = StateGraph(AgentState)
graph.add_node("agent", call_model)
graph.add_node("tools", tool_node)
# ... add edges ...

# 2. Attach ARGUS and run
watcher = ArgusWatcher()
app = watcher.attach(graph)
result = app.invoke(initial_state)
# persisted automatically`}
      />

      <Heading level={2} id="view-results">
        View Results
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        After your run completes, you can view results in several ways:
      </p>

      <CodeBlock
        language="bash"
        code={`# List all runs
argus list

# View the most recent run
argus show last

# View a specific run by ID (or 8-char prefix)
argus show run abc12345

# Launch the web dashboard
argus ui`}
      />

      <VideoPlaceholder
        title="Running argus show and viewing results in the terminal"
        caption="Quick walkthrough of the ARGUS CLI trace viewer"
      />

      <Heading level={2} id="next-steps">
        Next Steps
      </Heading>
      <ul className="mt-3 space-y-2 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        <li>
          <Link href="/docs/core-concepts" className="text-[var(--accent-soft)] underline decoration-dotted underline-offset-2 hover:text-[var(--ink)] hover:decoration-solid">
            Core Concepts
          </Link>{" "}
          — understand Watchers, Detectors, Traces, and Forensics
        </li>
        <li>
          <Link href="/docs/configuration" className="text-[var(--accent-soft)] underline decoration-dotted underline-offset-2 hover:text-[var(--ink)] hover:decoration-solid">
            Configuration
          </Link>{" "}
          — customize detection sensitivity, enable semantic judging, configure storage
        </li>
        <li>
          <Link href="/docs/cli-reference" className="text-[var(--accent-soft)] underline decoration-dotted underline-offset-2 hover:text-[var(--ink)] hover:decoration-solid">
            CLI Reference
          </Link>{" "}
          — all available commands and flags
        </li>
      </ul>
    </>
  );
}
