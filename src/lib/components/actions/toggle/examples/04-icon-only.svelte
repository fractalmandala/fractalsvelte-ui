<!-- @example Icon only and callbacks :: With no label the toggle is square; onPressedChange reports each change and pressable={false} stills the spring. -->
<script lang="ts">
	import { Toggle } from '@fractaldesign/fractalsvelte-ui';
	import { luBellOff, luPin, luStar } from '@fractaldesign/icons/lucide';

	let log = $state('No changes yet');
</script>

<div class="box gap-md">
	<div class="row gap-sm ycenter">
		<Toggle
			icon={luPin}
			aria-label="Pin to top"
			onPressedChange={(on) => (log = on ? 'Pinned to top' : 'Unpinned')}
		/>
		<Toggle icon={luBellOff} aria-label="Mute thread" variant="outline" pressable={false} />
		<Toggle icon={luStar} aria-label="Favourite" variant="soft" disabled />
	</div>
	<p class="text-sm text-secondary" aria-live="polite">{log}</p>
</div>
