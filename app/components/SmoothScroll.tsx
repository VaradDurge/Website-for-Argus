"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/** Inertial scrolling for the landing page. Off under reduced motion, paused
    while a modal has locked the body, and never applied inside a dialog. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.085,
      anchors: { offset: -72 },
      stopInertiaOnNavigate: true,
      prevent: (node) => node instanceof HTMLElement && node.getAttribute("role") === "dialog",
    });

    const sync = () => {
      if (document.body.style.overflow === "hidden") lenis.stop();
      else lenis.start();
    };
    const watcher = new MutationObserver(sync);
    watcher.observe(document.body, { attributes: true, attributeFilter: ["style"] });

    return () => {
      watcher.disconnect();
      lenis.destroy();
    };
  }, []);

  return null;
}
