// The gate, as a function: shared by scripts/gate.ts and scripts/verify.ts.

import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { analyzeLibrary } from './analysis.ts';
import type { ComponentAnalysis, Library } from './analysis.ts';
import { buildLayers } from './css.ts';
import type { LayerBuild } from './css.ts';
import { checkComponent, checkKitFragments, checkLibraryFiles, loadAllowlist } from './checks.ts';
import type { Diag, GateContext } from './checks.ts';
import { PATHS, ROOT, cssCodeLines, listDir, readText } from './util.ts';

export interface Scope {
	kit: string | null;
	name: string | null;
}

export interface GateGroup {
	id: string;
	kind: 'component' | 'styles' | 'library';
	diagnostics: Diag[];
}

export interface GateResult {
	scope: Scope;
	groups: GateGroup[];
	components: number;
	passing: number;
	failing: number;
	errors: number;
	warnings: number;
	budget: { fractalsvelte: number; fractalstyler: number } | null;
	scopeError: string | null;
}

export function parseScope(arg: string | undefined): Scope {
	if (!arg) return { kit: null, name: null };
	const [kit, name] = arg.replace(/^src\/lib\/components\//, '').replace(/\/+$/, '').split('/');
	return { kit: kit || null, name: name || null };
}

export function inScope(c: ComponentAnalysis, s: Scope): boolean {
	return (!s.kit || c.ref.kit === s.kit) && (!s.name || c.ref.slug === s.name);
}

function sortDiags(d: Diag[]): Diag[] {
	return d.sort((a, b) => (a.file < b.file ? -1 : a.file > b.file ? 1 : (a.line ?? 0) - (b.line ?? 0) || (a.rule < b.rule ? -1 : a.rule > b.rule ? 1 : 0)));
}

/** Dedupe identical diagnostics (a file can be reached twice). */
function uniq(d: Diag[]): Diag[] {
	const seen = new Set<string>();
	return d.filter((x) => {
		const k = `${x.rule}|${x.file}|${x.line}|${x.message}`;
		if (seen.has(k)) return false;
		seen.add(k);
		return true;
	});
}

export function fractalstylerLines(): number {
	return listDir(PATHS.fsDistStyles, 'file')
		.filter((n) => n.endsWith('.css') && n !== 'modular.css')
		.reduce((sum, n) => sum + cssCodeLines(readText(path.join(PATHS.fsDistStyles, n)) ?? ''), 0);
}

/** The highlighter must never drop or reorder characters. */
async function highlightSelftest(): Promise<Diag[]> {
	try {
		const mod = (await import(pathToFileURL(path.join(ROOT, 'scripts/lib/highlight.selftest.ts')).href)) as { selftest: () => Promise<string[]> };
		const failures = await mod.selftest();
		return failures.map((m) => ({ rule: 'highlight/selftest', severity: 'error' as const, file: 'src/lib/internal/highlight.ts', line: null, message: m, fix: 'the concatenated token text must equal the input' }));
	} catch (err) {
		return [{ rule: 'highlight/selftest', severity: 'error', file: 'src/lib/internal/highlight.ts', line: null, message: `selftest crashed: ${(err as Error).message}`, fix: 'fix highlight.ts' }];
	}
}

export async function runGate(scope: Scope, pre?: { lib: Library; layers: LayerBuild }): Promise<GateResult> {
	const layers = pre?.layers ?? buildLayers();
	const lib = pre?.lib ?? analyzeLibrary();
	const allow = loadAllowlist(layers);
	const result: GateResult = { scope, groups: [], components: 0, passing: 0, failing: 0, errors: 0, warnings: 0, budget: null, scopeError: null };

	const selected = lib.components.filter((c) => inScope(c, scope));
	if ((scope.kit || scope.name) && selected.length === 0) {
		const kitExists = lib.components.some((c) => c.ref.kit === scope.kit) || listDir(PATHS.components, 'dir').includes(scope.kit ?? '');
		result.scopeError = scope.name
			? `no component folder src/lib/components/${scope.kit}/${scope.name}`
			: kitExists
				? null
				: `no kit folder src/lib/components/${scope.kit}`;
	}

	const exportOwners = new Map<string, string[]>();
	for (const c of lib.components) {
		for (const e of c.exports) {
			const owners = exportOwners.get(e.name) ?? [];
			const id = `${c.ref.kit}/${c.ref.slug}`;
			if (!owners.includes(id)) owners.push(id);
			exportOwners.set(e.name, owners);
		}
	}
	const ctx: GateContext = { allow, kits: lib.kits, slugs: new Set(lib.components.map((c) => c.ref.slug)), exportOwners };

	if (!allow.registryFound) {
		result.groups.push({
			id: '(library)',
			kind: 'library',
			diagnostics: [{ rule: 'class/registry', severity: 'error', file: 'node_modules/@fractaldesign/fractalstyler/registry.json', line: null, message: 'fractalstyler registry.json not found', fix: 'pnpm install' }]
		});
	}

	for (const c of selected) {
		const diagnostics = sortDiags(uniq(checkComponent(c, ctx)));
		result.groups.push({ id: `${c.ref.kit}/${c.ref.slug}`, kind: 'component', diagnostics });
	}

	const styles = checkKitFragments(layers, lib.kits, scope.kit);
	if (styles.length || !scope.kit) result.groups.push({ id: '(styles)', kind: 'styles', diagnostics: sortDiags(styles) });

	if (!scope.kit) {
		const libraryDiags = [...checkLibraryFiles(allow), ...(await highlightSelftest())];
		result.groups.push({ id: '(library)', kind: 'library', diagnostics: sortDiags(uniq(libraryDiags)) });
		result.budget = { fractalsvelte: layers.codeLines, fractalstyler: fractalstylerLines() };
	}

	// merge duplicate (library) groups
	const merged: GateGroup[] = [];
	for (const g of result.groups) {
		const prev = merged.find((m) => m.id === g.id);
		if (prev) prev.diagnostics.push(...g.diagnostics);
		else merged.push(g);
	}
	result.groups = merged;

	for (const g of result.groups) {
		const errs = g.diagnostics.filter((d) => d.severity === 'error').length;
		result.errors += errs;
		result.warnings += g.diagnostics.length - errs;
		if (g.kind === 'component') {
			result.components++;
			if (errs) result.failing++;
			else result.passing++;
		}
	}
	return result;
}

export function formatGate(r: GateResult, opts: { quiet?: boolean } = {}): string {
	const lines: string[] = [];
	if (r.scopeError) lines.push(`✘ ${r.scopeError}`);
	for (const g of r.groups) {
		const errs = g.diagnostics.filter((d) => d.severity === 'error').length;
		if (opts.quiet && g.diagnostics.length === 0) continue;
		if (g.kind !== 'component' && g.diagnostics.length === 0) continue;
		lines.push(`${errs ? '✘' : '✔'} ${g.id}`);
		const ruleWidth = Math.max(0, ...g.diagnostics.map((d) => d.rule.length));
		for (const d of g.diagnostics) {
			const loc = d.line ? `${d.file}:${d.line}` : d.file;
			lines.push(`    ${d.severity === 'warning' ? '⚠ ' : ''}${d.rule.padEnd(ruleWidth)}  ${loc}  ${d.message}  → ${d.fix}`);
		}
	}
	lines.push(`${r.components} components, ${r.passing} passing, ${r.failing} failing, ${r.errors} errors${r.warnings ? `, ${r.warnings} warnings` : ''}`);
	if (r.budget) {
		const pct = r.budget.fractalstyler ? ((r.budget.fractalsvelte / r.budget.fractalstyler) * 100).toFixed(1) : '—';
		lines.push(`budget: fractalsvelte-ui extension CSS ${r.budget.fractalsvelte} lines vs fractalstyler ${r.budget.fractalstyler} lines (${pct}%)`);
	}
	return lines.join('\n');
}
