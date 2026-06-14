import type { Metadata } from "next";
import Introduction from "./pages/Introduction";

export const metadata: Metadata = {
  title: "Documentation — ARGUS",
  description:
    "What is ARGUS, why it exists, and how it gives you forensic observability for AI agent pipelines.",
};

export default function DocsPage() {
  return <Introduction />;
}
