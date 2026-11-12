import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Textarea',
	summary: 'A multi-line text field that can grow with its content, with a live character counter.',
	description: `\`Textarea\` shares its frame with \`Input\`: same variants, sizes and shapes, same focus ring, same \`Field\` wiring.

With \`autosize\` it uses the platform's \`field-sizing: content\`, so the field grows line by line between \`rows\` and \`maxRows\` with no layout script (a small fallback measures the content in browsers without it). Without it, \`rows\` is a fixed height and \`resize\` controls the drag handle.

Add \`counter\` for a live count, and \`maxlength\` to enforce a limit.`,
	features: [
		'Autosizing with CSS field-sizing, bounded by rows and maxRows',
		'Live character counter that turns red at the limit',
		'Configurable drag-resize',
		'Same variants, sizes and shapes as Input'
	],
	accessibility: [
		'Renders a native <textarea>; label, hint and error come from Field.',
		'The counter is linked with aria-describedby and is not a live region, so typing is not interrupted.',
		'maxlength is enforced natively, so assistive technology reports the limit.'
	],
	keyboard: [{ keys: 'Tab', action: 'Moves focus out of the field (Enter inserts a new line).' }],
	related: ['field', 'input']
});
