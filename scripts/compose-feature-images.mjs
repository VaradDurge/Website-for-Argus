/**
 * Compose Interfere-style rainbow-backed Argus demo stills.
 * Recreates the TREATMENT (blurred rainbow wash + cropped product chrome),
 * not Interfere product screenshots.
 */
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("/tmp/argus-pw/node_modules/playwright");
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public/images/demo");

const TOKENS = {
  void: "#F6F6F4",
  panel: "#FFFFFF",
  rail: "#EDEDEA",
  ex: "#F2F2EF",
  band: "#E8E8E4",
  line: "#E3E3DF",
  line2: "#D6D6D1",
  ink: "#1A1A1C",
  ink2: "#5A5A62",
  ink3: "#88888A",
  iris: "#5A46E0",
  irisSubtle: "#EFECFE",
  irisFg: "#5140D6",
  ok: "#0F7A55",
  okSubtle: "rgba(15,122,85,0.10)",
  warn: "#A35A06",
  warnSubtle: "rgba(163,90,6,0.10)",
  fail: "#C0263A",
  failSubtle: "rgba(192,38,58,0.09)",
};

const FRAMES = [
  {
    id: "feat-01-detection",
    title: "Detections",
    subtitle: "support-triage · last 1h",
    inner: `
      <div class="row head">
        <span class="mono">RUN</span><span class="mono">FINDING</span><span class="mono">STATUS</span>
      </div>
      <div class="row sel">
        <div>
          <div class="strong">8f9a-22b1</div>
          <div class="dim">extract → enrich → summarize</div>
        </div>
        <div>
          <div class="strong">Placeholder summary returned</div>
          <div class="warn">summarize · pipeline marked succeeded</div>
        </div>
        <span class="chip warn">Silent failure</span>
      </div>
      <div class="row">
        <div>
          <div class="strong">a90c-12ef</div>
          <div class="dim">retrieve → analyze → summarize</div>
        </div>
        <div>
          <div class="strong">Boilerplate brief</div>
          <div class="dim">summarize · confidence collapsed</div>
        </div>
        <span class="chip warn">Silent failure</span>
      </div>
      <div class="row">
        <div>
          <div class="strong">c3e1-90aa</div>
          <div class="dim">extract → enrich → summarize</div>
        </div>
        <div>
          <div class="strong">All detectors clear</div>
          <div class="dim">5/5 nodes</div>
        </div>
        <span class="chip ok">Clean</span>
      </div>
      <div class="row">
        <div>
          <div class="strong">b17d-44c0</div>
          <div class="dim">parse_diff → detect_risk</div>
        </div>
        <div>
          <div class="strong">Structural malformation</div>
          <div class="fail">BA-005 · expected ≥2 keys</div>
        </div>
        <span class="chip fail">Failed</span>
      </div>`,
  },
  {
    id: "feat-02-root-cause",
    title: "Root cause",
    subtitle: "8f9a-22b1 · walkback",
    inner: `
      <div class="graph">
        ${["extract|ok|01", "enrich|warn|02", "summarize|warn|03", "validate|fail|04", "respond|info|05"]
          .map((n, i, arr) => {
            const [label, tone, step] = n.split("|");
            const root = label === "enrich";
            return `<div class="node ${tone} ${root ? "root" : ""}">
              <i></i><b>${label}</b><em>${step}${root ? " · root" : ""}</em>
            </div>${i < arr.length - 1 ? '<span class="edge"></span>' : ""}`;
          })
          .join("")}
      </div>
      <div class="split">
        <div class="card">
          <div class="mono">FINDING</div>
          <div class="strong" style="margin-top:8px">enrich dropped ticket.body</div>
          <p>The node that raised is <span class="fail">validate</span>. The first hop that introduced bad state is <span class="warn">enrich</span>.</p>
        </div>
        <div class="card code">
          <div class="mono">STATE DIFF</div>
          <pre><span>  "ticket_id": "T-4419",</span>
<span>  "customer": "Northwind",</span>
<span class="hot">- "body": "Chargeback on Mar 12…"</span>
<span class="hot">+ "body": null</span></pre>
        </div>
      </div>`,
  },
  {
    id: "feat-03-replay",
    title: "Replay summarize",
    subtitle: "Frozen upstream · HTTP mocked",
    inner: `
      <div class="split">
        <div class="card">
          <div class="row-lite"><span class="mono">ORIGINAL</span><span class="chip fail">silent</span></div>
          <div class="field fail-bg">As an AI language model, I don't have enough context to summarise this ticket.</div>
          <div class="field fail-bg">confidence 0.91</div>
          <div class="field fail-bg">citations []</div>
        </div>
        <div class="card">
          <div class="row-lite"><span class="mono">REPLAYED</span><span class="chip ok">pass</span></div>
          <div class="field ok-bg">Northwind (enterprise) reports refund T-4419 never posted after the Mar 12 chargeback.</div>
          <div class="field ok-bg">confidence 0.74</div>
          <div class="field ok-bg">citations ["ticket.body"]</div>
        </div>
      </div>`,
  },
  {
    id: "feat-04-state-inspector",
    title: "Node inspector",
    subtitle: "enrich · step 02 · 0.84s",
    inner: `
      <div class="split">
        <div class="card">
          <div class="mono">INPUT</div>
          <pre><span>ticket_id: T-4419</span>
<span>subject: Refund never posted</span>
<span>body: Chargeback on Mar 12 still shows as open.</span></pre>
        </div>
        <div class="card">
          <div class="mono">OUTPUT</div>
          <pre><span>ticket_id: T-4419</span>
<span>customer: Northwind</span>
<span>plan: enterprise</span>
<span class="hot">body: null</span></pre>
        </div>
      </div>
      <div class="card" style="margin-top:12px">
        <div class="mono">WALKBACK</div>
        <p>Field silently dropped. Four nodes later, validate fails a contract the dashboard never saw.</p>
      </div>`,
  },
  {
    id: "feat-05-ci-strict",
    title: "Strict mode",
    subtitle: "CI gate · support-triage",
    inner: `
      <div class="row sel">
        <div>
          <div class="strong">argus check --strict</div>
          <div class="fail">exit 1 · 1 silent failure above warn</div>
        </div>
        <span class="chip fail">Blocked</span>
      </div>
      <div class="card" style="margin-top:12px">
        <div class="mono">REPORT</div>
        <pre><span>run        8f9a-22b1</span>
<span>node       summarize</span>
<span class="hot">detector   placeholder_summary</span>
<span class="hot">severity   warn → fail (strict)</span>
<span>action     fail the build</span></pre>
      </div>`,
  },
];

function renderHtml(frame) {
  return `<!doctype html>
<html><head><meta charset="utf-8">
<style>
  html,body{margin:0;padding:0;width:2400px;height:1280px;background:#0b0b10;font-family:ui-sans-serif,system-ui,sans-serif;}
  .stage{position:relative;width:2400px;height:1280px;overflow:hidden;background:
    radial-gradient(1200px 700px at 20% 80%, rgba(255,59,0,.55), transparent 60%),
    radial-gradient(1000px 640px at 75% 20%, rgba(0,142,255,.5), transparent 58%),
    radial-gradient(900px 600px at 55% 60%, rgba(246,0,157,.42), transparent 55%),
    linear-gradient(115deg,#ff3b00 0%,#f6009d 32%,#973ec6 58%,#5a46e0 82%,#00c2a8 100%);}
  .orb{position:absolute;inset:-10%;filter:blur(90px);opacity:.55;background:
    linear-gradient(90deg,rgba(255,59,0,.35),rgba(246,0,157,.28),rgba(90,70,224,.3));}
  .chrome{position:absolute;left:140px;top:150px;width:1960px;height:980px;border-radius:28px;
    background:${TOKENS.panel};box-shadow:0 40px 80px -24px rgba(0,0,0,.35),0 0 0 1px rgba(0,0,0,.08);
    display:flex;overflow:hidden;}
  .rail{width:72px;background:${TOKENS.rail};border-right:1px solid ${TOKENS.line};
    display:flex;flex-direction:column;align-items:center;padding:22px 0;gap:18px;}
  .hex{width:28px;height:28px;background:${TOKENS.irisSubtle};clip-path:polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%);
    box-shadow:inset 0 0 0 2px ${TOKENS.iris};}
  .dot{width:18px;height:18px;border-radius:6px;background:${TOKENS.line2};}
  .dot.on{background:${TOKENS.irisSubtle};box-shadow:inset 0 0 0 1.5px ${TOKENS.iris};}
  .work{flex:1;display:flex;flex-direction:column;min-width:0;}
  .band{height:52px;background:${TOKENS.band};border-bottom:1px solid ${TOKENS.line};
    display:flex;align-items:center;padding:0 28px;gap:12px;color:${TOKENS.ink3};
    font:600 13px ui-monospace,monospace;letter-spacing:.16em;text-transform:uppercase;}
  .live{width:8px;height:8px;border-radius:50%;background:${TOKENS.ok};}
  .body{padding:28px 32px 36px;flex:1;}
  h1{margin:0;font-size:34px;letter-spacing:-.02em;color:${TOKENS.ink};font-weight:560;}
  .sub{margin:6px 0 22px;font:13px ui-monospace,monospace;color:${TOKENS.ink3};letter-spacing:.08em;text-transform:uppercase;}
  .row{display:grid;grid-template-columns:280px 1fr 180px;gap:16px;align-items:center;
    padding:16px 18px;border-bottom:1px solid ${TOKENS.line};}
  .row.head{padding-bottom:10px;}
  .row.sel{background:${TOKENS.irisSubtle};border-radius:10px;border:1px solid transparent;}
  .strong{font-size:18px;color:${TOKENS.ink};font-weight:550;}
  .dim{margin-top:4px;font:13px ui-monospace,monospace;color:${TOKENS.ink3};}
  .warn{color:${TOKENS.warn};font:13px ui-monospace,monospace;}
  .fail{color:${TOKENS.fail};font:13px ui-monospace,monospace;}
  .chip{display:inline-flex;align-items:center;justify-content:center;height:26px;padding:0 10px;
    border-radius:6px;font:12px ui-monospace,monospace;}
  .chip.warn{color:${TOKENS.warn};background:${TOKENS.warnSubtle};}
  .chip.ok{color:${TOKENS.ok};background:${TOKENS.okSubtle};}
  .chip.fail{color:${TOKENS.fail};background:${TOKENS.failSubtle};}
  .mono{font:12px ui-monospace,monospace;letter-spacing:.16em;text-transform:uppercase;color:${TOKENS.ink3};}
  .graph{display:flex;align-items:center;gap:10px;margin-bottom:22px;}
  .node{min-width:160px;padding:12px 14px;border-radius:12px;background:${TOKENS.ex};border:1px solid ${TOKENS.line};}
  .node i{display:block;width:8px;height:8px;border-radius:50%;margin-bottom:8px;}
  .node.ok i{background:${TOKENS.ok};} .node.warn i{background:${TOKENS.warn};}
  .node.fail i{background:${TOKENS.fail};} .node.info i{background:${TOKENS.ink3};}
  .node.root{background:${TOKENS.warnSubtle};border-color:${TOKENS.warn};}
  .node b{display:block;font:15px ui-monospace,monospace;color:${TOKENS.ink};}
  .node em{display:block;margin-top:4px;font:12px ui-monospace,monospace;color:${TOKENS.ink3};font-style:normal;}
  .edge{width:28px;height:2px;background:${TOKENS.line2};}
  .split{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
  .card{background:${TOKENS.ex};border:1px solid ${TOKENS.line};border-radius:14px;padding:18px 20px;}
  .card p{margin:10px 0 0;font-size:16px;line-height:1.5;color:${TOKENS.ink2};}
  pre{margin:10px 0 0;font:15px/1.55 ui-monospace,monospace;color:${TOKENS.ink2};}
  pre .hot{display:block;margin:0 -8px;padding:0 8px;border-radius:6px;background:${TOKENS.failSubtle};color:${TOKENS.fail};}
  .row-lite{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;}
  .field{margin-top:10px;padding:12px 14px;border-radius:8px;font:15px/1.45 ui-monospace,monospace;}
  .fail-bg{background:${TOKENS.failSubtle};color:${TOKENS.fail};}
  .ok-bg{background:${TOKENS.okSubtle};color:${TOKENS.ok};}
</style></head>
<body><div class="stage"><div class="orb"></div>
  <div class="chrome">
    <div class="rail"><div class="hex"></div><div class="dot on"></div><div class="dot"></div><div class="dot"></div></div>
    <div class="work">
      <div class="band"><span class="live"></span>ARGUS / ${frame.subtitle}</div>
      <div class="body"><h1>${frame.title}</h1><div class="sub">${frame.subtitle}</div>${frame.inner}</div>
    </div>
  </div>
</div></body></html>`;
}

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 2400, height: 1280 }, deviceScaleFactor: 1 });

for (const frame of FRAMES) {
  const htmlPath = join(OUT, `${frame.id}.html`);
  writeFileSync(htmlPath, renderHtml(frame));
  await page.goto(`file://${htmlPath}`);
  await page.screenshot({ path: join(OUT, `${frame.id}.png`), type: "png" });
  console.log("wrote", frame.id);
}

await browser.close();
