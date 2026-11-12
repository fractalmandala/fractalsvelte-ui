import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Checkbox',
	summary: 'A native checkbox with a label, a description and a check that springs in.',
	description: `The checkbox wraps a real \`<input type="checkbox">\` in fractalstyler's \`.checkbox-box\`, so it submits with forms, takes validation, and is labelled by its own text. Only the paint is custom: the check mark scales in on a bouncy spring.

Use \`checked\` for a plain on/off choice and \`indeterminate\` for a parent that summarises a partly selected group. Both are bindable and both have a change callback.`,
	features: [
		'Real input: name, value, required and form reset all work',
		'Indeterminate state with a dash mark',
		'Label and description, or any content through children',
		'Invalid state wired to aria-invalid',
		'Check mark springs in; reduced motion fades it'
	],
	accessibility: [
		'The control is a native checkbox inside a <label>, so clicking the text toggles it and screen readers announce the label and state.',
		'The description is linked with aria-describedby.',
		'indeterminate is exposed through the native mixed state; the next toggle clears it.',
		'invalid sets aria-invalid="true" and a danger border.',
		'The focus ring is drawn only for keyboard focus.'
	],
	keyboard: [
		{ keys: 'Space', action: 'Toggles the checkbox.' },
		{ keys: 'Tab', action: 'Moves focus to the next control.' }
	],
	related: ['switch', 'radio-group', 'chip-group']
});
