// Step 3: one definition per prop NAME, shared by every component that has it.
// Edit `text` freely, then set `draft: false` once the wording is final.
// A component-specific override can go under `byComponent['actions/Button']`.
export interface PropDefinition {
	text: string;
	draft: boolean;
	byComponent?: Record<string, string>;
}

export const propDefinitions: Record<string, PropDefinition> = {
	variant: {
		draft: false,
		text: 'Visual style. Applied as a plain class, e.g. `primary`, `outline`, `ghost`.',
		byComponent: {
			'display/Tag': 'Fill colour: a surface (`bg-panel`, `state-hover`…), theme colour or message colour. With `textOnly`, colours the text instead.'
		}
	},
	size: { draft: true, text: 'Height step. Applied as a plain class, e.g. `h-xs` … `h-xl`.' },
	shape: { draft: true, text: 'Corner treatment. Applied as a plain class, e.g. `square`, `min`, `round`.' },
	shadow: {
		draft: true,
		text: 'Shadow depth. Applied as a plain class, e.g. `shad-bs`, `shad-hover-lg`. Defaults to `shad-none` (no shadow).'
	},
	textOnly: { draft: true, text: 'Drops the fill and uses the `variant` colour for the text and icon.' },
	loading: { draft: true, text: 'Shows a Spinner in place of `leading`, hides `trailing`, sets `aria-busy` and makes the element inert.' },
	disabled: { draft: true, text: 'Makes the element inert: disables a `<button>`; on a link, drops `href` and sets `aria-disabled`.' },
	href: { draft: true, text: 'Renders an `<a>` instead of a `<button>`.' },
	class: { draft: true, text: 'Extra classes appended after the component\'s own.' },
	children: { draft: true, text: 'Main content.' },
	leading: { draft: true, text: 'Content before `children` (e.g. an icon). Replaced by the Spinner while loading.' },
	trailing: { draft: true, text: 'Content after `children`. Hidden while loading.' }
};

export function definitionFor(prop: string, componentPath: string) {
	const d = propDefinitions[prop];
	if (!d) return { text: '', draft: true };
	return { text: d.byComponent?.[componentPath] ?? d.text, draft: d.draft };
}

/** Definition text as HTML: escaped, with `backticked` bits wrapped in <em> (styled as sans, not mono). */
export function definitionHtml(text: string): string {
	const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	return escaped.replace(/`([^`]+)`/g, '<em>$1</em>');
}
