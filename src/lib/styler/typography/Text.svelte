<!-- @component Body text with size, colour, weight and alignment props. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Weight, MessageText } from '../types';

	export type TextTag = 'p' | 'span' | 'div' | 'label' | 'small' | 'strong' | 'em';
	/** Body copy steps (line-height 1.5 built in) */
	export type BodySize = 'text-body-sm' | 'text-body' | 'text-body-lg';
	export type TextColor = 'text-primary' | 'text-secondary' | 'text-muted' | 'text-theme' | MessageText;
	export type TextAlign = 'ta-l' | 'ta-c' | 'ta-r';

	interface Props extends HTMLAttributes<HTMLElement> {
		as?: TextTag;
		size?: BodySize;
		color?: TextColor;
		weight?: Weight;
		align?: TextAlign;
		truncate?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		as = 'p',
		size = 'text-body',
		color = 'text-primary',
		weight,
		align,
		truncate = false,
		class: className = '',
		children,
		...restProps
	}: Props = $props();
</script>

<svelte:element
	this={as}
	class="{size} {color} {weight ?? ''} {align ?? ''} {truncate ? 'truncate' : ''} {className}"
	{...restProps}
>
	{@render children?.()}
</svelte:element>
