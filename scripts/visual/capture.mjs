/**
 * Shared CDP capture used by the visual-regression harness (and usable
 * standalone). Launches chrome-headless-shell with a fresh profile, waits for
 * real hydration (no virtual-time — IntersectionObserver and rAF need real
 * ticks), optionally stills the page, then captures the viewport.
 */
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

export const CHROME_SHELL =
	process.env.CHROME_SHELL ??
	`${process.env.HOME}/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell`;
export const DOCS_BASE = process.env.DOCS_BASE ?? 'http://localhost:5199';

/**
 * Launch a fresh headless Chrome and return a minimal CDP client bound to its
 * page target. Caller must `client.close()`.
 */
export async function launchBrowser({ width = 1440, height = 1000 } = {}) {
	const chrome = spawn(
		CHROME_SHELL,
		[
			'--headless',
			'--disable-gpu',
			'--hide-scrollbars',
			'--force-device-scale-factor=1',
			'--remote-debugging-port=0',
			'--user-data-dir=/tmp/visual-regression-profile',
			`--window-size=${width},${height}`,
			'about:blank'
		],
		{ stdio: ['ignore', 'pipe', 'pipe'] }
	);

	const port = await new Promise((resolve, reject) => {
		let buf = '';
		const onData = (d) => {
			buf += d.toString();
			const m = buf.match(/DevTools listening on (ws:\/\/[^\s]+)/);
			if (m) {
				cleanup();
				resolve(new URL(m[1]).port);
			}
		};
		const cleanup = () => {
			chrome.stderr.off('data', onData);
			chrome.stdout.off('data', onData);
		};
		chrome.stderr.on('data', onData);
		chrome.stdout.on('data', onData);
		chrome.on('exit', (code) => reject(new Error(`chrome exited early (${code}): ${buf}`)));
		setTimeout(() => {
			cleanup();
			reject(new Error('timeout waiting for devtools endpoint'));
		}, 15000);
	});

	const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
	const page = targets.find((t) => t.type === 'page');
	if (!page) throw new Error('no page target');

	const ws = new WebSocket(page.webSocketDebuggerUrl);
	await new Promise((res, rej) => {
		ws.onopen = res;
		ws.onerror = () => rej(new Error('websocket failed'));
	});

	let msgId = 0;
	const pending = new Map();
	ws.onmessage = (ev) => {
		const msg = JSON.parse(ev.data);
		if (msg.id && pending.has(msg.id)) {
			const { resolve, reject } = pending.get(msg.id);
			pending.delete(msg.id);
			if (msg.error) reject(new Error(`${msg.error.message} (${msg.error.code})`));
			else resolve(msg.result);
		}
	};

	const client = {
		send(method, params = {}) {
			const id = ++msgId;
			return new Promise((resolve, reject) => {
				pending.set(id, { resolve, reject });
				ws.send(JSON.stringify({ id, method, params }));
			});
		},
		evaluate(expression) {
			return this.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }).then(
				(r) => r.result.value
			);
		},
		close() {
			try {
				ws.close();
			} catch {
				/* ignore */
			}
			chrome.kill();
		}
	};

	await client.send('Page.enable');
	await client.send('Runtime.enable');
	return client;
}

/**
 * Navigate, wait for hydration, scroll the playground stage into view so
 * IntersectionObserver-driven motion (Reveal etc.) settles, then freeze all
 * time-driven behavior so captures are deterministic:
 *  - pause CSS animations at a fixed progress (marquee, shimmer)
 *  - stop CSS transitions (hover styling must come from :hover, not timing)
 *  - suppress caret blinking
 * Returns nothing; throws on navigation failure.
 */
export async function capturePage(client, url, { settleMs = 1400, freeze = true } = {}) {
	await client.send('Page.navigate', { url });
	await delay(settleMs);

	await client.evaluate(`(() => {
		const stage = document.querySelector('.playground__stage') || document.querySelector('main');
		if (stage) stage.scrollIntoView({ block: 'center' });
		window.dispatchEvent(new Event('scroll'));
		return document.readyState;
	})()`);
	await delay(500);	if (freeze) {
		await client.evaluate(`(() => {
			const style = document.createElement('style');
			style.id = '__vr_freeze';
			style.textContent = \`
				*, *::before, *::after {
					animation: none !important;
					transition: none !important;
					caret-color: transparent !important;
				}
		\`;
			document.head.appendChild(style);
			return true;
		})()`);
		await delay(120);
	}

	const { data } = await client.send('Page.captureScreenshot', { format: 'png' });
	return Buffer.from(data, 'base64');
}
