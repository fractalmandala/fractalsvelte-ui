<!-- @component Hierarchical timeline waterfall for visualizing nested traces, network spans, and durations. -->

<script lang="ts">
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { SvelteSet } from 'svelte/reactivity';
	import { Icon } from '@fractaldesign/icons';
	import { luChevronRight } from '@fractaldesign/icons/lucide';
	import { vars } from '../../../motion/index.js';
	import type { ChildTextColor, ChildTextSize, Shape, Size, Surface, TextColor, TextSize } from '../../../internal/tokens.js';
	import {
		collectExpandableIds,
		computeBounds,
		flattenWaterfall,
		type WaterfallItem,
		type WaterfallMarker
	} from './waterfall.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		items: WaterfallItem[];
		markers?: WaterfallMarker[];
		selectedId?: string;
		onSelect?: (item: WaterfallItem) => void;
		unit?: 'ms' | 's';
		ticks?: number;
		surface?: Surface;
		shape?: Shape;
		size?: Size;
		textSize?: TextSize;
		childTextSize?: ChildTextSize;
		textColor?: TextColor;
		childTextColor?: ChildTextColor;
	}

	let {
		items,
		markers = [],
		selectedId = $bindable(),
		onSelect,
		unit = 'ms',
		ticks = 4,
		surface = 'elevated',
		shape = 'modern',
		size = 'h-xs',
		textSize = 'text-sm',
		childTextSize = 'text-xs',
		textColor = 'text-muted',
		childTextColor = 'text-secondary',
		class: className,
		...rest
	}: Props = $props();

	let expanded = $state(new SvelteSet<string>());

	$effect.pre(() => {
		expanded = new SvelteSet(collectExpandableIds(items));
	});

	const rows = $derived(flattenWaterfall(items, expanded));
	const bounds = $derived(computeBounds(items, markers));
	const range = $derived(Math.max(1e-6, bounds.max - bounds.min));

	const axisTicks = $derived.by(() => {
		const count = Math.max(2, ticks);
		return Array.from({ length: count }, (_, idx) => {
			const frac = idx / (count - 1);
			const value = bounds.min + range * frac;
			return {
				value,
				pct: frac * 100,
				label: `${Number.isInteger(value) ? value : value.toFixed(1)}${unit}`
			};
		});
	});

	function toggle(id: string) {
		const next = new SvelteSet(expanded);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		expanded = next;
	}

	function select(item: WaterfallItem) {
		selectedId = item.id;
		onSelect?.(item);
	}

	function pctOf(val: number): number {
		return Math.min(100, Math.max(0, ((val - bounds.min) / range) * 100));
	}

	function spanPct(duration: number): number {
		return Math.min(100, Math.max(0, (duration / range) * 100));
	}
</script>

<div class={['box overflow-hidden', surface, shape, textSize, className]} {...rest}>
	<div class={['row ycenter bb px-sm py-xs', childTextSize, textColor]}>
		<div class="wvar shrink-0 weight-500" {@attach vars({ w: '40%' })}>Operation</div>
		<div class="grow row xbetween tabular-nums">
			{#each axisTicks as tick (tick.pct)}
				<span>{tick.label}</span>
			{/each}
		</div>
		<div class="wvar ta-r shrink-0 weight-500" {@attach vars({ w: '4rem' })}>Duration</div>
	</div>

	<div class="relative stack-rule" role="tree" aria-label="Trace waterfall">
		{#each rows as row (row.item.id)}
			{@const isSelected = selectedId === row.item.id}
			{@const toneCls = row.item.tone && row.item.tone !== 'neutral' ? `tone-${row.item.tone}` : undefined}
			<div
				role="treeitem"
				aria-expanded={row.hasChildren ? expanded.has(row.item.id) : undefined}
				aria-selected={isSelected}
				tabindex="0"
				class={['row ycenter px-sm py-xs interactive', isSelected ? 'selected state-selected' : 'bg-none']}
				onclick={() => select(row.item)}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						select(row.item);
					}
				}}
			>
				<div class="wvar shrink-0 row ycenter gap-xs indent min0" {@attach vars({ w: '40%', level: row.depth })}>
					{#if row.hasChildren}
						<button
							type="button"
							class={['bare row xcenter ycenter square pointer shrink-0', size, textColor]}
							aria-label={expanded.has(row.item.id) ? `Collapse ${row.item.label}` : `Expand ${row.item.label}`}
							onclick={(e) => {
								e.stopPropagation();
								toggle(row.item.id);
							}}
						>
							<Icon icon={luChevronRight} class={['caret quarter', childTextSize, expanded.has(row.item.id) && 'open']} />
						</button>
					{:else}
						<span class={['square shrink-0', size]} aria-hidden="true"></span>
					{/if}
					<span class="truncate weight-500">{row.item.label}</span>
					{#if row.item.status}
						<span class={['shrink-0', childTextSize, textColor]}>{row.item.status}</span>
					{/if}
				</div>

				<div class="grow relative wf-lane mx-sm">
					{#each markers as marker (marker.value)}
						<span
							class="wf-marker"
							title={marker.label}
							{@attach vars({ pos: pctOf(marker.value) })}
						></span>
					{/each}
					<div
						class={['wf-bar spring', toneCls]}
						{@attach vars({ start: pctOf(row.item.start), span: spanPct(row.item.duration) })}
					></div>
				</div>

				<div class={['wvar ta-r shrink-0 tabular-nums', childTextSize, childTextColor]} {@attach vars({ w: '4rem' })}>
					{row.item.duration}{unit}
				</div>
			</div>
		{/each}
	</div>
</div>
