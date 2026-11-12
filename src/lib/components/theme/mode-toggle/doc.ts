import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'ModeToggle',
	summary: 'Switches between light, dark and system mode with a circular reveal from the click point.',
	description: `A view over the shared \`theme\`. Pressing it calls \`theme.toggleMode(event)\` (or \`theme.setMode(mode, event)\`), so the new mode wipes in as a circular view transition that grows from where you clicked. Keyboard activation reveals from the centre of the control. The sun and moon swap on a spring and settle instantly under reduced motion.

Pick the shape that fits the surface: an \`icon\` button for toolbars, a \`switch\` for settings rows, or a \`segmented\` group when \`system\` should be visible. Add \`withSystem\` to offer the OS preference.

Leave \`value\` out to drive the shared theme. Pass a \`value\` and the component only reports changes through \`value\` and \`onValueChange\`, still with the reveal, which suits a provider-scoped or stored preference.`,
	features: [
		'Three shapes: icon button, switch, segmented radio group',
		'Optional system mode',
		'Circular view-transition reveal from the pointer',
		'Spring sun / moon swap'
	],
	accessibility: [
		'The icon button is a native button with aria-pressed reflecting dark mode and a fixed aria-label; with `withSystem` it is a three-step cycle whose label names the current and next mode instead.',
		'The switch has role="switch" with aria-checked set while dark mode is on.',
		'The segmented variant is a radiogroup of radios with a roving tab stop; arrow keys move and select.',
		'Icons are decorative and hidden from assistive technology.'
	],
	keyboard: [
		{ keys: 'Enter / Space', action: 'Toggles the icon button and switch; selects the focused segment.' },
		{ keys: 'Arrow Left / Right', action: 'In the segmented group, moves to and selects the neighbouring mode.' },
		{ keys: 'Home / End', action: 'In the segmented group, selects the first or last mode.' },
		{ keys: 'Tab', action: 'Moves focus into and out of the control (one tab stop).' }
	],
	related: ['theme-provider', 'theme-picker', 'theme-customizer']
});
