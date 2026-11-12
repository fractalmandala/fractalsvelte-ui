<!-- @example Usage :: A button with a label and a click handler. -->
<script lang="ts">
	import { Button } from '@fractaldesign/fractalsvelte-ui';

	let count = $state(0);
</script>

<Button onclick={() => count++}>Deploy to production</Button>
<p class="text-sm text-muted tabular-nums">Deployed {count} times</p>
