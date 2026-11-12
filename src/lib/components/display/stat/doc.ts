import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Stat',
	summary: 'A KPI block: a label, a tabular figure, an optional delta, and a quiet hint.',
	description: `A stat is the unit a dashboard is made of — a named figure with a trend beside it. Numbers use tabular numerals and \`Intl.NumberFormat\`, so currency, compact notation and percentages line up cleanly in a row of cards.

The delta carries a direction and a tone (inferred from the sign, or set explicitly). Pass \`countUp\` and the figure springs from zero the first time it scrolls into view.`,
	features: [
		'Tabular numerals and Intl.NumberFormat',
		'Signed delta with a trend icon and a tone',
		'Optional count-up on first view, via SpringValue and inView',
		'Optional leading icon and a hint under the value'
	],
	accessibility: [
		'The block is plain text: the label, value, delta and hint are read in order.',
		'The trend is conveyed by a text figure with a sign, not by colour or the icon alone.',
		'The icon is decorative and hidden from assistive technology.'
	],
	related: ['card']
});
