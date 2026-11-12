<!-- @example Controlled and solid :: bind:open with onOpenChange, and a solid surface. -->
<script lang="ts">
	import { ContextMenu, MenuCheckboxItem, MenuItem, MenuRadioGroup, MenuRadioItem, MenuSeparator } from '@fractaldesign/fractalsvelte-ui';

	let open = $state(false);
	let pinned = $state(false);
	let status = $state('open');
</script>

<ContextMenu bind:open surface="solid" onOpenChange={(next) => (open = next)}>
	{#snippet trigger({ props })}
		<button type="button" class="box gap-xs pad-bs radius-lg border bg-surface ta-l" {...props}>
			<p class="weight-600 text-primary">Harbour invoices</p>
			<p class="text-sm text-secondary">
				{open ? 'Menu is open at the pointer.' : 'Right-click, long-press, or Shift+F10 to change status.'}
				The issue is {status}{pinned ? ' and pinned' : ''}.
			</p>
		</button>
	{/snippet}
	<MenuCheckboxItem bind:checked={pinned} onCheckedChange={(next) => (pinned = next)}>Pin to sidebar</MenuCheckboxItem>
	<MenuSeparator />
	<MenuRadioGroup bind:value={status} onValueChange={(next) => (status = next)}>
		<MenuRadioItem value="open">Open</MenuRadioItem>
		<MenuRadioItem value="blocked">Blocked</MenuRadioItem>
		<MenuRadioItem value="done">Done</MenuRadioItem>
	</MenuRadioGroup>
	<MenuSeparator />
	<MenuItem onclick={() => (open = false)}>Close menu</MenuItem>
</ContextMenu>
