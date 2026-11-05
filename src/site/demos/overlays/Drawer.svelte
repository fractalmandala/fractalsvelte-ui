<script lang="ts">
	import Drawer from '$lib/components/overlays/Drawer.svelte';
	import Button from '$lib/components/actions/Button.svelte';
	import Checkbox from '$lib/components/forms/Checkbox.svelte';
	import Select from '$lib/components/forms/Select.svelte';

	let open = $state(false);
	const sort = [
		{ value: 'new', label: 'Newest first' },
		{ value: 'old', label: 'Oldest first' }
	];
</script>

<Drawer bind:open title="Filters" description="Narrow down the project list.">
	{#snippet trigger({ open: show })}<Button onclick={show}>Filters</Button>{/snippet}
	<div class="box gap-md">
		<Select label="Sort by" options={sort} value="new" />
		<div class="box gap-sm">
			<Checkbox label="Active projects" checked />
			<Checkbox label="Archived projects" />
			<Checkbox label="Shared with me" checked />
		</div>
	</div>
	{#snippet footer()}
		<Button variant="ghost" onclick={() => (open = false)}>Reset</Button>
		<Button onclick={() => (open = false)}>Apply</Button>
	{/snippet}
</Drawer>
