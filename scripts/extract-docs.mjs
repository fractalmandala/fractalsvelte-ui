// @ts-nocheck
/**
 * extract-docs.mjs — AST-driven documentation extractor for @fractaldesign/fractalsvelte-ui.
 *
 * Scans every .svelte component in src/lib/components/ and generates
 * src/lib/documentation/manifest.json.
 *
 * Implements the documentation flow from documentation-flow.md:
 * - props, defaults, $bindable, snippets extracted from TypeScript AST
 * - forwarded attributes extracted from interface heritage
 * - verbatim component source captured
 * - import & usage snippets generated
 * - merges with authored descriptions from src/lib/documentation/descriptions/*.ts
 */

import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import ts from 'typescript';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const p = (...s) => path.join(ROOT, ...s);

const COMPONENTS_DIR = p('src/lib/components');
const DESCRIPTIONS_DIR = p('src/lib/documentation/descriptions');
const OUTPUT_FILE = p('src/lib/documentation/manifest.json');

/** Recursively get all .svelte component files. */
async function getComponentFiles(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await getComponentFiles(fullPath)));
		} else if (entry.name.endsWith('.svelte')) {
			files.push(fullPath);
		}
	}
	return files;
}

/** Merge every authored descriptions/*.ts module into one map. */
async function loadDescriptions() {
	const map = {};
	if (!existsSync(DESCRIPTIONS_DIR)) return map;
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

/** Parse 'extends HTMLButtonAttributes' etc. */
function parseExtends(heritage) {
	if (!heritage) return { base: null, omit: [] };
	const text = heritage.replace(/^extends\s+/, '').trim();
	const omitMatch = text.match(
		/^Omit<\s*([A-Za-z0-9_]+)\s*(?:<[^>]*>)?\s*,\s*([^>]*(?:>[^>]*)?)>\s*$/
	);
	if (omitMatch) {
		const omit = [...omitMatch[2].matchAll(/'([^']+)'|"([^"]+)"/g)].map((m) => m[1] ?? m[2]);
		return { base: omitMatch[1], omit };
	}
	const base = text.match(/^([A-Za-z0-9_]+)/);
	return { base: base ? base[1] : text, omit: [] };
}

/** Extract script content from Svelte file. */
function extractScript(src) {
	const match = src.match(/<script(?:\s+lang="ts")?>([\s\S]*?)<\/script>/);
	return match ? match[1] : '';
}

/** Parse default values from $props() destructuring. */
function parseDefaults(scriptSrc) {
	const defaults = {};
	const bindables = new Set();

	// Match pattern: let { ... } = $props();
	const propsMatch = scriptSrc.match(/let\s*\{([\s\S]*?)\}\s*:\s*Props\s*=\s*\$props\(\)/);
	if (!propsMatch) return { defaults, bindables };

	const body = propsMatch[1];
	// Parse lines / comma-separated entries
	const lines = body.split(/,\s*\n|,\s*(?=[a-zA-Z_])/);
	for (const line of lines) {
		const clean = line.trim();
		if (!clean || clean.startsWith('//') || clean.startsWith('...')) continue;

		// Check for bindable: e.g. value = $bindable('')
		const bindableMatch = clean.match(/^([a-zA-Z0-9_]+)(?:\s*:\s*[a-zA-Z0-9_]+)?\s*=\s*\$bindable\((.*?)\)$/s);
		if (bindableMatch) {
			const propName = bindableMatch[1];
			bindables.add(propName);
			if (bindableMatch[2]) {
				defaults[propName] = bindableMatch[2].trim();
			}
			continue;
		}

		// Check for default: e.g. variant = 'primary'
		const defaultMatch = clean.match(/^([a-zA-Z0-9_]+)(?:\s*:\s*[a-zA-Z0-9_]+)?\s*=\s*(.+)$/s);
		if (defaultMatch) {
			defaults[defaultMatch[1]] = defaultMatch[2].trim();
		}
	}

	return { defaults, bindables };
}

/** Parse Props interface members from TypeScript source. */
function parseTypeScriptAST(scriptSrc, filePath) {
	const sf = ts.createSourceFile(filePath, scriptSrc, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
	const out = { members: [], extends: null, types: [], exports: [] };

	const walk = (n) => {
		if (ts.isInterfaceDeclaration(n) && n.name.text === 'Props') {
			const heritage = n.heritageClauses?.[0]?.getText(sf) ?? null;
			out.extends = parseExtends(heritage);
			for (const m of n.members) {
				if (!ts.isPropertySignature(m) || !m.name) continue;
				out.members.push({
					name: m.name.getText(sf).replace(/^['"]|['"]$/g, ''),
					type: m.type ? m.type.getText(sf) : 'unknown',
					optional: Boolean(m.questionToken),
					doc: (m.jsDoc ?? [])
						.map((j) =>
							j
								.getText(sf)
								.replace(/^\/\*\*?|\*\/$/g, '')
								.replace(/^\s*\*\s?/gm, '')
								.trim()
						)
						.filter(Boolean)
						.join(' ')
						.trim() || null
				});
			}
		}
		if (ts.isTypeAliasDeclaration(n) && n.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
			out.types.push({ name: n.name.text, definition: n.type.getText(sf) });
		}
		ts.forEachChild(n, walk);
	};
	walk(sf);
	return out;
}

/** Build sample usage snippet. */
function buildUsage(name, props, snippets) {
	const propAttrs = [];
	for (const p of props.slice(0, 3)) {
		if (p.default && p.default !== 'undefined' && p.default !== "''") {
			propAttrs.push(`${p.name}={${p.default}}`);
		}
	}
	const attrStr = propAttrs.length ? ' ' + propAttrs.join(' ') : '';
	if (snippets.some((s) => s.name === 'children')) {
		return `<${name}${attrStr}>Click me</${name}>`;
	}
	return `<${name}${attrStr} />`;
}

async function main() {
	console.log('Extracting documentation manifest from component ASTs...');
	const files = await getComponentFiles(COMPONENTS_DIR);
	const descriptions = await loadDescriptions();

	const components = [];

	for (const file of files) {
		const name = path.basename(file, '.svelte');
		const relPath = path.relative(COMPONENTS_DIR, file);
		const category = path.dirname(relPath) === '.' ? 'core' : path.dirname(relPath);
		const src = await readFile(file, 'utf8');
		const scriptSrc = extractScript(src);

		const { defaults, bindables } = parseDefaults(scriptSrc);
		const ast = parseTypeScriptAST(scriptSrc, file);

		const props = [];
		const snippets = [];

		for (const m of ast.members) {
			const isSnippet = /\bSnippet\b/.test(m.type);
			const entry = {
				name: m.name,
				type: m.type,
				optional: m.optional,
				default: defaults[m.name] ?? null,
				bindable: bindables.has(m.name),
				description: m.doc
			};

			if (isSnippet) {
				snippets.push(entry);
			} else {
				props.push(entry);
			}
		}

		const record = {
			name,
			category,
			file: path.relative(ROOT, file),
			description: descriptions[name] ?? null,
			importSnippet: `import { ${name} } from '@fractaldesign/fractalsvelte-ui';`,
			usageSnippet: buildUsage(name, props, snippets),
			extends: ast.extends,
			props,
			snippets,
			types: ast.types,
			code: src
		};

		components.push(record);
	}

	components.sort((a, b) => a.name.localeCompare(b.name));

	const manifest = {
		generatedAt: new Date().toISOString(),
		totalComponents: components.length,
		components
	};

	await mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
	await writeFile(OUTPUT_FILE, JSON.stringify(manifest, null, 2), 'utf8');

	console.log(`Extracted documentation for ${components.length} components to ${OUTPUT_FILE}`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
