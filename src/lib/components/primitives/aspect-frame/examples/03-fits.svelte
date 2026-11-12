<!-- @example Fits :: How the media meets the frame: cover crops to fill, contain letterboxes, fill stretches, scale-down never enlarges. -->
<script lang="ts">
	import { AspectFrame } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="grid-2 gap-sm">
	<div class="box gap-xs">
		<AspectFrame ratio="4-3" fit="cover" shape="curved">
			{#snippet children(media)}
				<img class={media} src="https://picsum.photos/seed/fractalsvelte-fit/800/500" alt="A forest trail after rain" />
			{/snippet}
		</AspectFrame>
		<p class="text-sm text-muted">cover</p>
	</div>
	<div class="box gap-xs">
		<AspectFrame ratio="4-3" fit="contain" shape="curved">
			{#snippet children(media)}
				<img class={media} src="https://picsum.photos/seed/fractalsvelte-fit/800/500" alt="A forest trail after rain" />
			{/snippet}
		</AspectFrame>
		<p class="text-sm text-muted">contain</p>
	</div>
	<div class="box gap-xs">
		<AspectFrame ratio="4-3" fit="fill" shape="curved">
			{#snippet children(media)}
				<img class={media} src="https://picsum.photos/seed/fractalsvelte-fit/800/500" alt="A forest trail after rain" />
			{/snippet}
		</AspectFrame>
		<p class="text-sm text-muted">fill</p>
	</div>
	<div class="box gap-xs">
		<AspectFrame ratio="4-3" fit="scale-down" shape="curved">
			{#snippet children(media)}
				<img class={media} src="https://picsum.photos/seed/fractalsvelte-fit/800/500" alt="A forest trail after rain" />
			{/snippet}
		</AspectFrame>
		<p class="text-sm text-muted">scale-down</p>
	</div>
</div>
