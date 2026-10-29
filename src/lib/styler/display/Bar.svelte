<script lang="ts" module>
	export interface BarMarker {
		/** 0–1 position along the track */
		at: number;
		label?: string;
	}
</script>

<script lang="ts">
	// Shared track for Progress and Meter. Geometry is SVG attributes, colour is
	// fractalstyler ink (currentColor), so the fill never needs a CSS width.
	import type { MessageText, Size } from '../types';

	interface Props {
		/** 0–1 */
		fraction?: number;
		tone?: MessageText;
		size?: Size;
		indeterminate?: boolean;
		striped?: boolean;
		animated?: boolean;
		markers?: BarMarker[];
		/** Fills bottom-to-top; the track takes `length` as its height. */
		direction?: 'horizontal' | 'vertical';
		/** Track length when vertical (CSS length). */
		length?: string;
	}

	let {
		fraction = 0,
		tone,
		size = 'h-md',
		indeterminate = false,
		striped = false,
		animated = false,
		markers = [],
		direction = 'horizontal',
		length = '8em'
	}: Props = $props();

	// Thickness rides the type scale (em), not pixels.
	const THICKNESS: Record<Size, number> = { 'h-sm': 0.25, 'h-md': 0.375, 'h-bs': 0.5, 'h-lg': 0.75, 'h-xl': 1 };
	const t = $derived(THICKNESS[size]);
	const pct = $derived(Math.max(0, Math.min(1, fraction)) * 100);
	const uid = $props.id();
	const v = $derived(direction === 'vertical');
	// Fill rect geometry: along x when horizontal, from the bottom when vertical.
	const fill = $derived(v ? { y: `${100 - pct}%`, width: '100%', height: `${pct}%` } : { width: `${pct}%`, height: '100%' });
</script>

<svg
	width={v ? `${t}em` : '100%'}
	height={v ? length : `${t}em`}
	class="{v ? 'shrink-0' : 'wfull'} {tone ?? 'text-theme'}"
	aria-hidden="true"
>
	{#if striped}
		<defs>
			<pattern id="{uid}-stripes" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
				<rect width="6" height="12" class="text-white" fill="currentColor" opacity="0.35" />
				{#if animated}
					<animateTransform
						attributeName="patternTransform"
						type="translate"
						from="0 0"
						to="12 0"
						dur="0.8s"
						repeatCount="indefinite"
						additive="sum"
					/>
				{/if}
			</pattern>
		</defs>
	{/if}
	<rect width="100%" height="100%" rx="{t / 2}em" fill="currentColor" opacity="0.15" />
	{#if indeterminate}
		<rect width={v ? '100%' : '30%'} height={v ? '30%' : '100%'} rx="{t / 2}em" fill="currentColor">
			<animate attributeName={v ? 'y' : 'x'} values="-30%;100%" dur="1.4s" repeatCount="indefinite" />
		</rect>
	{:else}
		<rect {...fill} rx="{t / 2}em" fill="currentColor" />
		{#if striped}
			<rect {...fill} rx="{t / 2}em" fill="url(#{uid}-stripes)" />
		{/if}
	{/if}
	{#each markers as m (m.at)}
		{@const at = Math.max(0, Math.min(1, m.at)) * 100}
		<rect
			x={v ? 0 : `${at}%`}
			y={v ? `${100 - at}%` : 0}
			width={v ? '100%' : 2}
			height={v ? 2 : '100%'}
			class="text-primary"
			fill="currentColor"
		>
			{#if m.label}<title>{m.label}</title>{/if}
		</rect>
	{/each}
</svg>
