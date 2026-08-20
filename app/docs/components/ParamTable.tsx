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
    <div className="my-5 overflow-hidden rounded-[var(--radius-inner)] border-[length:var(--hairline)] border-[var(--line)] bg-[var(--panel)] shadow-[var(--shadow-control)]">
      {groups.map((group, gi) => (
        <div key={group.label}>
          <div
            className={`bg-[var(--ex)] px-4 py-2.5 ${
              gi > 0 ? "border-t-[length:var(--hairline)] border-[var(--line)]" : ""
            }`}
          >
            <span className="eyebrow">{group.label}</span>
          </div>

          <div>
            {group.params.map((p, pi) => (
              <div
                key={p.name}
                className={`flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-start sm:gap-4 ${
                  pi < group.params.length - 1
                    ? "border-b-[length:var(--hairline)] border-[var(--line)]"
                    : ""
                }`}
              >
                <div className="flex shrink-0 items-baseline gap-2 sm:w-[200px]">
                  <code className="font-mono text-[12px] text-[var(--ink)]">
                    {p.name}
                  </code>
                  <span className="font-mono text-[10.5px] text-[var(--ink-3)]">
                    {p.type}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] leading-[1.6] text-[var(--ink-2)]">
                    {p.description}
                  </p>
                  {p.default !== undefined && (
                    <p className="mt-1">
                      <span className="font-mono text-[10.5px] text-[var(--ink-3)]">
                        Default:{" "}
                      </span>
                      <code className="font-mono text-[11px] text-[var(--sig-ok)]">
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
