import type { PipelineNode, ReplayField, RunRow } from "./types";

export const PIPELINE_NAME = "support-triage";
export const SELECTED_RUN_ID = "8f9a-22b1";

export const RUNS: readonly RunRow[] = [
  {
    id: "8f9a-22b1",
    graph: "support-triage",
    path: "extract → enrich → summarize → validate",
    status: "silent",
    failedNode: "summarize",
    steps: ["ok", "warn", "warn", "fail", "info"],
    duration: "6.42s",
    ago: "2m ago",
    tokens: "12.4k",
  },
  {
    id: "c3e1-90aa",
    graph: "support-triage",
    path: "extract → enrich → summarize → validate",
    status: "clean",
    steps: ["ok", "ok", "ok", "ok", "ok"],
    duration: "4.18s",
    ago: "11m ago",
    tokens: "9.1k",
  },
  {
    id: "b17d-44c0",
    graph: "code-review",
    path: "parse_diff → detect_risk → review_code",
    status: "failed",
    failedNode: "parse_diff",
    steps: ["fail", "ok", "ok", "ok"],
    duration: "25.09s",
    ago: "41m ago",
    tokens: "31.2k",
  },
  {
    id: "a90c-12ef",
    graph: "research-brief",
    path: "retrieve → analyze → summarize → format",
    status: "silent",
    failedNode: "summarize",
    steps: ["ok", "ok", "warn", "fail"],
    duration: "12.73s",
    ago: "1h ago",
    tokens: "18.6k",
  },
  {
    id: "e4b2-77d1",
    graph: "invoice-extract",
    path: "ocr → normalize → classify",
    status: "clean",
    steps: ["ok", "ok", "ok"],
    duration: "2.84s",
    ago: "2h ago",
    tokens: "3.4k",
  },
  {
    id: "f02a-55b8",
    graph: "support-triage",
    path: "extract → enrich → summarize → validate",
    status: "clean",
    steps: ["ok", "ok", "ok", "ok", "ok"],
    duration: "5.01s",
    ago: "3h ago",
    tokens: "10.8k",
  },
  {
    id: "d88e-01c4",
    graph: "router-weather",
    path: "router → weather → general",
    status: "clean",
    steps: ["ok", "ok", "ok"],
    duration: "2.23s",
    ago: "5h ago",
    tokens: "1.9k",
  },
];

export const NODES: readonly PipelineNode[] = [
  {
    id: "extract",
    label: "extract",
    step: "01",
    type: "tool",
    status: "ok",
    duration: "1.21s",
    finding: "Zendesk payload parsed. Ticket T-4419 and subject survived the hop.",
    input: { source: "zendesk", event: "ticket.updated" },
    output: {
      ticket_id: "T-4419",
      subject: "Refund never posted",
      body: "Chargeback on Mar 12 still shows as open. Customer wants ledger confirmation.",
    },
  },
  {
    id: "enrich",
    label: "enrich",
    step: "02",
    type: "tool",
    status: "warn",
    duration: "0.84s",
    finding:
      "ticket.body was dropped here. Downstream summarize received metadata only — the node still exited 0.",
    input: {
      ticket_id: "T-4419",
      subject: "Refund never posted",
      body: "Chargeback on Mar 12 still shows as open.",
    },
    output: {
      ticket_id: "T-4419",
      customer: "Northwind",
      plan: "enterprise",
      body: null,
    },
  },
  {
    id: "summarize",
    label: "summarize",
    step: "03",
    type: "llm",
    status: "warn",
    duration: "4.10s",
    finding:
      "Placeholder summary returned. The node marked succeeded — this is the silent failure.",
    input: {
      ticket_id: "T-4419",
      customer: "Northwind",
      plan: "enterprise",
      body: null,
    },
    output: {
      summary:
        "As an AI language model, I don't have enough context to summarise this ticket.",
      confidence: 0.91,
    },
  },
  {
    id: "validate",
    label: "validate",
    step: "04",
    type: "contract",
    status: "fail",
    duration: "0.09s",
    finding:
      "Contract: summary must cite ticket.body and name a next action. Observed a placeholder.",
    input: {
      summary:
        "As an AI language model, I don't have enough context to summarise this ticket.",
    },
    output: {
      ok: false,
      code: "BA-005",
      expected: "grounded summary",
      observed: "placeholder",
    },
  },
  {
    id: "respond",
    label: "respond",
    step: "05",
    type: "tool",
    status: "info",
    duration: "—",
    finding: "Skipped. Upstream contract failed, so no customer reply was sent.",
    input: { gated: true },
    output: { skipped: true },
  },
];

export const REPLAY_FIELDS: readonly ReplayField[] = [
  {
    key: "summary",
    before:
      "As an AI language model, I don't have enough context to summarise this ticket.",
    after:
      "Northwind (enterprise) reports refund T-4419 never posted after the Mar 12 chargeback. They want ledger confirmation and a 5-day SLA.",
    changed: true,
  },
  {
    key: "confidence",
    before: "0.91",
    after: "0.74",
    changed: true,
  },
  {
    key: "citations",
    before: "[]",
    after: '["ticket.body", "customer.plan"]',
    changed: true,
  },
  {
    key: "next_action",
    before: "null",
    after: "confirm_ledger",
    changed: true,
  },
];

export const RUN_STATS = {
  duration: "6420 ms",
  steps: "5/5",
  tokens: "12.4k",
  cost: "$0.041",
  version: "v0.8.1",
  started: "09:14:02",
} as const;
