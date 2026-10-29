<script lang="ts">
	import { StaggerList } from '$lib/styler';

	const items = [
		{ id: '1', label: 'First' },
		{ id: '2', label: 'Second' },
		{ id: '3', label: 'Third' }
	];
</script>

<StaggerList {items}>
	{#snippet itemSnippet({ item })}<div>{item.label}</div>{/snippet}
</StaggerList>
