<!-- @example Gaps :: Every step of the space ladder, from xs to 3xl. -->
<script lang="ts">
	import { Masonry } from '@fractaldesign/fractalsvelte-ui';

	const gaps = ['gap-xs', 'gap-sm', 'gap-md', 'gap-bs', 'gap-lg', 'gap-xl', 'gap-2xl', 'gap-3xl'] as const;
	const tiles = [1, 2, 3, 4, 5, 6];
</script>

<div class="column gap-lg measure-lg">
	{#each gaps as gap (gap)}
		<div class="box gap-xs">
			<span class="text-xs text-muted">{gap}</span>
			<Masonry {gap} columns={3} items={tiles}>
				{#snippet children(t, i)}
					<div class="box pad-md bg-panel border-subtle curved text-sm">Tile {t}</div>
				{/snippet}
			</Masonry>
		</div>
	{/each}
</div>
