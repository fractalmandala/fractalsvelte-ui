<!-- @component A compact indicator that work is underway, as a ring, a row of dots, or a row of bars. -->

<script lang="ts">
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { vars } from '../../../motion/index.js';
	import { type Size, type Tone } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		form?: 'ring' | 'dots' | 'bars';
		size?: Size;
		tone?: Tone;
		label?: string;
	}

	let {
		form = 'ring',
		size = 'h-lg',
		tone = 'neutral',
		label = 'Loading',
		class: className,
		...rest
	}: Props = $props();

	const toneVar: Record<Tone, string> = {
		neutral: 'var(--bg-button)',
		info: 'var(--info)',
		success: 'var(--success)',
		warning: 'var(--warning)',
		danger: 'var(--danger)'
	};
</script>

<div
	class={['row ycenter', size, `text-${`tone`}`, className]}
	role="status"
	aria-label={label}
	{...rest}
>
	<span class="sr-only">{label}</span>
	{#if form === 'ring'}
		<span
			class={['ring', size, 'anim-spin']}
			{@attach vars({ value: 0.25, 'theme-color': toneVar[tone] })}
		></span>
	{:else if form === 'dots'}
		<span class="row ycenter gap-xs" aria-hidden="true">
			{#each [0, 1, 2] as i (i)}
				<span class="dot anim-wave" {@attach vars({ i })}></span>
			{/each}
		</span>
	{:else}
		<span class="row ycenter gap-xs" aria-hidden="true">
			{#each [0, 1, 2] as i (i)}
				<span class="bar anim-stretch" {@attach vars({ i })}></span>
			{/each}
		</span>
	{/if}
</div>
