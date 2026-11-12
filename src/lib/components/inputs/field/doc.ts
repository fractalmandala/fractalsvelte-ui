import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Field',
	summary: 'The form-field wrapper: a label, a control, helper text and an error, wired together for assistive technology.',
	description: `\`Field\` owns the plumbing every form control needs. It generates ids, renders a real \`<label for>\`, puts the hint or error under the control, and shares the result with whatever sits inside through context.

Every control in this kit reads that context on its own: the \`id\` matches the label, \`aria-describedby\` points at the hint or error, \`aria-invalid\` follows the error, and \`required\` and \`disabled\` carry through. \`size\`, \`shape\` and \`variant\` are inherited the same way, so a field can set the look of the control inside it; the control's own props still win. To build your own control, call \`useFieldControl()\` — or read \`getFieldContext()\` directly — during initialisation.

Use \`orientation="horizontal"\` for settings pages where labels line up in a column to the left.`,
	features: [
		'Label, hint and error with generated, stable ids',
		'Controls pick ids, invalid state and look (size, shape, variant) up through context',
		'Error replaces the hint and is announced politely',
		'Vertical and horizontal layouts',
		'getFieldContext() and useFieldControl() for custom controls'
	],
	accessibility: [
		'The label is a native <label> whose for attribute matches the control id, so clicking it focuses the control.',
		'Hint and error text are linked to the control with aria-describedby, and the error is inside an aria-live="polite" region.',
		'The control receives aria-invalid when there is an error and required when marked required.',
		'Grouped controls (pin input, file drop) are named through aria-labelledby using the label id.'
	],
	api: [
		{
			name: 'getFieldContext()',
			type: '() => FieldContext | undefined',
			description: 'The nearest Field\'s shared state (controlId, labelId, describedBy, invalid, required, disabled, size, shape, variant), or undefined outside a Field. Call it during component initialisation.'
		},
		{
			name: 'useFieldControl(fallbackId, own)',
			type: '(fallbackId: string, own: () => FieldControlOwn) => FieldControl',
			description: 'Merges a control\'s own id, invalid, required, disabled, describedby, size, shape and variant with the surrounding Field. The control\'s value wins; otherwise the field\'s applies.'
		}
	],
	related: ['input', 'textarea', 'number-input', 'pin-input']
});
