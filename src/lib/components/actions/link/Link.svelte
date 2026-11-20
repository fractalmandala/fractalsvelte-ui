<!-- @component A text link with three inks and a quiet, fading underline. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luArrowUpRight } from '@fractaldesign/icons/lucide';
	import type { TextColor, TextSize } from '../../../internal/tokens.js';

	interface Props extends HTMLAnchorAttributes {
		href: string;
		external?: boolean;
		look?: 'theme' | 'plain' | 'subtle';
		underline?: 'hover' | 'always' | 'none';
		textSize?: TextSize;
		textColor?: TextColor;
		children?: Snippet;
	}

	let {
		href,
		external = false,
		look = 'theme',
		underline = 'hover',
		textSize,
		textColor,
		target,
		rel,
		class: className,
		children,
		...rest
	}: Props = $props();

	const variants = { theme: 'link', plain: 'link-plain', subtle: 'link-subtle' } as const;
	const resolvedTextColor = $derived(
		textColor ?? (look === 'subtle' ? 'text-secondary' : look === 'plain' ? 'text-primary' : undefined)
	);
</script>

<a
	class={['inline-flex ycenter', variants[look], underline !== 'none' && ['underline', underline], textSize, resolvedTextColor, 'focus-ring', className]}
	{href}
	target={external ? '_blank' : target}
	rel={external ? 'noopener noreferrer' : rel}
	{...rest}
>
	{@render children?.()}{#if external}<Icon icon={luArrowUpRight} size="0.85em" class="ml-xs" /><span class="sr-only"> (opens in a new tab)</span>{/if}
</a>
