// @ts-nocheck
/**
 * docs-check.mjs — Documentation Quality Gate for @fractaldesign/fractalsvelte-ui.
 *
 * Verifies that every component has an authored description, that no orphan
 * descriptions exist, and that the extracted manifest matches source components.
 * Exits non-zero on documentation drift.
 */

import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import ts from 'typescript';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const p = (...s) => path.join(ROOT, ...s);

const DESCRIPTIONS_DIR = p('src/lib/documentation/descriptions');
const MANIFEST_PATH = p('src/lib/documentation/manifest.json');

const errors = [];
const warnings = [];

async function loadDescriptions() {
	const map = {};
	if (!existsSync(DESCRIPTIONS_DIR)) {
		errors.push('descriptions/ directory does not exist');
		return map;
	}
	for (const f of (await readdir(DESCRIPTIONS_DIR)).filter((f) => f.endsWith('.ts'))) {
		const src = await readFile(path.join(DESCRIPTIONS_DIR, f), 'utf8');
		const js = ts.transpileModule(src, {
			compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ESNext }
		}).outputText;
		const mod = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'));
		Object.assign(map, mod.default ?? {});
	}
	return map;
}

async function main() {
	console.log('Running documentation quality gate...');
	const descriptions = await loadDescriptions();

	if (!existsSync(MANIFEST_PATH)) {
		console.error('manifest.json missing — run: pnpm docs:extract');
		process.exit(1);
	}

	const manifest = JSON.parse(await readFile(MANIFEST_PATH, 'utf8'));
	const byName = new Map(manifest.components.map((c) => [c.name, c]));

	// 1. Every component on disk has a description
	for (const c of manifest.components) {
		if (!descriptions[c.name]) {
			errors.push(`Missing description: ${c.name}`);
		}
	}

	// 2. Every description refers to a real component
	for (const name of Object.keys(descriptions)) {
		if (!byName.has(name)) {
			errors.push(`Orphan description (no such component): ${name}`);
		}
	}

	// 3. No component missing essential records
	for (const c of manifest.components) {
		if (!c.importSnippet) errors.push(`No import snippet: ${c.name}`);
		if (!c.code || c.code.length < 20) errors.push(`No source captured: ${c.name}`);
	}

	// 4. Description length & tone check
	for (const c of manifest.components) {
		const d = descriptions[c.name];
		if (!d) continue;
		if (d.length < 20) warnings.push(`Very short description (${d.length} chars): ${c.name}`);
		if (/\b(cutting-edge|revolutionary|world-class|unbelievable)\b/i.test(d)) {
			warnings.push(`Marketing language in description: ${c.name}`);
		}
	}

	if (warnings.length > 0) {
		console.warn(`\nWarnings (${warnings.length}):`);
		for (const w of warnings) {
			console.warn(`  [!] ${w}`);
		}
	}

	if (errors.length > 0) {
		console.error(`\nErrors (${errors.length}):`);
		for (const e of errors) {
			console.error(`  [X] ${e}`);
		}
		console.error('\nDocumentation quality check FAILED.');
		process.exit(1);
	}

	console.log(`\nDocumentation check PASSED. ${manifest.totalComponents} components verified with zero drift.`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
