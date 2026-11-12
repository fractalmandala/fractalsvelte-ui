import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Code',
	summary: 'A highlighted code block with a copy button, or a short inline snippet.',
	description: `The block variant highlights source with the library's own highlighter — Svelte, TypeScript, CSS, Bash, JSON and HTML — and keeps every character of the input, in order. A toolbar names the file (or the language) and copies the source. Line numbers, marked lines, soft wrap and a maximum height on the measure ladder are all optional.

The inline variant is a short snippet in running text, in the same monospace and a quiet panel fill.`,
	features: [
		'Syntax highlighting via highlight(code, lang)',
		'Copy button with a brief confirmation',
		'Optional file name, line numbers and marked lines',
		'Soft wrap, or a scrolling maximum height',
		'Inline variant for short snippets'
	],
	accessibility: [
		'The block is a <figure> with a <figcaption> for the file name or language.',
		'The copy control is a native button labelled "Copy code", which becomes "Copied" after a successful copy.',
		'The <pre> is focusable so a keyboard user can scroll a tall or wrapped block.',
		'Marked lines are a visual aid; they are not announced separately from the source itself.',
		'The inline variant is a native <code> element.'
	],
	keyboard: [
		{ keys: 'Tab', action: 'Moves focus to the copy button, then into the code if it scrolls.' },
		{ keys: 'Enter / Space', action: 'Copies the source when the copy button is focused.' }
	],
	related: ['card']
});
