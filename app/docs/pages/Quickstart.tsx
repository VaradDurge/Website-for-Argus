import { Heading } from "../components/Heading";
import { Callout } from "../components/Callout";
import { CodeBlock } from "../components/CodeBlock";
import { StepList } from "../components/StepList";
import { VideoPlaceholder } from "../components/VideoPlaceholder";
import Link from "next/link";

export default function Quickstart() {
  return (
    <>
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
      <CodeBlock language="bash" code="pip install argus-agents" />
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        That&apos;s it. No extra dependencies, no config files needed to start. ARGUS ships with
        sensible defaults that work out of the box.
      </p>

      <Heading level={2} id="instrument-your-graph">
        Setup — Pick Whichever Fits Your Code
      </Heading>

      <Heading level={3} id="option-a">
        Option A — Pass graph to constructor (recommended)
      </Heading>
      <CodeBlock
        language="python"
        code={`from argus import ArgusWatcher

watcher = ArgusWatcher(graph)      # attaches monitoring automatically
app = graph.compile()
result = app.invoke(initial_state) # run auto-saves when the last node finishes
print(watcher.run_id)              # access the run ID directly`}
      />

      <Heading level={3} id="option-b">
        Option B — Separate watch call
      </Heading>
      <CodeBlock
        language="python"
        code={`from argus import ArgusWatcher

watcher = ArgusWatcher()
watcher.watch(graph)       # before graph.compile()
app = graph.compile()
result = app.invoke(initial_state)`}
      />

      <Heading level={3} id="option-c">
        Option C — After compile
      </Heading>
      <CodeBlock
        language="python"
        code={`from argus import ArgusWatcher

watcher = ArgusWatcher()
app = graph.compile(checkpointer=memory)
app = watcher.watch_compiled(app)   # works on already-compiled graphs
result = app.invoke(initial_state)`}
      />

      <p className="mt-4 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        All three work. No changes to your node functions.
      </p>

      <Callout type="info" title="When is finalize() needed?">
        Runs are saved automatically for linear and fan-out/fan-in graphs. Only cyclic graphs
        (with back-edges) need a manual <code>watcher.finalize()</code> call.
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
        highlights={[1, 4, 11]}
        code={`from argus import ArgusWatcher
from langgraph.graph import StateGraph

# 1. Create the watcher with graph (recommended)
watcher = ArgusWatcher(graph)

# 2. Define your graph (your existing code)
graph = StateGraph(AgentState)
graph.add_node("agent", call_model)
graph.add_node("tools", tool_node)
# ... add edges ...

# 3. Compile and run
app = graph.compile()
result = app.invoke(initial_state)

# Run auto-saves for linear/fan-out graphs
# For cyclic graphs, call watcher.finalize()`}
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
          <Link href="/docs/core-concepts" className="text-[var(--accent-soft)] underline decoration-dotted underline-offset-2 hover:text-white hover:decoration-solid">
            Core Concepts
          </Link>{" "}
          — understand Watchers, Detectors, Traces, and Forensics
        </li>
        <li>
          <Link href="/docs/configuration" className="text-[var(--accent-soft)] underline decoration-dotted underline-offset-2 hover:text-white hover:decoration-solid">
            Configuration
          </Link>{" "}
          — customize detection sensitivity, enable semantic judging, configure storage
        </li>
        <li>
          <Link href="/docs/cli-reference" className="text-[var(--accent-soft)] underline decoration-dotted underline-offset-2 hover:text-white hover:decoration-solid">
            CLI Reference
          </Link>{" "}
          — all available commands and flags
        </li>
      </ul>
    </>
  );
}
