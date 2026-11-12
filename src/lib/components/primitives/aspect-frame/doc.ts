import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'AspectFrame',
	summary: 'A box of fixed proportion that holds media and clips it to its shape.',
	description: `An aspect frame reserves a box of a fixed proportion before its media arrives, so a grid of images or videos keeps its rhythm while it loads and never shifts the layout around it.

The frame does not own the media. It hands the media a class through the children snippet, and that class fills the frame and applies the fit: cover crops to fill, contain letterboxes, fill stretches, scale-down never enlarges past the natural size. Put the image or video in the snippet and bind the class to it.`,
	features: [
		'Seven proportions, from 16:9 to 1:1 and portrait',
		'Four fits, applied to the media through the children snippet',
		'Five shapes, clipping the media to the corner radius',
		'No layout shift while the media loads'
	],
	accessibility: [
		'The frame is a plain div and carries no role; the media inside it carries the meaning.',
		'Give every img an alt text that describes what it shows, or an empty alt when the image is decorative.',
		'Video inside a frame needs its own captions and controls; the frame does not add them.'
	]
});
