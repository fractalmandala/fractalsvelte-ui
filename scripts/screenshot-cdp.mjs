#!/usr/bin/env node
/**
 * CDP-driven page screenshot with real-time settling (hydration, IntersectionObserver).
 * Usage: node scripts/screenshot-cdp.mjs <slug-or-url> <outfile> [--width N] [--height N] [--wait ms] [--full]
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
    else if (a === '--top') args.top = true;
    else if (a === '--width') args.width = Number(argv[++i]);
    else if (a === '--height') args.height = Number(argv[++i]);
    else if (a === '--wait') args.wait = Number(argv[++i]);
    else args._.push(a);
  }
  return args;
}

const { _, full, top, width = 1440, height = 1000, wait = 1600 } = parseArgs(process.argv.slice(2));
const target = _[0] ?? 'button';
const out = _[1] ?? `/tmp/shots/cdp-${target}.png`;
mkdirSync(out.slice(0, out.lastIndexOf('/')) || '.', { recursive: true });

const url = target.startsWith('http') ? target : `${BASE}/components/${target}`;

// Launch a fresh browser with remote debugging on an ephemeral port.
const { spawn } = await import('node:child_process');
const chrome = spawn(SHELL, [
  '--headless',
  '--disable-gpu',
  '--hide-scrollbars',
  '--force-device-scale-factor=1',
  '--remote-debugging-port=0',
  `--window-size=${width},${height}`,
  'about:blank'
], { stdio: ['ignore', 'pipe', 'pipe'] });

const browserPort = await new Promise((resolve, reject) => {
  let buf = '';
  const onData = (d) => {
    buf += d.toString();
    const m = buf.match(/DevTools listening on (ws:\/\/[^\s]+)/);
    if (m) {
      const port = new URL(m[1]).port;
      cleanup();
      resolve(port);
    }
  };
  const cleanup = () => {
    chrome.stderr.off('data', onData);
    chrome.stdout.off('data', onData);
  };
  chrome.stderr.on('data', onData);
  chrome.stdout.on('data', onData);
  chrome.on('exit', (code) => reject(new Error(`chrome exited early (${code}): ${buf}`)));
  setTimeout(() => { cleanup(); reject(new Error('timeout waiting for devtools endpoint')); }, 15000);
});

// Pick the page (not browser) target's websocket.
const targets = await (await fetch(`http://127.0.0.1:${browserPort}/json/list`)).json();
const page = targets.find((t) => t.type === 'page');
if (!page) throw new Error('no page target');

const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

let msgId = 0;
const pending = new Map();
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
  }
};
function send(method, params = {}) {
  const id = ++msgId;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });

const navDone = send('Page.navigate', { url });
await navDone;

// Wait for hydration: svelte app sets window.__SVELTE_HYDRATED or we just wait real time.
await new Promise((r) => setTimeout(r, wait));

// Scroll the stage into view and nudge scroll so IntersectionObservers fire.
await send('Runtime.evaluate', {
  expression: `(() => {
    if (${Boolean(top)}) {
      window.scrollTo(0, 0);
    } else {
      const stage = document.querySelector('.playground__stage') || document.querySelector('.playground-stage') || document.querySelector('main');
      if (stage) stage.scrollIntoView({ block: 'center' });
    }
    window.dispatchEvent(new Event('scroll'));
    return document.readyState;
  })()`,
  awaitPromise: true
});

await new Promise((r) => setTimeout(r, 700));

await send('Emulation.clearDeviceMetricsOverride');
await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
await new Promise((r) => setTimeout(r, 250));

const { data, error } = await send('Page.captureScreenshot', { format: 'png' });
if (error || !data) {
  console.error('capture failed', error);
  chrome.kill();
  process.exit(1);
}
const { writeFileSync } = await import('node:fs');
writeFileSync(out, Buffer.from(data, 'base64'));
console.log(`saved ${out} (${target})`);

ws.close();
chrome.kill();
