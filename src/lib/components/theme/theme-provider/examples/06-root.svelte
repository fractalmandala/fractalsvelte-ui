<!-- @example Root :: The root layout wraps the app once; it restores, persists and applies the theme to the document. -->
<script lang="ts">
	import { ThemeProvider } from '@fractaldesign/fractalsvelte-ui';
</script>

<!-- In src/routes/+layout.svelte: root also inlines themeInitScript(), so there is no flash. -->
<ThemeProvider root storageKey="fractalsvelte-ui-theme">
	<div class="column gap-xs pad-bs radius-md border bg-surface">
		<p class="weight-600">Root layout</p>
		<p class="text-sm text-secondary">This page's theme is already managed by a root provider, so this one only re-confirms it.</p>
	</div>
</ThemeProvider>
