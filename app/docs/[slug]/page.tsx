import { notFound } from "next/navigation";
import { DOCS_REGISTRY } from "../content/registry";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(DOCS_REGISTRY)
    .filter((slug) => slug !== "introduction")
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = DOCS_REGISTRY[slug];
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
  };
}

export default async function DocsSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const page = DOCS_REGISTRY[slug];
  if (!page) notFound();

  const Content = page.component;
  return <Content />;
}
