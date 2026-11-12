<!-- @example Usage :: Hover or focus a toolbar button — neighbouring hints open instantly once the group is warm. -->
<script lang="ts">
	import { luCopy, luPencil, luTrash2 } from '@fractaldesign/icons/lucide';
	import { Button, Tooltip } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row gap-xs">
	<Tooltip content="Copy the share link">
		{#snippet trigger({ props })}
			<Button variant="ghost" size="sm" icon={luCopy} class="btn-icon" aria-label="Copy the share link" {...props} />
		{/snippet}
	</Tooltip>
	<Tooltip content="Rename this project">
		{#snippet trigger({ props })}
			<Button variant="ghost" size="sm" icon={luPencil} class="btn-icon" aria-label="Rename this project" {...props} />
		{/snippet}
	</Tooltip>
	<Tooltip content="Delete “Harbour invoices”">
		{#snippet trigger({ props })}
			<Button variant="ghost" size="sm" icon={luTrash2} class="btn-icon text-danger" aria-label="Delete this project" {...props} />
		{/snippet}
	</Tooltip>
</div>
