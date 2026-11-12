import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Kbd',
	summary: 'Draws keyboard keys as key caps, with mod resolved to ⌘ or Ctrl by platform.',
	description: `A kbd marks a key or a shortcut in running text or in a menu. Pass \`keys\` to draw a chord such as Mod plus K, or pass children to draw a single key label.

The key \`mod\` stands for the platform's command modifier: it is drawn as ⌘ on Apple platforms and as Ctrl everywhere else. The platform is read after mount, so the server render draws Ctrl and the page corrects it on the client without any flash of unsupported symbols in the markup.`,
	features: [
		'Chords drawn from a list of keys, joined by a separator',
		'The mod key resolves to ⌘ or Ctrl by platform',
		'Three sizes on the control height ladder',
		'Renders native kbd elements, which assistive technology reads as keyboard input'
	],
	accessibility: [
		'Each key is a native kbd element, so the key names are read as keyboard input.',
		'The separator between keys is decorative and hidden from assistive technology.',
		'Use the shortcut in running text as well as in a visible key cap, so the meaning never depends on styling alone.'
	]
});
