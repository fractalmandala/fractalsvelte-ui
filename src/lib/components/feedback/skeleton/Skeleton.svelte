<!-- @component A placeholder for content that has not loaded yet, shaped as text, a circle or a rectangle. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import type { Shape } from '../../../internal/tokens.js';
	import { SpringValue, vars } from '../../../motion/index.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		form?: 'text' | 'circle' | 'rect';
		lines?: number;
		animate?: 'shimmer' | 'pulse' | 'none';
		shape?: Shape;
		loaded?: boolean;
		children?: Snippet;
	}

	let {
		form = 'text',
		lines = 3,
		animate = 'shimmer',
		shape = 'round',
		loaded = false,
		children,
		class: className,
		...rest
	}: Props = $props();

	const fade = new SpringValue(0, 'snappy');

	$effect(() => {
		void fade.set(loaded ? 1 : 0);
	});

	const motion = $derived(animate === 'shimmer' ? 'anim-shimmer' : animate === 'pulse' ? 'anim-pulse' : '');
	const count = $derived(form === 'text' ? Math.max(1, Math.round(lines)) : 1);
</script>

<div class={['overlap', className]} aria-busy={!loaded || undefined} aria-live="polite" {...rest}>
	<div class="motion box gap-sm" {@attach vars({ mo: 1 - fade.current })}>
		{#each { length: count } as _, i (i)}
			<div
				class={['bone', form === 'text' && 'text', form === 'circle' && shape, motion]}
				{@attach vars({ w: form === 'text' && i === count - 1 && count > 1 ? '64%' : undefined })}
			></div>
		{/each}
	</div>
	{#if children}
		<div class="motion" {@attach vars({ mo: fade.current })}>
			{@render children()}
		</div>
	{/if}
</div>
