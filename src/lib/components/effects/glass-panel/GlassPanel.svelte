<!-- @component A frosted surface that builds on the library glass treatment, with blur, tint, border and rim. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { vars } from '../../../motion/index.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** How strongly the panel frosts what sits behind it. */
		blur?: 'sm' | 'md' | 'lg';
		/** Mixes a little of the theme accent into the frost. */
		tint?: boolean;
		/** Draws a hairline around the panel. */
		border?: boolean;
		/** Lights the top edge of the panel. */
		rim?: boolean;
		/** The panel's content. */
		children?: Snippet;
	}

	let {
		blur = 'md',
		tint = false,
		border = true,
		rim = true,
		class: klass,
		children,
		...rest
	}: Props = $props();

	const blurValue = { sm: '0.5rem', md: '1rem', lg: '1.75rem' };
</script>

<div
	class={['glass', 'box', 'curved', 'pad-lg', 'gap-sm', tint && 'tinted', border && 'border', rim && 'rim', klass]}
	{@attach vars({ 'glass-blur': blurValue[blur] })}
	{...rest}
>
	{@render children?.()}
</div>
