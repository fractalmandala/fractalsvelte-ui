<!-- @component Tabs with an animated indicator that slides to the active tab. -->

<script lang="ts" module>
	export interface MorphingTabItem {
		id: string;
		label: string;
		badge?: string | number;
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import { tick, untrack, type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type MorphingTabsVariant = 'pill' | 'underline' | 'segmented';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onselect'> {
		items: MorphingTabItem[];
		value?: string;
		variant?: MorphingTabsVariant;
		class?: string;
		itemSnippet?: Snippet<[{ item: MorphingTabItem; selected: boolean }]>;
		onselect?: (id: string) => void;
	}

	let {
		items = [],
		value = $bindable(''),
		variant = 'pill',
		class: className = '',
		itemSnippet,
		onselect,
		...restProps
	}: Props = $props();

	let svgEl = $state<SVGSVGElement | null>(null);
	let animX = $state<SVGAnimateElement | null>(null);
	let animW = $state<SVGAnimateElement | null>(null);
	let box = $state({ x: 0, y: 0, w: 0, h: 0 });
	let from = $state({ x: 0, w: 0 });
	let width = $state(0);
	let height = $state(0);

	$effect.pre(() => {
		if (!value && items.length) value = items.find((i) => !i.disabled)?.id ?? '';
	});

	// The indicator is an SVG rect behind the tabs. Moving it changes its x and
	// width attributes; a SMIL <animate> plays the morph between the old and new
	// geometry. Nothing writes CSS.
	function measure() {
		if (!svgEl) return;
		const btn = svgEl.parentElement?.querySelector<HTMLElement>(`[data-tab-id="${CSS.escape(value)}"]`);
		if (!btn) return;
		const origin = svgEl.getBoundingClientRect();
		const r = btn.getBoundingClientRect();
		const next = { x: r.left - origin.left, y: r.top - origin.top, w: r.width, h: r.height };
		const moved = box.w > 0 && (next.x !== box.x || next.w !== box.w);
		from = { x: box.x, w: box.w };
		box = next;
		if (moved) {
			tick().then(() => {
				animX?.beginElement();
				animW?.beginElement();
			});
		}
	}

	$effect(() => {
		void value;
		void width;
		void height;
		untrack(measure);
	});

	function select(item: MorphingTabItem) {
		if (item.disabled) return;
		value = item.id;
		onselect?.(item.id);
	}
</script>

<div
	bind:clientWidth={width}
	bind:clientHeight={height}
	class="relative row ycenter gap-xs {variant === 'underline' ? 'bb' : 'pad-xs bg-raised border radius-md'} {className}"
	role="tablist"
	{...restProps}
>
	<svg bind:this={svgEl} class="absolute full" aria-hidden="true">
		{#if box.w > 0}
			<rect
				x={box.x}
				y={variant === 'underline' ? box.y + box.h - 2 : box.y}
				width={box.w}
				height={variant === 'underline' ? 2 : box.h}
				rx={variant === 'underline' ? 1 : variant === 'pill' ? box.h / 2 : 4}
				class={variant === 'segmented' ? 'text-inverse' : 'text-theme'}
				fill="currentColor"
				opacity={variant === 'pill' ? 0.18 : 1}
			>
				<animate bind:this={animX} attributeName="x" from={from.x} to={box.x} dur="0.22s" begin="indefinite" calcMode="spline" keySplines="0.2 0 0 1" keyTimes="0;1" />
				<animate bind:this={animW} attributeName="width" from={from.w} to={box.w} dur="0.22s" begin="indefinite" calcMode="spline" keySplines="0.2 0 0 1" keyTimes="0;1" />
			</rect>
		{/if}
	</svg>
	{#each items as item (item.id)}
		{@const selected = value === item.id}
		<!-- .relative lifts each tab above the absolutely positioned indicator. -->
		<button
			type="button"
			role="tab"
			data-tab-id={item.id}
			data-variant="ghost"
			data-size="lg"
			data-shape={variant === 'pill' ? 'round' : 'modern'}
			class="relative"
			aria-selected={selected}
			disabled={item.disabled}
			onclick={() => select(item)}
		>
			<!-- Ink on the inner row: button[data-variant] sets color and would win. -->
			<span class="row ycenter gap-xs {selected ? (variant === 'pill' ? 'text-theme weight-600' : 'text-primary weight-600') : 'text-secondary'}">
				{#if itemSnippet}
					{@render itemSnippet({ item, selected })}
				{:else}
					<span>{item.label}</span>
					{#if item.badge !== undefined}<span class="chip bg-sunken text-secondary">{item.badge}</span>{/if}
				{/if}
			</span>
		</button>
	{/each}
</div>
