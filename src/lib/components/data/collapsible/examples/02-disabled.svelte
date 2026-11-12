<!-- @example Disabled and callbacks :: disabled locks the trigger; onOpenChange reports the next state. -->
<script lang="ts">
	import { Button, Collapsible } from '@fractaldesign/fractalsvelte-ui';
	import { Icon } from '@fractaldesign/icons';
	import { luChevronDown } from '@fractaldesign/icons/lucide';

	let open = $state(true);
	let disabled = $state(false);
	let last = $state('open');

	function onOpenChange(next: boolean) {
		last = next ? 'open' : 'closed';
	}
</script>

<div class="box gap-sm">
	<Button variant="outline" size="sm" onclick={() => (disabled = !disabled)}>
		{disabled ? 'Enable' : 'Disable'} the disclosure
	</Button>
	<Collapsible bind:open {onOpenChange} {disabled}>
		{#snippet trigger({ open, disabled, props, toggle })}
			<button class={['item', disabled && 'disabled']} {...props}>
				<span class="grow ta-l">
					<span class="weight-600">Incident timeline</span>
					<span class="text-sm text-muted">Last updated 10:33</span>
				</span>
				<span class={['caret spring spring-snappy', open && 'open']}>
					<Icon icon={luChevronDown} />
				</span>
			</button>
		{/snippet}
		<div class="pad-bs box gap-xs text-sm text-secondary">
			<p>10:19 — Lukas opened the media 5xx incident.</p>
			<p>10:27 — Ines started a fresh deploy of media.</p>
			<p>10:29 — The deploy went ready; error rate returned to 0.04%.</p>
			<p>10:33 — The incident was closed. Click the header to {open ? 'hide' : 'show'} this again, or call toggle from the trigger.</p>
		</div>
	</Collapsible>
	<p class="text-sm text-muted">The panel is {last}.</p>
</div>
