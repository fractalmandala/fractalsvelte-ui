<!-- @component A KPI block: a label, a tabular figure, an optional delta, and a quiet hint. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import type { IconData } from '@fractaldesign/icons';
	import { luMinus, luTrendingDown, luTrendingUp } from '@fractaldesign/icons/lucide';
	import { SpringValue, inView } from '../../../motion/index.js';
	import { toneText, type Tone } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		/** A short caption above the value, such as "Monthly recurring revenue". */
		label: string;
		/** The figure to display. A number is formatted with `format`; a string is shown as written. */
		value: number | string;
		/** A signed change, shown beside the value with a trend icon. */
		delta?: number;
		/** How to read `delta`: a percentage point figure (`4.2` → "+4.2%") or an absolute number. */
		deltaAs?: 'percent' | 'number';
		/** The trend direction. Inferred from the sign of `delta` when omitted. */
		trend?: 'up' | 'down' | 'flat';
		/** The colour of the delta. Inferred from the trend when omitted. */
		tone?: Tone;
		/** A quiet footnote under the value, such as "vs last month". */
		hint?: string;
		/** An icon drawn beside the block. */
		icon?: IconData;
		/** Springs the numeric value from zero when the stat first scrolls into view. */
		countUp?: boolean;
		/** `Intl.NumberFormat` options used when `value` is a number. */
		format?: Intl.NumberFormatOptions;
		/** The locale passed to `Intl.NumberFormat`. Defaults to the runtime locale. */
		locale?: string;
	}

	let {
		label,
		value,
		delta,
		deltaAs = 'percent',
		trend,
		tone,
		hint,
		icon,
		countUp = false,
		format,
		locale,
		class: klass,
		...rest
	}: Props = $props();

	const spring = new SpringValue(0, 'gentle');
	let visible = $state(false);

	$effect(() => {
		if (visible && countUp && typeof value === 'number') void spring.set(value);
	});

	const shown = $derived(
		typeof value === 'number'
			? new Intl.NumberFormat(locale, format).format(countUp ? spring.current : value)
			: value
	);

	const resolvedTrend = $derived(
		trend ?? (delta === undefined || delta === 0 ? 'flat' : delta > 0 ? 'up' : 'down')
	);
	const resolvedTone = $derived(
		tone ?? (resolvedTrend === 'up' ? 'success' : resolvedTrend === 'down' ? 'danger' : 'neutral')
	);
	const trendIcon = $derived(
		resolvedTrend === 'up' ? luTrendingUp : resolvedTrend === 'down' ? luTrendingDown : luMinus
	);

	const deltaLabel = $derived.by(() => {
		if (delta === undefined) return '';
		if (deltaAs === 'percent') {
			return `${new Intl.NumberFormat(locale, {
				signDisplay: 'exceptZero',
				maximumFractionDigits: 1
			}).format(delta)}%`;
		}
		return new Intl.NumberFormat(locale, {
			signDisplay: 'exceptZero',
			maximumFractionDigits: 1,
			...format
		}).format(delta);
	});

	const classes = $derived(['row', 'ycenter', 'gap-bs', klass]);
</script>

<div class={classes} {@attach inView({ onEnter: () => (visible = true) })} {...rest}>
	{#if icon}
		<span class="text-xl text-muted shrink-0">
			<Icon {icon} />
		</span>
	{/if}
	<div class="box gap-xs min0">
		<div class="text-sm text-muted">{label}</div>
		<div class="row ycenter wrap gap-sm">
			<span class="text-3xl weight-600 tabular-nums lh11 ls-tight-lg">{shown}</span>
			{#if delta !== undefined}
				<span
					class={[
						'row',
						'ycenter',
						'gap-xs',
						'text-sm',
						'weight-500',
						'tabular-nums',
						toneText[resolvedTone]
					]}
				>
					<Icon icon={trendIcon} />
					{deltaLabel}
				</span>
			{/if}
		</div>
		{#if hint}
			<div class="text-sm text-muted">{hint}</div>
		{/if}
	</div>
</div>
