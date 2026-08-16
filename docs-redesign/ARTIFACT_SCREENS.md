# Argus Instrument — Claude design artifact

Source: https://claude.ai/code/artifact/890ebef5-354e-4049-b4ad-cc6d989d1fbc
Artifact title: **Argus Instrument** — "design spec · rev D"

Status: **PARTIAL**. Recovered from a full-page CDP capture (`artifact-screens/artifact-full.png`,
2880×16000 device px). The capture repeats the same top ~1100 CSS px eight times — the artifact
iframe never scrolled — so only the hero and section 01.1 were recovered. Sections 02–08 are
still outstanding.

> **Correction (attempt 3).** An earlier note here claimed the artifact was publicly viewable
> because the capture showed a "Sign in" button. **That inference was wrong** — see
> [Access log](#access-log-attempt-3) below. The artifact is private to the signed-in Claude
> account and every anonymous route returns "Page not found". Do not spend time re-testing
> anonymous access.

## Section index (from sidebar)

| # | Section | Captured |
|---|---------|----------|
| 01 | Foundations | Partial — hero + 01.1 Grounds & ink |
| 02 | Primitives | No |
| 03 | Data display | No |
| 04 | Feedback | No |
| 05 | Execution graph | No |
| 06 | Node anatomy | No |
| 07 | **Screens** | No — highest priority |
| 08 | Motion & a11y | No |

## Global spec (from the hero spec row)

| Field | Value |
|-------|-------|
| Accent | Iris, single |
| Signal hues | 5 · non-colliding |
| Typefaces | Geist / Geist Mono |
| Grid | 8 pt |
| Themes | **Light + dark** |

The sidebar carries a **"Light" toggle**, and every colour token is published as a
**light / dark pair**. The artifact was authored dual-theme; it merely rendered dark in the capture.

## Hero copy

Eyebrow: `INTERFACE SPECIFICATION`

Heading: "The instrument, not the **dashboard**." — "dashboard" set in a muted ink tone.

Body: "ARGUS watches agent pipelines for the failures that don't raise exceptions — a tool that
returns an empty array, a model that quietly emits a placeholder, a field silently dropped four
nodes upstream. This document defines every surface that reports those findings: **the token
system, every component in every state, and a working execution graph you can drag, pan and
interrogate.**"

## 01 Foundations

Principle: "Everything downstream is derived from these four scales. The rule that shapes all of
them: **colour is signal.** If a hue appears on screen and doesn't mean something, it's a bug."

### 01.1 Grounds & ink

Format is `token — #LIGHT / #DARK — role`.

| Token | Light | Dark | Role |
|-------|-------|------|------|
| `void` | `#F6F6F4` | `#161618` | Page ground |
| `panel` | `#FFFFFF` | `#1C1C1F` | Cards, workspace content |
| `raised` | `#FFFFFF` | `#26262A` | Controls, graph nodes |
| `rail` | `#EDEDEA` | `#111113` | Icon rail — floor of the ladder |
| `ex` | `#F2F2EF` | `#1A1A1D` | Explorer panel |
| `band` | `#E8E8E4` | `#222226` | Collapsible group header |
| `line` | `#E3E3DF` | `#2A2A2E` | Hairline / border |
| `line-2` | `#D6D6D1` | `#34343A` | Border, stronger |
| `line-3` | `#BEBEBB` | `#45454C` | Border, strongest |
| `ink` | `#1A1A1C` | `#ECECEF` | Primary text |
| `ink-2` | `#5A5A62` | `#A6A6AD` | Secondary text |
| `ink-3` | `#88888A` | `#7C7C85` | Muted text |

Swatches render as rounded rectangles (~6px radius) in a six-up grid, each with the token name in
Geist, the hex pair in Geist Mono below it, and the role in muted ink.

### Not yet recovered

`iris` accent ramp, the 5 signal hues (`ok`, `lime`, and others), and sections 02–08.

## Layout

- Left sidebar ~166px: ARGUS wordmark with hexagonal iris-tinted glyph, "design spec · rev D",
  numbered section list in Geist Mono, "Light" toggle button, then footnotes
  ("Geist · Geist Mono", "8 pt grid", "Light / dark").
- Content column starts ~200px from the left, text measure ~450px, full-bleed spec tables
  and swatch grids run to ~990px.
- Eyebrow labels: Geist Mono, uppercase, ~11px, wide tracking, muted ink.
- H1: ~48–56px, tight leading, two lines.
- Section headings: numeric prefix in iris Geist Mono, then title in Geist ~20px.

---

## Access log (attempt 3)

Attempt 3 used a real Playwright-driven Chromium (v151 / Chrome for Testing), launched fresh
with no cookies. Playwright does have first-class cross-origin iframe support, so the iframe
barrier that stopped attempts 1 and 2 is **not** the blocker. The blocker is authentication.

### What was tested and what came back

| Route | Result |
|-------|--------|
| `https://<id>.frame.claudeusercontent.com/` | **404** — body is literally `not found` |
| `…/index.html`, `…/artifact` on the same host | **404** |
| `https://<id>.claudeusercontent.com/` | **404** |
| `https://claude.ai/code/artifact/<id>` (anonymous) | 200 but titled **"Page not found – Claude"** |
| `https://claude.site/artifacts/<id>` | 302 → `claude.ai/public/artifacts/<id>`, then Cloudflare bot challenge |
| `https://claude.ai/public/artifacts/<id>` | 200 but **"Page not found"** |
| `https://claude.ai/share/<id>` | Cloudflare bot challenge |
| `https://claude.ai/api/artifacts/<id>` | **403** + Cloudflare challenge |
| `WebFetch` on the public artifact URL | Cloudflare interstitial only |
| Exa `web_fetch_exa` on all three URLs | `CRAWL_NOT_FOUND` / `CRAWL_UNKNOWN_ERROR` |

### Conclusions — treat these as settled

1. **The artifact is private, not public.** `claude.site/artifacts/<id>` is the canonical
   *published* artifact route and it redirects to `claude.ai/public/artifacts/<id>`, which
   returns "Page not found". If the artifact had ever been published, that URL would serve it
   to anyone. It has not been published.
2. **The frame host will never serve the artifact on its own.** Claude renders artifacts by
   having the authenticated parent page fetch the artifact body from the API and hand it to the
   sandbox iframe. The frame origin is a bare sandbox shell with no artifact of its own, which
   is why every path on it 404s. No amount of URL guessing will fix this.
3. **Cross-origin iframe access was never the real problem.** Any browser holding the owner's
   claude.ai session can read the frame with Playwright's frame APIs. Any browser without it
   gets nothing to read.
4. **Cloudflare bot challenges guard the API and share routes.** Per the task constraints these
   were not solved.

### Why attempt 3 could not finish

- The Playwright MCP server (`plugin-everything-claude-code-playwright`) is unusable: it is
  configured in extension-bridge mode and fails with *"Extension connection timeout. Make sure
  the 'Playwright MCP Bridge' extension is installed."* Work-around used: a standalone
  Playwright install driven from the shell, which worked fine.
- The Cursor IDE browser — the one browser in this environment that **does** carry the user's
  claude.ai session, and the one that produced the attempt-1/2 capture — was unavailable:
  `browser_navigate` returned *"No browser tab available"*, and a tab created via
  `browser_tabs` was disposed before it could be navigated.

So: a working browser with no session, and a session with no working browser.

---

## How to unblock this — pick one (in order of preference)

### Option 1 — download the artifact HTML from the Claude UI (easiest, no tooling)

This is by far the best outcome, because the HTML source beats any screenshot: it carries the
exact hex values, class names, inline styles and every string of copy.

1. Open <https://claude.ai/code/artifact/890ebef5-354e-4049-b4ad-cc6d989d1fbc> while signed in.
2. Use the artifact's own **Copy** or **Download** control (top-right of the artifact panel), or
   open the artifact in a normal browser tab and use *File → Save Page As…* / view-source and
   copy everything.
3. Save it as `docs-redesign/artifact-screens/artifact-source.html`.
4. Then run the render phase, which needs no credentials at all:

```bash
export PLAYWRIGHT_BROWSERS_PATH="$HOME/Library/Caches/ms-playwright"
node docs-redesign/artifact-screens/capture-artifact.mjs --render
```

That produces `00-full.png`, `01-foundations.png` … `08-motion.png` plus a `-light.png` variant
of each, by loading the saved HTML standalone and clicking through the sidebar and the theme
toggle.

### Option 2 — publish the artifact, then anonymous capture works

In the Claude UI, share/publish the artifact so that
`https://claude.ai/public/artifacts/890ebef5-354e-4049-b4ad-cc6d989d1fbc` resolves. Once it
does, an agent can capture everything with no credentials whatsoever.

### Option 3 — hand Playwright an authenticated Chrome over a debugging port

Only needed if options 1 and 2 are impossible. Start Chrome with a debugging port on a
**separate** user-data-dir, sign in to Claude in that window, then:

```bash
export PLAYWRIGHT_BROWSERS_PATH="$HOME/Library/Caches/ms-playwright"
node docs-redesign/artifact-screens/capture-artifact.mjs --cdp=http://127.0.0.1:9222
```

Phase A digs the HTML out of the sandbox iframe by frame URL and writes
`artifact-source.html`; then run `--render` as in option 1.

Note: modern Chrome refuses `--remote-debugging-port` on the *default* profile, so a separate
`--user-data-dir` (and a fresh sign-in in it) is required. No credential files were read or
copied during attempt 3, and none need to be.

### Tooling left in place

- `docs-redesign/artifact-screens/capture-artifact.mjs` — the two-phase capture script described
  above. Phase B (`--render`) is credential-free and is the part that actually produces the
  section and light-theme screenshots.
- Playwright itself was installed to `/tmp/argus-pw` (outside the repo) and its Chromium to
  `~/Library/Caches/ms-playwright/chromium-1234`. If `/tmp` has been cleared, recreate with
  `mkdir -p /tmp/argus-pw && cd /tmp/argus-pw && npm init -y && npm i playwright`, or set
  `PW_ROOT` to any other resolvable Playwright entry point.

## Still outstanding

Sections **02–08** remain uncaptured, including section **07 "Screens"** — the highest-value
section, since it holds the product screen designs to be rebuilt as the demo UI on the
marketing site. Nothing new about sections 02–08 was learned in attempt 3; the section index
above is still sourced purely from the sidebar visible in the attempt-1 capture. Also still
missing: the `iris` accent ramp and the 5 signal hues.
