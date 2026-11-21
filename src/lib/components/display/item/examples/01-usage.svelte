<!-- @example Usage :: A teammate row with a leading icon aligned to the start, a title, a description and a spaced action. -->
<script lang="ts">
	import { Button, Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@fractaldesign/fractalsvelte-ui';
	import { luUser } from '@fractaldesign/icons/lucide';
</script>

<div class="measure-sm">
	<Item surface="outlined">
		<ItemMedia icon={luUser} textColor="text-muted" alignContent="xleft" />
		<ItemContent>
			<ItemTitle>Ada Lovelace</ItemTitle>
			<ItemDescription textSize="text-md" textColor="text-secondary">Owner · last seen in the billing workspace</ItemDescription>
		</ItemContent>
		<ItemActions gap="gap-md">
			<Button size="h-sm" variant="secondary">Message</Button>
		</ItemActions>
	</Item>
</div>
