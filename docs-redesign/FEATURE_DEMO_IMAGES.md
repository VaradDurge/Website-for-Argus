# Feature demo images

Interfere-style **cropped product UI on a rainbow wash**. These are Argus
instrument stills — same chrome, tokens, and story as the live hero demo —
not Interfere screenshots.

Regenerate with:

```bash
# Playwright lives outside the app (see scripts/compose-feature-images.mjs)
NODE_PATH=/tmp/argus-pw/node_modules node scripts/compose-feature-images.mjs
```

Source of treatment: live Interfere feature panels (“Fix problems with
confidence”) — blurred horizontal rainbow behind a flat, hairline-framed
app shell. Argus tokens from `app/globals.css` (void / panel / rail / ink /
iris / five signal hues).

## Inventory

| ID | File | Size | Aspect | Wired | Capability |
|----|------|------|--------|-------|------------|
| `feat-01-detection` | `/images/demo/feat-01-detection.png` | 2400×1280 | 15:8 | Feature 01 | Multi-layer detection inbox |
| `feat-02-root-cause` | `/images/demo/feat-02-root-cause.png` | 2400×1280 | 15:8 | Feature 02 | Graph walkback + state diff |
| `feat-03-replay` | `/images/demo/feat-03-replay.png` | 2400×1280 | 15:8 | Feature 03 | Original vs replayed output |
| `feat-04-state-inspector` | `/images/demo/feat-04-state-inspector.png` | 2400×1280 | 15:8 | Supporting | Field drop at `enrich` |
| `feat-05-ci-strict` | `/images/demo/feat-05-ci-strict.png` | 2400×1280 | 15:8 | Supporting | Strict-mode CI gate |

Display size in `FeatureBleed`: **1200×640** (15:8), right- or left-bleeding
off the 1200px container. Source files are 2× for retina.

## Mappings

### 01 — Catch failures before they ship

- **Title:** Detections
- **Story:** Run `8f9a-22b1` selected. `summarize` returned a placeholder and
  the pipeline still marked the node succeeded.
- **UI:** Icon rail + detections table (run / finding / status). Signal chips
  only — Clean / Silent failure / Failed.
- **Section:** `FeatureSections` 01, copy left, visual right.

### 02 — Know which node actually broke

- **Title:** Root cause
- **Story:** Walkback on the same run. `validate` raised; `enrich` dropped
  `ticket.body` and is marked root.
- **UI:** Five-node strip (extract → enrich → summarize → validate → respond)
  plus finding card and a field-level state diff.
- **Section:** `FeatureSections` 02, visual left, copy right.

### 03 — Replay and verify with confidence

- **Title:** Replay summarize
- **Story:** Frozen upstream, HTTP mocked. Original placeholder vs grounded
  replay (`T-4419` / Northwind).
- **UI:** Two-pane diff. Fail wash on original, ok wash on replay.
- **Section:** `FeatureSections` 03, copy left, visual right, section glow
  (`--gradient-section-glow`, blur 100px).

### 04 — Node inspector (supporting)

- Input vs output of `enrich`. `body: null` highlighted. Walkback copy
  explains the silent drop. Not mounted on the landing page; available if a
  fourth feature row or docs card is added.

### 05 — Strict mode (supporting)

- `argus check --strict` blocked on `placeholder_summary`. Shows CI gating
  without inventing a second visual language.

## Treatment notes

- Rainbow is **atmosphere behind** the chrome, never overlaid badges.
- Product UI is **flat** (no tilt, no browser URL bar).
- Hairline frame, 16px outer radius, icon rail, band header, Geist-like
  sans + mono labels — matches the live `ArgusDemo`.
- Colour is signal: iris for selection, ok / warn / fail for run state.

## Live counterparts (not images)

| Slot | Component | Notes |
|------|-----------|-------|
| `hero-cradle-runs` | `app/components/demo/ArgusDemo.tsx` | Interactive Runs / Trace / Replay |
| `hiw-01-detect` | `DetectMini` | 200px how-it-works card |
| `hiw-02-understand` | `UnderstandMini` | Missing `ticket.body` |
| `hiw-03-replay` | `ReplayMini` | Frozen + verify diff |
