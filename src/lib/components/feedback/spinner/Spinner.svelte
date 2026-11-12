<!-- @component A compact indicator that work is underway, as a ring, a row of dots, or a row of bars. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { vars } from '../../../motion/index.js';
	import { heightClass, textClass, toneText, type Size, type Tone } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** The visual style of the spinner. */
		variant?: 'ring' | 'dots' | 'bars';
		/** The size of the spinner. */
		size?: Size;
		/** The colour of the spinner. */
		tone?: Tone;
		/** A visually hidden label, announced to assistive technology. Defaults to "Loading". */
		label?: string;
	}

	let {
		variant = 'ring',
		size = 'md',
		tone = 'neutral',
		label = 'Loading',
		class: klass,
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
	class={['row ycenter', textClass[size], toneText[tone], klass]}
	role="status"
	aria-label={label}
	{...rest}
>
	<span class="sr-only">{label}</span>
	{#if variant === 'ring'}
		<span
			class={['ring', heightClass[size], 'anim-spin']}
			{@attach vars({ value: 0.25, 'theme-color': toneVar[tone] })}
		></span>
	{:else if variant === 'dots'}
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
