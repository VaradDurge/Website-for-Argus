import { DocsNav } from "./components/DocsNav";
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
    <div className="min-h-screen bg-[var(--bg)]">
      <DocsNav />
      <DocsShell>{children}</DocsShell>
    </div>
  );
}
