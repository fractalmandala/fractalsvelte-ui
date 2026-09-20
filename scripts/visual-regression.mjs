#!/usr/bin/env node
/**
 * Visual regression harness for the component docs pages.
 *
 *   node scripts/visual-regression.mjs                 # test against baselines
 *   node scripts/visual-regression.mjs --update        # (re)record baselines
 *   node scripts/visual-regression.mjs --slug button   # limit to one component
 *   node scripts/visual-regression.mjs --tolerance 4   # per-channel noise floor
 *   node scripts/visual-regression.mjs --threshold 0.02  # fail if >2% pixels differ
 *
 * Baselines live in scripts/visual/baselines/<slug>.png; diffs are written to
 * scripts/visual/diffs/<slug>.png (red = changed pixels). No new dependencies:
 * PNG codec and pixel diff are implemented in scripts/visual/png.mjs.
 *
 * Requires the dev server on DOCS_BASE (default http://localhost:5199).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { decodePng, diffImages, encodePng } from './visual/png.mjs';
import { launchBrowser, capturePage, DOCS_BASE } from './visual/capture.mjs';
import { components } from '../src/lib/docs/catalogue.ts';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// --- CLI ------------------------------------------------------------------------
const argv = process.argv.slice(2);
function argValue(flag, fallback) {
	const i = argv.indexOf(flag);
	return i !== -1 && i + 1 < argv.length ? argv[i + 1] : fallback;
}
const has = (flag) => argv.includes(flag);
const update = has('--update');
const only = argValue('--slug', null);
const tolerance = Number(argValue('--tolerance', 2));
const threshold = Number(argValue('--threshold', 0.001));

const baselineDir = resolve(root, 'scripts/visual/baselines');
const diffDir = resolve(root, 'scripts/visual/diffs');
mkdirSync(baselineDir, { recursive: true });
mkdirSync(diffDir, { recursive: true });

// --- Component list from the docs catalogue --------------------------------------
// Alias pages resolve to their family page for capture (same object the router shows).
const slugs = [...new Set(components.map((component) => (component.aliasOf ? component.aliasOf : component.slug)))];
const targets = only ? slugs.filter((s) => s === only) : slugs;
if (targets.length === 0) {
	console.error(`no matching slug${only ? `: ${only}` : ''}`);
	process.exit(1);
}

// --- Preflight -------------------------------------------------------------------
try {
	const res = await fetch(`${DOCS_BASE}/components/button`, { method: 'HEAD' });
	if (!res.ok) throw new Error(`status ${res.status}`);
} catch {
	console.error(`dev server unreachable at ${DOCS_BASE}.\nStart it first:  pnpm dev --port 5199 --strictPort\n(or point DOCS_BASE at a running instance).`);
	process.exit(1);
}

// --- Run -------------------------------------------------------------------------
const width = 1440;
const height = 1000;
console.log(`visual regression: ${targets.length} pages @ ${width}x${height} (tolerance ${tolerance}, threshold ${threshold})`);

const results = [];

if (update) {
	// Recording: one browser for the whole batch, capture sequentially.
	const client = await launchBrowser({ width, height });
	try {
		for (const slug of targets) {
			const shot = await capturePage(client, `${DOCS_BASE}/components/${slug}`);
			writeFileSync(resolve(baselineDir, `${slug}.png`), shot);
			results.push({ slug, status: 'recorded' });
			console.log(`  recorded ${slug}`);
		}
	} finally {
		client.close();
	}
} else {
	const client = await launchBrowser({ width, height });
	try {
		for (const slug of targets) {
			const baselinePath = resolve(baselineDir, `${slug}.png`);
			if (!existsSync(baselinePath)) {
				results.push({ slug, status: 'missing-baseline' });
				console.log(`  ✗ ${slug}: no baseline (run with --update to record)`);
				continue;
			}
			const shot = await capturePage(client, `${DOCS_BASE}/components/${slug}`);
			const diffPath = resolve(diffDir, `${slug}.png`);
			try {
				const actual = decodePng(shot);
				const baseline = decodePng(readFileSync(baselinePath));
				const diff = diffImages(baseline, actual, tolerance);
				if (!diff.different) {
					results.push({ slug, status: 'pass' });
					console.log(`  ✓ ${slug}`);
				} else if (threshold > 0 && diff.changedPixels / diff.totalPixels <= threshold) {
					results.push({ slug, status: 'pass-noisy', changed: diff.changedPixels, total: diff.totalPixels });
					console.log(`  ~ ${slug}: ${diff.changedPixels}/${diff.totalPixels} px (within threshold)`);
				} else {
					if (diff.diffRgba) writeFileSync(diffPath, encodePng(actual.width, actual.height, diff.diffRgba));
					results.push({ slug, status: 'fail', changed: diff.changedPixels, total: diff.totalPixels, diffPath });
					console.log(`  ✗ ${slug}: ${diff.changedPixels}/${diff.totalPixels} px differ → ${diffPath}`);
				}
			} catch (err) {
				results.push({ slug, status: 'error', message: err.message });
				console.log(`  ✗ ${slug}: ${err.message}`);
			}
		}
	} finally {
		client.close();
	}
}

// --- Summary ----------------------------------------------------------------------
const failed = results.filter((r) => r.status === 'fail');
const errored = results.filter((r) => r.status === 'error' || r.status === 'missing-baseline');
const noisy = results.filter((r) => r.status === 'pass-noisy');

console.log('');
console.log(`${results.length} pages: ${results.filter((r) => r.status.startsWith('pass') || r.status === 'recorded').length} ok, ${noisy.length} noisy, ${failed.length} failed, ${errored.length} errored`);

if (update) {
	console.log('Baselines updated. Review the diffs dir, then commit scripts/visual/baselines/.');
	process.exit(0);
}
if (failed.length || errored.length) {
	console.log('FAILED. Inspect scripts/visual/diffs/*.png (red = changed pixels).');
	if (failed.length) console.log('Intentional change? Re-record with: pnpm visual:update');
	process.exit(1);
}
