import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Item',
	summary: 'A list or row item with leading media, a title, a description and trailing actions.',
	description: `An item is one row in a list of things — a member, a repository, a file. Media leads, the title and description take the middle, and actions sit at the end.

Give it \`href\` or \`interactive\` and the whole row becomes a target, with the same hover and keyboard focus as an interactive Card. Do not nest links or buttons inside a row that is itself a link or a button; put those in a static item's \`ItemActions\` instead.`,
	parts: {
		ItemMedia: 'Leading media — an icon, an avatar, or any custom content.',
		ItemContent: 'The growing middle column for the title and description.',
		ItemTitle: 'The primary label of the row.',
		ItemDescription: 'Supporting text under the title.',
		ItemActions: 'Trailing actions or metadata.',
		ItemGroup: 'A vertical stack of items.',
		ItemSeparator: 'A hairline between rows in a group.'
	},
	features: [
		'Three variants: default, outline and muted',
		'Five sizes and five shapes',
		'Renders a link with href, or a focusable row when interactive',
		'Compound parts for media, content and actions'
	],
	accessibility: [
		'An item with href renders a native <a>, so it is announced and activated as a link.',
		'An interactive item without href is a focusable row with role="button" and activates on Enter and Space.',
		'Do not nest links or buttons inside an item that is itself a link or a button.',
		'The focus ring is drawn only for keyboard focus (:focus-visible), via the shared .interactive class.'
	],
	keyboard: [
		{ keys: 'Enter', action: 'Follows the link, or activates an interactive row.' },
		{ keys: 'Space', action: 'Activates an interactive row that is not a link.' },
		{ keys: 'Tab', action: 'Moves focus to or past the row.' }
	],
	related: ['card', 'avatar']
});
