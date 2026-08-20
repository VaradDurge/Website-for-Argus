import { Info, AlertTriangle, AlertOctagon, type LucideIcon } from "lucide-react";

const VARIANTS: Record<string, { icon: LucideIcon; border: string; bg: string; iconColor: string }> = {
  info: {
    icon: Info,
    border: "border-[var(--iris-border)]",
    bg: "bg-[var(--iris-subtle)]",
    iconColor: "text-[var(--iris-fg)]",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-[var(--sig-warn)]",
    bg: "bg-[var(--sig-warn-subtle)]",
    iconColor: "text-[var(--sig-warn)]",
  },
  danger: {
    icon: AlertOctagon,
    border: "border-[var(--sig-fail)]",
    bg: "bg-[var(--sig-fail-subtle)]",
    iconColor: "text-[var(--sig-fail)]",
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
    <div className={`my-5 rounded-[var(--radius-inner)] border-l-2 ${v.border} ${v.bg} p-4`}>
      <div className="flex gap-3">
        <Icon size={16} strokeWidth={1.8} className={`${v.iconColor} mt-0.5 shrink-0`} />
        <div className="min-w-0">
          {title && (
            <p className="eyebrow mb-1.5">{title}</p>
          )}
          <div className="text-[13.5px] leading-[1.65] text-[var(--ink-2)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
