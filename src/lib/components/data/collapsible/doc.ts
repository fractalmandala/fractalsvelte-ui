import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Collapsible',
	summary: 'A single disclosure whose panel opens and closes with a spring height.',
	description: `\`Collapsible\` is the one-panel cousin of \`Accordion\`. You pass a \`trigger\` snippet — it receives the open state, a disabled flag, a \`toggle\` function and a \`props\` object to spread onto a button — and the children become the panel. The panel uses fractalstyler's \`.collapse\`, timed with the shared spring tokens, so it opens and closes the same way as an accordion item or a data-table detail row.

Bind \`open\` to control it, or leave it uncontrolled. Disable the trigger when the content is not ready. Reach for \`Accordion\` when several disclosures need to coordinate.`,
	features: [
		'Trigger snippet with open, disabled, props and toggle',
		'Spring height via .collapse',
		'Controlled or uncontrolled through bind:open'
	],
	accessibility: [
		'The trigger snippet is expected to spread `props` onto a native button, which receives aria-expanded and aria-controls pointing at the panel.',
		'When disabled, the trigger is disabled and the panel cannot be toggled.',
		'The panel is hidden from interaction while closed (it collapses to zero height and clips its content).'
	],
	keyboard: [
		{ keys: 'Enter / Space', action: 'Toggles the panel when the trigger button is focused.' },
		{ keys: 'Tab', action: 'Moves focus to the trigger, then into the panel when it is open.' }
	],
	related: ['accordion', 'tree']
});
