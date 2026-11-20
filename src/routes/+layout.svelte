<script lang="ts">
	import '@fractaldesign/fractalstyler/styles';
	import '@fractaldesign/fractalsvelte-ui/styles';
	import '../docs-site/docs.css';
	import '../lib/styles/custom.sass'
	import type { Snippet } from 'svelte';
	import { onNavigate } from '$app/navigation';
	import { initTheme, themeInitScript } from '@fractaldesign/fractalsvelte-ui/theme';
	import { setupViewTransitions } from '@fractaldesign/fractalsvelte-ui/motion';
	import SiteHeader from '../docs-site/SiteHeader.svelte';
	import { shell } from '../docs-site/shell.svelte.js';
	import { browser, dev } from '$app/env'
	  import {
    Agentation,
    type AnnotationProps,
    type KeyBindings
  } from 'sv-agentation';

  const keyBindings: KeyBindings = {
    // Defaults:
    // inspect: 'i',
    // copy: 'c',
    // reset: 'r',
    // open: 'o',
    // delete: 'd',
    // cancel: 'esc',
    // submit: 'enter',
    inspect: 'Alt+I',
    copy: 'Alt+C',
    reset: 'Alt+R',
    open: 'Alt+O',
    delete: 'Alt+D'
  };

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	initTheme({ defaults: { mode: 'dark' } });
	setupViewTransitions(onNavigate, {
		type: (nav) => (nav.type === 'popstate' && (nav.delta ?? 0) < 0 ? 'slide-back' : 'fade')
	});

	const bootScript = `<script>${themeInitScript()}</` + 'script>';

  let playgroundAnnotationProps: AnnotationProps = {
    toolbarPosition: 'bottom-right',
    outputMode: 'forensic',
    pauseAnimations: true,
    clearOnCopy: true,
    includeComponentContext: true,
    includeComputedStyles: true,
    keyBindings
  };
</script>

<svelte:head>
	{@html bootScript}
</svelte:head>

{#if browser && dev}
  <Agentation {...playgroundAnnotationProps} />
{/if}

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
