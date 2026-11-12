<!-- @example Controlled, disabled and custom triggers :: A bound open menu, a solid surface, a disabled menu, a custom trigger, and a bar that does not wrap. -->
<script lang="ts">
	import { Button, Menubar, MenubarMenu, MenuItem } from '@fractaldesign/fractalsvelte-ui';

	let value = $state<string | null>(null);
</script>

<div class="box gap-sm">
	<Menubar
		bind:value
		onValueChange={(next) => (value = next)}
		loop={false}
		surface="solid"
		label="Atlas tools"
	>
		<MenubarMenu value="file" label="File">
			<MenuItem>New chart</MenuItem>
			<MenuItem>Open catalogue…</MenuItem>
		</MenubarMenu>
		<MenubarMenu value="insert">
			{#snippet trigger({ props })}
				<Button variant="ghost" size="sm" {...props}>Insert</Button>
			{/snippet}
			<MenuItem>Harbour mark</MenuItem>
			<MenuItem>Tide table</MenuItem>
		</MenubarMenu>
		<MenubarMenu value="publish" label="Publish" disabled>
			<MenuItem>Submit edition</MenuItem>
		</MenubarMenu>
		<MenubarMenu value="help" label="Help" surface="glass">
			<MenuItem>Keyboard shortcuts</MenuItem>
			<MenuItem>Release notes</MenuItem>
		</MenubarMenu>
	</Menubar>
	<span class="text-sm text-muted">{value ? `${value} is open` : 'Every menu is closed'}</span>
</div>
