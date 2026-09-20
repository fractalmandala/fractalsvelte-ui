<script lang="ts">
	import { Button } from 'fractalsvelte/components';

	let { selected = 'all' }: { selected?: string } = $props();
</script>

{#if selected === 'all'}
	<div class="row wrap gap-sm ycenter">
		<Button disabled>Disabled</Button>
		<Button variant="outline" disabled>Disabled</Button>
		<Button variant="destructive" disabled>Delete workspace</Button>
		<Button loading>Working</Button>
	</div>
{:else if selected === 'disabled'}
	<Button disabled>Disabled</Button>
{:else if selected === 'outline-disabled'}
	<Button variant="outline" disabled>Disabled</Button>
{:else if selected === 'destructive-disabled'}
	<Button variant="destructive" disabled>Delete workspace</Button>
{:else if selected === 'loading'}
	<Button loading>Working</Button>
{/if}
