<!-- @example Ratios :: Seven proportions on the same photograph, from landscape widescreen through the square to portrait. -->
<script lang="ts">
	import { AspectFrame } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap gap-sm ycenter">
	<div class="measure-xs"><AspectFrame ratio="16-9">{#snippet children(media)}<img class={media} src="https://picsum.photos/seed/fractalsvelte-ratio/800/450" alt="A harbour at dusk" />{/snippet}</AspectFrame></div>
	<div class="measure-xs"><AspectFrame ratio="4-3">{#snippet children(media)}<img class={media} src="https://picsum.photos/seed/fractalsvelte-ratio/800/600" alt="A harbour at dusk" />{/snippet}</AspectFrame></div>
	<div class="measure-xs"><AspectFrame ratio="3-2">{#snippet children(media)}<img class={media} src="https://picsum.photos/seed/fractalsvelte-ratio/900/600" alt="A harbour at dusk" />{/snippet}</AspectFrame></div>
	<div class="measure-xs"><AspectFrame ratio="1-1">{#snippet children(media)}<img class={media} src="https://picsum.photos/seed/fractalsvelte-ratio/600/600" alt="A harbour at dusk" />{/snippet}</AspectFrame></div>
	<div class="measure-xs"><AspectFrame ratio="2-3">{#snippet children(media)}<img class={media} src="https://picsum.photos/seed/fractalsvelte-ratio/600/900" alt="A harbour at dusk" />{/snippet}</AspectFrame></div>
	<div class="measure-xs"><AspectFrame ratio="3-4">{#snippet children(media)}<img class={media} src="https://picsum.photos/seed/fractalsvelte-ratio/600/800" alt="A harbour at dusk" />{/snippet}</AspectFrame></div>
	<div class="measure-xs"><AspectFrame ratio="9-16">{#snippet children(media)}<img class={media} src="https://picsum.photos/seed/fractalsvelte-ratio/450/800" alt="A harbour at dusk" />{/snippet}</AspectFrame></div>
</div>
