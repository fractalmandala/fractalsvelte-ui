<!-- @example Fade :: Every mask: none, radial, top, bottom and edges. -->
<script lang="ts">
	import { Pattern } from '@fractaldesign/fractalsvelte-ui';

	const fades = ['none', 'radial', 'top', 'bottom', 'edges'] as const;
</script>

<div class="grid-2 gap-bs">
	{#each fades as fade (fade)}
		<div class="relative overflow-hidden curved pad-xl box gap-sm bg-panel">
			<Pattern variant="dots" {fade} size="0.9rem" />
			<p class="card-title">Fade {fade}</p>
			<p class="card-desc text-secondary">The pattern keeps its tile size; only the mask changes.</p>
		</div>
	{/each}
</div>
