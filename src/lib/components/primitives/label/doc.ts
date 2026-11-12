import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Label',
	summary: 'A form label that names its control, with required and optional markers.',
	description: `A label names the control it belongs to, and that name is what a screen reader announces when focus arrives. Pass \`for\` with the control's id so the association is made in the markup, not just by position.

Use \`required\` to mark a field that must be filled. The asterisk is drawn for sighted users only, so the control itself still needs the native required attribute. Use \`optional\` on the fields that may be left empty, which is clearer than marking every other field as required.`,
	features: [
		'Native label element bound to its control with for',
		'Required asterisk in the danger ink, hidden from assistive technology',
		'Muted Optional marker',
		'Three sizes and a disabled state that matches its control'
	],
	accessibility: [
		'Renders a native label, so clicking it focuses the control named by for.',
		'The required asterisk is decorative and hidden from assistive technology; set required on the control to convey the requirement.',
		'The disabled state is visual only; disable the control itself.'
	]
});
