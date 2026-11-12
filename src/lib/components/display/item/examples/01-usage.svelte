<!-- @example Usage :: A teammate row with an icon, a title, a description and an action. -->
<script lang="ts">
	import { Button, Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@fractaldesign/fractalsvelte-ui';
	import { luUser } from '@fractaldesign/icons/lucide';
</script>

<div class="measure-sm">
	<Item variant="outline">
		<ItemMedia icon={luUser} />
		<ItemContent>
			<ItemTitle>Ada Lovelace</ItemTitle>
			<ItemDescription>Owner · last seen in the billing workspace</ItemDescription>
		</ItemContent>
		<ItemActions>
			<Button size="sm" variant="secondary">Message</Button>
		</ItemActions>
	</Item>
</div>
