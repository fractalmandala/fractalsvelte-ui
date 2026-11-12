<!-- @example Click, hover and manual :: The three open modes, including a panel that matches the trigger's width. -->
<script lang="ts">
	import { Button, Popover } from '@fractaldesign/fractalsvelte-ui';

	let open = $state(false);
	let log = $state('Manual popover is closed');
</script>

<div class="row wrap gap-sm ycenter">
	<Popover trigger="click">
		{#snippet target({ props })}
			<Button variant="outline" {...props}>Click</Button>
		{/snippet}
		<p class="text-sm text-secondary">Toggles on press. Esc or a click outside closes it.</p>
	</Popover>

	<Popover trigger="hover" placement="top">
		{#snippet target({ props })}
			<Button variant="ghost" {...props}>Hover or focus</Button>
		{/snippet}
		<p class="text-sm text-secondary">Stays open while you move the pointer onto the panel.</p>
	</Popover>

	<Button variant="secondary" onclick={() => (open = !open)}>{open ? 'Hide details' : 'Show details'}</Button>
	<Popover trigger="manual" bind:open matchWidth placement="bottom-start" onOpenChange={(next) => (log = next ? 'Manual popover is open' : 'Manual popover is closed')}>
		{#snippet target()}
			<span class="text-sm text-secondary">The November invoice run</span>
		{/snippet}
		<div class="box gap-xs">
			<p class="weight-600 text-primary">November invoice run</p>
			<p class="text-sm text-secondary">{log}. Driven only by the button next to it.</p>
		</div>
	</Popover>
</div>
