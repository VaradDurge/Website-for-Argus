"use client";

import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";

interface MorphingTextProps {
  words: string[];
  className?: string;
  interval?: number;
  showCursor?: boolean;
  /** When true the text is painted with a live shifting gradient */
  gradient?: boolean;
}

/**
 * MorphingText cycles through a list of words with a character-by-character
 * out → in morph. Inherits font, size, weight, and color from its parent
 * (no hardcoded gradient or bold) so you can drop it into any existing
 * heading and keep that heading's typography intact.
 *
 * Layout stability: an invisible copy of the longest word reserves the
 * intrinsic width so the surrounding text doesn't reflow mid-morph.
 */
export const MorphingText = ({
  words,
  className,
  interval = 2800,
  showCursor = false,
  gradient = false,
}: MorphingTextProps) => {
  const safeWords = words.length > 0 ? words : [""];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState(safeWords[0]);

  const currentWord = safeWords[currentIndex];
  const nextWord = safeWords[(currentIndex + 1) % safeWords.length];

  const longest = useMemo(
    () => safeWords.reduce((a, b) => (a.length >= b.length ? a : b), ""),
    [safeWords]
  );

  useEffect(() => {
    const morphDuration = 800;
    const steps = 20;
    let step = 0;

    const morphInterval = setInterval(() => {
      step += 1;
      const progress = step / steps;

      if (progress < 0.5) {
        // morph out
        const n = Math.floor(currentWord.length * (1 - progress * 2));
        setDisplayText(currentWord.slice(0, n));
      } else {
        // morph in
        const n = Math.floor(nextWord.length * ((progress - 0.5) * 2));
        setDisplayText(nextWord.slice(0, n));
      }

      if (step >= steps) {
        clearInterval(morphInterval);
        setDisplayText(nextWord);
      }
    }, morphDuration / steps);

    const wordTimeout = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % safeWords.length);
    }, interval);

    return () => {
      clearInterval(morphInterval);
      clearTimeout(wordTimeout);
    };
  }, [currentIndex, currentWord, nextWord, interval, safeWords.length]);

  return (
    <span
      className={cn("relative inline-block whitespace-pre", className)}
      style={{ paddingRight: "0.18em" }}
    >
      {/* width reservoir — invisible copy of the longest word */}
      <span className="invisible select-none" aria-hidden>
        {longest}
      </span>

      {/* visible morphing layer */}
      <span
        className={cn(
          "absolute left-0 top-0",
          gradient && "bg-clip-text text-transparent"
        )}
        style={
          gradient
            ? {
                backgroundImage:
                  "linear-gradient(90deg, #a78bff 0%, #c084fc 30%, #f97316 70%, #fb923c 100%)",
                backgroundSize: "200% 100%",
                animation: "gradient-shift 4s ease infinite",
                paddingRight: "0.18em",
              }
            : { paddingRight: "0.18em" }
        }
        aria-live="polite"
      >
        {displayText}
        {showCursor && (
          <span
            aria-hidden
            className="inline-block w-[2px] h-[0.82em] align-middle ml-0.5 bg-current"
            style={{ animation: "blink 1s steps(2) infinite" }}
          />
        )}
      </span>
    </span>
  );
};
