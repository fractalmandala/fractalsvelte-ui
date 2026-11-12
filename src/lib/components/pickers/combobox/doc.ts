import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Combobox',
	summary: 'A searchable field with a filtered list of options, following the ARIA 1.2 combobox pattern.',
	description: `A combobox is a text field that filters a list as the person types. The field keeps focus; arrow keys move an active descendant through the list, and the matching letters in each label are highlighted. Options can be grouped, and a custom \`filter\` or \`onInputChange\` hook makes async search straightforward.

Set \`allowCustom\` to let the typed text itself become the value when it matches no option. The list is a manual popover, anchored under the field, on a glass surface that springs open.`,
	features: [
		'ARIA 1.2 combobox with aria-activedescendant — the field keeps focus',
		'Default or custom filter, highlighted matches, grouped options',
		'allowCustom, async-friendly onInputChange, loading and empty states',
		'Clearable, invalid and disabled, on the shared size and shape axes',
		'Hidden input for native form submission'
	],
	accessibility: [
		'The field is a text input with role="combobox", aria-autocomplete="list", aria-expanded, aria-controls and aria-activedescendant.',
		'The list is a listbox; options carry role="option" and aria-selected. Groups are labelled.',
		'Disabled options are aria-disabled and skipped by the keyboard.',
		'Pass aria-label, or an id that a <label for> points at — attributes go to the input.'
	],
	keyboard: [
		{ keys: 'Arrow Down / Arrow Up', action: 'Opens the list if needed, then moves the active option.' },
		{ keys: 'Enter', action: 'Chooses the active option, or the typed text when allowCustom is set.' },
		{ keys: 'Escape', action: 'Closes the list and leaves the field text as it is.' },
		{ keys: 'Tab', action: 'Closes the list and moves focus on, committing a custom value when allowed.' }
	],
	related: ['select', 'date-picker']
});
