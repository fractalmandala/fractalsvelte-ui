<!-- @component A KPI block: a label, a tabular figure, an optional delta, and a quiet hint. -->

<script lang="ts">
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import type {  IconData  } from '@fractaldesign/icons';
	import { luMinus, luTrendingDown, luTrendingUp } from '@fractaldesign/icons/lucide';
	import { SpringValue, inView } from '../../../motion/index.js';
	import { type ChildTextSize, type TextColor, type TextSize, type Tone } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		label: string;
		value: number | string;
		delta?: number;
		deltaAs?: 'percent' | 'number';
		trend?: 'up' | 'down' | 'flat';
		tone?: Tone;
		hint?: string;
		icon?: IconData;
		countUp?: boolean;
		format?: Intl.NumberFormatOptions;
		locale?: string;
		textSize?: TextSize;
		childTextSize?: ChildTextSize;
		textColor?: TextColor;
		iconTextSize?: TextSize;
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
		textSize = 'text-3xl',
		childTextSize = 'text-sm',
		textColor = 'text-muted',
		iconTextSize = 'text-xl',
		class: className,
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

	const classes = $derived(['row', 'ycenter', 'gap-bs', className]);
</script>

<div class={classes} {@attach inView({ onEnter: () => (visible = true) })} {...rest}>
	{#if icon}
		<span class={['shrink-0', iconTextSize, textColor]}>
			<Icon {icon} />
		</span>
	{/if}
	<div class="box gap-xs min0">
		<div class={[childTextSize, textColor]}>{label}</div>
		<div class="row ycenter wrap gap-sm">
			<span class={['weight-600 tabular-nums lh11 ls-tight-lg', textSize]}>{shown}</span>
			{#if delta !== undefined}
				<span
					class={[
						'row',
						'ycenter',
						'gap-xs',
						childTextSize,
						'weight-500',
						'tabular-nums',
						`text-${`resolvedTone`}`
					]}
				>
					<Icon icon={trendIcon} />
					{deltaLabel}
				</span>
			{/if}
		</div>
		{#if hint}
			<div class={[childTextSize, textColor]}>{hint}</div>
		{/if}
	</div>
</div>
