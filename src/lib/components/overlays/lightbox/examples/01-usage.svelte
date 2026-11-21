<!-- @example Usage :: Click thumbnails to launch a zoomable full-screen Lightbox, with its own inset, corners, surface, type scale and thumbnail size. -->
<script lang="ts">
	import { Lightbox, type LightboxItem } from '@fractaldesign/fractalsvelte-ui';

	const makeSvg = (fill: string, accent: string) =>
		'data:image/svg+xml;utf8,' +
		encodeURIComponent(
			`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><rect width="640" height="360" fill="${fill}"/><circle cx="320" cy="180" r="90" fill="${accent}"/></svg>`
		);

	const items: LightboxItem[] = [
		{ src: makeSvg('#1e293b', '#38bdf8'), alt: 'Horizon study', caption: 'Dawn elevation study' },
		{ src: makeSvg('#1f2937', '#34d399'), alt: 'Canopy study', caption: 'Emerald clearing' }
	];

	let open = $state(false);
	let index = $state(0);
</script>

<div class="row gap-sm">
	{#each items as item, i (i)}
		<button
			type="button"
			class="bare h-3xl modern overflow-hidden border pointer focus-ring"
			aria-label={`Inspect ${item.alt}`}
			onclick={() => {
				index = i;
				open = true;
			}}
		>
			<img src={item.src} alt={item.alt ?? ''} class="hfull fit-cover" />
		</button>
	{/each}
</div>

<Lightbox
	{items}
	bind:open
	bind:index
	shape="curved"
	surface="overlayed"
	pad="pad-md"
	alignContent="xcenter"
	textSize="text-sm"
	size="h-xl"
	zoomButtonProps={{ variant: 'themed' }}
	closeButtonProps={{ variant: 'danger' }}
	prevButtonProps={{ size: 'h-md' }}
	nextButtonProps={{ size: 'h-md' }}
/>
