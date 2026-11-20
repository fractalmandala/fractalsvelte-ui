<!-- @example Axes :: Shape, density, motion and mode rewrite the ladders for one subtree. -->
<script lang="ts">
	import { Button, ThemeProvider } from '@fractaldesign/fractalsvelte-ui';
	import type { ThemeDensity, ThemeMode, ThemeMotion } from '@fractaldesign/fractalsvelte-ui/theme';
	import type { Shape } from '@fractaldesign/fractalsvelte-ui';

	const shapes: Shape[] = ['rect', 'mincurved', 'modern', 'curved', 'round'];
	const densities: ThemeDensity[] = ['compact', 'cozy', 'comfortable'];
	const motions: ThemeMotion[] = ['off', 'calm', 'snappy', 'playful'];
	const modes: ThemeMode[] = ['light', 'dark', 'system'];
</script>

<div class="column gap-md">
	<div class="row wrap gap-sm">
		{#each shapes as shape (shape)}
			<ThemeProvider {shape} class="pad-sm radius-md border">
				<Button variant="secondary" size="h-sm">shape: {shape}</Button>
			</ThemeProvider>
		{/each}
	</div>
	<div class="row wrap gap-sm">
		{#each densities as density (density)}
			<ThemeProvider {density} class="column gap-sm pad-sm radius-md border">
				<span class="text-xs text-muted">density: {density}</span>
				<Button size="h-sm">Save</Button>
			</ThemeProvider>
		{/each}
	</div>
	<div class="row wrap gap-sm">
		{#each motions as motion (motion)}
			<ThemeProvider {motion} class="pad-sm radius-md border">
				<Button variant="outline" size="h-sm">motion: {motion}</Button>
			</ThemeProvider>
		{/each}
	</div>
	<div class="row wrap gap-sm">
		{#each modes as mode (mode)}
			<ThemeProvider {mode} class="pad-sm radius-md border">
				<Button variant="secondary" size="h-sm">mode: {mode}</Button>
			</ThemeProvider>
		{/each}
	</div>
</div>
