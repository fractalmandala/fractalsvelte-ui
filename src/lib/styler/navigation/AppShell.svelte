<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/**
		 * Below 1025px the left rail is hidden; `.open` on the shell brings it
		 * back as a fixed drawer. At ≥1025px it is always shown.
		 */
		sidebarOpen?: boolean;
		/** Clamp header and main to --content-clamp */
		clamped?: boolean;
		class?: string;
		header?: Snippet;
		/** Left rail (navigation). Receives the open state. */
		sidebar?: Snippet<[{ open: boolean }]>;
		/** Right rail (table of contents), shown at ≥1281px */
		aside?: Snippet;
		children?: Snippet;
		footer?: Snippet;
	}

	let {
		sidebarOpen = $bindable(false),
		clamped = false,
		class: className = '',
		header,
		sidebar,
		aside,
		children,
		footer,
		...restProps
	}: Props = $props();
</script>

<!-- fractalstyler's .app-shell canon, verbatim: header, main (rails + section), footer. -->
<div class="app-shell bg-main {sidebarOpen ? 'open' : ''} {className}" {...restProps}>
	{#if header}
		<header class="app-header {clamped ? 'clamped' : ''} gap-md bb bg-surface">
			{@render header()}
		</header>
	{/if}
	<div class="app-main {clamped ? 'clamped' : ''}">
		{#if sidebar}
			<aside class="sidebar-left br bg-surface pad-sm" aria-label="Application sidebar">
				{@render sidebar({ open: sidebarOpen })}
			</aside>
		{/if}
		<main class="main-section">
			{@render children?.()}
		</main>
		{#if aside}
			<aside class="sidebar-right pad-sm" aria-label="On this page">
				{@render aside()}
			</aside>
		{/if}
	</div>
	{#if footer}
		<footer class="app-footer bt bg-surface text-sm text-muted">
			{@render footer()}
		</footer>
	{/if}
</div>
