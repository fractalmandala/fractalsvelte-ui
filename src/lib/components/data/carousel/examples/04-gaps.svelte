<!-- @example Gaps :: Every step of the space ladder, from xs to 3xl. -->
<script lang="ts">
	import { Carousel, CarouselSlide } from '@fractaldesign/fractalsvelte-ui';

	const gaps = ['gap-xs', 'gap-sm', 'gap-md', 'gap-bs', 'gap-lg', 'gap-xl', 'gap-2xl', 'gap-3xl'] as const;
</script>

<div class="column gap-lg">
	{#each gaps as gap (gap)}
		<div class="box gap-xs">
			<span class="text-xs text-muted">{gap}</span>
			<Carousel {gap} perView={3}>
				{#each [1, 2, 3, 4] as n (n)}
					<CarouselSlide><div class="box pad-md bg-panel border-subtle curved text-sm">Slide {n}</div></CarouselSlide>
				{/each}
			</Carousel>
		</div>
	{/each}
</div>
