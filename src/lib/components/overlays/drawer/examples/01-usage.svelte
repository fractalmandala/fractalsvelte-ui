<!-- @example Usage :: A right-hand drawer with a title, a short form and a footer. -->
<script lang="ts">
	import { Button, Drawer } from '@fractaldesign/fractalsvelte-ui';
</script>

<Drawer
	surface="solid"
	title="Add a collaborator"
	description="They will be able to comment on “Harbour invoices” and leave reviews."
>
	{#snippet trigger({ props })}
		<Button {...props}>Add collaborator</Button>
	{/snippet}
	<label class="box gap-xs text-sm text-primary">
		Email
		<input class="input h-lg radius-md border bg-input text-md" placeholder="ada@northwind.dev" />
	</label>
	{#snippet footer({ close })}
		<Button variant="ghost" onclick={close}>Cancel</Button>
		<Button onclick={close}>Send invite</Button>
	{/snippet}
</Drawer>
