<script lang="ts">
	import '@fractaldesign/fractalstyler/styles';
	import '@fractaldesign/fractalsvelte-ui/styles';
	import '../docs-site/docs.css';
	import type { Snippet } from 'svelte';
	import { onNavigate } from '$app/navigation';
	import { initTheme, themeInitScript } from '@fractaldesign/fractalsvelte-ui/theme';
	import { setupViewTransitions } from '@fractaldesign/fractalsvelte-ui/motion';
	import SiteHeader from '../docs-site/SiteHeader.svelte';
	import { shell } from '../docs-site/shell.svelte.js';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	initTheme({ defaults: { mode: 'dark' } });
	setupViewTransitions(onNavigate, {
		type: (nav) => (nav.type === 'popstate' && (nav.delta ?? 0) < 0 ? 'slide-back' : 'fade')
	});

	const bootScript = `<script>${themeInitScript()}</` + 'script>';
</script>

<svelte:head>
	<!-- applies the stored mode and theme before first paint -->
	{@html bootScript}
</svelte:head>

<div class={['app-shell', shell.open && 'open']}>
	<SiteHeader />
	<main id="main" class="app-main">
		{@render children()}
	</main>
	<footer class="app-footer">
		<span>fractalsvelte-ui · MIT</span>
		<span>Styled with fractalstyler</span>
	</footer>
</div>
