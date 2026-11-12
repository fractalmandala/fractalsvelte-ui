<!-- @example Usage :: A click popover with a short form, light-dismissed by Esc or a click outside. -->
<script lang="ts">
	import { Button, Popover } from '@fractaldesign/fractalsvelte-ui';
</script>

<Popover>
	{#snippet target({ props })}
		<Button variant="outline" {...props}>Share page</Button>
	{/snippet}
	<div class="box gap-sm">
		<p class="weight-600 text-primary">Share “Harbour invoices”</p>
		<p class="text-sm text-secondary">Anyone with the link can comment. They cannot change the filters or export.</p>
		<label class="box gap-xs text-sm text-primary">
			Link
			<input class="input h-lg radius-md border bg-input text-md" value="https://northwind.dev/s/harbour" readonly />
		</label>
	</div>
</Popover>
