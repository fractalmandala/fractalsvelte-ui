import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Navbar',
	summary: 'A top app bar with a brand, links and actions, glass on scroll, and a small-screen menu.',
	description: `The navbar is the site's persistent header: a brand, a row of links, and a trailing cluster of actions. It is sticky by default, and can take on a glass surface once the page has been scrolled. Below the medium breakpoint the links and actions collapse into a native popover menu, opened by a button, using fractalstyler's \`md-hide\` / \`md-only\` classes.

\`NavbarLink\` marks the current page with \`aria-current\`. The library is router-agnostic: pass \`href\` and \`current\` yourself.`,
	parts: {
		NavbarLink: 'A header link, with an optional current-page state.'
	},
	features: [
		'Brand, links and actions as snippets',
		'Sticky positioning, and glass that appears on scroll',
		'Responsive collapse into a native popover menu',
		'NavbarLink with a current-page state'
	],
	accessibility: [
		'The bar is a native header containing a navigation landmark, labelled by the label prop (default “Site”).',
		'The small-screen trigger is a button with an accessible name, and the menu is a native popover that the platform dismisses.',
		'NavbarLink sets aria-current="page" when current is true.'
	],
	keyboard: [
		{ keys: 'Tab', action: 'Moves through the brand, the visible links and actions, and the menu button on small screens.' },
		{ keys: 'Enter / Space', action: 'Opens the small-screen menu from its button, or follows a focused link.' },
		{ keys: 'Escape', action: 'Dismisses the small-screen menu, when it is open.' }
	],
	related: ['sidebar-nav', 'breadcrumbs', 'dock', 'link']
});
