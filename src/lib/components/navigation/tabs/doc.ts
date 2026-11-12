import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Tabs',
	summary: 'A tabbed view with a spring-driven sliding indicator and the WAI-ARIA tabs pattern.',
	description: `Tabs switch between a handful of peer views without leaving the page — Overview, Activity, Settings. The selected tab is marked by a sliding indicator that springs to the measured box of the active item, so a change of label or size stays aligned, and a ResizeObserver keeps it there.

The parts share context: wrap a \`TabList\` of \`Tab\`s and matching \`TabPanel\`s in \`Tabs\`. Arrow keys move a roving tabindex; automatic activation selects on focus, manual waits for Enter or Space.`,
	parts: {
		TabList: 'The tab list: hosts the sliding indicator and the roving keyboard focus.',
		Tab: 'One tab button, paired with a TabPanel of the same value.',
		TabPanel: 'The panel shown when its tab is selected.'
	},
	features: [
		'Three variants: underline, pill and enclosed, each with a sliding indicator',
		'Horizontal or vertical orientation, five sizes',
		'Automatic or manual keyboard activation',
		'Optional spring-fade panel transitions',
		'Re-measures the indicator on resize'
	],
	accessibility: [
		'Follows the WAI-ARIA tabs pattern: a tablist of tabs, each controlling a tabpanel.',
		'Roving tabindex keeps the list one tab stop; disabled tabs are skipped.',
		'Each tab sets aria-selected and aria-controls; each panel is labelled by its tab.',
		'Pass label on TabList, or an aria-label, to name the list when there is no visible heading.'
	],
	keyboard: [
		{ keys: 'Arrow Right / Arrow Left', action: 'Moves to the next or previous enabled tab. In automatic mode, also selects it. Vertical lists use Arrow Down / Arrow Up.' },
		{ keys: 'Home / End', action: 'Moves to the first or last enabled tab, and selects it in automatic mode.' },
		{ keys: 'Enter / Space', action: 'Selects the focused tab. Needed in manual activation; a native button already does this on click.' },
		{ keys: 'Tab', action: 'Leaves the list and moves to the selected panel, then the next focusable content.' }
	],
	related: ['segmented-control', 'navbar', 'sidebar-nav']
});
