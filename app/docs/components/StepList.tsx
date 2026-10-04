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
          <div className="flex shrink-0 flex-col items-center">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border-[length:var(--hairline)] border-[var(--iris-border)] bg-[var(--iris-subtle)] font-mono text-[11px] tracking-[0.1em] text-[var(--iris-fg)]">
              {i + 1}
            </span>
            {i < steps.length - 1 && (
              <div className="min-h-[24px] w-px flex-1 bg-[var(--line)]" />
            )}
          </div>

          <div className="-mt-0.5 min-w-0 flex-1 pb-8">
            <p className="mb-2 text-[15px] font-medium text-[var(--ink)]">
              {step.title}
            </p>
            <div className="text-[13.5px] leading-[1.65] text-[var(--ink-2)]">
              {step.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
