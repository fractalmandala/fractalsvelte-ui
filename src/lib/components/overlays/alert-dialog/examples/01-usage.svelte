<!-- @example Usage :: A trigger, a title, a description and two actions — focus lands on Cancel. -->
<script lang="ts">
	import { AlertDialog, Button } from '@fractaldesign/fractalsvelte-ui';
</script>

<AlertDialog
	title="Leave the Northwind workspace?"
	description="You will lose access to its projects. An owner can invite you back."
	confirmLabel="Leave workspace"
	cancelLabel="Stay"
>
	{#snippet trigger({ props })}
		<Button variant="outline" {...props}>Leave workspace</Button>
	{/snippet}
</AlertDialog>
