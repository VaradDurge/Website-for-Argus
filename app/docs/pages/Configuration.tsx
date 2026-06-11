import { Heading } from "../components/Heading";
import { Callout } from "../components/Callout";
import { CodeBlock } from "../components/CodeBlock";
import { ParamTable } from "../components/ParamTable";

export default function Configuration() {
  return (
    <>
      <Heading level={2} id="config-file">
        Config File
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        ARGUS looks for <code>argus.yaml</code> in your project root. Every setting has a sensible
        default — you only need a config file to override them.
      </p>

      <CodeBlock
        language="yaml"
        filename="argus.yaml"
        code={`# Core watcher settings
watcher:
  strict: false
  investigate: true
  max_field_size: 50000

# Detection layer configuration
detection:
  statistical:
    enabled: true
    z_threshold: 2.5
  semantic:
    enabled: true
    similarity_threshold: 0.7
  behavioral:
    enabled: true
    max_loop_count: 10
  structural:
    enabled: true

# Storage
storage:
  backend: sqlite
  path: .argus/traces.db

# Security
security:
  redact_keys:
    - api_key
    - password
    - secret
    - token`}
      />

      <Heading level={2} id="environment-variables">
        Environment Variables
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        All config values can be set via environment variables with the <code>ARGUS_</code> prefix.
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
                description: "Maximum character length for captured state fields. Larger values give more context but use more storage.",
              },
            ],
          },
          {
            label: "Semantic detection",
            params: [
              {
                name: "ARGUS_SEMANTIC_JUDGE",
                type: "bool",
                default: "false",
                description: "Enable LLM-as-judge for semantic detection. Requires an API key for the judge model.",
              },
              {
                name: "ARGUS_JUDGE_MODEL",
                type: "str",
                default: '"gpt-4o"',
                description: "Model to use for LLM-as-judge semantic evaluation.",
              },
            ],
          },
          {
            label: "Storage",
            params: [
              {
                name: "ARGUS_STORAGE_PATH",
                type: "str",
                default: '".argus/traces.db"',
                description: "Path to the SQLite database file for trace storage.",
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

      <Heading level={2} id="example-config">
        Example Config
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        A production-ready configuration with semantic judging enabled and sensitive keys redacted:
      </p>

      <CodeBlock
        language="yaml"
        filename="argus.yaml"
        code={`watcher:
  strict: true
  investigate: "always"
  max_field_size: 100000

detection:
  statistical:
    enabled: true
    z_threshold: 2.0
  semantic:
    enabled: true
    similarity_threshold: 0.75
    judge: true
    judge_model: "gpt-4o"
  behavioral:
    enabled: true
    max_loop_count: 5
  structural:
    enabled: true

security:
  redact_keys:
    - api_key
    - password
    - secret
    - token
    - authorization
    - x-api-key

storage:
  backend: sqlite
  path: /var/argus/traces.db`}
      />

      <Callout type="warning" title="Security">
        Always add sensitive field names to <code>redact_keys</code>. ARGUS captures full state at
        every step — without redaction, API keys and secrets will appear in your traces.
      </Callout>
    </>
  );
}
