<script lang="ts">
	import Carousel from '$lib/components/blocks/Carousel.svelte';

	const slides = [
		{ title: 'Slide One', color: '#22c55e' },
		{ title: 'Slide Two', color: '#3b82f6' },
		{ title: 'Slide Three', color: '#eab308' },
		{ title: 'Slide Four', color: '#ec4899' }
	];
</script>

<Carousel items={slides} perView={1}>
	{#snippet slide(item)}
		<div
			class="row xcenter ycenter text-inverse font-bold radius-md"
			style:background={item.color}
			style:height="160px"
		>
			{item.title}
		</div>
	{/snippet}
</Carousel>
