# Argus Marketing Website — Codebase Audit & Refactor Map

**Date:** 2026-08-16  
**Scope:** Read-only audit of `/Users/varaddurge/Documents/Website-for-Argus`  
**Stack:** Next.js 16.2.6, React 19.2.4, Tailwind CSS v4, framer-motion, `@paper-design/shaders`  
**Target redesign pattern:** https://interfere.com/ (hero → scroll-pinned 01/02/03 narrative with product UI → feature sections with gradient demo screenshots → testimonial → security → changelog → footer)

---

## 0. Next.js 16 docs for implementation agents

This repo’s AGENTS.md requires reading `node_modules/next/dist/docs/` before writing Next.js code. Relevant **App Router** guides:

### App router pages / layouts
| Topic | Path |
|-------|------|
| Layouts and pages | `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md` |
| Project structure | `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md` |
| File convention: `layout` | `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md` |
| File convention: `page` | `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md` |
| Linking / navigating | `node_modules/next/dist/docs/01-app/01-getting-started/04-linking-and-navigating.md` |
| Upgrading to v16 | `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` |

### Client vs server components
| Topic | Path |
|-------|------|
| Server and client components (getting started) | `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` |
| Directive: `use client` | `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-client.md` |
| Directive: `use server` | `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-server.md` |
| Rendering philosophy | `node_modules/next/dist/docs/01-app/02-guides/rendering-philosophy.md` |

### Image handling
| Topic | Path |
|-------|------|
| Images (getting started) | `node_modules/next/dist/docs/01-app/01-getting-started/12-images.md` |
| `<Image>` component API | `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md` |
| Public folder | `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/public-folder.md` |

### Metadata
| Topic | Path |
|-------|------|
| Metadata and OG images | `node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md` |
| Metadata file conventions (index) | `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/index.md` |
| `opengraph-image` | `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/opengraph-image.md` |
| Fonts | `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md` |
| Font component API | `node_modules/next/dist/docs/01-app/03-api-reference/02-components/font.md` |

---

## 1. Canonical app: root `app/` (not `argusweb/`)

### Verdict
**The live / canonical application is the root Next.js app** (`/Users/varaddurge/Documents/Website-for-Argus/app/`, with root `package.json`, `node_modules`, `.next`, and `.vercel`).

**`argusweb/` is a stale nested duplicate** of an earlier site snapshot. It is still git-tracked but is not what Vercel deploys and is not what recent commits modify for docs/landing work.

### Evidence

| Signal | Root | `argusweb/` |
|--------|------|-------------|
| `.vercel/project.json` | Present — `projectName: "website-for-argus"`, `projectId: prj_D4zT84lawqMAMuEBOLQAVSW0yG7o` | **No** `.vercel/` |
| Root `node_modules` / active `.next` | Yes — `.next/BUILD_ID` dated **2026-08-13** | Nested `.next` dated **2026-06-17** (stale) |
| Recent `git log` on paths | Active through Aug 2026 (docs, AgentSetup, waitlist fixes) | Last meaningful touch: older mobile/Replay fixes; not in recent HEAD landing commits |
| Feature completeness | Docs (`app/docs/`), pricing route, TrialUI, SocialProofTicker, Comparison, OG image, Analytics, Cal.com | No docs, no TrialUI, no pricing; has obsolete `GetStarted.tsx` + `LiveTrace.tsx` |
| `package.json` deps | Richer: `@calcom/embed-react`, `@vercel/analytics`, `@googleapis/sheets` | Older subset; no Cal/Analytics |

### Tree / content differences

**File counts (approx):**
- Root `app/`: **58** files
- `argusweb/app/`: **20** files
- Git-tracked under `app/*`+`components/*`+`lib/*`+`public/*`: **76**
- Git-tracked under `argusweb/*`: **42**

**Only in root `app/`:**
- `components/AgentSetup.tsx`, `Comparison.tsx`, `Pricing.tsx`, `SocialProofTicker.tsx`, `TrialUI.tsx`, `VideoModal.tsx`
- Entire `docs/` tree (~30+ files)
- `pricing/page.tsx`, `opengraph-image.tsx`, `robots.ts`, `sitemap.ts`

**Only in `argusweb/app/`:**
- `components/GetStarted.tsx` (numbered-divider landing pattern)
- `components/LiveTrace.tsx` (demo UI variant using `ProximityGlow`)

**Differ (content diverged) — 16 paths**, including shared names: `page.tsx`, `layout.tsx`, `globals.css`, `Hero`, `Pipeline`, `Replay`, `Features`, `Nav`, `Footer`, `FAQ`, `Stats`, modals, waitlist API.

**Root `page.tsx` section order ≠ `argusweb`:**
- Root: Nav → Hero(+TrialUI) → SocialProofTicker → Pipeline → AgentSetup → Replay → Features → Stats → Comparison → FAQ → Footer
- argusweb: Nav → Hero → GetStarted → Pipeline → Replay → Features → Stats → FAQ → Footer (with `01–05` divider labels; no TrialUI)

### Recommendation
Treat `argusweb/` as **archive / delete candidate** after redesign. Do not implement redesign there. Optionally cherry-pick ideas from `LiveTrace.tsx` / numbered dividers if useful, then remove the nested tree to avoid agent confusion.

---

## 2. Canonical page composition inventory

Source: `app/page.tsx` (server component; children are mostly client).

### Vertical order (top → bottom)

| # | Component | Path | Lines | Client? | Purpose / visual | Position |
|---|-----------|------|------:|:-------:|------------------|----------|
| 0 | `Nav` | `app/components/Nav.tsx` | ~260 | Yes | Sticky blurred header: Logo+Beta, Discord/GitHub/Instagram, links (Features/Replay/Docs/Pricing), LiquidMetal Waitlist + Book a Call; mobile hamburger | Fixed top |
| 1 | `Hero` | `app/components/Hero.tsx` | ~168 | Yes | Eyebrow, morphing H1, subtitle, CTAs (Book a Call / Watch Demo / Docs), pip install copy; **embeds `TrialUI`** | First viewport + extends below fold with demo |
| 2 | `SocialProofTicker` | `app/components/SocialProofTicker.tsx` | ~276 | Yes | Dual-row infinite social-card ticker (X/Reddit/Discord/Instagram mock quotes) | Immediately under Hero |
| 3 | `Pipeline` | `app/components/Pipeline.tsx` | ~331 | Yes | “Every node, traced” — horizontal (desktop) / vertical (mobile) status node strip with root-cause callout | Mid-page narrative #1 |
| 4 | `AgentSetup` | `app/components/AgentSetup.tsx` | ~361 | Yes | “Let your AI set up Argus” — 4 steps + expandable copyable prompt block | Mid-page how-to |
| 5 | `Replay` | `app/components/Replay.tsx` | ~527 | Yes | Replay narrative: step circles → before/after JSON cards → reused/ran badges → animated stats | Mid-page narrative #2 |
| 6 | `Features` | `app/components/Features.tsx` | ~156 | Yes | Sticky left headline + accordion feature list (6 items); **no product screenshots** | Feature list |
| 7 | `Stats` | `app/components/Stats.tsx` | ~114 | Yes | “By the numbers” animated counters | Proof strip |
| 8 | `Comparison` | `app/components/Comparison.tsx` | ~195 | Yes | Argus vs LangSmith/Langfuse capability table | Competitive |
| 9 | `FAQ` | `app/components/FAQ.tsx` | ~165 | Yes | Accordion Q&A | Pre-footer |
| 10 | `Footer` | `app/components/Footer.tsx` | ~110 | Yes | Logo blurb, links, pip install copy, giant outlined ARGUS wordmark | Page bottom |

### Supporting (not in `page.tsx` order, but coupled)

| Component | Lines | Client? | Role |
|-----------|------:|:-------:|------|
| `TrialUI` | **1430** | Yes | Full mock product dashboard — rendered **inside Hero** |
| `Logo` | ~38 | No | `next/image` of `/argus-logo.png` |
| `WaitlistModal` | ~228 | Yes | Form → `POST /api/waitlist` |
| `BetaAccessModal` | ~82 | Yes | Cal.com embed (`@calcom/embed-react`) |
| `ContactModal` | ~110 | Yes | Contact / mailto UI |
| `VideoModal` | ~74 | Yes | Watch Demo modal shell |
| `ProximityGlow` | ~126 | Yes | Mouse-proximity glow wrapper — **unused in root** (dead code; used only in `argusweb`) |
| `Pricing` | ~271 | Yes | Used on `/pricing`, not landing |

### Other routes (leave alone unless asked)
- `/docs` + `/docs/[slug]` — full docs shell (registry, TOC, sidebar, content pages)
- `/pricing` — Nav + Pricing + Footer
- `app/api/waitlist/route.ts` — Google Sheets append via service account
- `app/opengraph-image.tsx` — dynamic OG (1200×630)
- `app/robots.ts`, `app/sitemap.ts`

---

## 3. Deep dive: existing demo / product UI (most important)

There is **one primary interactive product UI** and **several secondary illustrative demos**. None use canvas or screenshots of the real product on the landing page (except docs PNGs elsewhere).

---

### 3.1 `TrialUI.tsx` — PRIMARY product mock (relocate/rebuild target)

| Attribute | Detail |
|-----------|--------|
| **Where on page** | Inside `Hero`, after CTAs/`pip install`, `mt-14 lg:mt-20`, max-width 1200px — **dominates first scroll** (hero text + large dashboard) |
| **What it simulates** | Full ARGUS web dashboard shell: sidebar (OBSERVE / ANALYZE / WORKFLOWS + bottom Guide/Changelog/Report Board/Settings), search, user chip. Pages: **Runs list**, **Run detail** (Overview graph / Pipeline steps / AI Analysis), **Compare** (base vs replay graphs + diff table), **Approvals** (HITL pattern approval: Private/Shared) |
| **How built** | Pure React JSX + Tailwind/CSS variables + Lucide icons + **inline SVG** Bézier edges for pipeline graphs. **framer-motion** `AnimatePresence` for page/tab transitions. **No canvas, no images, no shaders.** Mock data constants at top of file |
| **Dimensions** | Outer shell: `height: 720` (fixed px), `rounded-xl`, full content width up to ~1200px. Desktop sidebar `w-[190px]`. Graph nodes: `NODE_W=150`, `NODE_H=52`. Aspect ≈ **~1.67:1** at 1200×720 (browser-frame feel) |
| **Animation** | Tab/page crossfade (`opacity`/`x` ~120ms); Approvals confirm scale-in; CSS `.live-dot` pulse; graph is static SVG (no path draw). Hover styles on nodes |
| **Interactivity** | Fully clickable mock: filter runs, open run detail, select graph nodes (inspector), switch Compare/Approvals, approve Private/Shared, start replay animation inside Pipeline sub-tab |
| **CSS hooks** | `.trial-ui` forces scrollbar hiding (globals.css) |

**Sub-panels (internal):** `RunsPanel`, `RunDetailPanel` → `RunOverview` / `RunPipeline` / `RunAIAnalysis`, `ComparePanel`, `ApprovalsPanel`, `PipelineGraph`.

**Coupling:** Only imported by `Hero.tsx`. Safe to extract/relocate without touching docs.

---

### 3.2 `Pipeline.tsx` — illustrative failure strip (not full app chrome)

| Attribute | Detail |
|-----------|--------|
| **Where** | Section `#pipeline`, after SocialProofTicker |
| **Simulates** | Linear agent pipeline: extract → enrich → summarize (root cause warn) → validate (fail) → respond (pending) |
| **Build** | JSX “cards” (`panel-tight`) + SVG dashed connectors (`.arrow-flow` / custom lines); framer-motion `whileInView` stagger |
| **Dimensions** | Full content width (`max-w-[1280px]`); each node flex-1; no fixed aspect frame |
| **Animation** | Staggered fade/scale-in; warn node `.glow-warn` pulse; desktop connectors; mobile vertical stack + side “Root Cause” callout |
| **vs TrialUI** | Conceptual diagram, not navigable product |

---

### 3.3 `Replay.tsx` — replay workflow illustration

| Attribute | Detail |
|-----------|--------|
| **Where** | Section `#replay`, after AgentSetup |
| **Simulates** | Run `8f9a-22b1` pipeline steps with status badges; **Before/After** summarize-node field cards; Reused vs Ran cost story; bottom stats (10x / 40% / Zero) |
| **Build** | JSX + SVG circle `pathLength` draw-on; framer-motion; CSS `.replay-card` shimmer on hover. **No full app chrome.** (Root version dropped `ProximityGlow` wrapping that still exists in `argusweb`) |
| **Dimensions** | Content max ~900px; before/after cards `min-w-[320px]`; not a fixed dashboard frame |
| **Animation** | Sequential circle draw, connector draw, bounce ArrowDown, staggered field rows, counter animation |

---

### 3.4 `AgentSetup.tsx` — setup UX (prompt UI, not product dashboard)

| Attribute | Detail |
|-----------|--------|
| **Where** | `#agent-setup` between Pipeline and Replay |
| **Simulates** | Terminal/editor-style prompt file (`argus-setup.prompt`) with line numbers, syntax coloring heuristics, expand/collapse, copy |
| **Build** | JSX + framer-motion; large string constant `AGENT_PROMPT` |
| **Dimensions** | `max-w-[960px]` panel; collapsed height limited via expand toggle |
| **Not a product screenshot** — documentation/CTA block |

---

### 3.5 `Features.tsx` — text accordion only

No mock UI, no screenshots, no graphs. Sticky headline + expand-on-hover/click feature titles. For interfere.com-style “gradient-backed demo screenshots,” this section must be **rewritten** or replaced.

---

### 3.6 `Hero.tsx` — frame for TrialUI (not a separate product UI)

Hero atmosphere: dots-bg mask, MorphingText verbs, ButtonColorful / StarButton / VideoModal / BetaAccessModal. The product UI is entirely delegated to `TrialUI`.

---

### 3.7 Legacy / unused demo pieces

| Piece | Status |
|-------|--------|
| `argusweb/.../LiveTrace.tsx` | Older demo; uses ProximityGlow; **not in canonical app** |
| `ProximityGlow.tsx` (root) | Present but **unimported** — dead code |
| Docs PNGs (`Argus_*.png`) | Real product screenshots used in **docs pages**, not landing |

---

### Demo UI position map (current)

```
[Nav sticky]
[Hero copy + CTAs]
[★ TrialUI 720px dashboard]  ← PRIMARY — currently in hero
[SocialProofTicker]
[Pipeline node strip]        ← secondary diagram
[AgentSetup prompt panel]    ← setup, not product UI
[Replay before/after]        ← secondary diagram
[Features accordion]         ← no visuals
[Stats] [Comparison] [FAQ]
[Footer]
```

For interfere.com-style redesign, expect to **pull TrialUI (or rebuilt screenshots) out of Hero** into scroll-pinned 01/02/03 narrative slots, and replace Features with screenshot-backed feature bands.

---

## 4. Design system

### 4.1 CSS custom properties (`app/globals.css` `:root`)

**Surfaces:** `--bg` `#07070a`, `--bg-soft` `#0c0c10`, `--surface` `#101015`, `--surface-2` `#161620`, `--border` `#1f1f2a`, `--border-strong` `#2a2a38`

**Type:** `--text` `#f5f5f7`, `--text-muted` `#8a8a99`, `--text-dim` `#4a4a5a`

**Accent (indigo/violet):** `--accent` `#6d5cff`, `--accent-soft` `#8b7dff`, `--accent-glow` `rgba(109,92,255,0.35)`

**Signals:** `--signal-ok` `#00f0a8`, `--signal-warn` `#f5b13c`, `--signal-fail` `#ff5a6a`

**Grid:** `--grid`, `--grid-strong`

### 4.2 Tailwind v4 theme (`@theme inline`)

Maps colors: `--color-bg/surface/border/text/muted/accent/ok/warn/fail`  
Fonts: `--font-sans` → Geist, `--font-mono` → JetBrains Mono, `--font-serif` → Instrument Serif  
Animation token: `--animate-gradient-shift`

Import: `@import "tailwindcss";` (no classic `tailwind.config.js` theme — CSS-first v4).

### 4.3 Fonts (`app/layout.tsx`)

Loaded via `next/font/google`:
- **Geist** → `--font-geist` (primary UI)
- **Inter** → `--font-inter` (used explicitly in Replay)
- **JetBrains Mono** → `--font-mono`
- **Instrument Serif** (400, italic) → `--font-serif` (editorial accents)

`public/fonts/` exists but is **empty**. OG image historically tried local TTF (Dancing Script) per git history; current `opengraph-image.tsx` does not require `public/fonts/`.

### 4.4 Utility / animation classes in globals

| Class / keyframe | Role |
|------------------|------|
| `.eyebrow` / `.eyebrow-dim` | Mono uppercase labels |
| `.panel` / `.panel-tight` | Card surfaces |
| `.grid-bg` / `.dots-bg` | Background patterns |
| `.btn-primary` / `.btn-ghost` | Button styles (partially superseded by UI kit) |
| `.fade-up` | Entrance |
| `.live-dot` / `pulse-ok` | Live indicator |
| `.caret` / `blink` | Terminal caret |
| `.glow-warn` / `pulse-warn` | Pipeline warn node |
| `.arrow-flow` / `flow` | Dashed connector motion |
| `.modal-glow-border` / `modal-border-spin` | Waitlist success border |
| `.argus-wordmark` | Footer giant outlined wordmark → gradient fill on hover |
| `.replay-card` / `replay-shimmer` | Replay card hover |
| `.nav-link` | Underline hover |
| `.feature-cell` / `.proof-card` | Hover lifts |
| `.copy-pulse` | Copy feedback |
| `.pipeline-node` | Node hover scale |
| `ticker-left` / `ticker-right` | Social proof marquee |
| `.trial-ui` scrollbar hide | Demo chrome |
| Mobile `html { zoom: 0.8 }` @ ≤640px | Global mobile scale (high redesign risk) |

Body: dual radial gradients (accent + ok tint) on dark base.

### 4.5 Color usage pattern
Dark editorial forensic look: near-black backgrounds, violet accent for brand, green/amber/red signal triad for pipeline states. Gradient text (warn→pink→purple, or accent soft italic) used heavily in section H2s. Avoid assuming light mode — site is dark-only.

---

## 5. Reusable primitives

### `components/ui/`

| File | Lines | Notes |
|------|------:|-------|
| `button.tsx` | ~55 | shadcn-style CVA Button + Radix Slot; generic variants (`default/destructive/outline/...`) — **not wired to Argus CSS vars** |
| `button-colorful.tsx` | ~43 | Gradient blur pill CTA (“Book a Call”); wraps `Button` |
| `star-button.tsx` | ~113 | Animated star-border CTA (“Read the docs”); client |
| `liquid-metal-button.tsx` | ~324 | **@paper-design/shaders** liquid metal Waitlist button; client; high coupling / perf cost |
| `morphing-text.tsx` | ~118 | Character morph cycling words; used in Hero H1 |

### `lib/utils.ts`
```ts
cn(...inputs) // clsx + tailwind-merge
```
Only shared util.

**Usage notes:** Landing CTAs mix CSS classes (`.btn-primary`) and UI kit. Redesign should consolidate on one button system.

---

## 6. `public/` asset inventory

| Asset | Used where |
|-------|------------|
| `argus-logo.png` | `Logo.tsx` (Nav, Footer) |
| `Argus_Arch.png` | Docs: Introduction, Architecture |
| `Argus_Core.png` | Docs: CoreConcepts |
| `Argus_Approvals.png` | Docs: AdaptiveLearning |
| `Argus_Common_Private.png` | Docs: AdaptiveLearning |
| `Argus_DetectionLayers.png` | **Unused** (orphan) |
| `Argus_OG.png` | **Likely unused** by current dynamic `opengraph-image.tsx` (static file remains) |
| `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` | Create-Next-App leftovers — **unused** |
| `public/docs/` | Empty dir |
| `public/fonts/` | Empty dir |

Landing page currently has **zero product screenshot images** — all demos are live JSX.

---

## 7. REFACTOR MAP (interfere.com-style redesign)

Target structure:
1. Hero (brand-forward, minimal first viewport)
2. Scroll-pinned numbered narrative **01 / 02 / 03** with product-UI visuals
3. Three feature sections with **gradient-backed demo screenshots**
4. Testimonial
5. Security
6. Changelog
7. Footer

### Per-component disposition

| Component | Disposition | Notes |
|-----------|-------------|-------|
| **`TrialUI`** | **Rewrite or relocate + restyle** | Core demo asset. Relocate out of Hero into 01/02/03 (or replace with screenshot sequences + lighter interactive islands). 1430 lines — high rewrite cost; consider splitting panels into `demo/` modules |
| **`Hero`** | **Rewrite** | Must slim to brand + one headline + one sentence + CTA; remove embedded TrialUI from first viewport |
| **`Pipeline`** | **Relocate / rewrite** | Strong candidate for narrative step **01** visual (or feed into TrialUI “runs/pipeline” framing). Restyle to match pinned narrative |
| **`Replay`** | **Relocate / rewrite** | Candidate for narrative **02** or **03** (before/after + reuse). Overlaps TrialUI Compare panel — avoid duplicating same story twice |
| **`AgentSetup`** | **Restyle or relocate** | Keep content (install/prompt is valuable); may become a post-narrative “Get started” band, not mid-demo |
| **`Features`** | **Rewrite** | Needs screenshot-backed feature sections; current accordion insufficient for interfere pattern |
| **`SocialProofTicker`** | **Restyle or relocate** | Closest to “testimonial”; may become dedicated testimonial section or stay as social proof under hero |
| **`Stats`** | **Delete or merge** | interfere pattern doesn’t emphasize big counter strips; fold into narrative or drop |
| **`Comparison`** | **Delete or relocate** | Competitive table ≠ interfere structure; optional later page or footer-adjacent |
| **`FAQ`** | **Keep as-is or restyle** | Optional below changelog; low risk |
| **`Nav`** | **Restyle** | Keep modal wiring (Waitlist/Cal/Contact); update links for new section IDs |
| **`Footer`** | **Restyle** | Keep pip install + wordmark; add changelog/security anchors if needed |
| **`Logo`** | **Keep as-is** | |
| **Modals** (`Waitlist`, `BetaAccess`, `Contact`, `Video`) | **Keep as-is** | High coupling to Nav/Hero CTAs and Cal.com — do not casually rewrite |
| **`Pricing`** | **Keep as-is** | Separate route `/pricing` |
| **`ProximityGlow`** | **Delete** (root unused) | Or revive only if redesign needs it |
| **UI kit buttons** | **Restyle / consolidate** | Especially LiquidMetal (shader) vs redesign aesthetic |
| **`MorphingText`** | **Keep or drop** | Hero-dependent |
| **`argusweb/` entire tree** | **Delete** (after confirming no deploy refs) | Stale duplicate |
| **`app/docs/**`** | **Leave untouched** | Explicit: docs redesign out of scope |
| **`app/api/waitlist/route.ts`** | **Leave untouched** | Env-coupled Sheets integration |
| **`layout.tsx` / metadata / OG / robots / sitemap** | **Keep; restyle fonts only if brand changes** | |
| **`globals.css` tokens** | **Restyle** | Tokens can stay as base; expect new motion utilities for scroll-pinning |
| **New: Security section** | **Create** | No current dedicated security marketing section (docs Storage has security callouts) |
| **New: Changelog section** | **Create** | TrialUI sidebar lists “Changelog” but landing has no section; may link to docs or static list |
| **New: scroll-pin / sticky narrative shell** | **Create** | No existing scroll-pinned 01/02/03 infrastructure |

### Risk / high-coupling flags

| Area | Risk | Guidance |
|------|------|----------|
| **Modals + Cal.com + Waitlist API** | High | Preserve contracts; redesign can restyle chrome only |
| **`LiquidMetalButton` / shaders** | Medium–High | WebGL cost; may clash with new visual language |
| **Mobile `zoom: 0.8` on `html`** | High | Breaks layout math for sticky/pin; revisit early |
| **Nearly all landing = `"use client"`** | Medium | Opportunity to push static sections to RSC; TrialUI must stay client |
| **TrialUI size + mock fidelity** | High | Relocation without rewrite still ships heavy JS above fold if left in hero |
| **Docs tree + registry** | High if touched | Leave alone |
| **`.env.local` / Sheets credentials** | Critical | Do not commit; waitlist depends on them |
| **Duplicate `argusweb/`** | Agent confusion | Delete or quarantine before multi-agent redesign |
| **Empty `public/fonts` + orphan PNGs** | Low | Clean up opportunistically |

### Suggested mapping to interfere.com sections

| Target section | Source material |
|----------------|-----------------|
| Hero | Slim `Hero` (no TrialUI) |
| 01 narrative + product UI | Slice of TrialUI Runs/Overview **or** restyled `Pipeline` |
| 02 narrative + product UI | TrialUI Pipeline / AI Analysis **or** restyled `Replay` before/after |
| 03 narrative + product UI | TrialUI Compare / Approvals |
| Feature ×3 + gradient screenshots | New — use docs PNGs (`Argus_Arch`, `Argus_Core`, `Argus_Approvals`) as interim assets or capture fresh |
| Testimonial | Condensed `SocialProofTicker` or single quote |
| Security | New (BYOK / local runs / redaction messaging already in AgentSetup + docs) |
| Changelog | New lightweight list or link out |
| Footer | Restyled `Footer` |
| Get started / install | Relocated `AgentSetup` |

### Implementation order (recommended)
1. Confirm delete/quarantine of `argusweb/`
2. Extract `TrialUI` from Hero; slim Hero
3. Build scroll-pin narrative shell (read Next 16 client/server + layout docs first)
4. Assign TrialUI panels (or screenshots) to 01/02/03
5. Rewrite Features into three screenshot bands
6. Add Security + Changelog; restyle Nav/Footer
7. Defer FAQ/Comparison/Stats decisions; leave docs + waitlist API untouched

---

## Appendix A — Root landing import graph

```
page.tsx
  ├─ Nav → Logo, WaitlistModal, BetaAccessModal, ContactModal, LiquidMetalButton, ButtonColorful
  ├─ Hero → MorphingText, ButtonColorful, StarButton, BetaAccessModal, VideoModal, TrialUI
  ├─ SocialProofTicker
  ├─ Pipeline
  ├─ AgentSetup
  ├─ Replay
  ├─ Features
  ├─ Stats
  ├─ Comparison
  ├─ FAQ
  └─ Footer → Logo
```

## Appendix B — Git snapshot (read-only)

- Recent HEAD focuses on docs + AgentSetup copy (`4f2a7b6`, `ecc8843`, …)
- TrialUI introduced in redesign commit `8dda8c0` (“Linear-style redesign with interactive trial UI…”)
- Initial site: `aa93360`
- Working tree at audit time: untracked `docs-redesign/` only (this audit target)

---

*End of audit. No application code was modified; only this file was written.*
