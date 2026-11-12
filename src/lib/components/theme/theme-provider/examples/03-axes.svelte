<!-- @example Axes :: Radius, density, motion and mode rewrite the ladders for one subtree. -->
<script lang="ts">
	import { Button, ThemeProvider } from '@fractaldesign/fractalsvelte-ui';
	import type { ThemeDensity, ThemeMode, ThemeMotion, ThemeRadius } from '@fractaldesign/fractalsvelte-ui/theme';

	const radii: ThemeRadius[] = ['sharp', 'soft', 'round'];
	const densities: ThemeDensity[] = ['compact', 'cozy', 'comfortable'];
	const motions: ThemeMotion[] = ['off', 'calm', 'snappy', 'playful'];
	const modes: ThemeMode[] = ['light', 'dark', 'system'];
</script>

<div class="column gap-md">
	<div class="row wrap gap-sm">
		{#each radii as radius (radius)}
			<ThemeProvider {radius} class="pad-sm radius-md border">
				<Button variant="secondary" size="sm">radius: {radius}</Button>
			</ThemeProvider>
		{/each}
	</div>
	<div class="row wrap gap-sm">
		{#each densities as density (density)}
			<ThemeProvider {density} class="column gap-sm pad-sm radius-md border">
				<span class="text-xs text-muted">density: {density}</span>
				<Button size="sm">Save</Button>
			</ThemeProvider>
		{/each}
	</div>
	<div class="row wrap gap-sm">
		{#each motions as motion (motion)}
			<ThemeProvider {motion} class="pad-sm radius-md border">
				<Button variant="outline" size="sm">motion: {motion}</Button>
			</ThemeProvider>
		{/each}
	</div>
	<div class="row wrap gap-sm">
		{#each modes as mode (mode)}
			<ThemeProvider {mode} class="pad-sm radius-md border">
				<Button variant="secondary" size="sm">mode: {mode}</Button>
			</ThemeProvider>
		{/each}
	</div>
</div>
