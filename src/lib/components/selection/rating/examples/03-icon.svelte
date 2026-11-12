<!-- @example Custom icon :: Any Lucide icon can stand in for the star; max sets how many are shown. -->
<script lang="ts">
	import { Rating } from '@fractaldesign/fractalsvelte-ui';
	import { luHeart } from '@fractaldesign/icons/lucide';

	let favourites = $state(3);
</script>

<div class="box gap-sm">
	<Rating bind:value={favourites} icon={luHeart} max={6} label="Saved recipes" />
	<p class="text-sm text-muted tabular-nums">{favourites} of 6 hearts on this recipe</p>
</div>
