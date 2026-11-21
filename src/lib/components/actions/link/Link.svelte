<!-- @component A text link with three inks and a quiet, fading underline. -->

<script lang="ts">
	import type {  ComponentProps, Snippet  } from 'svelte';
	import type {  HTMLAnchorAttributes  } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luArrowUpRight } from '@fractaldesign/icons/lucide';
	import type {  TextColor, TextSize  } from '../../../internal/tokens.js';

	interface Props extends HTMLAnchorAttributes {
		href: string;
		external?: boolean;
		
		underline?: 'hover' | 'always' | 'none';
		textSize?: TextSize;
		textColor?: TextColor;
		iconProps?: Partial<ComponentProps<typeof Icon>>;
		children?: Snippet;
	}

	let {
		href,
		external = false,
		underline = 'hover',
		textSize,
		textColor,
		target,
		rel,
		iconProps,
		class: className,
		children,
		...rest
	}: Props = $props();

	const variants = { theme: 'link', plain: 'link-plain', subtle: 'link-subtle' } as const;
	const resolvedTextColor = $derived(textColor);
</script>

<a
	class={['inline-flex ycenter', 'link', underline !== 'none' && ['underline', underline], textSize, 'focus-ring', className]}
	{href}
	target={external ? '_blank' : target}
	rel={external ? 'noopener noreferrer' : rel}
	{...rest}
>
	{@render children?.()}{#if external}<Icon icon={luArrowUpRight} size="0.85em" {...iconProps} class={['ml-xs', iconProps?.class]} /><span class="sr-only"> (opens in a new tab)</span>{/if}
</a>
