<!-- @example Controlled :: Bind value to keep the mode in your own state, and react in onValueChange. -->
<script lang="ts">
	import { ModeToggle, ThemeProvider } from '@fractaldesign/fractalsvelte-ui';
	import type { ThemeMode } from '@fractaldesign/fractalsvelte-ui/theme';

	let mode = $state<ThemeMode>('light');
	let changes = $state(0);
</script>

<ThemeProvider {mode} class="column gap-sm pad-bs radius-md border">
	<div class="row ycenter xbetween">
		<p class="weight-600">Billing preview</p>
		<ModeToggle variant="segmented" size="sm" withSystem bind:value={mode} onValueChange={() => changes++} />
	</div>
	<p class="text-sm text-secondary tabular-nums">Only this card follows the toggle. Changed {changes} times.</p>
</ThemeProvider>
