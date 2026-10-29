<script lang="ts">
	// Shared overlay for the pointer-following effects (GlowCard, SpotlightCard,
	// AnimatedCard, Card3D glare). A radial gradient in the SVG's own pixel
	// space is centred on the pointer; its colour is fractalstyler ink. Mount it
	// as the first child of a padding-free .relative box so the .absolute.full
	// overlay covers the whole card.
	import type { MessageText } from '../types';

	interface Props {
		x: number;
		y: number;
		visible: boolean;
		radius?: number;
		tone?: MessageText | 'text-white';
		/** fill washes the surface; stroke lights the border under the pointer */
		mode?: 'fill' | 'stroke';
		/** Peak opacity at the pointer */
		intensity?: number;
		/** Corner radius of the stroked border, in px */
		rx?: number;
		/** Box size in px (the parent measures it) — needed to inset the stroke */
		width?: number;
		height?: number;
	}

	let {
		x,
		y,
		visible,
		radius = 300,
		tone,
		mode = 'fill',
		intensity = 0.25,
		rx = 8,
		width = 0,
		height = 0
	}: Props = $props();

	const uid = $props.id();
</script>

<svg class="absolute full {tone ?? 'text-theme'}" pointer-events="none" aria-hidden="true">
	<defs>
		<radialGradient id="{uid}-g" gradientUnits="userSpaceOnUse" cx={x} cy={y} r={radius}>
			<stop offset="0%" stop-color="currentColor" stop-opacity={intensity} />
			<stop offset="70%" stop-color="currentColor" stop-opacity="0" />
		</radialGradient>
	</defs>
	{#if visible}
		{#if mode === 'fill'}
			<rect width="100%" height="100%" fill="url(#{uid}-g)" />
		{:else}
			<rect x="1" y="1" width={Math.max(0, width - 2)} height={Math.max(0, height - 2)} {rx} fill="none" stroke="url(#{uid}-g)" stroke-width="2" />
		{/if}
	{/if}
</svg>
