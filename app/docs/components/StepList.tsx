interface Step {
  title: string;
  content: React.ReactNode;
}

interface StepListProps {
  steps: Step[];
}

export function StepList({ steps }: StepListProps) {
  return (
    <div className="my-6 flex flex-col gap-0">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-4">
          {/* step indicator + connector */}
          <div className="flex flex-col items-center shrink-0">
            <span
              className="flex items-center justify-center w-7 h-7 rounded-full font-mono text-[11px] tracking-[0.1em] text-[var(--accent-soft)]"
              style={{
                border: "1px solid rgba(139,125,255,0.35)",
                background: "rgba(109,92,255,0.08)",
              }}
            >
              {i + 1}
            </span>
            {i < steps.length - 1 && (
              <div
                className="w-px flex-1 min-h-[24px]"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, var(--border-strong) 50%, transparent 50%)",
                  backgroundSize: "1px 6px",
                }}
              />
            )}
          </div>

          {/* content */}
          <div className="pb-8 min-w-0 flex-1 -mt-0.5">
            <p className="text-[15px] font-medium text-white mb-2">
              {step.title}
            </p>
            <div className="text-[13.5px] leading-[1.7] text-[var(--text-muted)] [&_code]:font-mono [&_code]:text-[12px] [&_code]:bg-[var(--surface-2)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-white">
              {step.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
