<!-- @example Sizes and shapes :: Every size and every corner shape. -->
<script lang="ts">
	import { Item, ItemContent, ItemTitle } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm measure-sm">
	{#each ['xs', 'sm', 'md', 'lg', 'xl'] as const as size (size)}
		<Item {size} variant="outline">
			<ItemContent>
				<ItemTitle>Size {size}</ItemTitle>
			</ItemContent>
		</Item>
	{/each}
	{#each ['rect', 'mincurved', 'modern', 'curved', 'round'] as const as shape (shape)}
		<Item {shape} variant="outline">
			<ItemContent>
				<ItemTitle>Shape {shape}</ItemTitle>
			</ItemContent>
		</Item>
	{/each}
</div>
