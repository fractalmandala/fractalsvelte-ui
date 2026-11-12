<!-- @component A circular meter that shows how far a task has come, with a label in the centre. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { vars } from '../../../motion/index.js';
	import { heightClass, textClass, type Size, type Tone } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** The current progress, from 0 to `max`. Ignored when `indeterminate` is set. */
		value?: number;
		/** The value that represents a full ring. */
		max?: number;
		/** Spins a partial ring, for work whose length is unknown. */
		indeterminate?: boolean;
		/** The colour of the fill. */
		tone?: Tone;
		/** The diameter of the ring. */
		size?: Size;
		/** The stroke thickness, expressed through the text scale that the ring already uses. */
		thickness?: 'sm' | 'md' | 'lg';
		/** A short label drawn in the centre when `children` is omitted, such as "68%". */
		label?: string;
		/** Custom centre content. Replaces the label when provided. */
		children?: Snippet;
	}

	let {
		value = 0,
		max = 100,
		indeterminate = false,
		tone = 'info',
		size = 'md',
		thickness = 'md',
		label,
		children,
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

	const thickClass: Record<'sm' | 'md' | 'lg', string> = {
		sm: 'text-xs',
		md: 'text-md',
		lg: 'text-lg'
	};

	const fraction = $derived(max <= 0 ? 0 : Math.min(1, Math.max(0, value / max)));
	const percent = $derived(Math.round(fraction * 100));
	const fillValue = $derived(indeterminate ? 0.25 : fraction);
	const centre = $derived(label ?? (indeterminate ? undefined : `${percent}%`));
</script>

<div
	class={['relative inline-grid square', heightClass[size], klass]}
	role="progressbar"
	aria-label={label}
	aria-valuemin={indeterminate ? undefined : 0}
	aria-valuemax={indeterminate ? undefined : max}
	aria-valuenow={indeterminate ? undefined : value}
	aria-valuetext={indeterminate ? undefined : `${percent}%`}
	{...rest}
>
	<div
		class={['ring full', thickClass[thickness], indeterminate && 'anim-spin']}
		{@attach vars({ value: fillValue, 'theme-color': toneVar[tone] })}
	></div>
	{#if children || centre}
		<div class={['cover box xcenter ycenter tabular-nums text-secondary', textClass[size]]}>
			{#if children}
				{@render children()}
			{:else}
				{centre}
			{/if}
		</div>
	{/if}
</div>
