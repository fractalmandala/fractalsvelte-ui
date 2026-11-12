import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Typewriter',
	summary: 'Types and deletes its way through a list of words, with a blinking caret.',
	description: `\`Typewriter\` types each string in \`words\`, holds it for \`pause\` milliseconds, then deletes it and moves on. \`speed\` and \`deleteSpeed\` are the milliseconds spent on each character. With \`loop\`, it returns to the first word after the last is deleted; without it, the last word stays.

The first word is in the HTML on the server, so the line is never empty before hydration. The animated glyphs are \`aria-hidden\` and \`aria-live="off"\`; a static \`aria-label\` on the wrapper lists every word, so a screen reader is not read a stream of keystrokes.`,
	features: [
		'Types and deletes a list of words',
		'Configurable type speed, delete speed and pause',
		'Optional looping',
		'Optional blinking caret',
		'First word is present in the server HTML'
	],
	accessibility: [
		'The wrapper carries a static aria-label listing every word. The typed text is aria-hidden and aria-live="off", so assistive technology does not hear characters appearing and disappearing.',
		'prefers-reduced-motion (and theme motion="off") shows the first word immediately and does not type or delete. The caret uses .anim-blink, which the motion layer cancels under reduced motion.',
		'The root is a span. Place it inside a heading or a sentence so the static label reads naturally.'
	],
	related: ['text-reveal', 'number-ticker', 'marquee']
});
