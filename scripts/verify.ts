// pnpm verify <kit>[/<name>] — gen + gate + fractalstyler lint + svelte-check, scoped.
// Quiet, fast, and robust to other folders being broken: only diagnostics under the
// scope (and the kit's style fragments) count.

import { spawn } from 'node:child_process';
import path from 'node:path';
import { mapCustomLine } from './lib/css.ts';
import { formatGate, parseScope, runGate } from './lib/gate-core.ts';
import { runGen } from './lib/generate.ts';
import { PATHS, ROOT, escapeRe, rel } from './lib/util.ts';

const arg = process.argv.slice(2).find((a) => !a.startsWith('-'));
if (!arg) {
	console.log('usage: pnpm verify <kit>[/<name>]');
	process.exit(2);
}
const scope = parseScope(arg);
const prefix = `src/lib/components/${scope.kit}/${scope.name ? scope.name + '/' : ''}`;
/** kits/<kit>.css and kits/<kit>-<suffix>.css */
const fragment = new RegExp(`^src/lib/styles/layers/kits/${escapeRe(scope.kit ?? '')}(-[^/]+)?\\.css$`);
const inScope = (file: string) => {
	const f = file.split(path.sep).join('/').replace(/^\.\//, '');
	return f.startsWith(prefix) || fragment.test(f);
};

function run(cmd: string, args: string[]): Promise<{ code: number; stdout: string; stderr: string }> {
	return new Promise((resolve) => {
		const child = spawn(cmd, args, { cwd: ROOT, env: { ...process.env, FORCE_COLOR: '0' } });
		let stdout = '';
		let stderr = '';
		child.stdout.on('data', (d) => (stdout += d));
		child.stderr.on('data', (d) => (stderr += d));
		child.on('error', (e) => resolve({ code: 127, stdout, stderr: stderr + e.message }));
		child.on('close', (code) => resolve({ code: code ?? 1, stdout, stderr }));
	});
}

let failed = false;
const out: string[] = [];

// 1. gen
const gen = await runGen();
const genBad = gen.results.filter((r) => !r.ok);
out.push(genBad.length ? `⚠ gen      ${genBad.map((r) => r.summary).join('; ')}` : `✔ gen`);

// 2. gate (scoped)
const gate = await runGate(scope, { lib: gen.lib, layers: gen.layers });
if (gate.errors || gate.scopeError) failed = true;
out.push(`${gate.errors || gate.scopeError ? '✘' : '✔'} gate`);
if (gate.errors || gate.warnings || gate.scopeError) out.push(formatGate(gate, { quiet: true }).replace(/^/gm, '  '));

// 3 + 4. lint and svelte-check, in parallel
interface LintDiag {
	rule: string;
	severity: string;
	file: string;
	line?: number;
	found: string;
	suggestion: string;
}
const lintP = run(process.execPath, [PATHS.fsLintCli, '.', '--json']).then((r) => {
	const start = r.stdout.indexOf('[');
	let diags: LintDiag[] = [];
	try {
		diags = JSON.parse(r.stdout.slice(start)) as LintDiag[];
	} catch {
		return { ok: false, lines: [`  lint output unreadable (exit ${r.code}): ${(r.stderr || r.stdout).trim().split('\n').slice(0, 3).join(' ')}`] };
	}
	const lines: string[] = [];
	let errors = 0;
	for (const d of diags) {
		let file = d.file;
		let line = d.line;
		if (file === rel(PATHS.customCss) && line) {
			const m = mapCustomLine(gen.layers.segments, line);
			if (m) {
				file = `src/lib/styles/layers/${m.file}`;
				line = m.line;
			}
		}
		if (!inScope(file)) continue;
		if (d.severity === 'error') errors++;
		lines.push(`  ${d.severity === 'error' ? '' : '⚠ '}${d.rule}  ${file}${line ? ':' + line : ''}  ${d.found}  → ${d.suggestion.split('\n').join(' ')}`);
	}
	return { ok: errors === 0, lines };
});

const checkP = (async () => {
	const sync = await run('pnpm', ['exec', 'svelte-kit', 'sync']);
	if (sync.code !== 0) return { ok: false, lines: [`  svelte-kit sync failed: ${sync.stderr.trim().split('\n').slice(-3).join(' ')}`] };
	const r = await run('pnpm', ['exec', 'svelte-check', '--tsconfig', './tsconfig.json', '--output', 'machine']);
	const lines: string[] = [];
	let errors = 0;
	for (const l of r.stdout.split('\n')) {
		const m = l.match(/^\d+\s+(ERROR|WARNING)\s+"(.+?)"\s+(\d+):(\d+)\s+"(.*)"\s*$/);
		if (!m) continue;
		const file = path.isAbsolute(m[2]) ? rel(m[2]) : m[2];
		if (!inScope(file)) continue;
		if (m[1] === 'ERROR') errors++;
		lines.push(`  ${m[1] === 'ERROR' ? '' : '⚠ '}${file}:${m[3]}:${m[4]}  ${m[5].replace(/\\n/g, ' ').replace(/\\"/g, '"')}`);
	}
	if (!/COMPLETED/.test(r.stdout) && r.code !== 0 && lines.length === 0)
		return { ok: false, lines: [`  svelte-check did not complete: ${(r.stderr || r.stdout).trim().split('\n').slice(-3).join(' ')}`] };
	return { ok: errors === 0 && lines.length === 0, lines };
})();

const [lint, check] = await Promise.all([lintP, checkP]);
if (!lint.ok) failed = true;
out.push(`${lint.ok ? '✔' : '✘'} lint`, ...lint.lines);
if (!check.ok) failed = true;
out.push(`${check.ok ? '✔' : '✘'} svelte-check`, ...check.lines);

out.push(failed ? `✘ verify ${arg} failed` : `✔ verify ${arg} passed`);
console.log(out.join('\n'));
process.exitCode = failed ? 1 : 0;
