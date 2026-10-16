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
	import type { FsTone, FsSize } from '../types';
	import { TONE_TEXT } from '../classes';

	interface Props {
		/** 0–1 */
		fraction?: number;
		tone?: FsTone;
		size?: FsSize;
		indeterminate?: boolean;
		striped?: boolean;
		animated?: boolean;
		markers?: BarMarker[];
	}

	let {
		fraction = 0,
		tone = 'theme',
		size = 'md',
		indeterminate = false,
		striped = false,
		animated = false,
		markers = []
	}: Props = $props();

	// Thickness rides the type scale (em), not pixels.
	const THICKNESS: Record<FsSize, number> = { sm: 0.25, md: 0.375, bs: 0.5, lg: 0.75 };
	const t = $derived(THICKNESS[size]);
	const pct = $derived(Math.max(0, Math.min(1, fraction)) * 100);
	const uid = $props.id();
</script>

<svg width="100%" height="{t}em" class="wfull {TONE_TEXT[tone]}" aria-hidden="true">
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
		<rect width="30%" height="100%" rx="{t / 2}em" fill="currentColor">
			<animate attributeName="x" values="-30%;100%" dur="1.4s" repeatCount="indefinite" />
		</rect>
	{:else}
		<rect width="{pct}%" height="100%" rx="{t / 2}em" fill="currentColor" />
		{#if striped}
			<rect width="{pct}%" height="100%" rx="{t / 2}em" fill="url(#{uid}-stripes)" />
		{/if}
	{/if}
	{#each markers as m (m.at)}
		<rect x="{Math.max(0, Math.min(1, m.at)) * 100}%" width="2" height="100%" class="text-primary" fill="currentColor">
			{#if m.label}<title>{m.label}</title>{/if}
		</rect>
	{/each}
</svg>
