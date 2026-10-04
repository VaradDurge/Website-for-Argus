import { cn } from "@/lib/utils";

/** The ArgusLabs mark: a signal line with a break in it. Traced from the
    brand PNG so it stays crisp at any size and takes `currentColor`. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 33"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M2.4 17 12.5 2.7v9.9" />
      <path d="M12.5 17.5v12.8L21.6 16.6" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-flex items-center gap-2 text-[var(--ink)]", className)}
      aria-label="ArgusLabs"
    >
      <LogoMark className="h-[21px] w-auto" />
      <span className="text-[16.5px] font-semibold tracking-[-0.035em]" aria-hidden>
        ArgusLabs
      </span>
    </span>
  );
}
