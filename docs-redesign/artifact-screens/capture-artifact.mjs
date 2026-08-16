/**
 * Capture the "Argus Instrument" Claude artifact.
 *
 * The artifact is private to the signed-in Claude account, so phase A needs a browser
 * that already holds a claude.ai session. Phase B needs nothing but the saved HTML.
 *
 *   Phase A — extract  : pull the artifact HTML out of the cross-origin sandbox iframe.
 *   Phase B — render   : load the saved HTML standalone and screenshot every section
 *                        in both themes. No credentials involved.
 *
 * Usage
 * -----
 * Phase B only (preferred — run this once artifact-source.html exists):
 *   node capture-artifact.mjs --render
 *
 * Phase A via an already-running Chrome with an open debugging port:
 *   node capture-artifact.mjs --cdp=http://127.0.0.1:9222
 *
 * Phase A via a Chrome profile directory (Chrome must not already be running on it):
 *   node capture-artifact.mjs --profile="/path/to/a/chrome/user-data-dir"
 *
 * Requires: PLAYWRIGHT_BROWSERS_PATH pointing at an ms-playwright cache with chromium,
 * and the `playwright` package resolvable via PW_ROOT below.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const PW_ROOT = process.env.PW_ROOT || '/tmp/argus-pw/node_modules/playwright/index.mjs';
const { chromium } = await import(PW_ROOT);

const ID = '890ebef5-354e-4049-b4ad-cc6d989d1fbc';
const ARTIFACT_URL = `https://claude.ai/code/artifact/${ID}`;
const FRAME_HOST = `${ID}.frame.claudeusercontent.com`;

const OUT = path.dirname(new URL(import.meta.url).pathname);
const SOURCE_HTML = path.join(OUT, 'artifact-source.html');

const argv = process.argv.slice(2);
const arg = (name) => {
  const hit = argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : null;
};
const flag = (name) => argv.includes(`--${name}`);

/* ------------------------------------------------------------------ phase A */

async function extract() {
  const cdp = arg('cdp');
  const profile = arg('profile');
  let browser;
  let context;

  if (cdp) {
    browser = await chromium.connectOverCDP(cdp);
    context = browser.contexts()[0] || (await browser.newContext());
  } else if (profile) {
    context = await chromium.launchPersistentContext(profile, {
      channel: 'chrome',
      headless: false,
      viewport: { width: 1600, height: 1100 },
    });
  } else {
    throw new Error('phase A needs --cdp=<url> or --profile=<dir>');
  }

  const page = context.pages()[0] || (await context.newPage());
  await page.goto(ARTIFACT_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(8000);

  if (/page not found/i.test(await page.title())) {
    throw new Error(
      'claude.ai returned "Page not found" — this browser is not signed in to the ' +
        'account that owns the artifact.',
    );
  }

  // The artifact renders in a sandboxed cross-origin iframe. Playwright can reach
  // into it by frame URL, which is the capability plain CDP evaluation lacks.
  let frame = null;
  for (let i = 0; i < 30; i++) {
    frame = page.frames().find((f) => f.url().includes(FRAME_HOST));
    if (frame) {
      const ready = await frame
        .evaluate(() => document.body && document.body.innerText.length > 200)
        .catch(() => false);
      if (ready) break;
    }
    await page.waitForTimeout(1000);
  }
  if (!frame) {
    throw new Error(
      `no frame matching ${FRAME_HOST}. Frames seen:\n` +
        page.frames().map((f) => '  ' + f.url()).join('\n'),
    );
  }

  const html = await frame.content();
  await writeFile(SOURCE_HTML, html, 'utf8');
  console.log(`wrote ${SOURCE_HTML} (${html.length} bytes)`);

  if (cdp) await browser.close();
  else await context.close();
}

/* ------------------------------------------------------------------ phase B */

const SECTIONS = [
  ['01', 'foundations'],
  ['02', 'primitives'],
  ['03', 'data-display'],
  ['04', 'feedback'],
  ['05', 'execution-graph'],
  ['06', 'node-anatomy'],
  ['07', 'screens'],
  ['08', 'motion'],
];

async function render() {
  if (!existsSync(SOURCE_HTML)) {
    throw new Error(`missing ${SOURCE_HTML} — run phase A first, or save the artifact HTML there`);
  }
  const html = await readFile(SOURCE_HTML, 'utf8');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1600, height: 1100 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  await page.waitForTimeout(3000);

  for (const theme of ['dark', 'light']) {
    if (theme === 'light') {
      // Sidebar carries a theme toggle; label flips between "Light" and "Dark".
      const toggle = page
        .getByRole('button', { name: /light/i })
        .or(page.locator('button', { hasText: /^\s*Light\s*$/ }))
        .first();
      if ((await toggle.count()) === 0) {
        console.log('no theme toggle found — skipping light theme');
        continue;
      }
      await toggle.click();
      await page.waitForTimeout(1200);
    }

    const suffix = theme === 'light' ? '-light' : '';

    await page.screenshot({
      path: path.join(OUT, `00-full${suffix}.png`),
      fullPage: true,
    });

    for (const [num, slug] of SECTIONS) {
      const nav = page.locator(`a,button,[role="button"]`).filter({ hasText: new RegExp(`^\\s*${num}\\b`) }).first();
      if ((await nav.count()) > 0) {
        await nav.click().catch(() => {});
        await page.waitForTimeout(1000);
      }
      await page.screenshot({
        path: path.join(OUT, `${num}-${slug}${suffix}.png`),
        fullPage: false,
      });
      console.log(`captured ${num}-${slug}${suffix}.png`);
    }
  }

  await browser.close();
}

/* --------------------------------------------------------------------- main */

await mkdir(OUT, { recursive: true });
if (flag('render')) await render();
else await extract();
