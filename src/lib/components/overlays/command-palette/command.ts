import type { IconData } from '@fractaldesign/icons';

/** A command in the palette. */
export interface Command {
	/** A stable id, used as the option's DOM id suffix. */
	id: string;
	/** The visible label, also used for ranking and highlighting. */
	label: string;
	/** An optional section heading. Commands that share a group are listed together. */
	group?: string;
	/** An icon drawn before the label. */
	icon?: IconData;
	/** A keyboard shortcut, shown at the trailing edge. */
	shortcut?: string;
	/** Extra text used by the fuzzy scorer, not shown. */
	keywords?: string;
	/** Called when the command is chosen. The palette then closes. */
	onSelect: () => void;
}

export interface ScoredCommand {
	command: Command;
	score: number;
}

export interface CommandGroup {
	group: string;
	commands: Command[];
}

/** A small fuzzy scorer: substring beats subsequence; word starts and consecutive runs score higher. */
export function fuzzy(query: string, text: string): number {
	const q = query.trim().toLowerCase();
	const t = text.toLowerCase();
	if (!q) return 1;
	if (!t) return 0;
	const at = t.indexOf(q);
	if (at === 0) return 1;
	if (at > 0) return Math.max(0.7, 0.9 - at * 0.01);
	let ti = 0;
	let score = 0;
	let run = 0;
	for (const ch of q) {
		const found = t.indexOf(ch, ti);
		if (found < 0) return 0;
		const wordStart = found === 0 || /[\s/_-]/.test(t[found - 1] ?? '');
		run = found === ti ? run + 1 : 1;
		score += 1 + run * 0.45 + (wordStart ? 0.7 : 0);
		ti = found + 1;
	}
	return Math.min(0.68, (score / (q.length * 2.6)) * 0.68);
}

/** Rank a command against the query, using its label and keywords. `0` means no match. */
export function scoreCommand(query: string, command: Command): number {
	const q = query.trim();
	if (!q) return 1;
	const label = fuzzy(q, command.label);
	const keys = command.keywords ? fuzzy(q, command.keywords) * 0.85 : 0;
	return Math.max(label, keys);
}

/** Group scored commands, preserving rank order within and between groups. */
export function groupCommands(query: string, commands: Command[]): CommandGroup[] {
	const scored = commands
		.map((command) => ({ command, score: scoreCommand(query, command) }))
		.filter((row) => row.score > 0)
		.sort((a, b) => b.score - a.score || a.command.label.localeCompare(b.command.label));
	const groups: CommandGroup[] = [];
	const index = new Map<string, CommandGroup>();
	for (const row of scored) {
		const name = row.command.group ?? '';
		let group = index.get(name);
		if (!group) {
			group = { group: name, commands: [] };
			index.set(name, group);
			groups.push(group);
		}
		group.commands.push(row.command);
	}
	return groups;
}

/** Highlight the matched characters of a label against the query. */
export function marks(label: string, query: string): { text: string; hit: boolean }[] {
	const q = query.trim();
	if (!q) return [{ text: label, hit: false }];
	const lower = label.toLowerCase();
	const needle = q.toLowerCase();
	const at = lower.indexOf(needle);
	if (at >= 0) {
		const parts: { text: string; hit: boolean }[] = [];
		if (at > 0) parts.push({ text: label.slice(0, at), hit: false });
		parts.push({ text: label.slice(at, at + q.length), hit: true });
		if (at + q.length < label.length) parts.push({ text: label.slice(at + q.length), hit: false });
		return parts;
	}
	const parts: { text: string; hit: boolean }[] = [];
	let ti = 0;
	let cursor = 0;
	for (const ch of needle) {
		const found = lower.indexOf(ch, ti);
		if (found < 0) break;
		if (found > cursor) parts.push({ text: label.slice(cursor, found), hit: false });
		parts.push({ text: label.slice(found, found + 1), hit: true });
		cursor = found + 1;
		ti = found + 1;
	}
	if (cursor < label.length) parts.push({ text: label.slice(cursor), hit: false });
	return parts.length ? parts : [{ text: label, hit: false }];
}

/** Whether a keyboard event matches a shortcut like `mod+k` or `shift+mod+p`. */
export function matchesShortcut(event: KeyboardEvent, shortcut: string): boolean {
	const parts = shortcut
		.toLowerCase()
		.split('+')
		.map((part) => part.trim())
		.filter(Boolean);
	if (parts.length === 0) return false;
	const key = parts[parts.length - 1] ?? '';
	if (event.key.toLowerCase() !== key) return false;
	const wantMod = parts.includes('mod') || parts.includes('meta') || parts.includes('ctrl') || parts.includes('cmd');
	const wantShift = parts.includes('shift');
	const wantAlt = parts.includes('alt') || parts.includes('option');
	const apple = typeof navigator !== 'undefined' && /Macintosh|iPhone|iPad|iPod/.test(navigator.userAgent);
	const modDown = parts.includes('ctrl')
		? event.ctrlKey
		: parts.includes('meta') || parts.includes('cmd')
			? event.metaKey
			: apple
				? event.metaKey
				: event.ctrlKey;
	if (wantMod !== modDown) return false;
	if (wantShift !== event.shiftKey) return false;
	if (wantAlt !== event.altKey) return false;
	return true;
}
