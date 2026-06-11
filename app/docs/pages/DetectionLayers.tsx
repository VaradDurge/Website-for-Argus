import { Heading } from "../components/Heading";
import { Callout } from "../components/Callout";
import { CodeBlock } from "../components/CodeBlock";
import Image from "next/image";

export default function DetectionLayers() {
  return (
    <>
      <Heading level={2} id="overview">
        Overview
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        ARGUS runs four detection layers against every trace. Each layer looks for a different
        category of failure. Together, they cover the full spectrum of things that can go wrong
        in an AI pipeline — from numerical anomalies to meaning drift.
      </p>

      <figure className="my-6">
        <Image
          src="/Argus_DetectionLayers.png"
          alt="Four detection layers: Statistical, Semantic, Behavioral, Structural"
          width={720}
          height={405}
          className="rounded-lg border border-[var(--border)]"
        />
        <figcaption className="mt-2 text-center text-[12px] text-[var(--text-dim)]">
          The four detection layers run in parallel after each pipeline execution
        </figcaption>
      </figure>

      <p className="mt-4 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        All layers are enabled by default. You can configure sensitivity thresholds or disable
        individual layers in your <code>argus.yaml</code>.
      </p>

      <Heading level={2} id="statistical-detection">
        Statistical Detection
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Catches <span className="text-white font-medium">numerical anomalies</span> in execution
        metrics. This layer doesn&apos;t understand what your pipeline does — it just knows when
        something looks quantitatively different from normal.
      </p>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        What it detects:
      </p>
      <ul className="mt-3 space-y-2 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        <li className="flex gap-3">
          <span className="text-[var(--signal-warn)] shrink-0">&#8227;</span>
          <span>Execution time spikes or drops (a node that usually takes 2s now takes 30s)</span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--signal-warn)] shrink-0">&#8227;</span>
          <span>Output length anomalies (a response that&apos;s 10x shorter than average)</span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--signal-warn)] shrink-0">&#8227;</span>
          <span>Token count deviations beyond the Z-score threshold</span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--signal-warn)] shrink-0">&#8227;</span>
          <span>Retry count anomalies and error rate changes</span>
        </li>
      </ul>

      <CodeBlock
        language="yaml"
        filename="argus.yaml"
        code={`detection:
  statistical:
    enabled: true
    z_threshold: 2.5      # standard deviations from mean
    min_samples: 5        # minimum runs before baselining
    metrics:
      - execution_time
      - output_length
      - token_count`}
      />

      <Callout type="info" title="Baselining">
        Statistical detection needs history to establish baselines. The first few runs
        won&apos;t trigger statistical detections — ARGUS is building its model of
        &quot;normal&quot; for your pipeline.
      </Callout>

      <Heading level={2} id="semantic-detection">
        Semantic Detection
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Catches <span className="text-white font-medium">meaning drift and quality degradation</span>.
        This is the layer that understands what your pipeline is supposed to produce and can tell when
        the output is technically valid but semantically wrong.
      </p>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        What it detects:
      </p>
      <ul className="mt-3 space-y-2 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        <li className="flex gap-3">
          <span className="text-[var(--accent-soft)] shrink-0">&#8227;</span>
          <span>Relevance loss — retrieval returns documents that don&apos;t match the query</span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--accent-soft)] shrink-0">&#8227;</span>
          <span>Hallucination patterns — output contains claims not supported by the input context</span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--accent-soft)] shrink-0">&#8227;</span>
          <span>Topic drift — the response wanders away from the original intent</span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--accent-soft)] shrink-0">&#8227;</span>
          <span>Contradiction — output contradicts information from earlier in the pipeline</span>
        </li>
      </ul>

      <CodeBlock
        language="yaml"
        filename="argus.yaml"
        code={`detection:
  semantic:
    enabled: true
    similarity_threshold: 0.7    # cosine similarity floor
    judge: false                 # enable LLM-as-judge
    judge_model: "gpt-4o"       # model for semantic eval`}
      />

      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        There are two modes: <span className="text-white font-medium">embedding similarity</span>{" "}
        (fast, cheap, always-on) and <span className="text-white font-medium">LLM-as-judge</span>{" "}
        (slower, costs API calls, much more accurate). Use embeddings for production monitoring and
        LLM-as-judge for staging/CI evaluation.
      </p>

      <Heading level={2} id="behavioral-detection">
        Behavioral Detection
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Catches <span className="text-white font-medium">unexpected execution patterns</span> —
        the shape of how your pipeline runs, not what it produces.
      </p>
      <ul className="mt-3 space-y-2 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        <li className="flex gap-3">
          <span className="text-[var(--signal-fail)] shrink-0">&#8227;</span>
          <span>Infinite loops — a node re-executing beyond the configured threshold</span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--signal-fail)] shrink-0">&#8227;</span>
          <span>Skipped steps — expected nodes that never executed</span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--signal-fail)] shrink-0">&#8227;</span>
          <span>Unexpected transitions — edges that shouldn&apos;t fire but did</span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--signal-fail)] shrink-0">&#8227;</span>
          <span>State corruption — state fields modified by nodes that shouldn&apos;t touch them</span>
        </li>
      </ul>

      <CodeBlock
        language="yaml"
        filename="argus.yaml"
        code={`detection:
  behavioral:
    enabled: true
    max_loop_count: 10      # max times a node can re-execute
    detect_skipped: true    # flag nodes that should have run
    detect_mutations: true  # flag unexpected state changes`}
      />

      <Heading level={2} id="structural-detection">
        Structural Detection
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Catches <span className="text-white font-medium">contract violations and schema breaks</span>.
        This layer validates the data flowing through your pipeline against expected shapes and types.
      </p>
      <ul className="mt-3 space-y-2 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        <li className="flex gap-3">
          <span className="text-[var(--signal-ok)] shrink-0">&#8227;</span>
          <span>Missing required fields — a node output lacks expected keys</span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--signal-ok)] shrink-0">&#8227;</span>
          <span>Type mismatches — a field that should be a list is a string</span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--signal-ok)] shrink-0">&#8227;</span>
          <span>Empty results — a node returns an empty response when content is expected</span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--signal-ok)] shrink-0">&#8227;</span>
          <span>Schema drift — output shape changed from what the next node expects</span>
        </li>
      </ul>

      <CodeBlock
        language="yaml"
        filename="argus.yaml"
        code={`detection:
  structural:
    enabled: true
    check_required: true    # validate required fields
    check_types: true       # validate field types
    check_empty: true       # flag empty outputs`}
      />

      <Callout type="info" title="Custom validators">
        For domain-specific structural checks, use the <code>validators</code> parameter on
        ArgusWatcher. This lets you define custom validation functions per field.
      </Callout>
    </>
  );
}
