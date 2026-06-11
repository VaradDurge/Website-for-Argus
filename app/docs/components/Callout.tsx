import { Info, AlertTriangle, AlertOctagon, type LucideIcon } from "lucide-react";

const VARIANTS: Record<string, { icon: LucideIcon; border: string; bg: string; iconColor: string }> = {
  info: {
    icon: Info,
    border: "border-[var(--accent-soft)]",
    bg: "bg-[rgba(109,92,255,0.04)]",
    iconColor: "text-[var(--accent-soft)]",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-[var(--signal-warn)]",
    bg: "bg-[rgba(245,177,60,0.04)]",
    iconColor: "text-[var(--signal-warn)]",
  },
  danger: {
    icon: AlertOctagon,
    border: "border-[var(--signal-fail)]",
    bg: "bg-[rgba(255,90,106,0.04)]",
    iconColor: "text-[var(--signal-fail)]",
  },
};

interface CalloutProps {
  type?: "info" | "warning" | "danger";
  title?: string;
  children: React.ReactNode;
}

export function Callout({ type = "info", title, children }: CalloutProps) {
  const v = VARIANTS[type];
  const Icon = v.icon;

  return (
    <div className={`my-5 rounded-lg border-l-2 ${v.border} ${v.bg} p-4`}>
      <div className="flex gap-3">
        <Icon size={16} strokeWidth={1.8} className={`${v.iconColor} mt-0.5 shrink-0`} />
        <div className="min-w-0">
          {title && (
            <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-white mb-1.5">
              {title}
            </p>
          )}
          <div className="text-[13.5px] leading-[1.7] text-[var(--text-muted)] [&_code]:font-mono [&_code]:text-[12px] [&_code]:bg-[var(--surface-2)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-white">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
