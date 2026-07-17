import { Heading } from "../components/Heading";
import { Callout } from "../components/Callout";
import { CodeBlock } from "../components/CodeBlock";
import { ParamTable } from "../components/ParamTable";

export default function Configuration() {
  return (
    <>
      <Heading level={2} id="constructor">
        Constructor Parameters
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Everything is optional. Pass to the <code>ArgusWatcher</code> constructor to customize
        behavior per run.
      </p>

      <ParamTable
        groups={[
          {
            label: "Core",
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
                description: "Max characters per field before truncation in stored outputs.",
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
            ],
          },
          {
            label: "Security",
            params: [
              {
                name: "redact_keys",
                type: "set[str]",
                default: "None",
                description: 'Field names to redact from stored outputs (e.g. {"password", "api_key"}).',
              },
              {
                name: "validators",
                type: "dict",
                default: "None",
                description: 'Per-node semantic validators. Use "*" as key to run on every node. Each validator is a (bool, str) callable.',
              },
            ],
          },
          {
            label: "Latency",
            params: [
              {
                name: "node_timeout_ms",
                type: "float | None",
                default: "None",
                description: "Flag nodes that take ≥95% of this value as timeout-adjacent (likely truncated output). Pass via ArgusConfig.",
              },
              {
                name: "min_expected_ms",
                type: "float | None",
                default: "None",
                description: "Flag LLM nodes completing faster than this as suspiciously fast (likely cached/stale). Pass via ArgusConfig.",
              },
            ],
          },
          {
            label: "Replay & Evaluation",
            params: [
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

      <Heading level={2} id="example">
        Full Example
      </Heading>

      <CodeBlock
        language="python"
        code={`watcher = ArgusWatcher(
    graph,
    semantic_judge=True,
    judge_model="gpt-4o-mini",
    strict=True,
    record_http=True,
    redact_keys={"api_key", "token"},
    validators={
        "summarize": lambda o: (len(o.get("summary", "")) > 10, "Summary too short"),
    },
)`}
      />

      <Heading level={2} id="environment-variables">
        Environment Variables
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Configuration can also be set via environment variables with the <code>ARGUS_</code> prefix.
        Environment variables override config file values.
      </p>

      <ParamTable
        groups={[
          {
            label: "Core",
            params: [
              {
                name: "ARGUS_STRICT",
                type: "bool",
                default: "false",
                description: "Halt execution when a detection fires. Useful in CI/CD to fail builds on quality regressions.",
              },
              {
                name: "ARGUS_INVESTIGATE",
                type: 'bool | "always"',
                default: "true",
                description: "Run forensic root cause analysis. Set to \"always\" to analyze even when no detections fire.",
              },
              {
                name: "ARGUS_MAX_FIELD_SIZE",
                type: "int",
                default: "50000",
                description: "Maximum character length for captured state fields.",
              },
            ],
          },
          {
            label: "Semantic",
            params: [
              {
                name: "ARGUS_SEMANTIC_JUDGE",
                type: "bool",
                default: "false",
                description: "Enable LLM-as-judge for semantic detection. Requires OPENAI_API_KEY.",
              },
              {
                name: "ARGUS_JUDGE_MODEL",
                type: "str",
                default: '"gpt-4o"',
                description: "Model to use for LLM-as-judge evaluation.",
              },
            ],
          },
        ]}
      />

      <Heading level={2} id="precedence">
        Precedence
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Configuration values are resolved in this order (highest priority first):
      </p>
      <ol className="mt-3 space-y-1.5 text-[15px] leading-[1.75] text-[var(--text-muted)] list-decimal list-inside">
        <li><span className="text-white font-medium">Constructor arguments</span> — values passed directly to <code>ArgusWatcher()</code></li>
        <li><span className="text-white font-medium">Environment variables</span> — <code>ARGUS_*</code> vars</li>
        <li><span className="text-white font-medium">Config file</span> — <code>argus.yaml</code> in project root</li>
        <li><span className="text-white font-medium">Defaults</span> — built-in sensible defaults</li>
      </ol>

      <Callout type="info" title="Tip">
        Use constructor arguments for per-run overrides, environment variables for per-environment
        settings (dev vs prod), and the config file for project-wide defaults.
      </Callout>

      <Heading level={2} id="validators">
        Validators
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Validators catch semantic failures — when the structure is fine but the value is wrong.
        Each validator is a callable that returns <code>(bool, str)</code>.
      </p>

      <CodeBlock
        language="python"
        code={`watcher = ArgusWatcher(graph, validators={
    "classify": lambda o: (o.get("label") in ["yes", "no"], "unexpected label"),
    "*":        lambda o: ("error" not in o, "error key present"),
})`}
      />

      <p className="mt-2 text-[13px] text-[var(--text-dim)]">
        <code>&quot;*&quot;</code> runs on every node.
      </p>

      <Heading level={2} id="strict-mode">
        Strict Mode
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Strict mode enables additional detection patterns beyond the defaults: nested error keys,
        rate limit responses, empty required lists, and <code>list[int]</code> vs{" "}
        <code>list[str]</code> type mismatches.
      </p>

      <CodeBlock
        language="python"
        code={`# Recommended for CI/staging
watcher = ArgusWatcher(graph, strict=True)`}
      />

      <Callout type="warning" title="Security">
        Always add sensitive field names to <code>redact_keys</code>. ARGUS captures full state at
        every step — without redaction, API keys and secrets will appear in your stored runs.
      </Callout>
    </>
  );
}
