import { MonoLabel } from "../chrome";

export function FixMini() {
  return (
    <div className="flex h-full flex-col bg-[var(--panel)] p-3">
      <MonoLabel>argus fix 2e8a3c</MonoLabel>
      <p className="mt-2 text-[11px] leading-[1.45] text-[var(--ink)]">
        Root cause: <span className="font-mono">enrich_account</span>
      </p>
      <p className="mt-1 font-mono text-[9px] leading-[1.45] text-[var(--ink-2)]">
        csat_history was None. Upstream returned null instead of an object.
      </p>
      <div className="mt-auto pt-2 font-mono text-[9px] text-[var(--ink-3)]">
        paste-ready prompt · source line
      </div>
    </div>
  );
}
