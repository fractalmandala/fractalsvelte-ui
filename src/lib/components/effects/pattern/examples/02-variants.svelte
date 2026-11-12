<!-- @example Variants :: Grid, dots, lines and a cross, each as a feature tile. -->
<script lang="ts">
	import { Pattern } from '@fractaldesign/fractalsvelte-ui';

	const tiles = [
		['grid', 'Grid', 'A light ruled field, for a docs or analytics hero.'],
		['dots', 'Dots', 'A quieter stipple, for a pricing band.'],
		['lines', 'Lines', 'Horizontal rules, for a changelog or list.'],
		['cross', 'Cross', 'A ruled field with a diagonal, for a technical surface.']
	] as const;
</script>

<div class="grid-2 gap-bs">
	{#each tiles as [variant, title, copy] (variant)}
		<div class="relative overflow-hidden curved pad-xl box gap-sm bg-surface border-subtle">
			<Pattern {variant} fade="radial" />
			<p class="card-title">{title}</p>
			<p class="card-desc text-secondary">{copy}</p>
		</div>
	{/each}
</div>
