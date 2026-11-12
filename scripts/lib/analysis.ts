// The in-memory model of the library: kits, component folders and everything
// gen writes and the gate checks. Never throws on a half-built tree.

import ts from 'typescript';
import path from 'node:path';
import type { ApiComponent } from '../../src/lib/docs/api-types.ts';
import { analyzePart, folderAliases, parseExports, parseTs, readExamples, toApiPart } from './api.ts';
import type { ExampleInfo, ExportEntry, PartInfo } from './api.ts';
import { evalDoc } from './doc.ts';
import type { DocEval } from './doc.ts';
import { PATHS, byCodepoint, exists, isDir, listDir, pascal, readText, rel } from './util.ts';

export interface KitInfo {
	id: string;
	title: string;
	description: string;
}

/** Kits from kits.ts, read statically (works even while kits.ts is mid-edit). */
export function readKits(): KitInfo[] {
	const src = readText(PATHS.kitsTs);
	if (!src) return [];
	const sf = parseTs(src, 'kits.ts');
	const out: KitInfo[] = [];
	const visit = (n: ts.Node) => {
		if (ts.isObjectLiteralExpression(n)) {
			const rec: Record<string, string> = {};
			for (const p of n.properties) {
				if (ts.isPropertyAssignment(p) && ts.isIdentifier(p.name) && (ts.isStringLiteral(p.initializer) || ts.isNoSubstitutionTemplateLiteral(p.initializer))) {
					rec[p.name.text] = p.initializer.text;
				}
			}
			if (rec.id) out.push({ id: rec.id, title: rec.title ?? rec.id, description: rec.description ?? '' });
			return;
		}
		ts.forEachChild(n, visit);
	};
	visit(sf);
	return out;
}

export interface ComponentRef {
	kit: string;
	slug: string;
	dir: string;
	relDir: string;
}

/** Every component folder, kits in kits.ts order (unknown kits after, sorted), names sorted. */
export function listComponents(kits: KitInfo[] = readKits()): ComponentRef[] {
	const order = new Map(kits.map((k, i) => [k.id, i]));
	const kitDirs = listDir(PATHS.components, 'dir').sort((a, b) => {
		const ia = order.get(a) ?? 1e6;
		const ib = order.get(b) ?? 1e6;
		return ia - ib || byCodepoint(a, b);
	});
	const out: ComponentRef[] = [];
	for (const kit of kitDirs) {
		for (const slug of listDir(path.join(PATHS.components, kit), 'dir')) {
			const dir = path.join(PATHS.components, kit, slug);
			out.push({ kit, slug, dir, relDir: rel(dir) });
		}
	}
	return out;
}

export interface ComponentAnalysis {
	ref: ComponentRef;
	name: string;
	primaryFile: string;
	hasPrimary: boolean;
	hasIndex: boolean;
	hasDoc: boolean;
	exports: ExportEntry[];
	indexError: string | null;
	/** Root-level .svelte files of the folder. */
	svelteFiles: string[];
	/** Root-level .ts files of the folder (doc.ts and index.ts included). */
	tsFiles: string[];
	parts: PartInfo[];
	examples: ExampleInfo[];
	doc: DocEval | null;
	/** An unexpected failure while analysing this folder. */
	crash: string | null;
}

export function analyzeComponent(ref: ComponentRef): ComponentAnalysis {
	const name = pascal(ref.slug);
	const a: ComponentAnalysis = {
		ref,
		name,
		primaryFile: `${name}.svelte`,
		hasPrimary: exists(path.join(ref.dir, `${name}.svelte`)),
		hasIndex: false,
		hasDoc: false,
		exports: [],
		indexError: null,
		svelteFiles: [],
		tsFiles: [],
		parts: [],
		examples: [],
		doc: null,
		crash: null
	};
	try {
		const files = listDir(ref.dir, 'file');
		a.svelteFiles = files.filter((f) => f.endsWith('.svelte'));
		a.tsFiles = files.filter((f) => f.endsWith('.ts'));
		a.hasIndex = files.includes('index.ts');
		a.hasDoc = files.includes('doc.ts');

		if (a.hasIndex) {
			try {
				a.exports = parseExports(readText(path.join(ref.dir, 'index.ts')) ?? '', ref.dir);
			} catch (err) {
				a.indexError = (err as Error).message;
			}
		}

		// Parts: the exported .svelte components (primary first); without an
		// index.ts, fall back to the folder's .svelte files.
		const partFiles: { name: string; file: string }[] = [];
		const svelteExports = a.exports.filter((e) => e.svelteFile);
		if (svelteExports.length) {
			for (const e of svelteExports) {
				const file = (e.svelteFile ?? '').replace(/^\.\//, '');
				if (!file.includes('/') && a.svelteFiles.includes(file)) partFiles.push({ name: e.name, file });
			}
		} else {
			for (const f of a.svelteFiles) partFiles.push({ name: f.replace(/\.svelte$/, ''), file: f });
		}
		partFiles.sort((x, y) => (x.name === name ? -1 : y.name === name ? 1 : 0));

		const types = folderAliases(ref.dir);
		for (const p of partFiles) {
			const src = readText(path.join(ref.dir, p.file)) ?? '';
			a.parts.push(analyzePart(p.name, p.file, src, types));
		}

		a.examples = readExamples(ref.dir);
		if (a.hasDoc) a.doc = evalDoc(readText(path.join(ref.dir, 'doc.ts')) ?? '');
	} catch (err) {
		a.crash = (err as Error).stack ?? String(err);
	}
	return a;
}

export function toApiComponent(a: ComponentAnalysis): ApiComponent {
	return {
		kit: a.ref.kit,
		slug: a.ref.slug,
		name: a.name,
		exports: a.exports.filter((e) => !e.isType).map((e) => e.name),
		typeExports: a.exports.filter((e) => e.isType).map((e) => e.name),
		parts: a.parts.map(toApiPart),
		examples: a.examples.map((e) => ({ file: e.file, title: e.title, description: e.description }))
	};
}

export interface Library {
	kits: KitInfo[];
	components: ComponentAnalysis[];
}

export function analyzeLibrary(): Library {
	const kits = readKits();
	const components = listComponents(kits).map(analyzeComponent);
	return { kits, components };
}

export function hasModuleIndex(dir: string): boolean {
	return isDir(dir) && exists(path.join(dir, 'index.ts'));
}
