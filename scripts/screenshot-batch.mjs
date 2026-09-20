#!/usr/bin/env node
/**
 * Batch-screenshot a list of component docs pages.
 * Usage: node scripts/screenshot-batch.mjs <slug1> <slug2> ... [--width W] [--height H]
 */
import { execFile } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const SHELL = process.env.CHROME_SHELL
  ?? `${process.env.HOME}/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell`;
const BASE = process.env.DOCS_BASE ?? 'http://localhost:5199';
const OUT = process.env.SHOTS_DIR ?? '/tmp/shots';

const argv = process.argv.slice(2);
const widthIdx = argv.indexOf('--width');
const heightIdx = argv.indexOf('--height');
const delayIdx = argv.indexOf('--delay');
const width = widthIdx >= 0 ? argv[widthIdx + 1] : 1440;
const height = heightIdx >= 0 ? argv[heightIdx + 1] : 1000;
const delay = delayIdx >= 0 ? argv[delayIdx + 1] : 2400;
const slugs = argv.filter((a) => !a.startsWith('--') && a !== width && a !== height && a !== delay);

mkdirSync(OUT, { recursive: true });

for (const slug of slugs) {
  const out = `${OUT}/${slug}.png`;
  try {
    await execFileAsync(SHELL, [
      '--headless', '--disable-gpu', '--hide-scrollbars',
      '--force-device-scale-factor=1',
      `--screenshot=${out}`,
      `--virtual-time-budget=${delay}`,
      `--window-size=${width},${height}`,
      `${BASE}/components/${slug}`
    ], { timeout: 120000 });
    console.log(`ok ${slug}`);
  } catch (err) {
    console.log(`FAIL ${slug}: ${err.message.split('\n')[0]}`);
  }
}
