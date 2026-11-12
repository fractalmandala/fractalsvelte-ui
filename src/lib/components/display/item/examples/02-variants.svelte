<!-- @example Variants :: A quiet row, a hairline box, and a tinted panel. -->
<script lang="ts">
	import { Item, ItemContent, ItemDescription, ItemTitle } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm measure-sm">
	<Item variant="default">
		<ItemContent>
			<ItemTitle>Draft changelog</ItemTitle>
			<ItemDescription>Waiting for review from the docs team.</ItemDescription>
		</ItemContent>
	</Item>
	<Item variant="outline">
		<ItemContent>
			<ItemTitle>Published changelog</ItemTitle>
			<ItemDescription>Shipped with fractalsvelte-ui 0.4 this morning.</ItemDescription>
		</ItemContent>
	</Item>
	<Item variant="muted">
		<ItemContent>
			<ItemTitle>Archived changelog</ItemTitle>
			<ItemDescription>Kept for the 0.3 release notes.</ItemDescription>
		</ItemContent>
	</Item>
</div>
