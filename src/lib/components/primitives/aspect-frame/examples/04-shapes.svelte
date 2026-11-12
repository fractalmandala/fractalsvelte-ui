<!-- @example Shapes :: The frame clips its media to the corner shape, from square to a fully round crop. -->
<script lang="ts">
	import { AspectFrame } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap gap-sm ycenter">
	<div class="measure-xs"><AspectFrame ratio="1-1" shape="rect">{#snippet children(media)}<img class={media} src="https://picsum.photos/seed/fractalsvelte-shape/600/600" alt="A ceramic bowl on linen" />{/snippet}</AspectFrame></div>
	<div class="measure-xs"><AspectFrame ratio="1-1" shape="mincurved">{#snippet children(media)}<img class={media} src="https://picsum.photos/seed/fractalsvelte-shape/600/600" alt="A ceramic bowl on linen" />{/snippet}</AspectFrame></div>
	<div class="measure-xs"><AspectFrame ratio="1-1" shape="modern">{#snippet children(media)}<img class={media} src="https://picsum.photos/seed/fractalsvelte-shape/600/600" alt="A ceramic bowl on linen" />{/snippet}</AspectFrame></div>
	<div class="measure-xs"><AspectFrame ratio="1-1" shape="curved">{#snippet children(media)}<img class={media} src="https://picsum.photos/seed/fractalsvelte-shape/600/600" alt="A ceramic bowl on linen" />{/snippet}</AspectFrame></div>
	<div class="measure-xs"><AspectFrame ratio="1-1" shape="round">{#snippet children(media)}<img class={media} src="https://picsum.photos/seed/fractalsvelte-shape/600/600" alt="A ceramic bowl on linen" />{/snippet}</AspectFrame></div>
</div>
