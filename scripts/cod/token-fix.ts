// node scripts/cod/token-fix.ts <family> [kit[/name]] [--apply] [--inner]
// --inner also rewrites a literal on an inner element (default: root element only).
// family: pad | gap | textSize | textColor
//
// Turns a hardcoded prop-family class into the tokens.ts prop, behaviour-preserving:
// the old literal becomes the prop's default, so nothing renders differently until a
// consumer passes the prop. Dry run unless --apply.
//
// It only touches the unambiguous case: the part does not declare the prop yet, and the
// family's literal appears on exactly one line, inside a class="…" attribute or a string
// inside class={[…]}. Everything else is listed as MANUAL with the reason.
// Written by cod, 2026-11-19.

import { readFileSync, writeFileSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { audit, declaredProps, type Family } from './token-audit.ts';

const ROOT = join(import.meta.dirname, '../..');
const TOKENS = join(ROOT, 'src/lib/internal/tokens.js');

const SPEC: Partial<Record<Family, { prop: string; type: string; doc: string }>> = {
	pad: { prop: 'pad', type: 'Pad', doc: 'Padding from the space ladder.' },
	gap: { prop: 'gap', type: 'Gap', doc: 'Gap between child elements, from the space ladder. `\'\'` for none.' },
	textSize: { prop: 'textSize', type: 'TextSize', doc: 'Text size of the component.' },
	textColor: { prop: 'textColor', type: 'TextColor', doc: 'Text colour of the component.' }
};

const args = process.argv.slice(2);
const family = args[0] as Family;
const spec = SPEC[family];
if (!spec) {
	console.error(`family must be one of: ${Object.keys(SPEC).join(', ')}`);
	process.exit(2);
}
const scope = args.slice(1).find((a) => !a.startsWith('-'));
const apply = args.includes('--apply');
const inner = args.includes('--inner');

function addTypeImport(src: string, file: string, type: string): string {
	const re = /import (type )?\{([^}]*)\} from '([./]+internal\/tokens\.js)';/;
	const m = re.exec(src);
	if (m) {
		const names = m[2].split(',').map((s) => s.trim()).filter(Boolean);
		const name = m[1] ? type : `type ${type}`;
		if (names.includes(name)) return src;
		return src.replace(re, `import ${m[1] ?? ''}{ ${[...names, name].join(', ')} } from '${m[3]}';`);
	}
	let rel = relative(dirname(file), TOKENS);
	if (!rel.startsWith('.')) rel = './' + rel;
	return src.replace(/<script lang="ts"[^>]*>\n/, (open) => `${open}\timport type { ${type} } from '${rel}';\n`);
}

function addPropDecl(src: string): string | null {
	const m = /interface Props[^{]*\{/.exec(src);
	if (!m) return null;
	let depth = 1;
	let i = m.index + m[0].length;
	while (i < src.length && depth > 0) {
		if (src[i] === '{') depth++;
		else if (src[i] === '}') depth--;
		i++;
	}
	const close = i - 1;
	const lineStart = src.lastIndexOf('\n', close) + 1;
	const indent = src.slice(lineStart, close) + '\t';
	const decl = `${indent}/** ${spec!.doc} */\n${indent}${spec!.prop}?: ${spec!.type};\n`;
	return src.slice(0, lineStart) + decl + src.slice(lineStart);
}

function addDefault(src: string, literal: string): string | null {
	const re = /let\s*\{([\s\S]*?)\}\s*:\s*Props\s*=\s*\$props\(\)/;
	const m = re.exec(src);
	if (!m) return null;
	const body = m[1];
	const multiline = body.includes('\n');
	const entry = `${spec!.prop} = '${literal}'`;
	const newBody = multiline
		? body.replace(/^(\s*\n)?(\s*)/, (_all, nl = '\n', ind) => `${nl || '\n'}${ind}${entry},\n${ind}`)
		: ` ${entry},${body.startsWith(' ') ? body : ' ' + body}`;
	return src.replace(re, `let {${newBody}}: Props = $props()`);
}

/** The class expression the line sits in: [startLine, endLine] (0-based), or null. */
function classBlock(lines: string[], i: number): [number, number] | null {
	if (/class=("|\{)/.test(lines[i])) {
		if (/class="[^"]*"/.test(lines[i]) || /class=\{\[.*\]\}/.test(lines[i])) return [i, i];
	}
	// bare string element inside a multi-line class={[ … ]}
	if (!/^\s*'[^']*',?\s*$/.test(lines[i])) return null;
	let s = i;
	while (s > 0 && !/class=\{\[\s*$/.test(lines[s])) {
		s--;
		if (/\]\}/.test(lines[s]) || /^\s*</.test(lines[s]) && !/class=\{\[/.test(lines[s])) return null;
	}
	if (!/class=\{\[\s*$/.test(lines[s])) return null;
	let e = i;
	while (e < lines.length - 1 && !/\]\}/.test(lines[e])) e++;
	return [s, e];
}

/** Rewrite the one class line. Returns null when the shape is not one we handle. */
function rewriteLine(line: string, literal: string): string | null {
	const tok = new RegExp(`(^|\\s)${literal.replace(/[-]/g, '\\-')}(?=\\s|$)`);
	const clean = (s: string) => s.replace(tok, ' ').replace(/\s+/g, ' ').trim();
	// class="a literal b"
	const attr = /class="([^"]*)"/.exec(line);
	if (attr && tok.test(attr[1])) {
		const rest = clean(attr[1]);
		const v = rest ? `class={['${rest}', ${spec!.prop}]}` : `class={${spec!.prop}}`;
		return line.replace(attr[0], v);
	}
	// 'a literal' as an array element (single-line class={[…]} or its own line)
	if (/class=\{\[.*\]\}/.test(line) || /^\s*'[^']*',?\s*$/.test(line)) {
		for (const s of line.matchAll(/'([^']*)'/g)) {
			if (!tok.test(s[1])) continue;
			const rest = clean(s[1]);
			const repl = rest ? `'${rest}', ${spec!.prop}` : spec!.prop;
			return line.replace(s[0], repl);
		}
	}
	return null;
}

const reports = audit(scope);
const done: string[] = [];
const manual: string[] = [];
const review: string[] = [];
for (const r of reports) {
	const hits = r.findings.filter((f) => f.family === family);
	if (!hits.length) continue;
	if (r.props.includes(spec.prop)) {
		manual.push(`${r.file}: already declares \`${spec.prop}\` but ${hits.length} literal(s) remain (L${hits.map((h) => h.line).join(', L')})`);
		continue;
	}
	const lines = new Set(hits.map((h) => h.line));
	const literals = new Set(hits.map((h) => h.token));
	if (lines.size !== 1 || literals.size !== 1) {
		manual.push(`${r.file}: ${hits.length} literal(s) on ${lines.size} line(s), needs a judgement on which part gets \`${spec.prop}\` vs a child prop (L${[...lines].join(', L')})`);
		continue;
	}
	const file = join(ROOT, r.file);
	let src = readFileSync(file, 'utf8');
	const scriptless = src.replace(/interface Props[\s\S]*?\n\t?\}/, '');
	if (new RegExp(`(?<![\\w$-])${spec.prop}(?![\\w$-])`).test(scriptless)) {
		manual.push(`${r.file}: identifier \`${spec.prop}\` already used in the file`);
		continue;
	}
	const literal = [...literals][0];
	const lineNo = [...lines][0];
	const srcLines = src.split('\n');
	const block = classBlock(srcLines, lineNo - 1);
	const rewritten = block && rewriteLine(srcLines[lineNo - 1], literal);
	if (!block || !rewritten) {
		manual.push(`${r.file}: L${lineNo} \`${literal}\` is not in a plain class attribute (${srcLines[lineNo - 1].trim().slice(0, 90)})`);
		continue;
	}
	const isRoot = /\b(className|klass)\b|\.\.\.rest/.test(
		srcLines.slice(block[0], Math.min(block[1] + 3, srcLines.length)).join('\n')
	);
	if (!isRoot && !inner) {
		review.push(`${r.file}: L${lineNo} \`${literal}\` is on an inner element, not the root. Name it \`${spec.prop}\` only if it is the part's main inset (${srcLines[lineNo - 1].trim().slice(0, 90)})`);
		continue;
	}
	srcLines[lineNo - 1] = rewritten;
	src = srcLines.join('\n');
	const withDecl = addPropDecl(src);
	const withDefault = withDecl && addDefault(withDecl, literal);
	if (!withDefault) {
		manual.push(`${r.file}: no \`interface Props\` / \`$props()\` destructure to extend`);
		continue;
	}
	src = addTypeImport(withDefault, file, spec.type);
	if (declaredProps(src).includes(spec.prop) === false) {
		manual.push(`${r.file}: prop insertion did not parse back, skipped`);
		continue;
	}
	if (apply) writeFileSync(file, src);
	done.push(`${r.file}: L${lineNo} \`${literal}\` → \`${spec.prop}\` (default '${literal}')\n    ${rewritten.trim()}`);
}

console.log(`${apply ? 'APPLIED' : 'DRY RUN'} ${family}: ${done.length} fixed, ${review.length} inner (needs a call), ${manual.length} manual\n`);
for (const d of done) console.log('FIX    ' + d);
for (const v of review) console.log('INNER  ' + v);
for (const m of manual) console.log('MANUAL ' + m);
