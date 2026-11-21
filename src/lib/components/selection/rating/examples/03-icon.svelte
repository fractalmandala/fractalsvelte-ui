<!-- @example Custom icon and inks :: Any Lucide icon can stand in for the star, the filled and empty halves take their own inks, and max sets how many are shown. -->
<script lang="ts">
	import { Rating } from '@fractaldesign/fractalsvelte-ui';
	import { luHeart } from '@fractaldesign/icons/lucide';

	let favourites = $state(3);
</script>

<div class="box gap-sm">
	<Rating bind:value={favourites} icon={luHeart} max={6} label="Saved recipes" />
	<Rating
		bind:value={favourites}
		icon={luHeart}
		max={6}
		textColor="text-danger"
		childTextColor="text-secondary"
		label="Saved recipes, warmer ink"
	/>
	<p class="text-sm text-muted tabular-nums">{favourites} of 6 hearts on this recipe</p>
</div>
