// Turns a rendered doc page (DOM) into Markdown for "Copy this Page" / "Open as Markdown".
// Live previews are dropped; core-prop rows become their value labels; code blocks keep their source.

const SKIP = 'script, style, svg, button, input, select, textarea, nav, [aria-hidden="true"], [data-md-skip], .demo-box';

const clean = (s: string) => s.replace(/\s+/g, ' ');

function inline(node: Node): string {
	if (node.nodeType === Node.TEXT_NODE) return clean(node.textContent ?? '');
	if (!(node instanceof HTMLElement) || node.matches(SKIP)) return '';
	const inner = () => Array.from(node.childNodes).map(inline).join('');
	switch (node.tagName) {
		case 'CODE':
			return '`' + (node.textContent ?? '').trim() + '`';
		case 'STRONG':
		case 'B':
			return `**${inner().trim()}**`;
		case 'EM':
		case 'I':
			return `*${inner().trim()}*`;
		case 'A': {
			const href = (node as HTMLAnchorElement).href;
			return href ? `[${inner().trim()}](${href})` : inner();
		}
		case 'BR':
			return '\n';
		default:
			return inner();
	}
}

function table(t: HTMLTableElement): string {
	const rows = Array.from(t.rows).map((r) =>
		Array.from(r.cells).map((c) => inline(c).trim().replace(/\|/g, '\\|') || ' ')
	);
	if (!rows.length) return '';
	const [head, ...body] = rows;
	return [
		`| ${head.join(' | ')} |`,
		`| ${head.map(() => '---').join(' | ')} |`,
		...body.map((r) => `| ${r.join(' | ')} |`)
	].join('\n');
}

function block(node: Node, out: string[]) {
	if (node.nodeType === Node.TEXT_NODE) {
		const t = clean(node.textContent ?? '').trim();
		if (t) out.push(t);
		return;
	}
	if (!(node instanceof HTMLElement) || node.matches(SKIP)) return;
	const tag = node.tagName;
	if (/^H[1-6]$/.test(tag)) {
		out.push('#'.repeat(Number(tag[1])) + ' ' + (node.innerText || node.textContent || '').trim());
		return;
	}
	if (tag === 'PRE') {
		const lang = node.querySelector('code')?.className.match(/language-(\w+)/)?.[1] ?? node.dataset.lang ?? '';
		out.push('```' + lang + '\n' + (node.textContent ?? '').replace(/\n$/, '') + '\n```');
		return;
	}
	if (tag === 'TABLE') {
		out.push(table(node as HTMLTableElement));
		return;
	}
	if (tag === 'UL' || tag === 'OL') {
		const items = Array.from(node.children).filter((li) => li.tagName === 'LI');
		out.push(items.map((li, i) => `${tag === 'OL' ? `${i + 1}.` : '-'} ${inline(li).trim()}`).join('\n'));
		return;
	}
	if (node.classList.contains('props-row')) {
		// core-prop examples: keep only the value labels under each preview
		const labels = Array.from(node.querySelectorAll(':scope > * > span:last-child')).map((s) => '`' + (s.textContent ?? '').trim() + '`');
		if (labels.length) out.push('Values: ' + labels.join(', '));
		return;
	}
	if (tag === 'P' || tag === 'LI' || tag === 'SPAN' && node.parentElement?.closest('header')) {
		const t = inline(node).trim();
		if (t) out.push(t);
		return;
	}
	node.childNodes.forEach((c) => block(c, out));
}

export function htmlToMarkdown(root: HTMLElement): string {
	const out: string[] = [];
	root.childNodes.forEach((c) => block(c, out));
	return out.filter(Boolean).join('\n\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}
