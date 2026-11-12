import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'NumberInput',
	summary: 'A numeric field with stepper buttons, keyboard and wheel adjustment, and optional formatted display.',
	description: `\`NumberInput\` is a spinbutton in the same frame as \`Input\`. The value is a number or \`null\` when the field is empty — never a string. While the field is focused the raw number is editable; once it blurs, \`format\` presents it with \`Intl.NumberFormat\`.

The stepper buttons, Arrow Up and Down, the wheel (when the field is focused) and Page Up and Down all move the value by \`step\` (or ten times \`step\`) and honour \`min\`, \`max\` and \`precision\`. Press and hold a stepper to repeat. Inside a \`Field\` it takes its id, description and invalid state from context.`,
	features: [
		'Bindable number or null, with onValueChange',
		'Stepper buttons with press-and-hold repeat',
		'Arrow, Page, Home, End and focused-wheel adjustment',
		'min, max, step and precision',
		'Formatted display through Intl.NumberFormat',
		'Same variants, sizes and shapes as Input'
	],
	accessibility: [
		'The input has role="spinbutton" with aria-valuenow, aria-valuemin, aria-valuemax and aria-valuetext (the formatted value).',
		'Label, hint and error come from Field via for, aria-describedby and aria-invalid.',
		'The stepper buttons have accessible names and stay out of the tab order, because the arrow keys do the same job.',
		'inputmode is decimal or numeric so mobile keyboards offer the right keys.'
	],
	keyboard: [
		{ keys: 'Arrow Up / Arrow Down', action: 'Increases or decreases the value by step.' },
		{ keys: 'Page Up / Page Down', action: 'Increases or decreases the value by ten times step.' },
		{ keys: 'Home / End', action: 'Jumps to min or max when those bounds are set.' },
		{ keys: 'Tab', action: 'Moves focus into and out of the field.' }
	],
	related: ['field', 'input']
});
