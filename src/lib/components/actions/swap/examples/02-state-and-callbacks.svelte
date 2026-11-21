<!-- @example State and callbacks :: onActiveChange reports each flip, and disabled keeps the button in its state. -->
<script lang="ts">
	import { Icon } from '@fractaldesign/icons';
	import { luBell, luBellOff } from '@fractaldesign/icons/lucide';
	import { Swap } from '@fractaldesign/fractalsvelte-ui';

	let subscribed = $state(false);
	let log = $state('No change yet');
</script>

<div class="box gap-sm">
	<div class="row wrap ycenter gap-md">
		<Swap
			bind:active={subscribed}
			label="Subscribe to release notes"
			variant="secondary"
			onActiveChange={(on) => (log = on ? 'Subscribed to release notes' : 'Unsubscribed')}
		>
			{#snippet on()}<Icon icon={luBellOff} />{/snippet}
			{#snippet off()}<Icon icon={luBell} />{/snippet}
		</Swap>
		<Swap label="Pause playback (unavailable)" variant="outline" disabled />
	</div>
	<p class="text-sm text-secondary" aria-live="polite">{log}</p>
</div>
