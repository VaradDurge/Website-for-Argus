import {
  BookOpen,
  Rocket,
  Layers,
  Settings,
  Eye,
  Shield,
  Terminal,
  Code2,
  Database,
  GitBranch,
  Brain,
  type LucideIcon,
} from "lucide-react";

export interface SidebarItem {
  slug: string;
  label: string;
  icon: LucideIcon;
}

export interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    title: "Getting Started",
    items: [
      { slug: "introduction", label: "Introduction", icon: BookOpen },
      { slug: "quickstart", label: "Quickstart", icon: Rocket },
      { slug: "core-concepts", label: "Core Concepts", icon: Layers },
    ],
  },
  {
    title: "Configuration",
    items: [
      { slug: "configuration", label: "Configuration", icon: Settings },
      { slug: "watchers", label: "Watchers", icon: Eye },
      { slug: "detection-layers", label: "Detection Layers", icon: Shield },
      { slug: "adaptive-learning", label: "Adaptive Learning", icon: Brain },
    ],
  },
  {
    title: "Reference",
    items: [
      { slug: "cli-reference", label: "CLI Reference", icon: Terminal },
      { slug: "api-reference", label: "API Reference", icon: Code2 },
      { slug: "storage", label: "Storage", icon: Database },
      { slug: "architecture", label: "Architecture", icon: GitBranch },
    ],
  },
];

/** Flat ordered list of all slugs for prev/next nav */
export const ALL_SLUGS = SIDEBAR_SECTIONS.flatMap((s) =>
  s.items.map((i) => i.slug)
);

/** Find section title for a given slug */
export function getSectionForSlug(slug: string): string | undefined {
  for (const section of SIDEBAR_SECTIONS) {
    if (section.items.some((i) => i.slug === slug)) return section.title;
  }
  return undefined;
}

/** Find label for a given slug */
export function getLabelForSlug(slug: string): string | undefined {
  for (const section of SIDEBAR_SECTIONS) {
    const item = section.items.find((i) => i.slug === slug);
    if (item) return item.label;
  }
  return undefined;
}
