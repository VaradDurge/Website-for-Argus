# Argus Marketing Redesign — Interfere Design Specification

**Status:** Spec only (no implementation)  
**Reference site:** [https://interfere.com/](https://interfere.com/)  
**Source of tokens:** live HTML + `globals-C7Kkhpzg.css` / marketing JS bundles from `assets.interfere.com` (fetched 2026-08-16)  
**Product context:** ARGUS is a production-readiness / forensic observability platform for AI agent pipelines (LangGraph and plain Python). It detects silent failures, traces root cause, and supports execution replay — see `app/docs/pages/Introduction.tsx`, `app/components/Hero.tsx`, `TrialUI.tsx`, `Pipeline.tsx`, `Replay.tsx`.

---

## 0. Product summary (Argus)

ARGUS wraps agent pipelines (`ArgusWatcher.attach(graph)`), instruments every node/tool/state transition, and runs multi-layer detection (heuristics, anomaly, correlator, LLM investigator) for failures that never throw. Core marketing promises today:

- Catch silent failures before deploy
- Trace root cause through the graph
- Replay any node with frozen upstream state
- Zero-config instrumentation (pip install + few lines)

The redesign keeps that story but adopts Interfere’s **structure, density, hairline chrome, and scrollytelling rhythm**.

---

## 1. Interfere design-token deconstruction

### 1.1 Color palette (light marketing surface)

Interfere’s marketing site is a **light** system built on Radix-style scales + semantic aliases.

| Role | Token / value | Notes |
|------|----------------|-------|
| Page background | `--color-page` → `#fff` | Primary canvas |
| Shell / recessed | `--color-shell` → `oklch(97.3% 0 0)` ≈ `#F7F7F7` | Soft off-white behind cards |
| Surface / card | `--color-card` → `--gray-a2` (`#00000006`) | Near-invisible fill |
| Container recessed | `--gray-1` → `#FCFCFC` | |
| Standout / inverted solid | `--gray-12` → `#202020` / `--color-inverted-solid` | Primary CTA fill |
| Border default | `--color-border-default` → `--gray-a3` (`#0000000f`) | **0.5px** hairlines in UI chrome |
| Border strong | `--color-border-strong` → `--gray-a6` | |
| Text primary | `--color-primary-foreground` → `--gray-a12` (`#000000df`) | Near-black |
| Text secondary | `--color-secondary-foreground` → `--gray-a11` | Body / muted |
| Text tertiary / muted | `--color-tertiary-foreground` → `--gray-a9` | Eyebrows, labels |
| Text disabled | `--color-disabled-foreground` → `--gray-a8` | |
| Brand (accent) | `--blue-9` `#0090FF`, `--blue-10` `#0588F0` | Links, brand solid |
| Warning | `--orange-9` `#F76B15`, `--orange-10` `#EF5F00` | Priority chips |
| Danger | tomato scale (`--tomato-a*`) | Bad code lines |
| Positive | green scale | Fixed code lines |
| Hero frost panel | `#EBEBEB` at 70% + `backdrop-blur: 20px` | Product demo cradle |
| Shadow border | `--shadow-border-color` `#00000012` | Used as `0 0 0 0.5px` ring |

**Gray scale (light, hex):**  
`#FCFCFC` (1) → `#F9F9F9` (2) → `#F0F0F0` (3) → `#E8E8E8` (4) → `#E0E0E0` (5) → `#D9D9D9` (6) → `#CECECE` (7) → `#BBB` (8) → `#8D8D8D` (9) → `#838383` (10) → `#646464` (11) → `#202020` (12)

### 1.2 Signature gradient stops (hero + “Fix problems” glow)

Two closely related horizontal rainbow washes appear behind product imagery (low opacity, heavily blurred — atmosphere, not a solid fill).

**Hero orb** (`blur-[50px]`, pill shape `rounded-[300px]`):

```text
linear-gradient(90deg,
  rgba(255, 59, 0, 0.20) 0%,
  rgba(246, 0, 157, 0.20) 38%,
  rgba(151, 62, 198, 0.20) 71%,
  rgba(0, 142, 255, 0.20) 100%)
```

**Testimonial / section bottom glow** (`blur-[100px]`):

```text
linear-gradient(90deg,
  rgba(239, 95, 0, 0.20) 0%,
  rgba(194, 0, 122, 0.156) 37.5%,
  rgba(83, 0, 158, 0.144) 70.67%,
  rgba(0, 134, 240, 0.196) 100%)
```

**In-UI accent washes (code diff rows):**

- Danger line: `bg-linear-to-r from-danger-subtle/60 to-transparent` + tomato multiply overlay  
- Positive line: `bg-linear-to-r from-positive-subtle/60 to-transparent` + green multiply overlay  
- Card fades: `bg-linear-to-b from-card to-transparent`, `bg-linear-to-br from-card to-transparent`  
- Bottom vignette on mini cards: `bg-linear-to-b from-transparent to-page`

There is **no tilted/skewed screenshot card**. Product UI is flat, framed in hairline chrome, with the rainbow used only as a **blurred backlight**.

### 1.3 Typography

| Role | Family | Weight | Size | Tracking | Line-height |
|------|--------|--------|------|----------|-------------|
| UI / body | **Inter Variable** (`--font-inter`) | 400 / 450 (`semimedium`) / 500 | Body scale below | default / `-2%` on hero words | 1.25–1.5rem |
| Display italic accent | **Redaction 35** (`--font-redaction-35`) | 400 italic | Hero “breaks”: `38px` → `lg:59px` | `-3%` | `leading-none` |
| Quote serif | **Heldane Text** (`--font-heldane-text`) | 400 | `text-heading-5` → `md:text-heading-4` | — | — |
| Mono (eyebrows, step nums, code) | **Departure Mono** + **Berkeley Mono** | 400 | Eyebrow `0.75rem` / step `10px` | Departure for labels | `leading-none` |

**Font scale** (`--spacing: 0.25rem` = 4px):

| Token | Calc | ≈ px |
|-------|------|------|
| `--font-scale-00` | `2 * spacing` | 8 |
| `--font-scale-01` | `2.5 * spacing` | 10 |
| `--font-scale-02` | `2.5 * spacing + 1px` | 11 |
| `--font-scale-03` | `3 * spacing` | 12 |
| `--font-scale-04` | `3 * spacing + 1px` | 13 |
| `--font-scale-05` | `3.5 * spacing + 1px` | **15** (body base) |
| `--font-scale-06` | `4.5 * spacing` | 18 (body lg) |
| `--font-scale-07` | `5 * spacing` | 20 (heading-6) |
| `--font-scale-08` | `6 * spacing` | 24 (heading-5) |
| `--font-scale-09` | `7 * spacing` | 28 (heading-4) |
| `--font-scale-10` | `9 * spacing` | 36 (heading-3) |
| `--font-scale-11` | `11 * spacing` | 44 (heading-2) |
| `--font-scale-12` | `14 * spacing` | **56** (heading-1) |

Heading utilities use `letter-spacing: -0.01em`. Hero word spans use `tracking-[-2%]`.

**Eyebrow pattern:** Departure Mono, `0.75rem`, uppercase, `leading-none`, secondary/tertiary color — never a pill badge.

### 1.4 Spacing, container, radius, borders, shadows

| Token | Value |
|-------|--------|
| Spacing unit | `--spacing: 0.25rem` (4px) |
| Content max | `--constrained-max: 1200px` (+ horizontal padding `px-6` / `sm:px-5.5`) |
| Section padding | `py-16 md:py-24` (features); `py-16 md:py-36` (how-it-works); `py-24 md:py-30` (changelog) |
| Hero padding | `pt-12 pb-16 lg:pt-36 lg:pb-12` |
| Hairline | `border-[0.5px]`, outlines `0.5px` / `-outline-offset-1` |
| Radii | Cards `rounded-2xl` (16px); inner panels `rounded-[10px]` / `rounded-lg`; large blocks `rounded-3xl` (24px); buttons `rounded` ≈ 8px; pills rare |
| Product cradle shadow (hero) | Multi-stop soft stack: `0 0 0 0.5px` border ring + drops at 149px / 62px / 33px / 19px / 10px / 4px with alphas `0.07 → 0.02` |
| Default control shadow | `0 0 0 0.5px` + 1px soft drops (`--s-default`) |
| Glow | Rainbow blur orbs only — **no neon / purple glow language** |

### 1.5 Motion

| Behavior | Implementation |
|----------|----------------|
| Entrance | Framer Motion: start `translateY(20%)` + `blur(10px)` + `opacity:0` → clear; stagger on hero words |
| Easing | `--ease-out: cubic-bezier(0, 0, .2, 1)`; also `.25,.46,.45,.94` / `.23,1,.32,1` |
| Durations | UI transitions `150–300ms`; longer reveals `~400–600ms`; border-beam `4.2s` loop |
| How-it-works sync | **Not CSS `position: sticky`.** Desktop: autoplay cycle every **3s** across cards 0–2. Mobile/narrow: `IntersectionObserver` thresholds `[0.2,0.4,0.6,0.8,1]` picks the most-visible `data-how-it-works-card-index`. Active card `opacity-100`; inactive `opacity-60` (dark `opacity-40`). Narrative headline number chips highlight with `bg-brand-subtle` / `bg-component` behind the active phrase. |
| Card opacity | `transition-opacity duration-300 ease-out` |
| Logo wall | Masked marquee; cascade rect animation with staggered delays |
| Buttons | `scale(0.97)` on active for `.int-btn-scales` |
| `prefers-reduced-motion` | `motion-reduce:transition-none` on some highlights |

---

## 2. Interfere page structure (top → bottom)

### 2.1 Nav

- Slim top bar: logo left; centered desktop nav (`Product`, `Careers`, `Changelog`, Docs external); right CTAs (`Log in`, `Get Early Access`).
- Nav items: `h-7`, `text-body-sm`, secondary → primary on hover with `gray-4` wash — **not** heavy glass pills.

### 2.2 Hero — and where the product demo first appears

**Layout:** `@container` row on large screens:

1. **Left:** H1 — “Ship software that” + Redaction italic **“never breaks”** (`text-heading-3` → `lg:text-heading-1`, tracking tight).
2. **Right (aligned end):** H2 subtitle (secondary, max-w-lg, right-aligned on lg) + CTA pair (`Get Early Access` secondary, `Request a demo` primary/inverted).
3. **Below the copy row (full width):** the **primary product demo** — `data-testid="hero-illustration"`.

**Hero demo presentation (critical):**

- Frosted cradle: `bg-[#EBEBEB]/70`, `backdrop-blur-[20px]`, `rounded-2xl`.
- Height: `h-160` (40rem / 640px) → `md:h-200` (50rem / 800px); `min-w-360` (90rem / 1440px) — wide landscape panel.
- Soft multi-layer drop shadow + 0.5px ring.
- Behind it: rainbow blur orb (`h-160 w-374` → `md:h-214`, `blur-[50px]`).
- **Framing:** nested **app shell**, not a browser URL chrome and not a floating tilted screenshot. Left icon rail + main workspace showing an issue titled **“Broken password reset link”** (avatars, Inbox breadcrumb, investigation UI).
- Aspect of cradle ≈ **1440×800 ≈ 9:5** (desktop); content is cropped inside overflow-hidden.

### 2.3 Logo / social proof strip

- Label chip: “Trusted and funded by” (bordered, tertiary).
- Horizontal logo marquee with edge fade masks.
- Section `pt-12 pb-12` with bottom hairline.

### 2.4 How-it-works narrative (“finds / understands / owns resolution”)

**Headline (centered, large):**  
“Interfere finds **01** issues in your app, understands **02** what’s happening, and owns resolution **03** from first signal to production.”  
Number chips are Departure Mono `10px`, with highlight pills behind the active clause.

**Below: three-column grid** (`grid-cols-1 lg:grid-cols-3`, `gap-10`), section `py-16 md:py-36`.

Each column (`data-how-it-works-card-index`):

| Part | Spec |
|------|------|
| Visual | `h-50` (12.5rem / **200px**) full column width; outer `rounded-2xl border-[0.5px] p-1`; inner product mini-UI |
| Fade | Bottom `h-10` gradient to page |
| Number | `01` / `02` / `03` Departure Mono 10px |
| Copy | H3 body-base medium + secondary body paragraph |

**Visuals per step (mini):**

| Step | Content |
|------|---------|
| 01 Detect | Issue card `#112` “Reset password flow issue”, “Investigating…”, “Medium priority”, skeleton bars |
| 02 Understand | Syntax-highlighted code snippet with staging URL highlighted as wrong |
| 03 Fix | Related code / resolution affordance (timeline-adjacent UI) |

**Scroll / “pin” behavior (accurate):** There is **no sticky side panel**. On desktop cards sit side-by-side and **autoplay** highlights; on smaller viewports stacked cards drive highlight via **IntersectionObserver**. The *headline* updates emphasis so it *feels* like a pinned narrative.

Column split: **not** 50/50 sticky — it is **equal 1/1/1 cards**. The large sticky-feeling product UI the user may remember is closer to the **hero cradle** + later **feature detail panels**.

### 2.5 Feature sections 01 / 02 / 03 (full-bleed product panels)

Each section: `overflow-x-clip py-16 md:py-24`, constrained `1200px`, **`md:grid-cols-2`**:

**Left column** (`max-w-120`, `md:py-12`):

- Mono step number (`01`…)
- H2 `text-heading-4`
- Body secondary
- Capability label (e.g. “Full-stack understanding”)
- 1px divider
- Tag list in 2-col grid (`text-body-sm` secondary) — **not** pill chips; plain text rows

**Right column — product demo (second major placement):**

- Frame height: `h-120` (30rem / **480px**) → `md:h-160` (**640px**)
- Visual width: `w-300` (**1200px**) absolutely positioned `inset-y-0 -right-50 left-0` — **bleeds off the right edge** of the container (`overflow` clipped by section)
- Outer: `rounded-2xl border-[0.5px] bg-card` with left icon rail (app chrome, not OS browser chrome)
- Inner: `rounded-[10px] bg-page` workspace
- Aspect of visible stage ≈ **1200×640 ≈ 15:8** (desktop); heavily right-cropped on smaller widths
- **No tilt/rotate**; flat; hairline only; optional rainbow blur behind (section-level)

| Section | Title | Tags / label | Detail UI |
|---------|-------|--------------|-----------|
| 01 | Learn about issues before your customers do | Full-stack understanding · User Tracking, Logging & Alerting, Session Replays, Predictive Analysis, Release Tracking | App shell → Inbox → issue investigation |
| 02 | Understand what’s going wrong | Zero-touch triage · Prioritization, User Impact, Team Routing, Root Cause Analysis | Root-cause / code explanation (diff highlights) |
| 03 | Fix problems with confidence | Built for speed & teams · Multiplayer, SSO, Offline-first, SCIM, Roles, Domain Whitelisting | Issue `#120` / fix tracking / code action UI + rainbow backlight |

### 2.6 Testimonial

- Large `rounded-3xl` card (`bg-card`, soft outline), `px-6 py-24 md:p-30`
- Heldane serif quote, centered
- Avatar + name + company logo
- Rainbow blur at bottom of card

### 2.7 Security

- Same card language: `rounded-3xl`, split `lg:flex-row`
- Eyebrow “Security”; H2 “Secure by design.” + tertiary “Safe by default.”
- SOC 2 / GDPR & ISO copy blocks
- Link out to trust center

### 2.8 Changelog

- Eyebrow + “The Latest”
- 3 columns (`md:grid-cols-3`); each item top hairline, date in Departure Mono, title + excerpt, hover arrow

### 2.9 Footer

- Closing H2 echo of hero (“Ship software that never breaks”)
- Link columns + legal; restrained, lots of whitespace

---

## 3. Argus translation

### 3.1 Design direction

Interfere = light, blue brand, production-bug ops.  
Argus = **keep dark forensic identity** (existing site) but adopt Interfere’s **token architecture, hairlines, mono eyebrows, 1200px constraint, hero cradle + how-it-works cards + 2-col feature bleeds**.

Avoid: purple glow stacks, pill forests, stat strips in the hero, tilted glass cards.

### 3.2 Argus CSS custom properties (Tailwind v4 / `@theme inline` compatible)

Place in `:root` and mirror into `@theme inline` as `--color-*` / `--font-*` for utility generation.

```css
:root {
  /* ─── spacing & layout ─── */
  --spacing: 0.25rem;
  --constrained-max: 1200px;
  --section-y: calc(var(--spacing) * 16);      /* 64px */
  --section-y-md: calc(var(--spacing) * 24);   /* 96px */
  --section-y-lg: calc(var(--spacing) * 36);   /* 144px how-it-works */

  /* ─── surfaces (dark Interfere-structure) ─── */
  --color-page: #07070a;
  --color-shell: #0c0c10;
  --color-container: #101015;
  --color-card: rgba(255, 255, 255, 0.03);
  --color-component: rgba(255, 255, 255, 0.06);
  --color-component-hover: rgba(255, 255, 255, 0.09);

  /* ─── borders ─── */
  --color-border-default: rgba(255, 255, 255, 0.08);
  --color-border-subtle: rgba(255, 255, 255, 0.05);
  --color-border-strong: rgba(255, 255, 255, 0.14);
  --hairline: 0.5px;

  /* ─── text ─── */
  --color-primary-foreground: #f5f5f7;
  --color-secondary-foreground: #8a8a99;
  --color-tertiary-foreground: #4a4a5a;
  --color-disabled-foreground: #3a3a48;

  /* ─── brand / signals (Argus, not Interfere blue) ─── */
  --color-brand-solid: #00f0a8;          /* signal-ok as brand spark */
  --color-brand-foreground: #5cffc4;
  --color-brand-subtle: rgba(0, 240, 168, 0.12);
  --color-warning-solid: #f5b13c;
  --color-danger-solid: #ff5a6a;
  --color-inverted-solid: #f5f5f7;       /* primary CTA on dark */
  --color-on-inverted-foreground: #07070a;

  /* ─── demo cradle (dark analog of #EBEBEB frost) ─── */
  --color-demo-cradle: rgba(22, 22, 32, 0.85);
  --color-demo-cradle-border: rgba(255, 255, 255, 0.1);

  /* ─── rainbow atmosphere (Interfere stops, tuned for dark) ─── */
  --gradient-hero-orb: linear-gradient(
    90deg,
    rgba(255, 59, 0, 0.18) 0%,
    rgba(246, 0, 157, 0.16) 38%,
    rgba(151, 62, 198, 0.14) 71%,
    rgba(0, 240, 168, 0.18) 100%
  );
  --gradient-section-glow: linear-gradient(
    90deg,
    rgba(239, 95, 0, 0.16) 0%,
    rgba(194, 0, 122, 0.12) 37.5%,
    rgba(83, 0, 158, 0.12) 70.67%,
    rgba(0, 240, 168, 0.16) 100%
  );

  /* ─── type ─── */
  --font-sans: var(--font-geist), "InterVariable", ui-sans-serif, system-ui, sans-serif;
  --font-display-italic: var(--font-serif), "Redaction35", ui-serif, Georgia, serif;
  --font-mono-label: var(--font-mono), "DepartureMono", ui-monospace, monospace;
  --font-mono-code: var(--font-mono), "BerkeleyMono", ui-monospace, monospace;

  --font-scale-00: calc(var(--spacing) * 2);
  --font-scale-01: calc(var(--spacing) * 2.5);
  --font-scale-02: calc(var(--spacing) * 2.5 + 1px);
  --font-scale-03: calc(var(--spacing) * 3);
  --font-scale-04: calc(var(--spacing) * 3 + 1px);
  --font-scale-05: calc(var(--spacing) * 3.5 + 1px);
  --font-scale-06: calc(var(--spacing) * 4.5);
  --font-scale-07: calc(var(--spacing) * 5);
  --font-scale-08: calc(var(--spacing) * 6);
  --font-scale-09: calc(var(--spacing) * 7);
  --font-scale-10: calc(var(--spacing) * 9);
  --font-scale-11: calc(var(--spacing) * 11);
  --font-scale-12: calc(var(--spacing) * 14);

  --tracking-hero: -0.02em;
  --tracking-display-italic: -0.03em;
  --tracking-heading: -0.01em;
  --tracking-eyebrow: 0.12em;

  --radius-panel: 1rem;          /* 16px ≈ rounded-2xl */
  --radius-inner: 10px;
  --radius-block: 1.5rem;        /* 24px */
  --radius-control: 0.5rem;

  --shadow-demo: 0 0 0 0.5px rgba(255, 255, 255, 0.08),
    0 40px 80px -20px rgba(0, 0, 0, 0.65);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --duration-ui: 200ms;
  --duration-reveal: 500ms;
}

@theme inline {
  --color-page: var(--color-page);
  --color-shell: var(--color-shell);
  --color-card: var(--color-card);
  --color-border: var(--color-border-default);
  --color-text: var(--color-primary-foreground);
  --color-muted: var(--color-secondary-foreground);
  --color-brand: var(--color-brand-solid);
  --color-warn: var(--color-warning-solid);
  --color-fail: var(--color-danger-solid);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono-code);
  --font-serif: var(--font-display-italic);
}
```

### 3.3 Argus section-by-section page plan

Mirror Interfere’s order; replace content with Argus messaging.

| # | Section | Argus content | Demo UI? |
|---|---------|---------------|----------|
| A | **Nav** | Logo · Product · Docs · Changelog · GitHub · `Book a Call` / `Get Beta` | No |
| B | **Hero** | Brand-level: **ARGUS** as primary signal; H1 e.g. “Your agent finished. But did it actually *work?*” (serif italic on morphing verb). One supporting sentence on silent failures. CTAs: Book a Call + Read the docs. Install line secondary. | **YES — primary demo cradle (same slot as Interfere hero-illustration)** |
| C | **Social proof** | “Built for teams shipping agents” + logo/name ticker (frameworks: LangGraph, LangChain, Prefect, Temporal — or design partners) | No |
| D | **How it works narrative** | “ARGUS **detects** 01 silent failures, **explains** 02 root cause, and **replays** 03 the broken node until it’s fixed.” Three cards with mini UIs; IO + 3s autoplay | **YES — three mini CardAssets** |
| E | **Feature 01** | “Catch failures before they ship” · label “Multi-layer detection” · tags: Heuristic signatures, Anomaly detection, Semantic judge, Contract validators, CI gating | **YES — DetailAsset bleed** |
| F | **Feature 02** | “Know which node actually broke” · label “Forensic root cause” · tags: Graph walkback, State diffs, Tool-call forensics, Downstream impact | **YES — DetailAsset bleed** |
| G | **Feature 03** | “Replay and verify with confidence” · label “Built for engineers who ship” · tags: Frozen upstream state, Node replay, Output diff, HTTP record/mock, Strict mode | **YES — DetailAsset bleed + rainbow glow** |
| H | **Testimonial / quote** | Heldane-style serif block (placeholder until real quote) | Glow only |
| I | **Security / trust** | Redaction, local-first traces, no training on customer code (as applicable) | No |
| J | **Changelog / Latest** | Three recent product notes | No |
| K | **Footer** | Wordmark, Docs / GitHub / Discord, install command | No |

**Remove from first viewport vs current Argus:** Stats strip, comparison table, FAQ — move below or drop from landing to match Interfere’s quieter lower half. Keep FAQ as a later fold or docs link.

### 3.4 Exact demo UI placement (parity with Interfere)

1. **Hero product demo (PRIMARY)**  
   - Position: **directly under** the hero copy/CTA row (Interfere: sibling below the `@container` flex row; full constrained width).  
   - Presentation: frosted/dark **cradle** `rounded-2xl`, ~**9:5** landscape (`min-width ~1440px` conceptual artboard, height ~640–800px), soft shadow, rainbow blur **behind** (not overlaid badges).  
   - Content: live or static **Argus app shell** (reuse `TrialUI` visual language): Runs list → selected run with silent-failure warning on `summarize`.  
   - **Do not** put the demo in a side column only; Interfere’s hero demo is a **full-bleed-under** composition.

2. **How-it-works mini demos (SECONDARY)**  
   - Position: inside the three equal columns under the narrative H2.  
   - Size: **200px** tall frames, hairline `rounded-2xl`, opacity-linked to active step.

3. **Feature detail demos (TERTIARY / largest storytelling)**  
   - Position: **right column** of each `md:grid-cols-2` feature section (alternate copy/visual if needed, but default copy-left / visual-right like Interfere 01).  
   - Size: stage **480×1200 → 640×1200**, right-edge bleed (`-right` overflow).  
   - Framing: app chrome rail + inner `10px` radius workspace — **not** browser chrome, **not** tilted media cards.

---

## 4. Demo-UI imagery inventory

Every distinct visual needed for the redesign. Prefer **composed React UI** (like current `TrialUI`) rendered to static frames or kept interactive; if exporting PNGs/WebP, use the aspect ratios below.

### 4.1 Hero

| ID | Purpose | Aspect | Depicts | Gradient treatment |
|----|---------|--------|---------|-------------------|
| `hero-cradle-runs` | Primary hero product demo | **9:5** (e.g. 1440×800) | Argus shell: sidebar (Observe/Analyze) + Runs table + one run selected with status mix (ok / warn silent failure / fail). Title bar “Runs” / pipeline name. | Rainbow orb **behind** cradle only (`--gradient-hero-orb`, blur 50px). Cradle fill `--color-demo-cradle`. No overlay chips. |

### 4.2 How-it-works CardAssets (h ≈ 200px, ~16:10 crop)

| ID | Purpose | Aspect | Depicts | Gradient treatment |
|----|---------|--------|---------|-------------------|
| `hiw-01-detect` | Step 01 mini | **16:10** (e.g. 480×300 artboard, cropped to 200px tall) | Detection card: issue “Silent failure in `summarize`”, status Investigating, Medium, skeleton confidence bars | Inner `from-card → transparent` vertical fade; bottom vignette to page |
| `hiw-02-understand` | Step 02 mini | **16:10** | Code/state panel: upstream node returned placeholder / missing field; highlighted offending lines | Danger-subtle → transparent on bad lines |
| `hiw-03-replay` | Step 03 mini | **16:10** | Replay control: “Replay from `summarize`”, frozen inputs badge, Verify diff affordance | Soft brand-subtle wash optional; bottom vignette |

### 4.3 Feature DetailAssets (bleed panels)

| ID | Purpose | Aspect | Depicts | Gradient treatment |
|----|---------|--------|---------|-------------------|
| `feat-01-detection-shell` | Feature 01 right panel | **15:8** (1200×640) | Full app: Inbox-style “Detections” list + detail “Placeholder summary returned — pipeline marked succeeded” | Section may use faint shell bg; **no** full-bleed rainbow required |
| `feat-02-root-cause` | Feature 02 right panel | **15:8** | Graph strip extract → enrich → **summarize (root cause)** → validate fail; inspector explaining upstream dict missing field | Warn color on root-cause node; optional danger/positive line washes in state JSON |
| `feat-03-replay-verify` | Feature 03 right panel | **15:8** | Replay workspace: original vs replayed output diff; “Strict mode” / CI gate toggle | **`--gradient-section-glow`** blurred behind panel (`blur ≈ 100px`), same structural role as Interfere’s “Fix problems with confidence” glow |

### 4.4 Optional supporting frames

| ID | Purpose | Aspect | Depicts | Gradient treatment |
|----|---------|--------|---------|-------------------|
| `quote-atmosphere` | Behind testimonial card | Full width × ~200px | Abstract only (no UI) | `--gradient-section-glow` |
| `hiw-headline-badges` | Not an image — CSS | — | Mono `01/02/03` highlight pills | `brand-subtle` fill when active |

---

## 5. Motion spec for Argus (Interfere-parity)

1. Hero: word-level reveal, `y: 20% → 0`, `blur: 10 → 0`, `opacity 0 → 1`, ease-out, stagger ~40–80ms; demo cradle delayed after copy.  
2. How-it-works: autoplay 3s on `lg+`; IntersectionObserver on small screens; sync headline chip highlight to `activeIndex`.  
3. Feature sections: simple `whileInView` fade/slide once; no scroll-jacking.  
4. Durations: UI 150–300ms; reveals 400–600ms; honor `prefers-reduced-motion`.

---

## 6. Implementation notes (for later — not in this change)

- Rebuild landing `app/page.tsx` section order to match §3.3.  
- Extract shared `DemoCradle`, `HowItWorks`, `FeatureBleed` primitives.  
- Reuse `TrialUI` internals for `hero-cradle-runs` / feature assets rather than inventing a second visual language.  
- Tailwind v4: map tokens via `@theme inline`; prefer `border-[length:var(--hairline)]` for 0.5px.  
- Do **not** copy Interfere’s blue brand or Redaction licensing without checking; Argus may keep Geist + existing serif italic as the display accent.

---

## 7. Sources

- Live DOM / SSR HTML from `https://interfere.com/`  
- CSS: `https://assets.interfere.com/assets/globals-C7Kkhpzg.css`  
- Marketing bundles: `_marketing-*.js`, `detect-section-asset-*.js`, `problem-timeline-*.js`  
- Argus: `app/page.tsx`, `app/components/*`, `app/docs/pages/Introduction.tsx`, `app/globals.css`
