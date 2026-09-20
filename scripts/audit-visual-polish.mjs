#!/usr/bin/env node
/**
 * Automated Visual Polish Audit & Triage Engine
 *
 * Inspects components in specimen isolation (.playground-stage), probes computed styles,
 * captures clean screenshots, and uses TypeSafe AI (Jev System One) to classify and rank
 * visual defects across the entire catalog.
 *
 * Usage:
 *   node scripts/audit-visual-polish.mjs                  # audit full catalogue
 *   node scripts/audit-visual-polish.mjs --slug button    # single component
 *   node scripts/audit-visual-polish.mjs --limit 20       # first 20 components
 *   node scripts/audit-visual-polish.mjs --no-ai          # fast DOM/Style probe only
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DOCS_BASE = process.env.DOCS_BASE ?? 'http://localhost:5199';
const CDP_URL = process.env.CDP_URL ?? 'http://127.0.0.1:9333';

// 1. CLI Arguments
const argv = process.argv.slice(2);
const getArg = (flag, fallback = null) => {
	const idx = argv.indexOf(flag);
	return idx !== -1 && idx + 1 < argv.length ? argv[idx + 1] : fallback;
};
const hasFlag = (flag) => argv.includes(flag);

const onlySlug = getArg('--slug', null);
const limit = getArg('--limit', null) ? parseInt(getArg('--limit'), 10) : null;
const skipAi = hasFlag('--no-ai');

// 2. Load API Key
function getApiKey() {
	if (process.env.TYPESAFE_API_KEY) return process.env.TYPESAFE_API_KEY;
	const basicsEnvPath = '/Users/amrit/fractalmandala/fractalsvelte-basics/.env';
	if (existsSync(basicsEnvPath)) {
		const m = readFileSync(basicsEnvPath, 'utf8').match(/TYPESAFE_API_KEY=([^\r\n]+)/);
		if (m) return m[1].trim();
	}
	const localEnvPath = resolve(ROOT, '.env');
	if (existsSync(localEnvPath)) {
		const m = readFileSync(localEnvPath, 'utf8').match(/TYPESAFE_API_KEY=([^\r\n]+)/);
		if (m) return m[1].trim();
	}
	return null;
}

const API_KEY = getApiKey();

// 3. Setup Directories
const specimenDir = resolve(ROOT, 'scripts/visual/specimens');
const baselineDir = resolve(ROOT, 'scripts/visual/baselines');
const diffDir = resolve(ROOT, 'scripts/visual/diffs');
const docsDir = resolve(ROOT, 'docs');
mkdirSync(specimenDir, { recursive: true });
mkdirSync(docsDir, { recursive: true });

// 4. Import Component Catalogue
const { components, categoryToSlug } = await import('../src/lib/docs/catalogue.ts');
const uniqueComponents = [];
const seenSlugs = new Set();

for (const c of components) {
	const slug = c.aliasOf || c.slug;
	if (!seenSlugs.has(slug)) {
		seenSlugs.add(slug);
		uniqueComponents.push(c);
	}
}

let targets = onlySlug
	? uniqueComponents.filter((c) => (c.aliasOf || c.slug) === onlySlug)
	: uniqueComponents;

if (limit && targets.length > limit) {
	targets = targets.slice(0, limit);
}

console.log(`\n======================================================`);
console.log(`  Visual Polish Audit Engine`);
console.log(`  Targeting ${targets.length} components | Dev Server: ${DOCS_BASE}`);
console.log(`  CDP: ${CDP_URL} | TypeSafe AI: ${!skipAi && API_KEY ? 'Active (Jev System One)' : 'Skipped/Disabled'}`);
console.log(`======================================================\n`);

// 5. Connect to Headless Chrome via CDP
async function connectCDP() {
	const listRes = await fetch(`${CDP_URL}/json/list`);
	if (!listRes.ok) throw new Error(`Cannot reach CDP at ${CDP_URL}`);
	const targets = await listRes.json();
	const page = targets.find((t) => t.type === 'page') || targets[0];
	if (!page) throw new Error('No page target available on CDP');

	const ws = new WebSocket(page.webSocketDebuggerUrl);
	await new Promise((res, rej) => {
		ws.onopen = res;
		ws.onerror = rej;
	});

	let msgId = 0;
	const pending = new Map();
	ws.onmessage = (ev) => {
		const msg = JSON.parse(ev.data);
		if (msg.id && pending.has(msg.id)) {
			const { resolve, reject } = pending.get(msg.id);
			pending.delete(msg.id);
			if (msg.error) reject(new Error(msg.error.message));
			else resolve(msg.result);
		}
	};

	const send = (method, params = {}) =>
		new Promise((resolve, reject) => {
			const cur = ++msgId;
			pending.set(cur, { resolve, reject });
			ws.send(JSON.stringify({ id: cur, method, params }));
		});

	return {
		send,
		close: () => ws.close()
	};
}

const client = await connectCDP();

// Set generous viewport height so the entire playground stage fits without vertical clipping
await client.send('Emulation.setDeviceMetricsOverride', {
	width: 1440,
	height: 1400,
	deviceScaleFactor: 1,
	mobile: false
});

// 6. Audit Loop
const auditResults = [];

try {
	for (let i = 0; i < targets.length; i++) {
		const comp = targets[i];
		const slug = comp.aliasOf || comp.slug;
		const catSlug = categoryToSlug(comp.category);
		const targetUrl = `${DOCS_BASE}/components/${slug}`;

		process.stdout.write(`[${i + 1}/${targets.length}] Auditing ${slug.padEnd(26)} `);

		try {
			await client.send('Page.navigate', { url: targetUrl });
			// Hydration & tick delay
			await new Promise((r) => setTimeout(r, 650));
			await client.send('Runtime.evaluate', {
				expression: `(() => {
					window.scrollTo(0, 0);
					window.dispatchEvent(new Event('resize'));
				})()`
			});
			await new Promise((r) => setTimeout(r, 300));

			// Evaluate DOM & Stage Styles
			const probeResponse = await client.send('Runtime.evaluate', {
				expression: `(() => {
					const stage = document.querySelector('.playground-stage') || document.querySelector('.playground__stage') || document.querySelector('main');
					if (!stage) return { error: 'No stage element found' };

					const rect = stage.getBoundingClientRect();
					const children = stage.querySelectorAll('*');
					const text = stage.innerText || '';

					// 1. Raw Stub Detector
					const isRawStub = /Explore(dock|bubble|menu|button|sidebar|text)|Compose(dock|bubble|menu|button|sidebar|text)|Share(dock|bubble|menu|button|sidebar|text)/i.test(text);

					// 2. Unstyled Elements Detector
					let unstyledFont = false;
					let unstyledButton = false;
					let unstyledInput = false;

					for (const el of children) {
						const cs = window.getComputedStyle(el);
						const font = cs.fontFamily.toLowerCase();
						if (font.includes('times') || (font.includes('serif') && !font.includes('sans') && !font.includes('mono'))) {
							unstyledFont = true;
						}
						if (el.tagName === 'BUTTON') {
							if (cs.backgroundColor === 'rgb(239, 239, 239)' || cs.borderStyle === 'outset') {
								unstyledButton = true;
							}
						}
						if (el.tagName === 'INPUT' && cs.borderStyle === 'inset') {
							unstyledInput = true;
						}
					}

					// 3. Canvas & Layout Check
					const canvas = stage.querySelector('canvas');
					const canvasRect = canvas ? canvas.getBoundingClientRect() : null;
					const isFixedOverlay = canvas && window.getComputedStyle(canvas).position === 'fixed';
					const canvasClipped = canvasRect && !isFixedOverlay && (canvasRect.height > rect.height || canvasRect.bottom > rect.bottom + 5 || canvasRect.width > rect.width);

					// 4. Closed Item Content/Padding Leak Check (e.g. collapsed accordions or drawers)
					let paddingLeak = false;
					const hiddenRegions = stage.querySelectorAll('[role="region"][aria-hidden="true"], [data-slot*="content"][inert], [data-slot*="description"][inert]');
					for (const region of hiddenRegions) {
						const cs = window.getComputedStyle(region);
						const r = region.getBoundingClientRect();
						if (r.height > 2 && (cs.paddingTop !== '0px' || cs.paddingBottom !== '0px') && cs.overflow !== 'hidden') {
							paddingLeak = true;
						}
					}

					// 5. Overflow & Bounding Box
					const hasOverflow = stage.scrollWidth > stage.clientWidth + 4;
					const isCollapsed = rect.height < 35 || rect.width < 50;

					return {
						rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
						childrenCount: children.length,
						isRawStub,
						unstyledFont,
						unstyledButton,
						unstyledInput,
						hasCanvas: !!canvas,
						canvasClipped,
						paddingLeak,
						hasOverflow,
						isCollapsed,
						textSample: text.trim().slice(0, 100)
					};
				})()`,
				returnByValue: true
			});

			const probe = probeResponse.result.value;

			if (probe.error) {
				console.log(`✗ Error: ${probe.error}`);
				auditResults.push({
					slug,
					name: comp.name,
					category: comp.category,
					priority: 'P0',
					score: 0,
					defect: 'missing_stage',
					details: probe.error
				});
				continue;
			}

			// Capture Specimen Screenshot
			const r = probe.rect;
			let specimenPath = `scripts/visual/specimens/${slug}.png`;
			if (r && r.width > 0 && r.height > 0) {
				const { data } = await client.send('Page.captureScreenshot', {
					format: 'png',
					clip: { x: Math.max(0, r.x), y: Math.max(0, r.y), width: Math.min(1440, r.width), height: Math.min(1000, r.height), scale: 1 }
				});
				writeFileSync(resolve(ROOT, specimenPath), Buffer.from(data, 'base64'));
			}

			// Heuristic Rule Scoring
			let heuristicScore = 4;
			let defect = 'clean';
			let priority = 'P2';

			if (probe.isCollapsed) {
				heuristicScore = 0;
				defect = 'collapsed_zero_height';
				priority = 'P0';
			} else if (probe.isRawStub) {
				heuristicScore = 1;
				defect = 'raw_unimplemented_stub';
				priority = 'P0';
			} else if (probe.unstyledButton || probe.unstyledInput || probe.unstyledFont) {
				heuristicScore = 1;
				defect = 'unstyled_browser_default';
				priority = 'P0';
			} else if (probe.paddingLeak) {
				heuristicScore = 2;
				defect = 'collapsed_padding_leak';
				priority = 'P1';
			} else if (probe.canvasClipped) {
				heuristicScore = 2;
				defect = 'canvas_clipped';
				priority = 'P1';
			} else if (probe.hasOverflow) {
				heuristicScore = 2;
				defect = 'layout_overflow';
				priority = 'P1';
			} else if (probe.childrenCount === 0) {
				heuristicScore = 0;
				defect = 'empty_unrendered';
				priority = 'P0';
			}

			// Check existing diff & baseline
			const hasBaseline = existsSync(resolve(baselineDir, `${slug}.png`));
			const hasDiff = existsSync(resolve(diffDir, `${slug}.png`));

			const itemResult = {
				slug,
				name: comp.name,
				category: comp.category,
				priority,
				score: heuristicScore,
				defect,
				probe,
				hasBaseline,
				hasDiff,
				specimenPath: `specimens/${slug}.png`,
				baselinePath: hasBaseline ? `baselines/${slug}.png` : null,
				diffPath: hasDiff ? `diffs/${slug}.png` : null
			};

			auditResults.push(itemResult);

			const badge = priority === 'P0' ? '🔴 P0' : priority === 'P1' ? '🟡 P1' : '🟢 P2';
			console.log(`${badge} [Score: ${heuristicScore}/4] ${defect}`);
		} catch (err) {
			console.log(`✗ Error: ${err.message}`);
			auditResults.push({
				slug,
				name: comp.name,
				category: comp.category,
				priority: 'P0',
				score: 0,
				defect: 'audit_exception',
				details: err.message
			});
		}
	}
} finally {
	client.close();
}

// 7. TypeSafe AI Batch Refinement (for ambiguous or flagged items)
if (!skipAi && API_KEY) {
	const needsAiCheck = auditResults.filter((r) => r.priority !== 'P2' || r.score <= 3);
	if (needsAiCheck.length > 0) {
		console.log(`\n⚡ Consulting TypeSafe AI (Jev System One) for ${needsAiCheck.length} flagged items...`);

		// Process in chunks of 15
		const chunkSize = 15;
		for (let c = 0; c < needsAiCheck.length; c += chunkSize) {
			const chunk = needsAiCheck.slice(c, c + chunkSize);
			const questions = {};

			for (const item of chunk) {
				questions[`score_${item.slug}`] = {
					type: 'score',
					instructions: `Rate the visual production-readiness of the Svelte UI component "${item.name}" based on its layout rect (${item.probe?.rect?.width}x${item.probe?.rect?.height}), DOM elements (${item.probe?.childrenCount}), and defect observation: "${item.defect}".`,
					levels: [
						{ score: 0, description: 'Fatal: Collapsed, blank, or completely unrendered.' },
						{ score: 1, description: 'Raw/Unstyled: Generic stub or raw browser defaults without design system tokens.' },
						{ score: 2, description: 'Defective: Misaligned padding, clipped canvas/overflow, or rough edges.' },
						{ score: 3, description: 'Viable: Styled with tokens, readable layout, and responsive bounds.' },
						{ score: 4, description: 'Showcase: Monospace-polished, high-taste component library quality.' }
					]
				};
			}

			try {
				const aiRes = await fetch('https://api.typesafe.ai/v1/systemone', {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${API_KEY}`,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						model: 'jev-latest',
						state: { components: chunk.map((k) => ({ slug: k.slug, defect: k.defect, probe: k.probe })) },
						questions
					})
				});

				if (aiRes.ok) {
					const data = await aiRes.json();
					for (const item of chunk) {
						const ans = data.answers?.[`score_${item.slug}`];
						if (ans && typeof ans.score === 'number') {
							item.aiScore = ans.score;
							item.aiConfidence = ans.confidence ?? 1.0;
							// If Jev scored lower, respect the harsher grade
							if (ans.score < item.score) {
								item.score = ans.score;
								if (item.score <= 1) item.priority = 'P0';
								else if (item.score === 2) item.priority = 'P1';
							}
						}
					}
					console.log(`  ✓ Evaluated batch ${Math.floor(c / chunkSize) + 1}/${Math.ceil(needsAiCheck.length / chunkSize)}`);
				}
			} catch (e) {
				console.warn('  ⚠️ TypeSafe API call failed, falling back to deterministic heuristics:', e.message);
			}
		}
	}
}

// 8. Output Visual Punchlist JSON
writeFileSync(resolve(docsDir, 'VISUAL-PUNCHLIST.json'), JSON.stringify(auditResults, null, 2));
console.log(`\n✓ Written: docs/VISUAL-PUNCHLIST.json (${auditResults.length} components)`);

// 9. Generate Interactive Visual Triage Gallery (HTML)
const p0Count = auditResults.filter((r) => r.priority === 'P0').length;
const p1Count = auditResults.filter((r) => r.priority === 'P1').length;
const p2Count = auditResults.filter((r) => r.priority === 'P2').length;

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Fractalsvelte UI — Visual Triage Dashboard</title>
	<style>
		:root {
			--bg: #0b0f19;
			--surface: #141b2d;
			--surface-hover: #1b253d;
			--border: #24304f;
			--text: #e2e8f0;
			--text-muted: #8492a6;
			--danger: #ef4444;
			--warning: #f59e0b;
			--success: #10b981;
			--primary: #6366f1;
			--font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
		}
		* { box-sizing: border-box; margin: 0; padding: 0; }
		body {
			background: var(--bg);
			color: var(--text);
			font-family: var(--font-mono);
			padding: 2rem;
			line-height: 1.5;
		}
		header {
			border-bottom: 1px solid var(--border);
			padding-bottom: 1.5rem;
			margin-bottom: 2rem;
			display: flex;
			justify-content: space-between;
			align-items: flex-end;
		}
		h1 { font-size: 1.75rem; font-weight: 700; color: #fff; }
		.stats { display: flex; gap: 1rem; margin-top: 0.5rem; font-size: 0.875rem; }
		.stat-badge {
			padding: 0.25rem 0.75rem;
			border-radius: 4px;
			font-weight: 600;
		}
		.stat-p0 { background: rgba(239, 68, 68, 0.2); color: var(--danger); border: 1px solid var(--danger); }
		.stat-p1 { background: rgba(245, 158, 11, 0.2); color: var(--warning); border: 1px solid var(--warning); }
		.stat-p2 { background: rgba(16, 185, 129, 0.2); color: var(--success); border: 1px solid var(--success); }
		
		.controls { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }
		button.tab {
			background: var(--surface);
			border: 1px solid var(--border);
			color: var(--text);
			padding: 0.5rem 1rem;
			cursor: pointer;
			font-family: var(--font-mono);
			font-size: 0.85rem;
			border-radius: 4px;
			transition: all 0.15s ease;
		}
		button.tab.active, button.tab:hover {
			background: var(--primary);
			border-color: var(--primary);
			color: #fff;
		}

		.grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
			gap: 1.5rem;
		}
		.card {
			background: var(--surface);
			border: 1px solid var(--border);
			border-radius: 6px;
			overflow: hidden;
			display: flex;
			flex-direction: column;
		}
		.card.p0 { border-top: 3px solid var(--danger); }
		.card.p1 { border-top: 3px solid var(--warning); }
		.card.p2 { border-top: 3px solid var(--success); }

		.card-header {
			padding: 0.75rem 1rem;
			border-bottom: 1px solid var(--border);
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		.card-title { font-size: 1rem; font-weight: 600; color: #fff; }
		.badge {
			font-size: 0.75rem;
			padding: 0.15rem 0.5rem;
			border-radius: 3px;
			font-weight: 600;
		}
		.badge-p0 { background: rgba(239, 68, 68, 0.25); color: var(--danger); }
		.badge-p1 { background: rgba(245, 158, 11, 0.25); color: var(--warning); }
		.badge-p2 { background: rgba(16, 185, 129, 0.25); color: var(--success); }

		.card-specimen {
			background: #111;
			min-height: 180px;
			max-height: 240px;
			display: grid;
			place-items: center;
			overflow: hidden;
			border-bottom: 1px solid var(--border);
			position: relative;
		}
		.card-specimen img {
			max-width: 100%;
			max-height: 240px;
			object-fit: contain;
			display: block;
		}
		.card-specimen .empty-msg {
			color: var(--text-muted);
			font-size: 0.8rem;
		}

		.card-body {
			padding: 0.75rem 1rem;
			font-size: 0.8rem;
			display: flex;
			flex-direction: column;
			gap: 0.4rem;
		}
		.meta-row { display: flex; justify-content: space-between; }
		.meta-label { color: var(--text-muted); }
		.meta-val { color: var(--text); font-weight: 600; }
		.defect-tag {
			display: inline-block;
			background: rgba(255, 255, 255, 0.08);
			padding: 0.15rem 0.4rem;
			border-radius: 3px;
			color: #f1f5f9;
		}
		.file-link {
			margin-top: 0.25rem;
			font-size: 0.75rem;
			color: var(--primary);
			text-decoration: none;
			word-break: break-all;
		}
		.file-link:hover { text-decoration: underline; }
	</style>
</head>
<body>
	<header>
		<div>
			<h1>Visual Polish Audit & Triage Gallery</h1>
			<p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.25rem;">
				Automated specimen audit across ${auditResults.length} components. Evaluated with Headless Chrome & TypeSafe AI (Jev System One).
			</p>
			<div class="stats">
				<span class="stat-badge stat-p0">🔴 P0 Broken/Raw: ${p0Count}</span>
				<span class="stat-badge stat-p1">🟡 P1 Layout Defect: ${p1Count}</span>
				<span class="stat-badge stat-p2">🟢 P2 Ready: ${p2Count}</span>
			</div>
		</div>
	</header>

	<div class="controls">
		<button class="tab active" onclick="filterCards('all')">All (${auditResults.length})</button>
		<button class="tab" onclick="filterCards('p0')">🔴 P0 Urgent (${p0Count})</button>
		<button class="tab" onclick="filterCards('p1')">🟡 P1 Layout (${p1Count})</button>
		<button class="tab" onclick="filterCards('p2')">🟢 P2 Polished (${p2Count})</button>
	</div>

	<div class="grid" id="grid">
		${auditResults
			.map((r) => {
				const badgeClass = r.priority === 'P0' ? 'badge-p0' : r.priority === 'P1' ? 'badge-p1' : 'badge-p2';
				const cardClass = r.priority.toLowerCase();
				return `
			<div class="card ${cardClass}" data-priority="${cardClass}">
				<div class="card-header">
					<span class="card-title">${r.name}</span>
					<span class="badge ${badgeClass}">${r.priority} · Score ${r.score}/4</span>
				</div>
				<div class="card-specimen">
					<img src="../scripts/visual/${r.specimenPath}" alt="${r.slug} specimen" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
					<span class="empty-msg" style="display: none;">No specimen captured</span>
				</div>
				<div class="card-body">
					<div class="meta-row">
						<span class="meta-label">Defect:</span>
						<span class="defect-tag">${r.defect}</span>
					</div>
					<div class="meta-row">
						<span class="meta-label">Category:</span>
						<span class="meta-val">${r.category}</span>
					</div>
					${
						r.probe?.rect
							? `
					<div class="meta-row">
						<span class="meta-label">Stage Rect:</span>
						<span class="meta-val">${Math.round(r.probe.rect.width)} × ${Math.round(r.probe.rect.height)} px</span>
					</div>`
							: ''
					}
					<a class="file-link" href="file://${ROOT}/src/lib/components/${r.slug}.svelte">Open Source File</a>
				</div>
			</div>`;
			})
			.join('\n')}
	</div>

	<script>
		function filterCards(type) {
			document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
			event.target.classList.add('active');
			document.querySelectorAll('.card').forEach(card => {
				if (type === 'all' || card.getAttribute('data-priority') === type) {
					card.style.display = 'flex';
				} else {
					card.style.display = 'none';
				}
			});
		}
	</script>
</body>
</html>
`;

writeFileSync(resolve(docsDir, 'visual-triage.html'), htmlContent);
console.log(`✓ Written: docs/visual-triage.html`);

console.log(`\n======================================================`);
console.log(`  Audit Complete!`);
console.log(`  🔴 P0 Broken/Raw Stubs:    ${p0Count}`);
console.log(`  🟡 P1 Layout/Clipping:     ${p1Count}`);
console.log(`  🟢 P2 Production Ready:    ${p2Count}`);
console.log(`  Open in browser: file://${docsDir}/visual-triage.html`);
console.log(`======================================================\n`);
