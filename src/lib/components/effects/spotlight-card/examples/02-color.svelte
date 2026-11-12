<!-- @example Colour :: Theme accent light beside a neutral white highlight. -->
<script lang="ts">
	import { SpotlightCard } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="grid-2 gap-bs">
	<SpotlightCard color="theme">
		<p class="card-title">Theme light</p>
		<p class="card-desc text-secondary">The accent follows the pointer — useful on a feature or pricing card.</p>
	</SpotlightCard>
	<SpotlightCard color="neutral">
		<p class="card-title">Neutral light</p>
		<p class="card-desc text-secondary">A white highlight that stays quiet against any hue.</p>
	</SpotlightCard>
</div>
