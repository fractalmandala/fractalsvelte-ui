<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Intent } from '../../types.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		mode?: 'radar' | 'linear';
		label?: string;
		active?: boolean;
		intent?: 'primary' | Intent;
		class?: string;
	}

	let {
		mode = 'radar',
		label = 'LIDAR SCAN',
		active = true,
		intent = 'primary',
		class: className = '',
		...restProps
	}: Props = $props();

	// Pre-calculated target blips for atmospheric tech aesthetics
	const radarBlips = [
		{ x: 32, y: 28, delay: 0.6 },
		{ x: 68, y: 35, delay: 1.8 },
		{ x: 74, y: 70, delay: 2.9 },
		{ x: 25, y: 65, delay: 4.2 }
	];
</script>

<div
	class="f-lidar-sweep {className}"
	data-mode={mode}
	data-intent={intent}
	data-active={active ? '' : undefined}
	role="img"
	aria-label={label}
	{...restProps}
>
	{#if mode === 'radar'}
		<div class="f-radar-viewport">
			<!-- Range rings -->
			<div class="f-radar-ring f-ring-1"></div>
			<div class="f-radar-ring f-ring-2"></div>
			<div class="f-radar-ring f-ring-3"></div>

			<!-- Crosshairs -->
			<div class="f-radar-crosshair-h"></div>
			<div class="f-radar-crosshair-v"></div>

			<!-- Sweep sweep beam -->
			<div class="f-radar-sweep-beam"></div>

			<!-- Blips -->
			{#each radarBlips as blip, i (i)}
				<div
					class="f-radar-blip"
					style="
						left: {blip.x}%;
						top: {blip.y}%;
						animation-delay: {blip.delay}s;
					"
				></div>
			{/each}
		</div>
	{:else}
		<div class="f-linear-viewport">
			<!-- Grid dots -->
			<div class="f-linear-grid">
				{#each Array(20) as _, i (i)}
					<span
						class="f-linear-dot"
						style="animation-delay: {((i % 5) * 0.3).toFixed(2)}s;"
					></span>
				{/each}
			</div>

			<!-- Linear sweep plane line -->
			<div class="f-linear-plane"></div>
		</div>
	{/if}

	{#if label}
		<span class="f-lidar-label">{label}</span>
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-lidar-sweep {
			position: relative;
			width: 100%;
			max-width: 260px;
			background: #090a0f;
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-lg);
			padding: 1rem;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 0.5rem;
			overflow: hidden;
		}

		/* Radar Viewport */
		.f-radar-viewport {
			position: relative;
			width: 160px;
			height: 160px;
			border-radius: 50%;
			border: 1px solid rgba(99, 102, 241, 0.3);
			background: radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, rgba(10, 10, 16, 0.95) 100%);
			overflow: hidden;
		}

		.f-radar-ring {
			position: absolute;
			left: 50%;
			top: 50%;
			border-radius: 50%;
			border: 1px dashed rgba(255, 255, 255, 0.12);
			transform: translate(-50%, -50%);
			pointer-events: none;
		}

		.f-ring-1 { width: 33%; height: 33%; }
		.f-ring-2 { width: 66%; height: 66%; }
		.f-ring-3 { width: 100%; height: 100%; border-style: solid; border-color: rgba(255, 255, 255, 0.15); }

		.f-radar-crosshair-h {
			position: absolute;
			left: 0;
			right: 0;
			top: 50%;
			height: 1px;
			background: rgba(255, 255, 255, 0.1);
		}

		.f-radar-crosshair-v {
			position: absolute;
			top: 0;
			bottom: 0;
			left: 50%;
			width: 1px;
			background: rgba(255, 255, 255, 0.1);
		}

		.f-radar-sweep-beam {
			position: absolute;
			inset: 0;
			border-radius: 50%;
			background: conic-gradient(
				from 0deg,
				transparent 0deg,
				transparent 280deg,
				rgba(99, 102, 241, 0.1) 320deg,
				rgba(99, 102, 241, 0.45) 360deg
			);
			pointer-events: none;
		}

		.f-lidar-sweep[data-active] .f-radar-sweep-beam {
			animation: f-radar-spin 4s linear infinite;
		}

		.f-radar-blip {
			position: absolute;
			width: 6px;
			height: 6px;
			margin-left: -3px;
			margin-top: -3px;
			border-radius: 50%;
			background: #6366f1;
			box-shadow: 0 0 8px #6366f1;
			opacity: 0;
			animation: f-blip-fade 4s ease-out infinite;
		}

		/* Linear Viewport */
		.f-linear-viewport {
			position: relative;
			width: 100%;
			height: 110px;
			background: rgba(0, 0, 0, 0.4);
			border-radius: var(--f-radius-md);
			border: 1px solid rgba(255, 255, 255, 0.08);
			overflow: hidden;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.f-linear-grid {
			position: absolute;
			inset: 16px;
			display: grid;
			grid-template-columns: repeat(5, 1fr);
			grid-template-rows: repeat(4, 1fr);
			place-items: center;
		}

		.f-linear-dot {
			width: 4px;
			height: 4px;
			border-radius: 50%;
			background: rgba(99, 102, 241, 0.6);
			animation: f-dot-pulse 3s ease-in-out infinite alternate;
		}

		.f-linear-plane {
			position: absolute;
			left: 0;
			right: 0;
			height: 2px;
			background: linear-gradient(90deg, transparent, #6366f1, transparent);
			box-shadow: 0 0 10px #6366f1;
			top: 10%;
		}

		.f-lidar-sweep[data-active] .f-linear-plane {
			animation: f-plane-sweep 3.5s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate;
		}

		.f-lidar-label {
			font-family: var(--f-font-mono, monospace);
			font-size: 10px;
			letter-spacing: 0.15em;
			color: var(--f-text-muted);
			text-transform: uppercase;
		}

		/* Intents */
		.f-lidar-sweep[data-intent='success'] .f-radar-viewport { border-color: rgba(16, 185, 129, 0.3); }
		.f-lidar-sweep[data-intent='success'] .f-radar-sweep-beam {
			background: conic-gradient(from 0deg, transparent 0deg, transparent 280deg, rgba(16, 185, 129, 0.1) 320deg, rgba(16, 185, 129, 0.45) 360deg);
		}
		.f-lidar-sweep[data-intent='success'] .f-radar-blip { background: #10b981; box-shadow: 0 0 8px #10b981; }
		.f-lidar-sweep[data-intent='success'] .f-linear-plane { background: linear-gradient(90deg, transparent, #10b981, transparent); box-shadow: 0 0 10px #10b981; }

		.f-lidar-sweep[data-intent='warning'] .f-radar-viewport { border-color: rgba(245, 158, 11, 0.3); }
		.f-lidar-sweep[data-intent='warning'] .f-radar-sweep-beam {
			background: conic-gradient(from 0deg, transparent 0deg, transparent 280deg, rgba(245, 158, 11, 0.1) 320deg, rgba(245, 158, 11, 0.45) 360deg);
		}
		.f-lidar-sweep[data-intent='warning'] .f-radar-blip { background: #f59e0b; box-shadow: 0 0 8px #f59e0b; }
		.f-lidar-sweep[data-intent='warning'] .f-linear-plane { background: linear-gradient(90deg, transparent, #f59e0b, transparent); box-shadow: 0 0 10px #f59e0b; }

		@keyframes f-radar-spin {
			from { transform: rotate(0deg); }
			to { transform: rotate(360deg); }
		}

		@keyframes f-blip-fade {
			0%, 75% { opacity: 0; transform: scale(0.6); }
			76% { opacity: 1; transform: scale(1.4); }
			100% { opacity: 0; transform: scale(1); }
		}

		@keyframes f-plane-sweep {
			from { top: 12%; }
			to { top: 86%; }
		}

		@keyframes f-dot-pulse {
			from { opacity: 0.2; transform: scale(0.8); }
			to { opacity: 0.9; transform: scale(1.2); }
		}
	}
</style>
