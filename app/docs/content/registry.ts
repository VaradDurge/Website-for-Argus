import { type ComponentType } from "react";

export interface TOCItem {
  id: string;
  label: string;
  level: 2 | 3;
}

export interface DocPage {
  slug: string;
  title: string;
  description: string;
  toc: TOCItem[];
  component: ComponentType;
}

/* ── lazy imports for code-splitting ── */
import Introduction from "../pages/Introduction";
import Quickstart from "../pages/Quickstart";
import CoreConcepts from "../pages/CoreConcepts";
import Configuration from "../pages/Configuration";
import Watchers from "../pages/Watchers";
import DetectionLayers from "../pages/DetectionLayers";
import CLIReference from "../pages/CLIReference";
import Storage from "../pages/Storage";
import Architecture from "../pages/Architecture";
import APIReference from "../pages/APIReference";

export const DOCS_REGISTRY: Record<string, DocPage> = {
  introduction: {
    slug: "introduction",
    title: "Introduction",
    description:
      "What is ARGUS, why it exists, and how it gives you forensic observability for AI agent pipelines.",
    toc: [
      { id: "what-is-argus", label: "What is ARGUS?", level: 2 },
      { id: "the-problem", label: "The Problem", level: 2 },
      { id: "how-argus-works", label: "How ARGUS Works", level: 2 },
      { id: "key-capabilities", label: "Key Capabilities", level: 3 },
      { id: "who-is-it-for", label: "Who Is It For?", level: 2 },
    ],
    component: Introduction,
  },

  quickstart: {
    slug: "quickstart",
    title: "Quickstart",
    description:
      "Install ARGUS and run your first trace in under 5 minutes.",
    toc: [
      { id: "prerequisites", label: "Prerequisites", level: 2 },
      { id: "installation", label: "Installation", level: 2 },
      { id: "instrument-your-graph", label: "Instrument Your Graph", level: 2 },
      { id: "run-your-pipeline", label: "Run Your Pipeline", level: 2 },
      { id: "view-results", label: "View Results", level: 2 },
      { id: "next-steps", label: "Next Steps", level: 2 },
    ],
    component: Quickstart,
  },

  "core-concepts": {
    slug: "core-concepts",
    title: "Core Concepts",
    description:
      "Understand Watchers, Detectors, Traces, and Forensics — the four primitives of ARGUS.",
    toc: [
      { id: "watchers", label: "Watchers", level: 2 },
      { id: "detectors", label: "Detectors", level: 2 },
      { id: "traces", label: "Traces", level: 2 },
      { id: "forensics", label: "Forensics", level: 2 },
      { id: "how-they-connect", label: "How They Connect", level: 2 },
    ],
    component: CoreConcepts,
  },

  configuration: {
    slug: "configuration",
    title: "Configuration",
    description:
      "Configure ARGUS via YAML files and environment variables.",
    toc: [
      { id: "config-file", label: "Config File", level: 2 },
      { id: "environment-variables", label: "Environment Variables", level: 2 },
      { id: "precedence", label: "Precedence", level: 2 },
      { id: "example-config", label: "Example Config", level: 2 },
    ],
    component: Configuration,
  },

  watchers: {
    slug: "watchers",
    title: "Watchers",
    description:
      "Deep dive into ArgusWatcher — the core monitoring primitive.",
    toc: [
      { id: "overview", label: "Overview", level: 2 },
      { id: "basic-usage", label: "Basic Usage", level: 2 },
      { id: "parameters", label: "Parameters", level: 2 },
      { id: "core-params", label: "Core", level: 3 },
      { id: "security-params", label: "Security", level: 3 },
      { id: "replay-eval-params", label: "Replay & Eval", level: 3 },
      { id: "lifecycle", label: "Lifecycle", level: 2 },
    ],
    component: Watchers,
  },

  "detection-layers": {
    slug: "detection-layers",
    title: "Detection Layers",
    description:
      "The four detection layers that catch silent failures in your AI pipelines.",
    toc: [
      { id: "overview", label: "Overview", level: 2 },
      { id: "statistical-detection", label: "Statistical Detection", level: 2 },
      { id: "semantic-detection", label: "Semantic Detection", level: 2 },
      { id: "behavioral-detection", label: "Behavioral Detection", level: 2 },
      { id: "structural-detection", label: "Structural Detection", level: 2 },
    ],
    component: DetectionLayers,
  },

  "cli-reference": {
    slug: "cli-reference",
    title: "CLI Reference",
    description:
      "Complete reference for all ARGUS CLI commands.",
    toc: [
      { id: "overview", label: "Overview", level: 2 },
      { id: "argus-watch", label: "argus watch", level: 2 },
      { id: "argus-trace", label: "argus trace", level: 2 },
      { id: "argus-replay", label: "argus replay", level: 2 },
      { id: "argus-report", label: "argus report", level: 2 },
      { id: "argus-login", label: "argus login", level: 2 },
      { id: "argus-ui", label: "argus ui", level: 2 },
      { id: "argus-update", label: "argus update", level: 2 },
    ],
    component: CLIReference,
  },

  "api-reference": {
    slug: "api-reference",
    title: "API Reference",
    description:
      "Python API reference for ARGUS classes and methods.",
    toc: [
      { id: "arguswatcher", label: "ArgusWatcher", level: 2 },
      { id: "methods", label: "Methods", level: 2 },
      { id: "watch", label: ".watch()", level: 3 },
      { id: "finalize", label: ".finalize()", level: 3 },
      { id: "get-trace", label: ".get_trace()", level: 3 },
      { id: "data-models", label: "Data Models", level: 2 },
    ],
    component: APIReference,
  },

  storage: {
    slug: "storage",
    title: "Storage",
    description:
      "How ARGUS stores traces, detections, and forensic data.",
    toc: [
      { id: "overview", label: "Overview", level: 2 },
      { id: "sqlite-schema", label: "SQLite Schema", level: 2 },
      { id: "trace-storage", label: "Trace Storage", level: 3 },
      { id: "detection-storage", label: "Detection Storage", level: 3 },
      { id: "querying", label: "Querying Data", level: 2 },
      { id: "export", label: "Export Formats", level: 2 },
    ],
    component: Storage,
  },

  architecture: {
    slug: "architecture",
    title: "Architecture",
    description:
      "System design, file structure, and extension points.",
    toc: [
      { id: "system-overview", label: "System Overview", level: 2 },
      { id: "data-flow", label: "Data Flow", level: 2 },
      { id: "extension-points", label: "Extension Points", level: 2 },
    ],
    component: Architecture,
  },
};
