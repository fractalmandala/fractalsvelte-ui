import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Select',
	summary: 'A custom single or multiple choice list that opens from a field, with groups, icons and typeahead.',
	description: `Select replaces the native \`<select>\` when the options need more than text: an icon, a second line, a group heading, or several choices at once. The field is a button; the list is a native popover anchored under it with CSS anchor positioning, as wide as the field, on a glass surface that springs open.

It is generic over the value type — numbers, ids, or objects all work — and \`value\` is bindable (an array when \`multiple\` is set). Give it a \`name\` and it writes hidden inputs, so it submits with an ordinary form.`,
	features: [
		'Single or multiple selection, bindable value',
		'Grouped options with headings, icons and descriptions',
		'Typeahead, Home/End, and a check mark on chosen options',
		'Clearable, invalid and disabled states on the shared size and shape axes',
		'Hidden inputs for native form submission',
		'Anchored native popover — top layer, light dismiss, no portal'
	],
	accessibility: [
		'The field is a <button> with aria-haspopup="listbox", aria-expanded and aria-controls pointing at the list.',
		'The list has role="listbox" (aria-multiselectable when multiple) and is labelled by the field; options carry role="option" and aria-selected.',
		'Groups are role="group", labelled by their heading.',
		'Disabled options are aria-disabled and skipped by the keyboard.',
		'Focus moves into the list when it opens and returns to the field when it closes.',
		'Pass aria-label, or an id that a <label for> points at — attributes go to the field button.'
	],
	keyboard: [
		{ keys: 'Enter / Space / Arrow Down', action: 'On the field: opens the list on the chosen (or first) option.' },
		{ keys: 'Arrow Up', action: 'On the field: opens the list on the chosen (or last) option.' },
		{ keys: 'Arrow Down / Arrow Up', action: 'Moves to the next or previous enabled option.' },
		{ keys: 'Home / End', action: 'Moves to the first or last option.' },
		{ keys: 'Enter / Space', action: 'Chooses the focused option (toggles it when multiple).' },
		{ keys: 'A–Z', action: 'Jumps to the next option whose label starts with what is typed.' },
		{ keys: 'Escape / Tab', action: 'Closes the list and returns focus to the field.' }
	],
	related: ['combobox']
});
