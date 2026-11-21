<!-- @example Stepping without thumbnails :: The viewer opens on a chosen plate, reports every move, and stops at the last one instead of looping. -->
<script lang="ts">
	import { Button, Lightbox, type LightboxItem } from '@fractaldesign/fractalsvelte-ui';

	const makeSvg = (fill: string, accent: string) =>
		'data:image/svg+xml;utf8,' +
		encodeURIComponent(
			`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><rect width="640" height="360" fill="${fill}"/><circle cx="320" cy="180" r="90" fill="${accent}"/></svg>`
		);

	const items: LightboxItem[] = [
		{ src: makeSvg('#1e293b', '#f472b6'), alt: 'Plate one', caption: 'Tidal shelf, low water' },
		{ src: makeSvg('#172033', '#818cf8'), alt: 'Plate two', caption: 'Tidal shelf, slack water' },
		{ src: makeSvg('#0f172a', '#60a5fa'), alt: 'Plate three', caption: 'Tidal shelf, high water' }
	];

	let open = $state(false);
	let index = $state(1);
	let status = $state('viewer closed');
</script>

<div class="row gap-sm ycenter">
	<Button variant="outline" onclick={() => (open = true)}>Open plate 2 of {items.length}</Button>
	<span class="text-sm text-muted">{status}</span>
</div>

<Lightbox
	bind:open
	bind:index
	{items}
	loop={false}
	showThumbnails={false}
	showCounter={false}
	onOpenChange={(next) => (status = next ? 'viewer open' : 'viewer closed')}
	onIndexChange={(next) => (status = `showing plate ${next + 1} of ${items.length}`)}
/>
