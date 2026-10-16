<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { WEIGHT, type FsWeight } from '../classes';

	export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
	export type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div';
	/** fractalstyler's heading roles, largest first */
	export type HeadingSize = 'display' | 'title' | 'xl' | 'lg' | 'bs' | 'md' | 'sm';
	export type HeadingTracking = 'tight' | 'normal' | 'wide';

	interface Props extends HTMLAttributes<HTMLHeadingElement> {
		level?: HeadingLevel;
		as?: HeadingTag;
		size?: HeadingSize;
		tracking?: HeadingTracking;
		weight?: FsWeight;
		class?: string;
		children?: Snippet;
	}

	let {
		level = 1,
		as,
		size,
		tracking = 'normal',
		weight,
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	// The semantic composites carry size, weight, line-height and tracking
	// together (.page-title, .page-heading-*); the two small steps compose.
	const SIZE_CLASSES: Record<HeadingSize, string> = {
		display: 'hero-name lh11',
		title: 'page-title',
		xl: 'page-heading-xl',
		lg: 'page-heading-lg',
		bs: 'page-heading-bs',
		md: 'text-md weight-600 lh12',
		sm: 'text-sm weight-600 lh12 tt-u ls-wide-lg'
	};
	const TRACKING_CLASSES: Record<HeadingTracking, string> = {
		tight: 'ls-tight-lg',
		normal: '',
		wide: 'ls-wide-lg'
	};
	const BY_LEVEL: Record<HeadingLevel, HeadingSize> = { 1: 'title', 2: 'xl', 3: 'lg', 4: 'bs', 5: 'md', 6: 'sm' };

	const tag = $derived<HeadingTag>(as ?? (`h${level}` as HeadingTag));
	const sizeKey = $derived(size ?? BY_LEVEL[level]);
</script>

<svelte:element
	this={tag}
	class="{SIZE_CLASSES[sizeKey]} {TRACKING_CLASSES[tracking]} {weight ? WEIGHT[weight] : ''} {className}"
	{...restProps}
>
	{@render children?.()}
</svelte:element>
