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
        Instrument Your Graph
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Wrap your LangGraph pipeline with ARGUS in three lines:
      </p>

      <StepList
        steps={[
          {
            title: "Import and create a watcher",
            content: (
              <CodeBlock
                language="python"
                code={`from argus import ArgusWatcher

watcher = ArgusWatcher()`}
              />
            ),
          },
          {
            title: "Attach it to your graph",
            content: (
              <>
                <p className="mb-2">
                  Call <code>watch()</code> before compiling. ARGUS hooks into the graph&apos;s
                  execution callbacks automatically.
                </p>
                <CodeBlock
                  language="python"
                  code={`watcher.watch(graph)
app = graph.compile()`}
                />
              </>
            ),
          },
          {
            title: "Run and finalize",
            content: (
              <>
                <p className="mb-2">
                  Run your pipeline normally. When it&apos;s done, call <code>finalize()</code> to
                  trigger detection and generate the trace.
                </p>
                <CodeBlock
                  language="python"
                  code={`result = app.invoke({"messages": [("user", "What's the weather?")]})
watcher.finalize()`}
                />
              </>
            ),
          },
        ]}
      />

      <Heading level={2} id="run-your-pipeline">
        Run Your Pipeline
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Here&apos;s a complete example — a simple LangGraph pipeline with ARGUS instrumentation:
      </p>

      <CodeBlock
        language="python"
        filename="example.py"
        showLineNumbers
        highlights={[1, 4, 5, 11]}
        code={`from argus import ArgusWatcher
from langgraph.graph import StateGraph

# 1. Create the watcher
watcher = ArgusWatcher()

# 2. Define your graph (your existing code)
graph = StateGraph(AgentState)
graph.add_node("agent", call_model)
graph.add_node("tools", tool_node)
# ... add edges ...

# 3. Instrument and run
watcher.watch(graph)
app = graph.compile()
result = app.invoke(initial_state)

# 4. Finalize — triggers detection
watcher.finalize()`}
      />

      <Callout type="warning" title="Important">
        Always call <code>watcher.finalize()</code> after your pipeline completes. This is what
        triggers the detection layers and generates the trace. If you skip it, ARGUS collects
        raw data but doesn&apos;t analyze it.
      </Callout>

      <Heading level={2} id="view-results">
        View Results
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        After <code>finalize()</code>, you can view results in several ways:
      </p>

      <CodeBlock
        language="bash"
        code={`# View the latest trace in your terminal
argus trace --last

# Launch the replay UI
argus ui

# Generate a report
argus report --format html`}
      />

      <VideoPlaceholder
        title="Running argus trace and viewing results in the terminal"
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
