<!-- @component A frosted surface that builds on the library glass treatment, with blur, tint and an optional solid fallback. -->

<script lang="ts">
	import type { Gap, Pad, Shape, Space, Surface } from '../../../internal/tokens.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { vars } from '../../../motion/index.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		blur?: Space;
		tint?: boolean;
		surface?: Surface;
		shape?: Shape;
		pad?: Pad;
		gap?: Gap;
		children?: Snippet;
	}

	let {
		blur = 'md',
		tint = false,
		surface = 'glass',
		shape = 'curved',
		pad = 'pad-lg',
		gap = 'gap-sm',
		class: className,
		children,
		...rest
	}: Props = $props();

	const blurValue: Partial<Record<Space, string>> = { sm: '0.5rem', md: '1rem', lg: '1.75rem' };
</script>

<div
	class={['box', surface, shape, pad, gap, tint && 'tinted', className]}
	{@attach vars({ 'glass-blur': (blurValue[blur] ?? blurValue.md) })}
	{...rest}
>
	{@render children?.()}
</div>
