// pnpm comments:restore [kit[/name]] [--dry-run] [--clean]
// Reads each folder's comments.md and writes the JSDoc back above the declaration
// or member it came from, by declaration label and member path. Entries whose
// site no longer exists are reported and dropped; nothing else is touched.

import fs from 'node:fs';
import path from 'node:path';
import { commentsPath, componentFolders, insertDocs, readComments, writeSource } from './lib/comments.ts';
import { PATHS, readText } from './lib/util.ts';

const argv = process.argv.slice(2);
const [kit = null, name = null] = (argv.find((a) => !a.startsWith('-')) ?? '')
	.replace(/^src\/lib\/components\//, '')
	.replace(/\/+$/, '')
	.split('/');
const scope = { kit: kit || null, name: name || null };

/** A plain folder under `src/lib` — not a kit, but it carries prose too. */
function foldersUnderLib(): { kit: string | null; slug: string; dir: string; relDir: string }[] {
	const plain = ['internal', 'motion', 'theme', 'docs'];
	const wanted = plain.filter((d) => (kit ? kit === d : false));
	return wanted.map((d) => ({
		kit: null,
		slug: d,
		dir: path.join(PATHS.lib, d),
		relDir: `src/lib/${d}`
	}));
}
const dryRun = argv.includes('--dry-run');
const clean = argv.includes('--clean');

const extra = foldersUnderLib();
const folders = [...componentFolders().filter((f) => (!scope.kit || f.kit === scope.kit) && (!scope.name || f.slug === scope.name)), ...extra];
if (!folders.length) {
	console.log('usage: pnpm comments:restore [kit[/name]] [--dry-run]');
	process.exit(2);
}

const missing: string[] = [];
let restored = 0;
let files = 0;

for (const folder of folders) {
	const entries = readComments(folder.dir);
	if (!entries) continue;
	const byFile = new Map<string, typeof entries>();
	for (const e of entries) {
		const list = byFile.get(e.file) ?? [];
		list.push(e);
		byFile.set(e.file, list);
	}
	for (const [name, list] of byFile) {
		const full = path.join(folder.dir, name);
		const source = readText(full);
		if (source === null) {
			for (const e of list) missing.push(`${folder.relDir}/${name} — file is gone`);
			continue;
		}
		const result = insertDocs(source, name, list);
		for (const e of result.missing) missing.push(`${folder.relDir}/${name} — no ${e.label} ${e.path || '(itself)'}`);
		if (!result.applied) continue;
		restored += result.applied;
		files += 1;
		if (!dryRun) writeSource(full, result.output);
	}
	if (clean && !dryRun && !missing.some((m) => m.startsWith(folder.relDir))) fs.rmSync(commentsPath(folder.dir), { force: true });
}

console.log(`${dryRun ? 'would restore' : 'restored'} ${restored} annotations into ${files} files`);
for (const m of missing) console.log(`  missing: ${m}`);
