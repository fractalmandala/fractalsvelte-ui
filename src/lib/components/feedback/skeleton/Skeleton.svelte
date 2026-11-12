<!-- @component A placeholder for content that has not loaded yet, shaped as text, a circle or a rectangle. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { SpringValue, vars } from '../../../motion/index.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** The placeholder shape: lines of text, a circle, or a rectangle. */
		variant?: 'text' | 'circle' | 'rect';
		/** How many lines to draw when `variant` is `text`. */
		lines?: number;
		/** The loading animation. `none` is a still placeholder. */
		animate?: 'shimmer' | 'pulse' | 'none';
		/** Cross-fades from the placeholder to `children` when true. */
		loaded?: boolean;
		/** The real content, revealed when `loaded` is true. */
		children?: Snippet;
	}

	let {
		variant = 'text',
		lines = 3,
		animate = 'shimmer',
		loaded = false,
		children,
		class: klass,
		...rest
	}: Props = $props();

	const fade = new SpringValue(0, 'snappy');

	$effect(() => {
		void fade.set(loaded ? 1 : 0);
	});

	const motion = $derived(animate === 'shimmer' ? 'anim-shimmer' : animate === 'pulse' ? 'anim-pulse' : '');
	const count = $derived(variant === 'text' ? Math.max(1, Math.round(lines)) : 1);
</script>

<div class={['overlap', klass]} aria-busy={!loaded || undefined} aria-live="polite" {...rest}>
	<div class="motion box gap-sm" {@attach vars({ mo: 1 - fade.current })}>
		{#each { length: count } as _, i (i)}
			<div
				class={['bone', variant === 'text' && 'text', variant === 'circle' && 'round', motion]}
				{@attach vars({ w: variant === 'text' && i === count - 1 && count > 1 ? '64%' : undefined })}
			></div>
		{/each}
	</div>
	{#if children}
		<div class="motion" {@attach vars({ mo: fade.current })}>
			{@render children()}
		</div>
	{/if}
</div>
