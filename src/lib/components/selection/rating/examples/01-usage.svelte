<!-- @example Usage :: A five-star rating bound to a value, with a live read-out. -->
<script lang="ts">
	import { Rating } from '@fractaldesign/fractalsvelte-ui';

	let score = $state(4);
</script>

<div class="box gap-sm">
	<Rating bind:value={score} label="Aurora typography pack" />
	<p class="text-sm text-muted tabular-nums">{score} out of 5 — typography pack</p>
</div>
