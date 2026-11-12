<!-- @example Elements :: The wrapper renders as a div, section, article or aside. -->
<script lang="ts">
	import { ThemeProvider } from '@fractaldesign/fractalsvelte-ui';

	const tags = ['div', 'section', 'article', 'aside'] as const;
</script>

<div class="grid grid-2 gap-sm">
	{#each tags as tag (tag)}
		<ThemeProvider as={tag} theme="rose" mode="light" class="pad-bs radius-md border">
			<p class="text-sm">Rendered as a <code class="font-mono">&lt;{tag}&gt;</code></p>
		</ThemeProvider>
	{/each}
</div>
