import { Heading } from "../components/Heading";
import { Callout } from "../components/Callout";
import { CodeBlock } from "../components/CodeBlock";
import Image from "next/image";

export default function AdaptiveLearning() {
  return (
    <>
      <Heading level={2} id="overview">
        Overview
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        ARGUS learns from your runs. When the semantic judge discovers a new failure pattern, it
        proposes a candidate signature. You review it in the{" "}
        <span className="text-white font-medium">Approvals</span> page and choose: Private (local
        only) or Shared (synced to all ARGUS users via cloud).
      </p>
      <p className="mt-4 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        Expensive LLM analysis discovers patterns once. Cheap heuristic matching catches them
        forever after.
      </p>

      <Heading level={2} id="how-it-works">
        How It Works
      </Heading>
      <ol className="mt-3 space-y-3 text-[15px] leading-[1.75] text-[var(--text-muted)] list-decimal list-inside">
        <li>
          <span className="text-white font-medium">Discovery</span> — the LLM investigator analyzes
          a failure and extracts a reusable pattern
        </li>
        <li>
          <span className="text-white font-medium">Proposal</span> — the pattern is saved as a
          candidate in <code>.argus/candidates.json</code> with confidence, evidence, and reasoning
        </li>
        <li>
          <span className="text-white font-medium">Review</span> — open <code>argus ui</code>,
          go to the Approvals page. Each candidate shows the pattern, match strategy, severity,
          confidence score, and source evidence
        </li>
        <li>
          <span className="text-white font-medium">Approval</span> — approve as Private (local only)
          or Shared (synced to all ARGUS users via cloud)
        </li>
        <li>
          <span className="text-white font-medium">Detection</span> — the approved pattern is loaded
          into the heuristic engine and matched against every future node output
        </li>
      </ol>

      <figure className="my-6 max-w-[420px]">
        <Image
          src="/Argus_Approvals.png"
          alt="ARGUS Approvals page showing pending candidates with Reject, Private, and Shared approval options"
          width={420}
          height={236}
          className="w-full h-auto rounded-lg border border-[var(--border)]"
        />
        <figcaption className="mt-2 text-center text-[12px] text-[var(--text-dim)]">
          The Approvals page — review AI-discovered patterns before they enter the detection engine
        </figcaption>
      </figure>

      <Heading level={2} id="three-tier-registry">
        Three-Tier Signature Registry
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        The heuristic engine loads signatures from three sources, merged and deduplicated at startup:
      </p>

      <figure className="my-6 max-w-[380px]">
        <Image
          src="/Argus_Common_Private.png"
          alt="Heuristic engine reads from Common DB (synced with all users) and Private DB (local to you)"
          width={380}
          height={200}
          className="w-full h-auto rounded-lg border border-[var(--border)]"
        />
        <figcaption className="mt-2 text-center text-[12px] text-[var(--text-dim)]">
          The heuristic engine merges shared and private signature databases
        </figcaption>
      </figure>

      <ul className="mt-4 space-y-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        <li className="flex gap-3">
          <span className="text-[var(--accent-soft)] shrink-0">&#8227;</span>
          <span>
            <span className="text-white font-medium">Bundled</span> — ships with ARGUS. Core patterns
            for placeholder outputs, semantic degradation markers, corrupted JSON, and repeated filler text.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--signal-ok)] shrink-0">&#8227;</span>
          <span>
            <span className="text-white font-medium">Private</span> — patterns you approved as
            &quot;Private&quot;. Stored locally in <code>.argus/custom_signatures.json</code>.
            Only your instance uses these.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--signal-warn)] shrink-0">&#8227;</span>
          <span>
            <span className="text-white font-medium">Shared</span> — community-contributed patterns
            synced from the cloud. When you approve a pattern as &quot;Shared&quot;, it gets pushed
            to the cloud database and becomes available to every ARGUS user.
          </span>
        </li>
      </ul>

      <Callout type="info" title="Deduplication">
        If the same pattern exists in multiple tiers, ARGUS deduplicates by{" "}
        <code>(pattern, match_strategy)</code> — the most specific version wins. No pattern runs twice.
      </Callout>

      <Heading level={2} id="semantic-judge-override">
        Semantic Judge Override
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        The heuristic engine is fast but context-blind — it matches patterns without understanding
        meaning. A cookie-baking agent that outputs &quot;I cannot find the flour&quot; would
        trigger the &quot;I cannot&quot; refusal pattern, even though it&apos;s a legitimate response.
      </p>
      <p className="mt-4 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        When <code>semantic_judge=True</code>, the LLM judge runs{" "}
        <span className="text-white font-medium">after</span> heuristic detection and can override
        false positives. It reviews the full input/output context and clears flags that don&apos;t
        hold up under semantic analysis.
      </p>

      <Heading level={2} id="approvals-ui">
        Approvals UI
      </Heading>
      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        The Approvals page in <code>argus ui</code> has three tabs:
      </p>
      <ul className="mt-3 space-y-2 text-[15px] leading-[1.75] text-[var(--text-muted)]">
        <li className="flex gap-3">
          <span className="text-[var(--signal-warn)] shrink-0">&#8227;</span>
          <span>
            <span className="text-white font-medium">Pending</span> — candidates discovered by the
            LLM investigator, awaiting your review
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--signal-ok)] shrink-0">&#8227;</span>
          <span>
            <span className="text-white font-medium">Private</span> — your locally approved patterns
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-[var(--accent-soft)] shrink-0">&#8227;</span>
          <span>
            <span className="text-white font-medium">Shared</span> — community patterns synced from
            the cloud
          </span>
        </li>
      </ul>

      <CodeBlock
        language="bash"
        code={`# Open the UI and navigate to Approvals
argus ui

# Cloud sync requires login
argus login`}
      />

      <Callout type="info" title="Human-in-the-loop">
        No pattern enters the detection engine without your explicit approval. The LLM proposes,
        you decide.
      </Callout>
    </>
  );
}
