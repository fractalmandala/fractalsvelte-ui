import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Avatar',
	summary: 'A portrait that falls back from an image to initials, then to an icon, with an optional status dot.',
	description: `An avatar is a compact, named likeness. Give it a photograph and it crops the image to the tile; if the image is missing or fails to load, it draws initials from the person's name on a colour derived from that name — a hue written to a custom property, never a hard-coded colour. With no name either, it shows a user icon.

A status dot marks presence: online, away, busy or offline. Sizes follow the shared ladder; the shape is a circle, a rounded square or a square.`,
	features: [
		'Graceful fallback from image to initials to icon',
		'Deterministic hue from the name, through --avatar-hue',
		'Five sizes and three shapes',
		'Optional presence dot with an accessible status name',
		'Inherits size and shape from an enclosing AvatarGroup'
	],
	accessibility: [
		'The avatar is a single role="img" with an accessible name built from alt or name, plus the status when set.',
		'The photograph, initials and icon are decorative; assistive technology hears only the accessible name.',
		'The status dot is colour and position, and is also included in the accessible name so it is not conveyed by colour alone.'
	],
	related: ['avatar-group', 'card']
});
