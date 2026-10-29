<script lang="ts">
	import { page } from '$app/state';
 	import { browser, dev } from '$app/env';
	import type { Snippet } from 'svelte';
	import '@fractaldesign/fractalstyler/css'
	import '$lib/styles/globals.sass'
	import '$lib/styles/comps-documentation.sass'
	import manifest from '$lib/documentation/manifest.styler.json';
	import { modeScript, mode } from '#lib/mode/mode.svelte.js'
	import ModeToggle from '#lib/mode/ModeToggle.svelte';
  import {
    Agentation,
    type AnnotationProps,
    type KeyBindings
  } from 'sv-agentation';

	interface Props {
		children?: Snippet;
		headerSnippet?: Snippet;
	}

	let { children, headerSnippet }: Props = $props();
	const store = mode();
	const dark = $derived(store.resolved === 'dark');
	const categories = [
		{ id: 'actions', name: 'Actions & Buttons', icon: '⚡' },
		{ id: 'forms', name: 'Forms & Inputs', icon: '📝' },
		{ id: 'display', name: 'Data Display', icon: '📊' },
		{ id: 'layout', name: 'Layout & Bento', icon: '📐' },
		{ id: 'navigation', name: 'Navigation & Shells', icon: '🧭' },
		{ id: 'overlays', name: 'Overlays & Dialogs', icon: '🪟' },
		{ id: 'typography', name: 'Typography & Code', icon: '✍️' },
		{ id: 'motion', name: 'Motion & Animations', icon: '✨' },
		{ id: 'blocks', name: 'UI Blocks & Diagrams', icon: '🧩' }
	];
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
    reset: 'Alt+R',
    open: 'Alt+O',
    delete: 'Alt+D',
		copy: 'c',
		cancel: 'esc',
  };

  let playgroundAnnotationProps: AnnotationProps = {
    toolbarPosition: 'bottom-right',
    outputMode: 'forensic',
    pauseAnimations: true,
    clearOnCopy: false,
    includeComponentContext: true,
    includeComputedStyles: true,
		keyBindings
  };

</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- modeScript() returns static, self-contained code -->
	{@html `<script>${modeScript({ attribute: 'data-mode' })}<\x2fscript>`}
</svelte:head>

{#if browser && dev}
  <Agentation {...playgroundAnnotationProps} />
{/if}
<div class="app-shell bg-main">
	<header class="app-header xbetween ycenter row">
		<a class="logo-link row ycenter gap-bs" href="/">
			{#if dark}
			<img src="/images/fractalsvelte-l.png" alt="logotype" class="logotype"/>
			{:else}
			<img src="/images/fractalsvelte-d.png" alt="logotype" class="logotype"/>
			{/if}
		</a>
		<div class="row ycenter gap-bs grow">
			{@render headerSnippet?.()}
		</div>
		<nav class="header-nav ycenter row gap-bs">
			<a href="/">link</a>
			<a href="/designer">Design</a>
			<a href="/components">components</a>
			<ModeToggle/>
		</nav>
	</header>
	<main class="app-main">
		{@render children?.()}
	</main>
	<footer class="app-footer">
		<span class="text-xs">2026</span>
	</footer>
</div>
