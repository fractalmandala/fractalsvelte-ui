<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Size, Shape } from '../../types';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		size?: Size;
		shape?: Shape;
		limit?: number;
		excess?: number;
		class?: string;
		children?: Snippet;
		overflowSnippet?: Snippet<[{ count: number }]>;
	}

	let {
		size = 'md',
		shape = 'pill',
		limit,
		excess,
		class: className = '',
		children,
		overflowSnippet,
		...restProps
	}: Props = $props();
</script>

<div
	class="f-avatar-group {className}"
	data-size={size}
	data-shape={shape}
	{...restProps}
>
	{#if children}
		{@render children()}
	{/if}

	{#if excess && excess > 0}
		{#if overflowSnippet}
			{@render overflowSnippet({ count: excess })}
		{:else}
			<div class="f-avatar-group-excess" data-size={size} data-shape={shape}>
				+{excess}
			</div>
		{/if}
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-avatar-group {
			display: inline-flex;
			align-items: center;
			flex-direction: row;
			box-sizing: border-box;
		}

		/* Negative margin overlap and border separation */
		.f-avatar-group :global(.f-avatar) {
			box-shadow: 0 0 0 2px var(--f-surface);
			transition: transform var(--f-duration-fast) var(--f-ease),
				z-index var(--f-duration-fast) var(--f-ease);
		}

		.f-avatar-group :global(.f-avatar:hover) {
			transform: translateY(-2px);
			z-index: 10;
		}

		/* Overlap offsets per size */
		.f-avatar-group[data-size='xs'] :global(.f-avatar:not(:first-child)),
		.f-avatar-group[data-size='xs'] .f-avatar-group-excess {
			margin-left: -6px;
		}

		.f-avatar-group[data-size='sm'] :global(.f-avatar:not(:first-child)),
		.f-avatar-group[data-size='sm'] .f-avatar-group-excess {
			margin-left: -8px;
		}

		.f-avatar-group[data-size='md'] :global(.f-avatar:not(:first-child)),
		.f-avatar-group[data-size='md'] .f-avatar-group-excess {
			margin-left: -10px;
		}

		.f-avatar-group[data-size='lg'] :global(.f-avatar:not(:first-child)),
		.f-avatar-group[data-size='lg'] .f-avatar-group-excess {
			margin-left: -12px;
		}

		.f-avatar-group[data-size='xl'] :global(.f-avatar:not(:first-child)),
		.f-avatar-group[data-size='xl'] .f-avatar-group-excess {
			margin-left: -16px;
		}

		/* Overflow excess counter pill */
		.f-avatar-group-excess {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			background: var(--f-sunken);
			color: var(--f-text-muted);
			border: 1px solid var(--f-border);
			box-shadow: 0 0 0 2px var(--f-surface);
			box-sizing: border-box;
			font-family: inherit;
			font-weight: 600;
			line-height: 1;
			flex-shrink: 0;
			user-select: none;
			z-index: 5;
		}

		.f-avatar-group-excess[data-shape='pill'] {
			border-radius: var(--f-radius-full);
		}
		.f-avatar-group-excess[data-shape='rounded'] {
			border-radius: var(--f-radius-md);
		}
		.f-avatar-group-excess[data-shape='square'] {
			border-radius: 0;
		}

		.f-avatar-group-excess[data-size='xs'] {
			width: 24px;
			height: 24px;
			font-size: 10px;
		}
		.f-avatar-group-excess[data-size='sm'] {
			width: 32px;
			height: 32px;
			font-size: var(--f-text-xs);
		}
		.f-avatar-group-excess[data-size='md'] {
			width: 40px;
			height: 40px;
			font-size: var(--f-text-sm);
		}
		.f-avatar-group-excess[data-size='lg'] {
			width: 48px;
			height: 48px;
			font-size: var(--f-text-base);
		}
		.f-avatar-group-excess[data-size='xl'] {
			width: 60px;
			height: 60px;
			font-size: var(--f-text-xl);
		}
	}
</style>
