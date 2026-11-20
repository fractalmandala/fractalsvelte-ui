import type { IconData } from '@fractaldesign/icons';

/** The input a trigger menu watches, and which characters open it. */
export interface TriggerConfig {
	/** Characters that open the menu, e.g. `['@', '/']`. */
	triggers: readonly string[];
	/** The single trigger character for a menu that only watches one. */
	trigger?: string;
	/** The suggestion list shown while the menu is open. */
	items?: TriggerMenuItem[];
	/** The menu's accessible label. */
	label?: string;
}

/** One row of the suggestion popup. */
export interface TriggerMenuItem {
	value: string;
	label: string;
	description?: string;
	disabled?: boolean;
	icon?: IconData;
	/** What replaces the trigger + query when the item is picked; `value` when omitted. */
	insertText?: string;
}

/** A trigger word found immediately before the caret. */
export interface ActiveTriggerMatch {
	trigger: string;
	/** Index of the trigger character in the text. */
	start: number;
	/** What the user has typed after it. */
	query: string;
}

/** Detects an active trigger word immediately preceding `caret` with no inner whitespace. */
export function detectTrigger(
	text: string,
	caret: number,
	triggerChars: readonly string[]
): ActiveTriggerMatch | null {
	const before = text.slice(0, caret);
	let i = before.length - 1;

	while (i >= 0) {
		const ch = before[i];

		if (/\s/.test(ch)) return null;

		const matchedTrigger = triggerChars.find((t) => before.slice(i, i + t.length) === t);

		if (matchedTrigger) {
			const prev = i === 0 ? '' : before[i - 1];

			if (i === 0 || /\s/.test(prev)) {
				return {
					trigger: matchedTrigger,
					start: i,
					query: before.slice(i + matchedTrigger.length)
				};
			}

			return null;
		}
		i--;
	}

	return null;
}
