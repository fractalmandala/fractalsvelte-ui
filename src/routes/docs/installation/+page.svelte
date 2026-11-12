<script lang="ts">
	import CodeBlock from '../../../docs-site/CodeBlock.svelte';
	import DocPage from '../../../docs-site/DocPage.svelte';
	import GuideFooter from '../../../docs-site/GuideFooter.svelte';
	import InstallTabs from '../../../docs-site/InstallTabs.svelte';
	import Rich from '../../../docs-site/Rich.svelte';
	import Section from '../../../docs-site/Section.svelte';

	const toc = [
		{ id: 'install', label: 'Install' },
		{ id: 'styles', label: 'Import the styles' },
		{ id: 'html', label: 'Mode and theme' },
		{ id: 'runtime', label: 'The theme runtime' },
		{ id: 'first', label: 'Your first component' }
	];

	const styles = `<script lang="ts">
	import '@fractaldesign/fractalstyler/styles';
	import '@fractaldesign/fractalsvelte-ui/styles';

	let { children } = $props();
</` + `script>

{@render children()}`;

	const html = `<!doctype html>
<html lang="en" data-mode="dark" data-theme="fractalsvelte">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		%sveltekit.head%
	</head>
	<body>
		%sveltekit.body%
	</body>
</html>`;

	const runtime = `<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { initTheme } from '@fractaldesign/fractalsvelte-ui/theme';
	import { setupViewTransitions } from '@fractaldesign/fractalsvelte-ui/motion';

	initTheme();                          // restores, follows the OS, persists
	setupViewTransitions(onNavigate);     // page transitions on every navigation
</` + `script>`;

	const first = `<script lang="ts">
	import { Button } from '@fractaldesign/fractalsvelte-ui';
	import { theme } from '@fractaldesign/fractalsvelte-ui/theme';
</` + `script>

<Button variant="themed" onclick={(e) => theme.toggleMode(e)}>
	Toggle the lights
</Button>`;
</script>

<DocPage title="Installation" eyebrow="Getting started" lead="Install the library and fractalstyler, import the two stylesheets once, and set the mode and theme on `<html>`." {toc}>
	<Section id="install" title="Install">
		<p class="text-body text-secondary lh16">
			<Rich text="fractalsvelte-ui is styled by fractalstyler, a peer dependency. Install both:" />
		</p>
		<InstallTabs />
	</Section>

	<Section id="styles" title="Import the styles">
		<p class="text-body text-secondary lh16">
			<Rich text="Import fractalstyler first, then fractalsvelte-ui's extension layer, once, in your root layout. Order matters: the extension layer builds on fractalstyler's tokens." />
		</p>
		<CodeBlock code={styles} title="src/routes/+layout.svelte" />
	</Section>

	<Section id="html" title="Mode and theme">
		<p class="text-body text-secondary lh16">
			<Rich text="Colours resolve from two attributes on `<html>`: `data-mode` (`light` or `dark`) and `data-theme` (a named theme such as `fractalsvelte`, `aurora` or `ember`). Set defaults in `app.html` so the first paint is already right." />
		</p>
		<CodeBlock code={html} lang="html" title="src/app.html" />
	</Section>

	<Section id="runtime" title="The theme runtime">
		<p class="text-body text-secondary lh16">
			<Rich text="`initTheme()` makes the settings live: it restores what the visitor chose, follows the operating system when the mode is `system`, and persists changes. `setupViewTransitions(onNavigate)` animates every navigation." />
		</p>
		<CodeBlock code={runtime} title="src/routes/+layout.svelte" />
	</Section>

	<Section id="first" title="Your first component">
		<p class="text-body text-secondary lh16">
			<Rich text="Every component, attachment and helper is a named export of `@fractaldesign/fractalsvelte-ui`; motion and theme also have their own entry points." />
		</p>
		<CodeBlock code={first} title="src/routes/+page.svelte" />
	</Section>

	{#snippet footer()}<GuideFooter href="/docs/installation" />{/snippet}
</DocPage>
