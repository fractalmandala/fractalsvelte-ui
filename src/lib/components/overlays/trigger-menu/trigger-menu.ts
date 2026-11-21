import type { IconData } from '@fractaldesign/icons';

export interface TriggerConfig {
	triggers?: readonly string[];
	trigger?: string;
	items?: TriggerMenuItem[];
	label?: string;
}

export interface TriggerMenuItem {
	value: string;
	label: string;
	description?: string;
	disabled?: boolean;
	icon?: IconData;
	insertText?: string;
}

export interface ActiveTriggerMatch {
	trigger: string;
	start: number;
	query: string;
}

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
