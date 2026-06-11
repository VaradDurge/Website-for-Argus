interface InlineCodeProps {
  children: React.ReactNode;
}

export function InlineCode({ children }: InlineCodeProps) {
  return (
    <code className="font-mono text-[12.5px] bg-[var(--surface-2)] border border-[var(--border)] px-1.5 py-0.5 rounded text-white">
      {children}
    </code>
  );
}
