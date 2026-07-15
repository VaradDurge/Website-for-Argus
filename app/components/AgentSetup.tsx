"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, ChevronDown } from "lucide-react";

const AGENT_PROMPT = `I want to add ARGUS monitoring to my LangGraph pipeline. Before writing any code, audit my codebase and then integrate it properly.

STEP 1 — AUDIT MY PIPELINE

Find the file where my StateGraph is defined and check these things:

1. STATE TYPE: Find my state class. ARGUS works best when state is a TypedDict (or Pydantic model / dataclass). If my state is just a plain dict, convert it to a TypedDict with proper field annotations. Example:

# BAD — plain dict, ARGUS can't check field contracts
app = graph.compile()
result = app.invoke({"query": "...", "results": []})

# GOOD — TypedDict lets ARGUS verify fields between nodes
class AgentState(TypedDict):
    query: str
    results: list[str]
    summary: str

2. NODE RETURN TYPES: Check every node function. Each should:
  - Accept the state type as its first parameter (type-annotated)
  - Return a dict with only the fields it's responsible for
  - NOT return the entire state — just the fields it modifies

# BAD — no type hint, returns everything
def search(state):
    return {**state, "results": [...]}

# GOOD — typed, returns only what it produces
def search(state: AgentState) -> dict:
    return {"results": [...]}

3. GRAPH STRUCTURE: Check if the graph is:
  - Linear (A → B → C) — auto-finalize works, no extra code needed
  - Fan-out/fan-in (DAG) — auto-finalize works
  - Cyclic (has loops / back-edges) — will need watcher.finalize() after invoke

4. ASYNC CHECK: If node functions are async (async def), ARGUS handles both — just make sure you're using await app.ainvoke() not app.invoke().

5. EXTERNAL CALLS: List which nodes make external API calls (OpenAI, search APIs, databases). This determines whether to enable record_http.

Print a summary of what you found and any fixes needed before proceeding.

STEP 2 — FIX COMPATIBILITY ISSUES

If you found issues in Step 1, fix them now:
- Convert plain dict state to TypedDict with annotations
- Add type annotations to node function parameters
- Make nodes return only their output fields (not the full state)
- Ensure all fields referenced by downstream nodes exist in the TypedDict

STEP 3 — INTEGRATE ARGUS

Install with all features:

pip install argus-agents[all]

Or install only what you need:

pip install argus-agents                    # core only (zero dependencies)
pip install argus-agents[langgraph]         # + LangGraph adapter
pip install argus-agents[cli]               # + argus CLI commands
pip install argus-agents[llm]               # + LLM investigation & semantic judge
pip install argus-agents[langgraph,cli]     # LangGraph + CLI (no LLM features)

Add ArgusWatcher to the file where the graph is built:

from argus import ArgusWatcher

watcher = ArgusWatcher(graph)          # pass StateGraph before compile()
app = graph.compile()
result = app.invoke(initial_state)
print(watcher.run_id)

If the graph is already compiled elsewhere, use watch_compiled():

watcher = ArgusWatcher()
app = watcher.watch_compiled(app)
result = app.invoke(initial_state)

STEP 4 — PICK THE RIGHT CONFIG

Choose parameters based on what you found in the audit:

watcher = ArgusWatcher(graph,
    # --- Detection strictness ---
    strict=True,              # catches empty lists, nested errors, type mismatches

    # --- Semantic validators (custom per-node checks) ---
    validators={
        # example: ensure summaries aren't empty stubs
        "summarize": lambda o: (len(o.get("summary", "")) > 10, "Summary too short"),
        # wildcard: runs on every node
        "*": lambda o: ("error" not in o, "error key present"),
    },

    # --- LLM investigation (needs argus login) ---
    investigate=True,         # LLM root-cause analysis on failures (default: True)
                              # set to "always" to investigate every run, False to disable

    # --- LLM semantic judge (needs argus login) ---
    semantic_judge=True,      # LLM reviews every node's output for subtle issues (default: True)
    judge_model="gpt-4o",     # or "gpt-4o-mini" for cheaper runs

    # --- Deterministic rerun ---
    record_http=True,         # records every outbound API call (default: True)
                              # replays from disk on rerun — zero extra cost

    # --- Redaction (scrub sensitive fields from stored runs) ---
    redact_keys={"token", "api_key", "password"},    # exact field name match
    redact_patterns=True,                             # auto-detect emails, URLs, API keys
    # redact_functions={                              # custom per-field redaction
    #     "ssn": lambda v: "***-**-" + str(v)[-4:],
    # },

    # --- Output control ---
    max_field_size=50_000,    # max chars per field before truncation (default: 50k)
)

For production / high-throughput pipelines, use ArgusConfig:

from argus import ArgusWatcher, ArgusConfig

watcher = ArgusWatcher(graph,
    config=ArgusConfig(
        sample_rate=0.1,          # persist only 10% of clean runs (saves disk)
        persist_failures=True,    # but ALWAYS persist runs with failures (default: True)
        dry_run=False,            # set True to capture events without writing to disk
    ),
    validators={...},
)

If the graph has cycles (loops / back-edges), call finalize after invoke:

result = app.invoke(initial_state)
watcher.finalize()    # required for cyclic graphs, safe to call on any graph

After running the pipeline:

argus show last       # see what ARGUS caught
argus ui              # open the web dashboard
argus doctor          # check environment and optional deps`;

const STEPS = [
  { num: "1", label: "Copy the prompt" },
  { num: "2", label: "Paste into your AI" },
  { num: "3", label: "Pipeline monitored" },
];

function PromptLine({ line, num }: { line: string; num: number }) {
  const isHeading = line.startsWith("STEP ");
  const isComment = line.trimStart().startsWith("#") && !isHeading;
  const isCode =
    line.includes("import ") ||
    line.includes("pip install") ||
    line.includes("def ") ||
    line.includes("class ") ||
    line.includes("watcher =") ||
    line.includes("app =") ||
    line.includes("result =");

  let textClass = "text-[var(--text-muted)]";
  if (isHeading) textClass = "text-[var(--accent-soft)] font-medium";
  else if (isComment) textClass = "text-[var(--text-dim)]";
  else if (isCode) textClass = "text-[var(--signal-ok)]/80";

  return (
    <div className="prompt-line flex gap-3 px-3 sm:px-4 py-[1px] rounded-sm">
      <span className="hidden sm:inline-block w-6 text-right text-[var(--text-dim)]/40 select-none tabular-nums shrink-0">
        {num}
      </span>
      <span className={`${textClass} whitespace-pre-wrap break-words min-w-0`}>
        {line || "\u00A0"}
      </span>
    </div>
  );
}

export function AgentSetup() {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const copyRef = useRef<HTMLButtonElement>(null);

  const lines = AGENT_PROMPT.split("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(AGENT_PROMPT);
    setCopied(true);
    if (copyRef.current) {
      copyRef.current.classList.remove("copy-pulse");
      void copyRef.current.offsetWidth;
      copyRef.current.classList.add("copy-pulse");
    }
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <section id="agent-setup" className="relative py-24 lg:py-32 scroll-mt-20">
      <div className="mx-auto max-w-[960px] px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="eyebrow inline-block"
          >
            ▸ Zero-friction setup
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-5 text-[32px] sm:text-[42px] lg:text-[52px] leading-[1.1] tracking-[-0.03em] font-medium"
          >
            Let your{" "}
            <span className="font-serif-italic bg-gradient-to-r from-[var(--accent)] to-[var(--accent-soft)] bg-clip-text text-transparent">
              AI
            </span>{" "}
            set up Argus
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-[14px] sm:text-[16px] text-[var(--text-muted)] max-w-[480px] mx-auto leading-[1.6]"
          >
            Copy this prompt, paste it into Claude or ChatGPT, and it will
            audit your pipeline and wire up ARGUS automatically.
          </motion.p>
        </div>

        {/* 3-step row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex items-center justify-center gap-2 sm:gap-3 mb-8 font-mono text-[11px] sm:text-[12px]"
        >
          {STEPS.map((step, i) => (
            <div key={step.num} className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-[var(--border-strong)] text-[var(--accent-soft)] text-[10px]">
                  {step.num}
                </span>
                <span className="text-[var(--text-muted)]">{step.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <span className="text-[var(--text-dim)]/40 hidden sm:inline">
                  ———
                </span>
              )}
            </div>
          ))}
        </motion.div>

        {/* Prompt block */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="panel overflow-hidden"
        >
          {/* Header bar */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)]/50" />
              <span className="font-mono text-[11px] sm:text-[12px] text-[var(--text-dim)]">
                argus-setup.prompt
              </span>
              <span className="font-mono text-[10px] text-[var(--text-dim)]/40">
                {lines.length} lines
              </span>
            </div>

            <button
              ref={copyRef}
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--border)] text-[12px] font-mono text-[var(--text-muted)] hover:text-white hover:border-[var(--accent)]/40 transition-colors"
              aria-label="Copy setup prompt"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-[var(--signal-ok)]" />
                  <span className="text-[var(--signal-ok)]">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy prompt</span>
                </>
              )}
            </button>
          </div>

          {/* Prompt content */}
          <div className="relative">
            <div
              className={`font-mono text-[11px] sm:text-[12px] leading-[1.7] py-3 transition-[max-height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                expanded
                  ? "max-h-[600px] overflow-y-auto"
                  : "max-h-[260px] sm:max-h-[300px] overflow-hidden"
              }`}
            >
              {lines.map((line, i) => (
                <PromptLine key={i} line={line} num={i + 1} />
              ))}
            </div>

            {/* Fade overlay when collapsed */}
            <AnimatePresence>
              {!expanded && (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to bottom, transparent, var(--surface))",
                  }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Expand toggle */}
          <div className="flex justify-center py-3 border-t border-[var(--border)]">
            <button
              onClick={() => setExpanded((p) => !p)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[12px] font-mono text-[var(--text-dim)] hover:text-[var(--text-muted)] transition-colors"
            >
              {expanded ? "Collapse" : "Show full prompt"}
              <motion.span
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="inline-flex"
              >
                <ChevronDown size={12} />
              </motion.span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
