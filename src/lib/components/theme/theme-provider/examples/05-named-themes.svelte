<!-- @example Named themes :: Every built-in theme is just three numbers; pick one by name. -->
<script lang="ts">
	import { Button, ThemeProvider } from '@fractaldesign/fractalsvelte-ui';
	import type { ThemeName } from '@fractaldesign/fractalsvelte-ui/theme';

	const names: ThemeName[] = ['fractalsvelte', 'aurora', 'ocean', 'ember', 'rose', 'lime', 'amber', 'mono'];
</script>

<div class="grid grid-4 gap-sm">
	{#each names as name (name)}
		<ThemeProvider theme={name} class="column gap-sm pad-bs radius-md border">
			<span class="weight-600 text-sm tt-c">{name}</span>
			<Button variant="themed" size="sm">Accent</Button>
		</ThemeProvider>
	{/each}
</div>
