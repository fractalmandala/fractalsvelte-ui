#!/usr/bin/env node
/**
 * Regenerate the value tables in docs/guides/09-token-reference.md from
 * token-source.json (which is itself generated from _00_tokens.sass).
 * Prose outside the BEGIN/END GENERATED markers is preserved.
 *
 *   node scripts/generate-token-guide.mjs          # rewrite the tables
 *   node scripts/generate-token-guide.mjs --check  # exit 1 if stale
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const guidePath = resolve(root, 'docs/guides/09-token-reference.md');

const { defaults, dark } = JSON.parse(readFileSync(resolve(root, 'src/lib/styles/token-source.json'), 'utf8'));

const GROUPS = [
	['Typography', (n) => n.startsWith('--font-') || (n.startsWith('--text-') && !['--text-primary', '--text-secondary', '--text-muted', '--text-inverse'].includes(n))],
	['Space', (n) => n.startsWith('--space-')],
	['Radius', (n) => n.startsWith('--radius')],
	['Controls', (n) => n.startsWith('--control-h')],
	['Elevation', (n) => n.startsWith('--shadow-')],
	['Layering', (n) => n.startsWith('--z-')],
	['Layout', (n) => ['--header-height', '--footer-height', '--measure', '--page-gutter', '--sidebar-width', '--toc-width', '--card-min', '--breakpoint', '--shell-pad', '--layout-max'].includes(n)],
	['Motion', (n) => n.startsWith('--motion-') || n.startsWith('--ease-')],
	['Palette', () => true]
];

function renderTables() {
	const used = new Set();
	const parts = [];
	for (const [title, match] of GROUPS) {
		const names = Object.keys(defaults).filter((n) => !used.has(n) && match(n));
		if (!names.length) continue;
		names.forEach((n) => used.add(n));
		parts.push(`### ${title}\n\n| Token | Default | Dark override |\n| --- | --- | --- |`);
		for (const name of names) {
			const isColor = /^(#|rgb|hsl|color-mix)/.test(defaults[name]);
			const def = isColor ? defaults[name].toLowerCase() : defaults[name];
			const darkNote = dark[name] === defaults[name] ? 'inherits default' : `\`${(dark[name] ?? '').toLowerCase()}\``;
			parts.push(`| \`${name}\` | \`${def}\` | ${darkNote} |`);
		}
		parts.push('');
	}
	return parts.join('\n');
}

const BEGIN = '<!-- BEGIN GENERATED TOKEN TABLES -->';
const END = '<!-- END GENERATED TOKEN TABLES -->';
const guide = readFileSync(guidePath, 'utf8');

const generated = `${BEGIN}\n\n${renderTables()}\n${END}`;
let next;
if (guide.includes(BEGIN) && guide.includes(END)) {
	next = guide.replace(new RegExp(`${BEGIN}[\\s\\S]*${END}`), generated);
} else {
	// First run: replace everything after the intro paragraph.
	const marker = guide.indexOf('## Token groups and shipped values');
	next = `${guide.slice(0, marker)}${generated}\n`;
}

if (process.argv.includes('--check')) {
	checkGuideSync(guide, next);
} else {
	writeFileSync(guidePath, next);
	console.log(`token guide tables regenerated (${Object.keys(defaults).length} tokens documented)`);
}

function checkGuideSync(current, expected) {
	if (current !== expected) {
		console.error('Out of date: docs/guides/09-token-reference.md. Run `pnpm tokens:generate` (it refreshes the guide tables too).');
		process.exit(1);
	}
	console.log('Token guide tables are in sync.');
}

export function checkGuide() {
	const current = readFileSync(guidePath, 'utf8');
	checkGuideSync(current, next);
}
