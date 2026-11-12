<!-- @component A linear bar that shows how far a task has come, or that work is underway. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { vars } from '../../../motion/index.js';
	import { textClass, type Size, type Tone } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** The current progress, from 0 to `max`. Ignored when `indeterminate` is set. */
		value?: number;
		/** The value that represents a full bar. */
		max?: number;
		/** Shows a sliding bar with no determined value, for work whose length is unknown. */
		indeterminate?: boolean;
		/** The colour of the fill. */
		tone?: Tone;
		/** The thickness of the track, scaled with the text size. */
		size?: Size;
		/** A visible name for the bar, such as "Uploading archive". */
		label?: string;
		/** Shows the percentage to the right of the label, in tabular numerals. */
		showValue?: boolean;
		/** Draws diagonal stripes over the fill. */
		striped?: boolean;
	}

	let {
		value = 0,
		max = 100,
		indeterminate = false,
		tone = 'info',
		size = 'md',
		label,
		showValue = false,
		striped = false,
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

	const fraction = $derived(max <= 0 ? 0 : Math.min(1, Math.max(0, value / max)));
	const percent = $derived(Math.round(fraction * 100));
	const fillValue = $derived(indeterminate ? 0.35 : fraction);
</script>

<div class={['box gap-xs wfull', textClass[size], klass]} {...rest}>
	{#if label || (showValue && !indeterminate)}
		<div class="row xbetween ycenter gap-sm">
			{#if label}
				<span class="text-sm text-secondary">{label}</span>
			{/if}
			{#if showValue && !indeterminate}
				<span class="text-sm text-muted tabular-nums">{percent}%</span>
			{/if}
		</div>
	{/if}
	<div
		class={['track slim wfull overflow-hidden']}
		role="progressbar"
		aria-label={label}
		aria-valuemin={indeterminate ? undefined : 0}
		aria-valuemax={indeterminate ? undefined : max}
		aria-valuenow={indeterminate ? undefined : value}
		aria-valuetext={indeterminate ? undefined : `${percent}%`}
	>
		<div
			class={['fill spring', striped && 'stripes', indeterminate && 'anim-slide']}
			{@attach vars({ value: fillValue, 'theme-color': toneVar[tone] })}
		></div>
	</div>
</div>
