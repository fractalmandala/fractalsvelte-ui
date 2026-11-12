<!-- @example Size and intensity :: A tight dim light, and a wide brighter one. -->
<script lang="ts">
	import { SpotlightCard } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="grid-2 gap-bs">
	<SpotlightCard size="24%" intensity={0.2}>
		<p class="card-title">Tight and quiet</p>
		<p class="card-desc text-secondary">A 24% light at 0.2 intensity, for a card that should barely react.</p>
	</SpotlightCard>
	<SpotlightCard size="70%" intensity={0.55}>
		<p class="card-title">Wide and bright</p>
		<p class="card-desc text-secondary">A 70% light at 0.55 intensity, for a hero tile that wants to feel lit.</p>
	</SpotlightCard>
</div>
