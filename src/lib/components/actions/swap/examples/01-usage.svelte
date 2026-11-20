<!-- @example Usage :: Icon swaps with rotate, flip, and fade transitions. -->
<script lang="ts">
	import { Icon } from '@fractaldesign/icons';
	import { luVolume2, luVolumeX, luHeart, luHeartOff } from '@fractaldesign/icons/lucide';
	import { Swap } from '@fractaldesign/fractalsvelte-ui';

	let muted = $state(false);
	let liked = $state(true);
</script>

<div class="row wrap ycenter gap-md">
	<Swap bind:active={muted} label="Toggle mute" variant="outline" effect="rotate">
		{#snippet on()}<Icon icon={luVolumeX} />{/snippet}
		{#snippet off()}<Icon icon={luVolume2} />{/snippet}
	</Swap>
	<Swap bind:active={liked} label="Like item" variant="secondary" effect="flip">
		{#snippet on()}<Icon icon={luHeart} />{/snippet}
		{#snippet off()}<Icon icon={luHeartOff} />{/snippet}
	</Swap>
	<Swap label="Confirm toggle" variant="themed" effect="fade" />
</div>
