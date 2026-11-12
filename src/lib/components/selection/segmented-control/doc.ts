import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'SegmentedControl',
	summary: 'A compact single choice among a short list of segments, with a spring-driven sliding indicator.',
	description: `A segmented control is for a handful of mutually exclusive views or modes — Day, Week, Month — where a select would be too hidden and a radio group too tall. The chosen segment is marked by a sliding surface that springs to the measured box of the active item, so a change of size or label stays aligned.

It is a radiogroup with roving focus. Pass \`block\` to stretch it across its container, with equal segments.`,
	features: [
		'Spring-driven sliding indicator, measured from the active segment',
		'Optional icons, five sizes, and a block (full-width) layout',
		'Disabled options and a disabled group',
		'Hidden input for native form submission'
	],
	accessibility: [
		'The control is a radiogroup; each segment is a radio with aria-checked.',
		'Roving tabindex keeps the group one tab stop; arrow keys move and select.',
		'Disabled options are skipped by the keyboard and expose aria-disabled.',
		'Pass label, or an aria-label, to name the group.'
	],
	keyboard: [
		{ keys: 'Arrow Right / Arrow Left', action: 'Moves to the next or previous enabled segment and selects it.' },
		{ keys: 'Home / End', action: 'Moves to the first or last enabled segment and selects it.' },
		{ keys: 'Enter / Space', action: 'Selects the focused segment.' }
	],
	related: ['radio-group', 'chip-group', 'tabs']
});
