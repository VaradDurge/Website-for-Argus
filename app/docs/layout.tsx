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
    <div className="min-h-screen bg-[var(--bg)] relative">
      {/* ambient background — fixed, pure CSS */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          backgroundImage: [
            /* soft purple wash top-right — mirrors main site */
            "radial-gradient(900px 500px at 80% -5%, rgba(109,92,255,0.06), transparent 60%)",
            /* faint green bottom-left */
            "radial-gradient(600px 400px at -5% 70%, rgba(0,240,168,0.025), transparent 55%)",
            /* warm accent near center for depth */
            "radial-gradient(500px 500px at 50% 40%, rgba(245,177,60,0.015), transparent 50%)",
          ].join(", "),
        }}
      />
      {/* fine dot grid — very subtle, gives texture */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(ellipse 70% 50% at 50% 30%, black 20%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 50% at 50% 30%, black 20%, transparent 70%)",
        }}
      />
      <DocsNav />
      <DocsShell>{children}</DocsShell>
    </div>
  );
}
