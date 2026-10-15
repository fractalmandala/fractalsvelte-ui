<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type KbdSize = 'xs' | 'sm' | 'md';
	export type KbdVariant = 'default' | 'outline' | 'subtle';

	interface Props extends HTMLAttributes<HTMLElement> {
		size?: KbdSize;
		variant?: KbdVariant;
		class?: string;
		children?: Snippet;
	}

	let {
		size = 'sm',
		variant = 'default',
		class: className = '',
		children,
		...restProps
	}: Props = $props();
</script>

<kbd
	class="f-kbd {className}"
	data-size={size}
	data-variant={variant}
	{...restProps}
>
	{#if children}
		{@render children()}
	{/if}
</kbd>

<style>
	@layer fractalsvelte-ui.components {
		.f-kbd {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			font-family: var(--f-font-mono);
			font-weight: 500;
			line-height: 1;
			color: var(--f-text);
			border-radius: var(--f-radius-sm);
			user-select: none;
			vertical-align: baseline;
			box-sizing: border-box;
			white-space: nowrap;
		}

		/* Sizes */
		.f-kbd[data-size='xs'] {
			font-size: 0.6875rem;
			height: 18px;
			min-width: 18px;
			padding: 0 4px;
		}

		.f-kbd[data-size='sm'] {
			font-size: var(--f-text-xs);
			height: 22px;
			min-width: 22px;
			padding: 0 6px;
		}

		.f-kbd[data-size='md'] {
			font-size: var(--f-text-sm);
			height: 26px;
			min-width: 26px;
			padding: 0 8px;
		}

		/* Variants */
		.f-kbd[data-variant='default'] {
			background: var(--f-surface);
			border: 1px solid var(--f-border);
			border-bottom: 2px solid var(--f-border-strong);
			box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.6);
		}

		:global([data-theme='dark']) .f-kbd[data-variant='default'] {
			background: var(--f-raised);
			border-color: var(--f-border);
			border-bottom-color: var(--f-border-strong);
			box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08);
		}

		.f-kbd[data-variant='outline'] {
			background: transparent;
			border: 1px solid var(--f-border-strong);
		}

		.f-kbd[data-variant='subtle'] {
			background: var(--f-sunken);
			border: 1px solid transparent;
			color: var(--f-text-muted);
		}
	}
</style>
