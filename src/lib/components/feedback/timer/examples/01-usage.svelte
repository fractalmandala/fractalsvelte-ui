<!-- @example Usage :: 30-second countdown alongside an interactive stopwatch. -->
<script lang="ts">
	import { Timer } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="column gap-md">
	<Timer mode="countdown" duration={30_000} gap="gap-sm" />
	<Timer mode="stopwatch" />
</div>
