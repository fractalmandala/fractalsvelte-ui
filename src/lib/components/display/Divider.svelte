<!-- @component Horizontal or vertical divider separator rule with optional centered label. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { Border, TextSize } from '$lib/types.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Optional text label centered along the divider line. */
		label?: string;
		/** Vertical orientation instead of default horizontal. */
		vertical?: boolean;
		border?: Border;
		textsize?: TextSize;
		class?: string;
		children?: Snippet;
	}

	let {
		label,
		vertical = false,
		border = 'border',
		textsize = 'text-sm',
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	const hasLabel = $derived(Boolean(label || children));
</script>

<div
	role="separator"
	aria-orientation={vertical ? 'vertical' : 'horizontal'}
	class="divider-root {vertical ? 'vertical' : 'horizontal'} {hasLabel ? 'has-label' : ''} {border} {textsize} {className}"
	{...restProps}
>
	{#if hasLabel && !vertical}
		<span class="divider-text text-secondary font-medium">
			{#if children}
				{@render children()}
			{:else}
				{label}
			{/if}
		</span>
	{/if}
</div>

<style>
	.divider-root.horizontal {
		width: 100%;
		height: 1px;
		background: var(--border, #e5e7eb);
		border: none;
		margin: 0.5rem 0;
	}

	.divider-root.vertical {
		width: 1px;
		height: 100%;
		min-height: 1rem;
		align-self: stretch;
		background: var(--border, #e5e7eb);
		border: none;
		margin: 0 0.5rem;
	}

	.divider-root.has-label {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		height: auto;
		background: transparent;
	}

	.divider-root.has-label::before,
	.divider-root.has-label::after {
		content: '';
		flex: 1;
		height: 1px;
		background: var(--border, #e5e7eb);
	}

	.divider-text {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		white-space: nowrap;
	}
</style>
