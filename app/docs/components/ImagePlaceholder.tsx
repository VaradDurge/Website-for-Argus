import { ImageIcon } from "lucide-react";

interface ImagePlaceholderProps {
  alt: string;
  caption?: string;
  aspectRatio?: string;
}

export function ImagePlaceholder({
  alt,
  caption,
  aspectRatio = "16/9",
}: ImagePlaceholderProps) {
  return (
    <figure className="my-6">
      <div
        className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[var(--border-strong)] bg-[var(--surface)]"
        style={{ aspectRatio }}
      >
        <ImageIcon size={28} strokeWidth={1.2} className="text-[var(--text-dim)]" />
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--text-dim)]">
          Image coming soon
        </span>
      </div>
      {(caption || alt) && (
        <figcaption className="mt-2 text-center text-[12px] text-[var(--text-dim)]">
          {caption || alt}
        </figcaption>
      )}
    </figure>
  );
}
