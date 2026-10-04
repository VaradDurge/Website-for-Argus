"use client";

import { useEffect, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, video[controls], [tabindex]:not([tabindex="-1"])';

/** Move focus into an open dialog, keep Tab inside it, and hand focus back
    to whatever opened it when it closes. */
export function useDialogFocus(open: boolean, ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    // the panel mounts in the same commit; focus once it is in the document
    const frame = requestAnimationFrame(() => {
      ref.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    });

    const onKey = (e: KeyboardEvent) => {
      const root = ref.current;
      if (e.key !== "Tab" || !root) return;
      const items = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;
      if (!root.contains(current)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && current === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [open, ref]);
}
