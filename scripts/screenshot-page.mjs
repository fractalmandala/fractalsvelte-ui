#!/usr/bin/env node
/**
 * Screenshot a component docs page with chrome-headless-shell.
 * Usage: node scripts/screenshot-page.mjs <slug> <outfile> [--width N] [--height N] [--delay ms] [--full]
 *   --full : capture full page height (component previews sit near the top)
 *   --delay: extra settle time in ms (default 1400)
 */
import { execFile } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const SHELL = process.env.CHROME_SHELL
  ?? `${process.env.HOME}/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell`;
const BASE = process.env.DOCS_BASE ?? 'http://localhost:5199';

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--full') args.full = true;
    else if (a === '--width') args.width = argv[++i];
    else if (a === '--height') args.height = argv[++i];
    else if (a === '--delay') args.delay = argv[++i];
    else args._.push(a);
  }
  return args;
}

const { _, full, width, height, delay } = parseArgs(process.argv.slice(2));
const slug = _[0] ?? 'button';
const out = _[1] ?? `/tmp/shots/${slug}.png`;
mkdirSync(out.slice(0, out.lastIndexOf('/')) || '.', { recursive: true });

const url = slug.startsWith('http') ? slug : slug.startsWith('/') ? `${BASE}${slug}` : `${BASE}/components/${slug}`;
const virtualTime = Number(delay ?? 1400);

const flags = [
  '--headless',
  '--disable-gpu',
  '--hide-scrollbars',
  '--force-device-scale-factor=1',
  `--screenshot=${out}`,
  `--virtual-time-budget=${virtualTime}`,
  `--window-size=${width ?? 1440},${height ?? 1000}`,
  url
];

try {
  const { stderr } = await execFileAsync(SHELL, flags, { timeout: 120000 });
  if (stderr && !/devtools/i.test(stderr)) console.error(stderr.trim());
} catch (err) {
  console.error('screenshot failed:', err.message);
  process.exit(1);
}

if (!existsSync(out)) {
  console.error('no screenshot written');
  process.exit(1);
}
console.log(`saved ${out} (${slug})`);
