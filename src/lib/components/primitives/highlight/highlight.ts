/** One piece of a highlighted string: `match` is true where the query hit. */
export interface HighlightChunk {
	text: string;
	match: boolean;
}

const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function buildChunks(text: string, spans: { start: number; end: number }[]): HighlightChunk[] {
	const result: HighlightChunk[] = [];
	let cursor = 0;

	for (const span of spans) {
		if (span.start > cursor) result.push({ text: text.slice(cursor, span.start), match: false });
		result.push({ text: text.slice(span.start, span.end), match: true });
		cursor = span.end;
	}

	if (cursor < text.length) result.push({ text: text.slice(cursor), match: false });

	return result;
}

/** Splits `text` into matched and unmatched chunks for `query`. */
export function splitHighlight(
	text: string,
	query: string | readonly string[] | undefined,
	ignoreCase = true,
	matchAll = true
): HighlightChunk[] {
	const queries = (Array.isArray(query) ? query : query ? [query as string] : []).filter(
		Boolean
	) as string[];

	if (queries.length === 0 || text.length === 0) return [{ text, match: false }];

	const pattern = queries.map(escapeRegex).join('|');
	const flags = `${ignoreCase ? 'i' : ''}${matchAll ? 'g' : ''}u`;
	const regex = new RegExp(`(${pattern})`, flags);
	const raw = matchAll
		? [...text.matchAll(regex)]
		: (() => {
				const m = text.match(regex);

				return m ? [m] : [];
			})();

	const spans: { start: number; end: number }[] = [];

	for (const match of raw) {
		const start = match.index ?? 0;
		const end = start + match[0].length;

		if (end <= start) continue;

		const prev = spans[spans.length - 1];

		if (prev && start <= prev.end) {
			prev.end = Math.max(prev.end, end);
		} else {
			spans.push({ start, end });
		}
	}

	return spans.length > 0 ? buildChunks(text, spans) : [{ text, match: false }];
}
