interface Param {
  name: string;
  type: string;
  default?: string;
  description: string;
}

interface ParamGroup {
  label: string;
  params: Param[];
}

interface ParamTableProps {
  groups: ParamGroup[];
}

export function ParamTable({ groups }: ParamTableProps) {
  return (
    <div className="my-5 rounded-lg border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      {groups.map((group, gi) => (
        <div key={group.label}>
          {/* group header */}
          <div
            className={`px-4 py-2.5 ${
              gi > 0 ? "border-t border-[var(--border)]" : ""
            }`}
            style={{ background: "rgba(255,255,255,0.015)" }}
          >
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--text-dim)]">
              {group.label}
            </span>
          </div>

          {/* params */}
          <div>
            {group.params.map((p, pi) => (
              <div
                key={p.name}
                className={`px-4 py-3 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 ${
                  pi < group.params.length - 1
                    ? "border-b border-[var(--border)]/30"
                    : ""
                }`}
              >
                <div className="flex items-baseline gap-2 sm:w-[200px] shrink-0">
                  <code className="font-mono text-[12px] text-white">
                    {p.name}
                  </code>
                  <span className="font-mono text-[10.5px] text-[var(--text-dim)]">
                    {p.type}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] leading-[1.6] text-[var(--text-muted)]">
                    {p.description}
                  </p>
                  {p.default !== undefined && (
                    <p className="mt-1">
                      <span className="font-mono text-[10.5px] text-[var(--text-dim)]">
                        Default:{" "}
                      </span>
                      <code className="font-mono text-[11px] text-[var(--signal-ok)]">
                        {p.default}
                      </code>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
