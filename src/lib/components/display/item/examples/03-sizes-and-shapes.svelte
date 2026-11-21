<!-- @example Sizes and shapes :: Every size and every corner shape. -->
<script lang="ts">
	import { Item, ItemContent, ItemTitle } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm measure-sm">
	{#each ['h-xs', 'h-sm', 'h-md', 'h-bs', 'h-lg', 'h-xl', 'h-2xl', 'h-3xl'] as const as size (size)}
		<Item {size} surface="outlined">
			<ItemContent>
				<ItemTitle>Size {size}</ItemTitle>
			</ItemContent>
		</Item>
	{/each}
	{#each ['rect', 'mincurved', 'modern', 'curved', 'round'] as const as shape (shape)}
		<Item {shape} surface="outlined">
			<ItemContent>
				<ItemTitle>Shape {shape}</ItemTitle>
			</ItemContent>
		</Item>
	{/each}
</div>
