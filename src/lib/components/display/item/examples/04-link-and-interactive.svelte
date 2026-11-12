<!-- @example Link and interactive :: A row that navigates, and a row that acts as a button. -->
<script lang="ts">
	import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@fractaldesign/fractalsvelte-ui';
	import { luBook, luTrash } from '@fractaldesign/icons/lucide';

	let removed = $state(false);
</script>

<div class="box gap-sm measure-sm">
	<Item href="https://fractaldesign.dev/docs" target="_blank" variant="outline">
		<ItemMedia icon={luBook} />
		<ItemContent>
			<ItemTitle>Documentation</ItemTitle>
			<ItemDescription>Guides, the API reference and worked examples.</ItemDescription>
		</ItemContent>
	</Item>
	{#if !removed}
		<Item interactive variant="outline" onclick={() => (removed = true)}>
			<ItemMedia icon={luTrash} />
			<ItemContent>
				<ItemTitle>Move to trash</ItemTitle>
				<ItemDescription>The archive can be restored for 30 days.</ItemDescription>
			</ItemContent>
		</Item>
	{/if}
</div>
