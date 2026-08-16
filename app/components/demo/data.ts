import type { ExplorerRun, PipelineRow, WorkspaceItem } from "./types";

export const CRASHED_ID = "2e8a3c";
export const CLEAN_ID = "8917b9";
export const SEM_ID = "5a9592";
export const WARN_ID = "990422";
export const COMPARE_ID = "compare";
export const FULL_RUN_ID = "20260815-224711-2e8a3c";

export const FAILING: readonly ExplorerRun[] = [
  { id: CRASHED_ID, ago: "2m", tone: "bad" },
  { id: WARN_ID, ago: "14m", tone: "warn" },
  { id: SEM_ID, ago: "22m", tone: "sem" },
];

export const RECENT: readonly ExplorerRun[] = [
  { id: CLEAN_ID, ago: "1m", tone: "ok" },
  { id: "replay", ago: "1m", tone: "plain", nest: true, label: "replay · enrich_account" },
  { id: "777d92", ago: "31m", tone: "ok" },
  { id: "b7613d", ago: "44m", tone: "ok" },
  { id: "e86257", ago: "live", tone: "live" },
];

export const INITIAL_TABS: readonly WorkspaceItem[] = [
  { id: CRASHED_ID, kind: "run", label: CRASHED_ID, tone: "bad" },
];

export const PIPELINE: readonly PipelineRow[] = [
  { num: "01", name: "ingest_ticket", status: "mute", statusLabel: "pass", duration: "88ms" },
  { num: "02", name: "classify_intent", status: "mute", statusLabel: "pass", duration: "412ms" },
  {
    num: "03",
    name: "enrich_account",
    detail:
      "Dropped csat_history, required by draft_reply. stripe_api returned HTTP 429 and the error was swallowed.",
    status: "bad",
    statusLabel: "fail",
    duration: "1,344ms",
    flag: "tool",
  },
  {
    num: "04",
    name: "draft_reply",
    detail: "Emitted a placeholder body — matched signature placeholder_outputs.",
    status: "sem",
    statusLabel: "semantic_fail",
    duration: "2,410ms",
    flag: "sem",
  },
  {
    num: "05",
    name: "policy_check",
    detail: "KeyError on csat_history.",
    status: "bad",
    statusLabel: "crashed",
    duration: "—",
    flag: "tool",
  },
];

export const RUN_META: Record<
  string,
  {
    fullId: string;
    status: "bad" | "ok" | "warn" | "sem";
    statusLabel: string;
    meta: string;
    finding: string;
    findingWho: string;
    findingWhoOk?: boolean;
    chain: string;
    facts: [string, string][];
  }
> = {
  [CRASHED_ID]: {
    fullId: FULL_RUN_ID,
    status: "bad",
    statusLabel: "crashed",
    meta: "Argus v0.9.4 · support-triage · 22:47:11",
    finding:
      "enrich_account reported pass while omitting csat_history. Its stripe_api call was rate-limited and the handler swallowed the error, so the crash surfaced three nodes later in policy_check.",
    findingWho: "enrich_account",
    chain: "Root cause · confidence 0.91",
    facts: [
      ["Duration", "3.12s"],
      ["Steps", "4 / 7"],
      ["Tokens", "3,842"],
      ["Cost", "$0.041"],
      ["Tool calls", "9"],
    ],
  },
  [CLEAN_ID]: {
    fullId: "20260815-224812-8917b9",
    status: "ok",
    statusLabel: "clean",
    meta: "Argus v0.9.4 · support-triage · 22:48:12",
    finding:
      "Fixing enrich_account cleared the cascade. The placeholder in draft_reply and the KeyError in policy_check both disappeared.",
    findingWho: "enrich_account",
    findingWhoOk: true,
    chain: "3 of 4 findings resolved · latency down 380ms",
    facts: [
      ["Duration", "2.74s"],
      ["Steps", "7 / 7"],
      ["Tokens", "3,610"],
      ["Cost", "$0.038"],
      ["Tool calls", "9"],
    ],
  },
  [SEM_ID]: {
    fullId: "20260815-222901-5a9592",
    status: "sem",
    statusLabel: "semantic_fail",
    meta: "Argus v0.9.4 · support-triage · 22:29:01",
    finding:
      "draft_reply returned a boilerplate apology. The node exited 0 — this is a silent failure, not a crash.",
    findingWho: "draft_reply",
    chain: "Signature · placeholder_outputs · confidence 0.87",
    facts: [
      ["Duration", "4.08s"],
      ["Steps", "7 / 7"],
      ["Tokens", "5,120"],
      ["Cost", "$0.052"],
      ["Tool calls", "6"],
    ],
  },
  [WARN_ID]: {
    fullId: "20260815-223311-990422",
    status: "warn",
    statusLabel: "degraded",
    meta: "Argus v0.9.4 · doc-indexer · 22:33:11",
    finding:
      "retrieve_context returned 3 of 8 expected chunks. Downstream nodes still passed — quality dropped without an exception.",
    findingWho: "retrieve_context",
    chain: "Degraded input · pinecone · 8.2s",
    facts: [
      ["Duration", "9.41s"],
      ["Steps", "6 / 6"],
      ["Tokens", "2,104"],
      ["Cost", "$0.019"],
      ["Tool calls", "4"],
    ],
  },
};

export const LOG_LINES = [
  { t: "22:47:11.088", msg: "ingest_ticket  ok  88ms", err: false },
  { t: "22:47:11.500", msg: "classify_intent  ok  412ms  intent=billing_dispute", err: false },
  { t: "22:47:12.844", msg: "enrich_account  stripe_api HTTP 429 — swallowed", err: true },
  { t: "22:47:12.845", msg: "enrich_account  csat_history=null  marked pass", err: true },
  { t: "22:47:15.255", msg: "draft_reply  placeholder_outputs  semantic_fail", err: true },
  { t: "22:47:15.256", msg: "policy_check  KeyError: csat_history", err: true },
];
