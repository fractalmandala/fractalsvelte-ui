import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'DescriptionList',
	summary: 'A list of term and definition pairs, laid out as a stack or as aligned rows.',
	description: `A description list is the right shape for metadata — an instance type next to its region, a plan next to its price. It renders a native \`<dl>\`, with each pair grouped so the list can split into columns and take hairline dividers between entries.

\`orientation\` stacks the term over the definition, or places them on one row with the terms aligned. \`columns\` spreads the pairs across up to four columns.`,
	features: [
		'Items data API or custom children',
		'Vertical or horizontal pairs, with terms aligned in a row',
		'One to four columns',
		'Optional hairline dividers',
		'Native <dl>, <dt> and <dd> semantics'
	],
	accessibility: [
		'Renders a native <dl>. Each pair is a <dt> followed by a <dd>, so the term and definition are announced together.',
		'When items are provided, each pair is wrapped in a <div>, which is valid in a description list and does not change the accessible structure.',
		'Do not nest another list inside a definition without a clear relationship.'
	],
	related: ['card', 'stat']
});
