<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Whether the sidebar is currently in its collapsed mini-state */
		sidebarCollapsed?: boolean;
		/** Expanded width of the sidebar (e.g. '260px') */
		sidebarWidth?: string;
		/** Collapsed mini-width of the sidebar (e.g. '64px') */
		collapsedWidth?: string;
		/** Whether the header is fixed/sticky at the top of the viewport */
		headerSticky?: boolean;
		/** Default height of the header slot (e.g. '64px') */
		headerHeight?: string;
		/** Additional CSS classes */
		class?: string;
		/** Header section snippet */
		header?: Snippet;
		/** Sidebar section snippet, receiving the collapsed state */
		sidebar?: Snippet<[{ collapsed: boolean }]>;
		/** Main content area snippet */
		children?: Snippet;
		/** Footer section snippet */
		footer?: Snippet;
	}

	let {
		sidebarCollapsed = $bindable(false),
		sidebarWidth = '260px',
		collapsedWidth = '64px',
		headerSticky = true,
		headerHeight = '64px',
		class: className = '',
		header,
		sidebar,
		children,
		footer,
		...restProps
	}: Props = $props();

	const activeSidebarWidth = $derived(sidebarCollapsed ? collapsedWidth : sidebarWidth);
</script>

<div
	class="f-app-shell {className}"
	data-sidebar-collapsed={sidebarCollapsed}
	data-header-sticky={headerSticky}
	style="--app-sidebar-width: {activeSidebarWidth}; --app-header-height: {header ? headerHeight : '0px'};"
	{...restProps}
>
	{#if header}
		<div class="f-shell-header-wrapper" class:is-sticky={headerSticky}>
			{@render header()}
		</div>
	{/if}

	<div class="f-shell-body">
		{#if sidebar}
			<aside class="f-shell-sidebar" aria-label="Application sidebar">
				{@render sidebar({ collapsed: sidebarCollapsed })}
			</aside>
		{/if}

		<div class="f-shell-main-wrapper">
			<main class="f-shell-content">
				{#if children}
					{@render children()}
				{/if}
			</main>

			{#if footer}
				<footer class="f-shell-footer">
					{@render footer()}
				</footer>
			{/if}
		</div>
	</div>
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-app-shell {
			display: flex;
			flex-direction: column;
			min-height: 100vh;
			background: var(--f-bg);
			color: var(--f-text);
			box-sizing: border-box;
		}

		.f-shell-header-wrapper {
			width: 100%;
			height: var(--app-header-height);
			flex-shrink: 0;
		}

		.f-shell-header-wrapper.is-sticky {
			position: sticky;
			top: 0;
			z-index: 40;
		}

		.f-shell-body {
			display: flex;
			flex: 1;
			min-height: 0;
			width: 100%;
			position: relative;
		}

		.f-shell-sidebar {
			width: var(--app-sidebar-width);
			flex-shrink: 0;
			box-sizing: border-box;
			border-right: 1px solid var(--f-border);
			background: var(--f-panel);
			overflow-y: auto;
			overflow-x: hidden;
			transition: width var(--f-duration-normal) var(--f-ease);
			position: sticky;
			top: var(--app-header-height, 0);
			height: calc(100vh - var(--app-header-height, 0));
		}

		.f-shell-main-wrapper {
			flex: 1;
			display: flex;
			flex-direction: column;
			min-width: 0;
			overflow-y: auto;
		}

		.f-shell-content {
			flex: 1;
			min-width: 0;
			display: flex;
			flex-direction: column;
		}

		.f-shell-footer {
			border-top: 1px solid var(--f-border);
			background: var(--f-surface);
			flex-shrink: 0;
		}
	}
</style>
