<!-- @example Horizontal axis :: A row of desks that reorders along x. -->
<script lang="ts">
	import { Reorder } from '@fractaldesign/fractalsvelte-ui';

	let items = $state([
		{ id: 'news', label: 'News' },
		{ id: 'comment', label: 'Comment' },
		{ id: 'arts', label: 'Arts' },
		{ id: 'sport', label: 'Sport' }
	]);
</script>

<Reorder bind:items key={(item) => item.id} axis="x" onReorder={(next) => (items = next)}>
	{#snippet children(item, { dragging, handleProps })}
		<div
			class={['card', 'rim', 'shad-sm', 'pad-md', dragging && 'shad-lg', handleProps.class]}
			role="button" tabindex={-1} aria-label="Reorder" onpointerdown={handleProps.onpointerdown}
		>
			<span class="text-sm weight-500">{item.label}</span>
		</div>
	{/snippet}
</Reorder>
