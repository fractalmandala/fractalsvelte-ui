<!-- @example Usage :: A segmented time field bound to a session start time. -->
<script lang="ts">
	import { TimeField } from '@fractaldesign/fractalsvelte-ui';

	let starts = $state<string | null>('09:30');
</script>

<div class="box gap-sm measure-xs">
	<TimeField bind:value={starts} aria-label="Session starts" />
	<p class="text-sm text-muted">{starts ? `Starts at ${starts}` : 'Type a start time'}</p>
</div>
