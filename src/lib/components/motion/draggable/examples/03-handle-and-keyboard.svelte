<!-- @example Handle, disabled and position :: A handle snippet, a selector handle, a disabled card, and a bound position. -->
<script lang="ts">
	import { Draggable } from '@fractaldesign/fractalsvelte-ui';
	import { Icon } from '@fractaldesign/icons';
	import { luGripVertical } from '@fractaldesign/icons/lucide';

	let position = $state({ x: 0, y: 0 });
</script>

<div class="box gap-lg">
	<Draggable
		bind:position
		onPositionChange={(next) => (position = next)}
		onDragStart={() => {}}
		onDrag={() => {}}
		onDragEnd={() => {}}
		class="card rim shad-md pad-md measure-sm"
	>
		{#snippet handle()}
			<span class="row ycenter gap-sm text-sm text-muted">
				<Icon icon={luGripVertical} />
				Drag from here
			</span>
		{/snippet}
		<p class="weight-500">Caption to place</p>
		<p class="text-sm text-secondary tabular-nums">{Math.round(position.x)} × {Math.round(position.y)}</p>
	</Draggable>
	<Draggable handle="[data-drag-handle]" class="card rim shad-sm pad-md measure-sm">
		<span data-drag-handle class="row ycenter gap-sm text-sm text-muted">
			<Icon icon={luGripVertical} />
			Selector handle
		</span>
		<p class="text-sm text-secondary">Only the labelled handle starts the drag.</p>
	</Draggable>
	<Draggable disabled class="card rim pad-md measure-sm">
		<p class="text-sm text-muted">Disabled — this one stays put.</p>
	</Draggable>
</div>
