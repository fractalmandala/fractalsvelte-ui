<!-- @component A text link with three inks and a quiet, fading underline. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luArrowUpRight } from '@fractaldesign/icons/lucide';

	interface Props extends HTMLAnchorAttributes {
		/** Where the link goes. */
		href: string;
		/** Marks the link as leaving the site: opens it in a new tab with a safe `rel`, adds an arrow icon and a screen-reader hint. */
		external?: boolean;
		/** The ink. `theme` is the accent colour, `plain` is the body ink that warms to the accent on hover, `subtle` is secondary ink that darkens on hover. */
		variant?: 'theme' | 'plain' | 'subtle';
		/** When the underline shows. */
		underline?: 'hover' | 'always' | 'none';
		/** The link text. */
		children?: Snippet;
	}

	let {
		href,
		external = false,
		variant = 'theme',
		underline = 'hover',
		target,
		rel,
		class: klass,
		children,
		...rest
	}: Props = $props();

	const variants = { theme: 'link', plain: 'link-plain', subtle: 'link-subtle' } as const;
</script>

<a
	class={[variants[variant], underline !== 'none' && ['underline', underline], 'focus-ring', klass]}
	{href}
	target={external ? '_blank' : target}
	rel={external ? 'noopener noreferrer' : rel}
	{...rest}
>
	{@render children?.()}{#if external}<Icon icon={luArrowUpRight} size="0.85em" class="ml-xs" /><span class="sr-only"> (opens in a new tab)</span>{/if}
</a>
