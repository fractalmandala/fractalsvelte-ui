// pnpm comments:strip [kit[/name]] [--props] [--dry-run] [--force]
// Moves the JSDoc of a component folder's source into comments.md and strips it
// from the source. Every file is round-tripped in memory first: if what we would
// write to comments.md does not restore the original exactly, the file is left
// alone and reported.

import path from 'node:path';
import {
	componentFolders,
	findDocs,
	insertDocs,
	readComments,
	sourceFiles,
	squashSource,
	stripDocs,
	writeComments,
	writeSource
} from './lib/comments.ts';
import type { DocEntry } from './lib/comments.ts';
import { readText } from './lib/util.ts';

const argv = process.argv.slice(2);
const [kit = null, name = null] = (argv.find((a) => !a.startsWith('-')) ?? '')
	.replace(/^src\/lib\/components\//, '')
	.replace(/\/+$/, '')
	.split('/');
const scope = { kit: kit || null, name: name || null };
const onlyProps = argv.includes('--props');
const dryRun = argv.includes('--dry-run');
const force = argv.includes('--force');

const folders = componentFolders().filter(
	(f) => (!scope.kit || f.kit === scope.kit) && (!scope.name || f.slug === scope.name)
);
if (!folders.length) {
	console.log('usage: pnpm comments:strip [kit[/name]] [--props] [--dry-run] [--force]');
	process.exit(2);
}

interface Plan {
	full: string;
	stripped: string;
}

// Line breaks and indentation are free to change; token order is not.
const squash = squashSource;

const skipped: string[] = [];
const plans: { folder: { relDir: string; dir: string }; entries: DocEntry[]; files: Plan[] }[] = [];

for (const folder of folders) {
	if (readComments(folder.dir) !== null && !force) {
		skipped.push(`${folder.relDir} — comments.md exists (--force to overwrite)`);
		continue;
	}
	const entries: DocEntry[] = [];
	const files: Plan[] = [];
	for (const name of sourceFiles(folder.dir)) {
		const full = path.join(folder.dir, name);
		const source = readText(full);
		if (source === null) continue;
		const found = findDocs(source, name, onlyProps ? 'props' : 'all');
		if (!found.length) continue;
		const stripped = stripDocs(source, found);
		const mine: DocEntry[] = found.map((e) => ({
			file: e.file,
			label: e.label,
			path: e.path,
			body: e.body,
			line: e.line
		}));
		const back = insertDocs(stripped, name, mine);
		if (back.missing.length || squash(back.output) !== squash(source)) {
			skipped.push(`${folder.relDir}/${name} — would not round-trip, left untouched`);
			continue;
		}
		entries.push(...mine);
		files.push({ full, stripped });
	}
	if (files.length) plans.push({ folder, entries, files });
}

let annotations = 0;
let written = 0;
for (const plan of plans) {
	annotations += plan.entries.length;
	written += plan.files.length;
	if (dryRun) continue;
	writeComments(plan.folder.dir, plan.folder.relDir, plan.entries);
	for (const file of plan.files) writeSource(file.full, file.stripped);
}

const verb = dryRun ? 'would strip' : 'stripped';
const scopeNote = onlyProps ? 'interface Props only' : 'all JSDoc';
console.log(`${verb} ${annotations} annotations from ${written} files in ${plans.length} folders (${scopeNote})`);
for (const s of skipped) console.log(`  skipped: ${s}`);
if (dryRun) console.log('dry run — nothing written');
