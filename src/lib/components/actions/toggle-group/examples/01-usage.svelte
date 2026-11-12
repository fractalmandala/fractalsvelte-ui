<!-- @example Usage :: Single selection, like a segmented control. -->
<script lang="ts">
	import { ToggleGroup, ToggleGroupItem } from '@fractaldesign/fractalsvelte-ui';

	let layout = $state<string | string[]>('grid');
</script>

<div class="box gap-sm">
	<ToggleGroup type="single" label="Layout" bind:value={layout}>
		<ToggleGroupItem value="list">List</ToggleGroupItem>
		<ToggleGroupItem value="grid">Grid</ToggleGroupItem>
		<ToggleGroupItem value="board">Board</ToggleGroupItem>
	</ToggleGroup>
	<p class="text-sm text-secondary">Showing projects as a {layout || 'default'} view.</p>
</div>
