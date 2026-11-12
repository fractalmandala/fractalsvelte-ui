import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'SearchInput',
	summary: 'A search field with a leading icon, a clear button, a loading state, and an optional keyboard shortcut.',
	description: `\`SearchInput\` is an \`Input\` with \`type="search"\`, a search icon, and a clear button. \`onSearch\` fires 250ms after typing settles, and immediately when Enter is pressed, so you can fetch results without handling the debounce yourself.

\`loading\` puts a spinner in the field while a query is in flight. \`shortcut\` (for example \`/\`) is shown as a hint while the field is empty, and pressing that key focuses the field — unless focus is already in another input.`,
	features: [
		'type="search" with the platform cancel button hidden',
		'Debounced onSearch, immediate on Enter',
		'Loading spinner',
		'Shortcut hint and focus shortcut',
		'Clearable, with Escape to clear',
		'Same variants, sizes and shapes as Input'
	],
	accessibility: [
		'Renders a native search input; label, hint and error come from Field. Without a Field, give it an aria-label.',
		'The clear button has an accessible name and is not a tab stop (Escape clears). The shortcut hint is a visual kbd and is not announced as a key instruction unless you add one in the label or hint.',
		'The loading indicator is decorative; announce a busy state on the results region yourself.'
	],
	keyboard: [
		{ keys: 'Enter', action: 'Fires onSearch immediately with the current query.' },
		{ keys: 'Escape', action: 'Clears the query.' },
		{ keys: 'The shortcut key', action: 'Focuses the field when focus is not already in another control.' }
	],
	related: ['field', 'input']
});
