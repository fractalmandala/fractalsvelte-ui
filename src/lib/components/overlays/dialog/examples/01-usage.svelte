<!-- @example Usage :: A trigger, a title, a description and a footer — focus returns to the button when it closes. -->
<script lang="ts">
	import { Button, Dialog } from '@fractaldesign/fractalsvelte-ui';
</script>

<Dialog surface="solid" title="Invite teammates" description="They will get an email with a link to join the Northwind workspace.">
	{#snippet trigger({ props })}
		<Button {...props}>Invite teammates</Button>
	{/snippet}
	<label class="box gap-xs text-sm text-primary">
		Email addresses
		<input class="input h-lg radius-md border bg-input text-md" placeholder="ada@northwind.dev, grace@northwind.dev" />
	</label>
	{#snippet footer({ close })}
		<Button variant="ghost" onclick={close}>Cancel</Button>
		<Button onclick={close}>Send invites</Button>
	{/snippet}
</Dialog>
