<!-- @example Surface, corner and inset :: The lit card on three surfaces, with the corner and inset ladders alongside. -->
<script lang="ts">
	import { SpotlightCard } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="grid-3 gap-bs">
	<SpotlightCard surface="elevated">
		<p class="card-title">Elevated</p>
		<p class="card-desc text-secondary">The default raised fill the light falls on.</p>
	</SpotlightCard>
	<SpotlightCard surface="paneled" shape="modern" pad="pad-xl" gap="gap-xs">
		<p class="card-title">Paneled</p>
		<p class="card-desc text-secondary">A recessed fill, a squarer corner and a tighter inset.</p>
	</SpotlightCard>
	<SpotlightCard surface="overlayed" shape="round">
		<p class="card-title">Overlayed</p>
		<p class="card-desc text-secondary">The overlay fill, a round corner and a generous inset.</p>
	</SpotlightCard>
</div>
