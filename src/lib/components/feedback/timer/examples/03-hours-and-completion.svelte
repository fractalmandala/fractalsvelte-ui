<!-- @example Hours and completion :: An eight-second countdown read as hh:mm:ss, with its own controls hidden, reporting when it reaches zero. -->
<script lang="ts">
	import { Timer } from '@fractaldesign/fractalsvelte-ui';

	let finished = $state(false);
</script>

<div class="column gap-xs">
	<Timer
		mode="countdown"
		duration={8_000}
		autoStart
		showHours
		showControls={false}
		size="h-xl"
		onComplete={() => (finished = true)}
	/>
	<span class="text-sm text-secondary">
		{finished ? 'Countdown complete' : 'Counting down from eight seconds'}
	</span>
</div>
