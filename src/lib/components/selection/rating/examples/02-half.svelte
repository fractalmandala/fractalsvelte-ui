<!-- @example Half ratings :: allowHalf steps the value by 0.5, and hovering a half previews it. -->
<script lang="ts">
	import { Rating } from '@fractaldesign/fractalsvelte-ui';

	let score = $state(3.5);
</script>

<div class="box gap-sm">
	<Rating bind:value={score} allowHalf label="Framer Motion cookbook" />
	<p class="text-sm text-muted tabular-nums">{score.toFixed(1)} out of 5</p>
</div>
