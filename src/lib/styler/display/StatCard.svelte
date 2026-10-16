<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from 'fractalicons';
	import { luChevronUp, luChevronDown } from 'fractalicons/lucide';
	import type { FsCardVariant } from '../types';

	export type StatDeltaType = 'increase' | 'decrease' | 'neutral';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		title: string;
		value: string | number;
		delta?: string | number;
		deltaType?: StatDeltaType;
		timeframe?: string;
		variant?: FsCardVariant;
		class?: string;
		icon?: Snippet;
		sparkline?: Snippet;
		footer?: Snippet;
	}

	let {
		title,
		value,
		delta,
		deltaType,
		timeframe,
		variant = 'primary',
		class: className = '',
		icon,
		sparkline,
		footer,
		...restProps
	}: Props = $props();

	const type = $derived.by<StatDeltaType>(() => {
		if (deltaType) return deltaType;
		if (delta === undefined || delta === null) return 'neutral';
		const str = String(delta).trim();
		if (str.startsWith('+')) return 'increase';
		if (str.startsWith('-')) return 'decrease';
		const num = Number(delta);
		if (!isNaN(num) && num !== 0) return num > 0 ? 'increase' : 'decrease';
		return 'neutral';
	});

	const DELTA_CLASSES: Record<StatDeltaType, string> = {
		increase: 'text-success',
		decrease: 'text-danger',
		neutral: 'text-muted'
	};
</script>

<div class="card box gap-sm {className}" data-variant={variant} data-shape="curved" data-pad="md" {...restProps}>
	<div class="row ycenter xbetween gap-sm">
		<span class="text-sm weight-500 text-secondary">{title}</span>
		{#if icon}<span class="row ycenter text-muted" aria-hidden="true">{@render icon()}</span>{/if}
	</div>
	<div class="row ybot xbetween gap-md">
		<div class="box gap-xs min0">
			<span class="text-2xl weight-600 lh11 ls-tight-lg">{value}</span>
			{#if delta !== undefined || timeframe}
				<div class="row ycenter gap-xs text-sm">
					{#if delta !== undefined}
						<span class="row ycenter weight-500 {DELTA_CLASSES[type]}">
							{#if type === 'increase'}<Icon icon={luChevronUp} />{:else if type === 'decrease'}<Icon
									icon={luChevronDown}
								/>{/if}
							{delta}
						</span>
					{/if}
					{#if timeframe}<span class="text-muted">{timeframe}</span>{/if}
				</div>
			{/if}
		</div>
		{#if sparkline}<div class="shrink-0" aria-hidden="true">{@render sparkline()}</div>{/if}
	</div>
	{#if footer}<footer class="bt-sub pt-sm text-sm text-secondary">{@render footer()}</footer>{/if}
</div>
