import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Carousel',
	summary: 'A scroll-snap carousel with autoplay, drag, and a spring-loaded indicator.',
	description: `\`Carousel\` is a horizontal rail of \`CarouselSlide\`s, built on fractalstyler's \`.reel\` and \`.carousel-track\`. Slides snap into place, \`perView\` and \`gap\` travel as custom properties, and a pair of buttons plus a row of dots move the current index. The active dot is followed by a spring \`.indicator\`.

Drag the track to scroll with momentum; it snaps to the nearest slide on release. Autoplay advances on a timer and pauses while the carousel is hovered, focused, or the user prefers reduced motion. Keyboard arrows, Home and End move the rail, and a polite live region announces the current slide.`,
	parts: {
		CarouselSlide: 'One slide in the rail, with an optional accessible label.'
	},
	features: [
		'Scroll-snap rail with perView and gap as custom properties',
		'Looping next/previous, keyboard arrows, and a live region',
		'Autoplay that pauses on hover, focus and reduced motion',
		'Pointer drag with momentum and a spring-loaded dot indicator'
	],
	accessibility: [
		'The root is a named region with aria-roledescription="carousel". Each slide is a group with aria-roledescription="slide" and an accessible name (the label, or "Slide n of m").',
		'Previous and next buttons, and each dot, are labelled. The current dot is aria-current="true".',
		'A visually hidden live region politely announces the current slide when the index changes.',
		'Autoplay pauses when the carousel is hovered or focused, and whenever reduced motion is requested.'
	],
	keyboard: [
		{ keys: 'Arrow Left / Right', action: 'Moves to the previous or next slide.' },
		{ keys: 'Home / End', action: 'Jumps to the first or last slide.' },
		{ keys: 'Enter / Space', action: 'Activates the focused previous, next or dot button.' }
	],
	related: ['virtual-list']
});
