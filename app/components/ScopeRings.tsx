/* ARGUS = agentic realtime guard & unified scope. The scope is the brand's
   eye: rings and ticks that turn slowly, a sweep passing like radar, and the
   gaze's light at the centre. Each moving ring is its own HTML layer so the
   compositor rotates it; nothing here repaints per frame. Decorative only. */

const TICKS = Array.from({ length: 120 }, (_, i) => i * 3);
const FIBERS = Array.from({ length: 36 }, (_, i) => i * 10);

function Layer({ spin, children }: { spin?: "slow" | "rev"; children: React.ReactNode }) {
  return (
    <div className={spin ? `scope__layer scope__spin-${spin}` : "scope__layer"}>
      <svg viewBox="-500 -500 1000 1000" className="scope__svg">
        {children}
      </svg>
    </div>
  );
}

export function ScopeRings() {
  return (
    <div aria-hidden className="scope">
      <Layer spin="slow">
        <circle r={470} className="scope__line" />
        {TICKS.map((a) => (
          <line
            key={a}
            x1={0}
            y1={-470}
            x2={0}
            y2={a % 30 === 0 ? -440 : a % 15 === 0 ? -452 : -460}
            transform={`rotate(${a})`}
            className={a % 30 === 0 ? "scope__tick scope__tick--major" : "scope__tick"}
          />
        ))}
      </Layer>
      <Layer spin="rev">
        <circle r={392} className="scope__line scope__line--dash" />
        <circle r={392} className="scope__line scope__line--arc" pathLength={100} />
      </Layer>
      <Layer>
        <circle r={310} className="scope__line" />
        <circle r={128} className="scope__line scope__line--iris" />
        <path
          d="M -560 0 H -330 M 330 0 H 560 M 0 -560 V -330 M 0 330 V 560"
          className="scope__cross"
        />
      </Layer>
      <Layer spin="slow">
        {FIBERS.map((a) => (
          <line key={a} x1={0} y1={-136} x2={0} y2={a % 30 === 0 ? -232 : -204} transform={`rotate(${a})`} className="scope__fiber" />
        ))}
      </Layer>
      <div className="scope__sweep" />
      <div className="scope__pupil" />
    </div>
  );
}
