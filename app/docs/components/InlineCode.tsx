interface InlineCodeProps {
  children: React.ReactNode;
}

export function InlineCode({ children }: InlineCodeProps) {
  return (
    <code className="rounded-[5px] border-[length:var(--hairline)] border-[var(--line)] bg-[var(--ex)] px-1.5 py-0.5 font-mono text-[12.5px] text-[var(--ink)]">
      {children}
    </code>
  );
}
