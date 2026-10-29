<!-- @component A radar-style sweeping scan animation. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { MessageText } from '../types';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		mode?: 'radar' | 'linear';
		label?: string;
		active?: boolean;
		tone?: MessageText;
		class?: string;
	}

	let { mode = 'radar', label = 'LIDAR SCAN', active = true, tone = 'text-success', class: className = '', ...restProps }: Props = $props();

	const uid = $props.id();
	const BLIPS = [
		{ x: 32, y: 28, delay: 0.6 },
		{ x: 68, y: 35, delay: 1.8 },
		{ x: 74, y: 70, delay: 2.9 },
		{ x: 25, y: 65, delay: 4.2 }
	];
</script>

<!-- Entirely SVG: rings and crosshair are geometry, the beam is an
     animateTransform rotation, blips fade on staggered SMIL timelines. -->
<div class="box xcenter gap-sm pad-md bg-sunken border radius-md {tone ?? 'text-theme'} {className}" role="img" aria-label={label} {...restProps}>
	{#if mode === 'radar'}
		<svg viewBox="0 0 100 100" width="12em" height="12em" aria-hidden="true">
			<defs>
				<radialGradient id="{uid}-beam" cx="50" cy="50" r="48" gradientUnits="userSpaceOnUse">
					<stop offset="0%" stop-color="currentColor" stop-opacity="0.05" />
					<stop offset="100%" stop-color="currentColor" stop-opacity="0.45" />
				</radialGradient>
			</defs>
			<g fill="none" stroke="currentColor" stroke-opacity="0.35" stroke-width="0.5">
				<circle cx="50" cy="50" r="48" />
				<circle cx="50" cy="50" r="32" />
				<circle cx="50" cy="50" r="16" />
				<line x1="2" y1="50" x2="98" y2="50" />
				<line x1="50" y1="2" x2="50" y2="98" />
			</g>
			{#if active}
				<g>
					<path d="M50 50 L50 2 A48 48 0 0 1 91.6 26 Z" fill="url(#{uid}-beam)" />
					<line x1="50" y1="50" x2="91.6" y2="26" stroke="currentColor" stroke-width="0.8" />
					<animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="5s" repeatCount="indefinite" />
				</g>
				{#each BLIPS as b, i (i)}
					<circle cx={b.x} cy={b.y} r="1.8" fill="currentColor" opacity="0">
						<animate attributeName="opacity" values="0;1;0" keyTimes="0;0.1;1" dur="5s" begin="{b.delay}s" repeatCount="indefinite" />
					</circle>
				{/each}
			{/if}
		</svg>
	{:else}
		<svg viewBox="0 0 100 40" class="wfull" aria-hidden="true">
			{#each Array.from({ length: 20 }) as _, i (i)}
				<circle cx={10 + (i % 5) * 20} cy={8 + Math.floor(i / 5) * 8} r="1.4" fill="currentColor" opacity="0.25">
					{#if active}
						<animate attributeName="opacity" values="0.25;1;0.25" dur="2s" begin="{((i % 5) * 0.3).toFixed(2)}s" repeatCount="indefinite" />
					{/if}
				</circle>
			{/each}
			{#if active}
				<rect y="0" width="1.5" height="40" fill="currentColor" opacity="0.8">
					<animate attributeName="x" values="0;98.5;0" dur="3s" repeatCount="indefinite" />
				</rect>
			{/if}
		</svg>
	{/if}
	{#if label}<span class="chip mono tt-u ls-wide-xl">{label}</span>{/if}
</div>
