import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Stepper',
	summary: 'A sequence of steps, with a connector that fills as each one is completed.',
	description: `A stepper is for a process that happens in a known order — a checkout, a publishing pipeline, an onboarding. Pass a \`steps\` array; the current step is the bindable \`value\`. Markers derive their state from the current index (complete, current, upcoming), or take an explicit \`status\`, including \`error\`.

The connector between markers is a \`.track\` whose \`.fill\` is driven by \`vars()\` and springs to its new width. In a linear stepper only the current step and earlier ones are clickable; turn \`linear\` off to allow skipping ahead, or \`clickable\` off for a purely descriptive trail.`,
	features: [
		'Horizontal or vertical orientation',
		'Linear or free navigation, and a non-clickable mode',
		'Complete, current, upcoming and error states',
		'Spring-filled connectors between steps',
		'Optional icons, descriptions and per-step disabled'
	],
	accessibility: [
		'Rendered as a navigation landmark; pass label, or an aria-label, to name it.',
		'The current step is marked with aria-current="step".',
		'Unreachable markers are disabled and expose aria-disabled when the stepper is clickable.'
	],
	keyboard: [
		{ keys: 'Tab', action: 'Moves through the clickable step markers.' },
		{ keys: 'Enter / Space', action: 'Selects the focused step, when it is allowed.' }
	],
	related: ['tabs', 'pagination', 'progress']
});
