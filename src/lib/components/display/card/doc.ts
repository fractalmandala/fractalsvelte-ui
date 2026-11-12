import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Card',
	summary: 'The content surface: a padded container with five treatments and an optional spring lift.',
	description: `A card groups related content on a surface. It is built from parts (header, title, description, content, footer and edge-to-edge media) that take their padding, gap and type scale from the card's \`size\`, so a card always has the same rhythm.

Five variants cover the range from a raised, lit \`elevated\` panel to a \`ghost\` card that only appears under the pointer. Give it \`href\` or \`interactive\` and the whole card becomes a target that lifts on a spring; \`tilt\` swaps the lift for a 3D lean toward the pointer.`,
	parts: {
		CardHeader: 'Groups the title and description, with an optional trailing action.',
		CardTitle: 'The card heading, at a configurable level.',
		CardDescription: 'Secondary text under the title.',
		CardContent: 'The body of the card.',
		CardFooter: 'A row for actions or metadata at the bottom.',
		CardMedia: 'An image or illustration that runs to the card edges.'
	},
	features: [
		'Five variants: elevated, outline, filled, ghost and glass',
		'Padding, gap and type scale follow one size ladder',
		'Renders a link with href, or a focusable article when interactive',
		'Spring hover lift or 3D tilt, disabled under reduced motion',
		'Media that bleeds to the edges and is clipped by the corner shape'
	],
	accessibility: [
		'A card with href renders a native <a>, so it is announced and activated as a link.',
		'An interactive card without href is a focusable <article role="button"> and activates on Enter and Space.',
		'Do not nest links or buttons inside a card that is itself a link or button.',
		'CardTitle renders a real heading; choose level to keep the page outline correct.',
		'The focus ring is drawn only for keyboard focus (:focus-visible).'
	],
	keyboard: [
		{ keys: 'Enter', action: 'Follows the link, or activates an interactive card.' },
		{ keys: 'Space', action: 'Activates an interactive card that is not a link.' },
		{ keys: 'Tab', action: 'Moves focus to or past the card.' }
	],
	related: ['stat', 'avatar']
});
