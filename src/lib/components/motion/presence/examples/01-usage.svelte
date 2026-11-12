<!-- @example Usage :: A proofing notice enters and leaves with a fade. -->
<script lang="ts">
	import { Button, Presence } from '@fractaldesign/fractalsvelte-ui';

	let show = $state(true);
</script>

<div class="box gap-md measure-sm">
	<Button variant="secondary" onclick={() => (show = !show)}>{show ? 'Dismiss notice' : 'Show notice'}</Button>
	<Presence {show}>
		<div class="card rim shad-sm pad-md">
			<p class="weight-500">Copy is with the night editor</p>
			<p class="text-sm text-secondary">The Tuesday leader is locked for 11 o'clock.</p>
		</div>
	</Presence>
</div>
