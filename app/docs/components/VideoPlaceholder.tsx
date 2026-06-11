import { PlayCircle } from "lucide-react";

interface VideoPlaceholderProps {
  title: string;
  caption?: string;
}

export function VideoPlaceholder({ title, caption }: VideoPlaceholderProps) {
  return (
    <figure className="my-6">
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[var(--border-strong)] bg-[var(--surface)] py-12">
        <PlayCircle size={32} strokeWidth={1.2} className="text-[var(--text-dim)]" />
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--text-dim)]">
          Video coming soon
        </span>
        <p className="text-[13px] text-[var(--text-muted)]">{title}</p>
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-[12px] text-[var(--text-dim)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
