import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Tooltip',
	summary: 'A short hint on hover or focus, using popover="hint" and a shared warm group.',
	description: `A tooltip describes a control when the pointer hovers it or the control is focused. It uses \`popover="hint"\` where the engine supports it, and falls back to \`popover="manual"\` otherwise — it never traps pointer or focus. Esc dismisses it.

Neighbouring tooltips share a warm group: after one has opened, the next opens instantly, so a row of icon buttons does not feel laggy. \`delay\` and \`closeDelay\` are in milliseconds.

The trigger receives \`aria-describedby\` pointing at the hint while it is open.`,
	features: [
		'popover="hint" with a manual fallback',
		'Shared warm group so adjacent hints open instantly',
		'Configurable open and close delays',
		'Eight placements, spring enter from the trigger side',
		'Esc dismisses; the hint never traps the pointer'
	],
	accessibility: [
		'The hint has role="tooltip" and the trigger is wired with aria-describedby while it is open.',
		'The hint carries pointer-events: none, so it never intercepts the pointer.',
		'Focus stays on the trigger; the hint does not take focus.',
		'Esc closes the hint.'
	],
	keyboard: [
		{ keys: 'Focus', action: 'Opens the hint after the open delay (or instantly when the group is warm).' },
		{ keys: 'Esc', action: 'Dismisses the hint.' }
	],
	related: ['hover-card', 'popover']
});
