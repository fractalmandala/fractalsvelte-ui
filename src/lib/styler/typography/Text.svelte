<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { WEIGHT, type FsWeight } from '../classes';

	export type TextVariant = 'body' | 'lead' | 'muted' | 'subtle' | 'code' | 'caption' | 'bold';
	export type TextTag = 'p' | 'span' | 'div' | 'label' | 'small' | 'strong' | 'em';
	/** Body copy steps: .text-body-sm / .text-body / .text-body-lg */
	export type TextSize = 'sm' | 'md' | 'lg';
	export type TextAlign = 'left' | 'center' | 'right';

	interface Props extends HTMLAttributes<HTMLElement> {
		variant?: TextVariant;
		as?: TextTag;
		size?: TextSize;
		weight?: FsWeight;
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

	// Each variant pairs a body-copy step (line-height 1.5 built in) with ink.
	const VARIANT_CLASSES: Record<TextVariant, string> = {
		body: 'text-body text-primary',
		lead: 'text-body-lg text-secondary',
		muted: 'text-body-sm text-muted',
		subtle: 'text-body text-secondary',
		code: 'text-body-sm mono',
		caption: 'text-body-sm text-muted',
		bold: 'text-body weight-700'
	};
	const SIZE_CLASSES: Record<TextSize, string> = { sm: 'text-body-sm', md: 'text-body', lg: 'text-body-lg' };
	const ALIGN_CLASSES: Record<TextAlign, string> = { left: 'ta-l', center: 'ta-c', right: 'ta-r' };

	const tag = $derived<TextTag>(as ?? (variant === 'caption' ? 'small' : 'p'));
</script>

<svelte:element
	this={tag}
	class="{VARIANT_CLASSES[variant]} {size ? SIZE_CLASSES[size] : ''} {weight ? WEIGHT[weight] : ''} {align
		? ALIGN_CLASSES[align]
		: ''} {truncate ? 'truncate' : ''} {className}"
	{...restProps}
>
	{@render children?.()}
</svelte:element>
