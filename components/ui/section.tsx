import { cn } from "@/lib/utils";

/** 1200px content constraint with the standard horizontal padding. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("constrained", className)}>{children}</div>;
}

/** Mono uppercase label. Never a pill badge. */
export function Eyebrow({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <p className={cn("eyebrow", className)}>{children}</p>;
}

/** Two-column plain-text capability list under a hairline divider. */
export function TagList({
  label,
  items,
  className,
}: {
  label: string;
  items: readonly string[];
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-[13px] font-medium text-[var(--ink)]">{label}</p>
      <div className="mt-4 h-px w-full bg-[var(--line)]" />
      <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
        {items.map((item) => (
          <li key={item} className="text-[13px] leading-[1.5] text-[var(--ink-2)]">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
