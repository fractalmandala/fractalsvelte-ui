<!-- @example Live ticks :: A stopwatch that starts on its own, reports every 100ms tick and runs at the larger height. -->
<script lang="ts">
	import { Timer } from '@fractaldesign/fractalsvelte-ui';

	let ticks = $state(0);
</script>

<div class="row ycenter gap-md measure-sm">
	<Timer
		startButtonProps={{ variant: 'primary' }}
		pauseButtonProps={{ variant: 'outline' }}
		resetButtonProps={{ variant: 'ghost' }} mode="stopwatch" autoStart interval={100} size="h-lg" onTick={() => (ticks += 1)} />
	<span class="text-sm text-secondary">{ticks} ticks reported</span>
</div>
