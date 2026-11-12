import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'FileDrop',
	summary: 'A drag-and-drop zone with click-to-browse, a file list, and clear reasons when a file is rejected.',
	description: `Drop files onto the zone or click it to open the system picker. Accepted files appear in a list with their size and a remove button. Files that do not match \`accept\`, that are larger than \`maxSize\`, or that would take the list past \`maxFiles\` are refused, and the reason is shown under the list.

\`multiple\` is on by default; turn it off to keep a single file, replacing whatever was there. The value is a bindable \`File[]\`, also reported through \`onFiles\`. Inside a \`Field\`, the zone takes the label, description and invalid state from context.`,
	features: [
		'Drag over, drop, and click to browse',
		'accept, multiple, maxSize and maxFiles',
		'File list with size and remove',
		'Rejection reasons under the list',
		'Custom zone content through children'
	],
	accessibility: [
		'The drop zone is a button, so it is a keyboard-operable control. Enter and Space open the system picker.',
		'Inside a Field, the button is named by the label (aria-labelledby) and described by the hint, the file list and any rejection reasons.',
		'The hidden file input is removed from the tab order and hidden from assistive technology; the button is the only tab stop.',
		'Each remove button has an accessible name (Remove invoice.pdf, and so on).'
	],
	keyboard: [
		{ keys: 'Enter / Space', action: 'Opens the system file picker.' },
		{ keys: 'Tab', action: 'Moves focus to the zone, then to each remove button in the list.' }
	],
	related: ['field']
});
