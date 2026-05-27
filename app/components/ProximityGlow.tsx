"use client";

import { useEffect, useRef } from "react";

interface ProximityGlowProps {
  children: React.ReactNode;
  className?: string;
  proximity?: number;
}

export function ProximityGlow({
  children,
  className = "",
  proximity = 220,
}: ProximityGlowProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const borderRef = useRef<HTMLDivElement | null>(null);
  const spotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let rafId = 0;
    let targetX = 0.5;
    let targetY = 0.5;
    let targetO = 0;
    let x = 0.5;
    let y = 0.5;
    let o = 0;

    const onMove = (e: MouseEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
      const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
      const dist = Math.hypot(dx, dy);

      targetO = dist > proximity ? 0 : 1 - dist / proximity;
      targetX = (e.clientX - r.left) / r.width;
      targetY = (e.clientY - r.top) / r.height;
    };

    const onLeave = () => {
      targetO = 0;
    };

    const tick = () => {
      x += (targetX - x) * 0.15;
      y += (targetY - y) * 0.15;
      o += (targetO - o) * 0.12;

      const mx = `${(x * 100).toFixed(2)}%`;
      const my = `${(y * 100).toFixed(2)}%`;
      const op = o.toFixed(3);

      if (borderRef.current) {
        borderRef.current.style.setProperty("--mx", mx);
        borderRef.current.style.setProperty("--my", my);
        borderRef.current.style.opacity = op;
      }
      if (spotRef.current) {
        spotRef.current.style.setProperty("--mx", mx);
        spotRef.current.style.setProperty("--my", my);
        spotRef.current.style.opacity = op;
      }

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafId);
    };
  }, [proximity]);

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      {/* proximity spotlight halo */}
      <div
        ref={spotRef}
        className="absolute -inset-8 rounded-[28px] pointer-events-none blur-2xl"
        style={{
          background:
            "radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), rgba(139,125,255,0.55), rgba(109,92,255,0.18) 40%, transparent 70%)",
          opacity: 0,
        }}
      />

      {/* proximity border light */}
      <div
        ref={borderRef}
        className="absolute -inset-px rounded-[16px] pointer-events-none"
        style={{
          background:
            "radial-gradient(280px circle at var(--mx, 50%) var(--my, 50%), rgba(180,165,255,0.85), rgba(139,125,255,0.35) 30%, transparent 60%)",
          opacity: 0,
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "1px",
        }}
      />

      {children}
    </div>
  );
}
