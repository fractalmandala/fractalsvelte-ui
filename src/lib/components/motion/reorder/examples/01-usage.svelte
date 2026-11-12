<!-- @example Usage :: Drag a story to a new place in the lineup, or use Space and the arrows. -->
<script lang="ts">
	import { Reorder } from '@fractaldesign/fractalsvelte-ui';
	import { Icon } from '@fractaldesign/icons';
	import { luGripVertical } from '@fractaldesign/icons/lucide';

	let items = $state([
		{ id: 'leader', title: 'Leader', deck: 'A quiet majority for the chapel.' },
		{ id: 'home', title: 'Home news', deck: 'Flood water over the print works.' },
		{ id: 'foreign', title: 'Foreign', deck: 'Late cables from Rome.' },
		{ id: 'arts', title: 'Arts', deck: 'A new hanging at the Academy.' }
	]);
</script>

<Reorder bind:items key={(item) => item.id} axis="y" onReorder={(next) => (items = next)}>
	{#snippet children(item, { dragging, handleProps })}
		<div class={['card', 'rim', 'shad-sm', 'pad-sm', 'row', 'ycenter', 'gap-sm', dragging && 'shad-lg']}>
			<span class={handleProps.class} role="button" tabindex={-1} aria-label="Reorder" onpointerdown={handleProps.onpointerdown}>
				<Icon icon={luGripVertical} />
			</span>
			<div class="box">
				<p class="weight-500">{item.title}</p>
				<p class="text-sm text-secondary">{item.deck}</p>
			</div>
		</div>
	{/snippet}
</Reorder>
