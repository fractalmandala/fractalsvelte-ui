<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Space } from '../../types';

	export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'fluid';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Max-width constraint breakpoint tier */
		size?: ContainerSize;
		/** Horizontal gutter padding token */
		gutter?: Space;
		/** Whether to auto-center horizontally */
		centered?: boolean;
		/** Additional CSS classes */
		class?: string;
		/** Contained children */
		children?: Snippet;
	}

	let {
		size = 'lg',
		gutter = 'lg',
		centered = true,
		class: className = '',
		children,
		...restProps
	}: Props = $props();
</script>

<div
	class="f-container {className}"
	data-size={size}
	data-gutter={gutter}
	data-centered={centered ? 'true' : 'false'}
	{...restProps}
>
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-container {
			width: 100%;
			box-sizing: border-box;
		}

		.f-container[data-centered='true'] {
			margin-inline: auto;
		}

		/* Max-widths */
		.f-container[data-size='sm'] {
			max-width: 640px;
		}
		.f-container[data-size='md'] {
			max-width: 768px;
		}
		.f-container[data-size='lg'] {
			max-width: 1024px;
		}
		.f-container[data-size='xl'] {
			max-width: 1280px;
		}
		.f-container[data-size='fluid'] {
			max-width: 100%;
		}

		/* Horizontal Gutters */
		.f-container[data-gutter='none'] {
			padding-inline: 0;
		}
		.f-container[data-gutter='3xs'] {
			padding-inline: var(--f-space-3xs);
		}
		.f-container[data-gutter='2xs'] {
			padding-inline: var(--f-space-2xs);
		}
		.f-container[data-gutter='xs'] {
			padding-inline: var(--f-space-xs);
		}
		.f-container[data-gutter='sm'] {
			padding-inline: var(--f-space-sm);
		}
		.f-container[data-gutter='md'] {
			padding-inline: var(--f-space-md);
		}
		.f-container[data-gutter='lg'] {
			padding-inline: var(--f-space-lg);
		}
		.f-container[data-gutter='xl'] {
			padding-inline: var(--f-space-xl);
		}
		.f-container[data-gutter='2xl'] {
			padding-inline: var(--f-space-2xl);
		}
	}
</style>
