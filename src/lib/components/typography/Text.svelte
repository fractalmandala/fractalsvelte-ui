<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Size } from '../../types';

	export type TextVariant =
		| 'body'
		| 'lead'
		| 'muted'
		| 'subtle'
		| 'code'
		| 'caption'
		| 'bold';

	export type TextTag =
		| 'p'
		| 'span'
		| 'div'
		| 'label'
		| 'small'
		| 'strong'
		| 'em';

	export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
	export type TextAlign = 'left' | 'center' | 'right' | 'justify';

	interface Props extends HTMLAttributes<HTMLElement> {
		variant?: TextVariant;
		as?: TextTag;
		size?: Size;
		weight?: TextWeight;
		align?: TextAlign;
		truncate?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		variant = 'body',
		as,
		size,
		weight,
		align,
		truncate = false,
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	const tag = $derived<TextTag>(as ?? (variant === 'caption' ? 'small' : 'p'));
</script>

<svelte:element
	this={tag}
	class="f-text {className}"
	data-variant={variant}
	data-size={size}
	data-weight={weight}
	data-align={align}
	data-truncate={truncate ? '' : undefined}
	{...restProps}
>
	{#if children}
		{@render children()}
	{/if}
</svelte:element>

<style>
	@layer fractalsvelte-ui.components {
		.f-text {
			margin: 0;
			font-family: inherit;
			box-sizing: border-box;
			line-height: 1.6;
		}

		/* Variants */
		.f-text[data-variant='body'] {
			font-size: var(--f-text-base);
			color: var(--f-text);
		}

		.f-text[data-variant='lead'] {
			font-size: var(--f-text-lg);
			color: var(--f-text);
			line-height: 1.6;
		}

		.f-text[data-variant='muted'] {
			font-size: var(--f-text-sm);
			color: var(--f-text-muted);
		}

		.f-text[data-variant='subtle'] {
			font-size: var(--f-text-sm);
			color: var(--f-text-subtle);
		}

		.f-text[data-variant='code'] {
			font-family: var(--f-font-mono);
			font-size: 0.9em;
			color: var(--f-text);
		}

		.f-text[data-variant='caption'] {
			font-size: var(--f-text-xs);
			color: var(--f-text-muted);
			line-height: 1.4;
		}

		.f-text[data-variant='bold'] {
			font-size: var(--f-text-base);
			font-weight: 700;
			color: var(--f-text);
		}

		/* Sizes */
		.f-text[data-size='xs'] {
			font-size: var(--f-text-xs);
		}
		.f-text[data-size='sm'] {
			font-size: var(--f-text-sm);
		}
		.f-text[data-size='md'] {
			font-size: var(--f-text-base);
		}
		.f-text[data-size='lg'] {
			font-size: var(--f-text-lg);
		}
		.f-text[data-size='xl'] {
			font-size: var(--f-text-xl);
		}

		/* Weights */
		.f-text[data-weight='normal'] {
			font-weight: 400;
		}
		.f-text[data-weight='medium'] {
			font-weight: 500;
		}
		.f-text[data-weight='semibold'] {
			font-weight: 600;
		}
		.f-text[data-weight='bold'] {
			font-weight: 700;
		}

		/* Align */
		.f-text[data-align='left'] {
			text-align: left;
		}
		.f-text[data-align='center'] {
			text-align: center;
		}
		.f-text[data-align='right'] {
			text-align: right;
		}
		.f-text[data-align='justify'] {
			text-align: justify;
		}

		/* Truncate */
		.f-text[data-truncate] {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
</style>
