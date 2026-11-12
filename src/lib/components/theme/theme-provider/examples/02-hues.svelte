<!-- @example Hues :: Three hues side by side, set with hue, chroma and tint alone. -->
<script lang="ts">
	import { Button, ThemeProvider } from '@fractaldesign/fractalsvelte-ui';

	const brands = [
		{ name: 'Fjord', hue: 232, chroma: 0.16, tint: 0.014 },
		{ name: 'Terracotta', hue: 38, chroma: 0.18, tint: 0.01 },
		{ name: 'Moss', hue: 140, chroma: 0.13, tint: 0.008 }
	];
</script>

<div class="grid grid-3 gap-md">
	{#each brands as brand (brand.name)}
		<ThemeProvider hue={brand.hue} chroma={brand.chroma} tint={brand.tint} class="column gap-sm pad-bs radius-md border">
			<p class="weight-600">{brand.name}</p>
			<p class="text-xs text-muted tabular-nums">hue {brand.hue} / chroma {brand.chroma}</p>
			<div class="row gap-xs">
				<Button size="sm" variant="themed">Accent</Button>
				<Button size="sm" variant="soft">Soft</Button>
			</div>
		</ThemeProvider>
	{/each}
</div>
