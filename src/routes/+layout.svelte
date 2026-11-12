<script lang="ts">
	import '@fractaldesign/fractalstyler/styles';
	import '@fractaldesign/fractalsvelte-ui/styles';
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
	<a href="#main" class="sr-only">Skip to content</a>
	<SiteHeader />
	<div id="main" class="box grow">
		{@render children()}
	</div>
</div>
