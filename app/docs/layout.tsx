import { Nav } from "../components/Nav";
import { DocsShell } from "./components/DocsShell";

export const metadata = {
  title: {
    default: "Docs",
    template: "%s | ARGUS Docs",
  },
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="docs-root min-h-screen bg-[var(--void)]">
      <Nav />
      <DocsShell>{children}</DocsShell>
    </div>
  );
}
