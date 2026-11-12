<script lang="ts">
	import type { Snippet } from 'svelte';
	import Sidebar from './Sidebar.svelte';
	import { shell } from './shell.svelte.js';

	interface Props {
		/** The page. */
		children: Snippet;
	}

	let { children }: Props = $props();

	$effect(() => {
		shell.hasSidebar = true;
		return () => {
			shell.hasSidebar = false;
			shell.open = false;
		};
	});
</script>

<div class="app-main">
	<aside class="sidebar-left br-sub scroll-thin z-modal">
		<Sidebar onnavigate={() => (shell.open = false)} />
	</aside>
	{#if shell.open}
		<button type="button" class="drawer-scrim bare lg-hide z-sticky" aria-label="Close navigation" onclick={() => (shell.open = false)}></button>
	{/if}
	{@render children()}
</div>
