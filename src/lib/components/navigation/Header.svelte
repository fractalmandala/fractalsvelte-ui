<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface Props extends HTMLAttributes<HTMLElement> {
		/** Whether the header sticks to the top of the viewport during scrolling */
		sticky?: boolean;
		/** Whether to render a bottom border */
		bordered?: boolean;
		/** Fixed height of the header (e.g. '64px') */
		height?: string;
		/** Additional CSS classes */
		class?: string;
		/** Brand / Logo section slot on the far left */
		brand?: Snippet;
		/** Central section slot for global search or navigation */
		center?: Snippet;
		/** Trailing actions slot for user controls or status indicators */
		actions?: Snippet;
		/** Default fallback slot */
		children?: Snippet;
	}

	let {
		sticky = true,
		bordered = true,
		height = '64px',
		class: className = '',
		brand,
		center,
		actions,
		children,
		...restProps
	}: Props = $props();
</script>

<header
	class="f-header {className}"
	data-sticky={sticky}
	data-bordered={bordered}
	style="--header-height: {height};"
	{...restProps}
>
	{#if brand}
		<div class="f-header-brand">
			{@render brand()}
		</div>
	{/if}

	{#if center}
		<div class="f-header-center">
			{@render center()}
		</div>
	{/if}

	{#if actions}
		<div class="f-header-actions">
			{@render actions()}
		</div>
	{/if}

	{#if children && !brand && !center && !actions}
		{@render children()}
	{/if}
</header>

<style>
	@layer fractalsvelte-ui.components {
		.f-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: var(--header-height, 64px);
			padding: 0 var(--f-space-lg);
			background: var(--f-surface);
			color: var(--f-text);
			gap: var(--f-space-md);
			box-sizing: border-box;
			transition: background var(--f-duration-fast) var(--f-ease),
				border-color var(--f-duration-fast) var(--f-ease);
		}

		.f-header[data-sticky='true'] {
			position: sticky;
			top: 0;
			z-index: 50;
			backdrop-filter: blur(12px);
			-webkit-backdrop-filter: blur(12px);
		}

		.f-header[data-bordered='true'] {
			border-bottom: 1px solid var(--f-border);
		}

		.f-header-brand {
			display: flex;
			align-items: center;
			gap: var(--f-space-sm);
			flex-shrink: 0;
		}

		.f-header-center {
			display: flex;
			align-items: center;
			justify-content: center;
			flex: 1;
			min-width: 0;
		}

		.f-header-actions {
			display: flex;
			align-items: center;
			gap: var(--f-space-xs);
			flex-shrink: 0;
		}
	}
</style>
