import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Toggle',
	summary: 'A two-state button that stays pressed until pressed again.',
	description: `A toggle is a button that remembers. Use it for a setting that is either on or off and takes effect immediately — bold text, mute, pin to top — where a checkbox would feel too form-like.

State is \`aria-pressed\`, and the pressed look is driven from that attribute: subtle variants fill, and every variant gains an inset ring. \`pressed\` is bindable, with \`onPressedChange\` for callers who would rather listen.`,
	features: [
		'Bindable or controlled through pressed and onPressedChange',
		'Shares variants, sizes and shapes with Button',
		'Icon-only (square) when it has no label',
		'The pressed look follows aria-pressed, so styling and semantics cannot drift'
	],
	accessibility: [
		'Renders a native <button> with aria-pressed reflecting the state.',
		'An icon-only toggle needs an aria-label; icons are decorative.',
		'Keep the accessible name constant; the pressed state is announced separately.'
	],
	keyboard: [
		{ keys: 'Enter / Space', action: 'Toggles the button.' },
		{ keys: 'Tab', action: 'Moves focus to the next focusable element.' }
	],
	related: ['toggle-group', 'icon-button', 'button']
});
