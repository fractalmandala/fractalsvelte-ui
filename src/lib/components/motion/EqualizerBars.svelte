<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Intent, Size } from '../../types.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		bars?: number;
		playing?: boolean;
		size?: Size;
		intent?: 'primary' | Intent;
		class?: string;
	}

	let {
		bars = 5,
		playing = true,
		size = 'md',
		intent = 'primary',
		class: className = '',
		...restProps
	}: Props = $props();

	// Array of predefined timing offsets and animation durations for realistic organic movement
	const delays = [-0.18, -0.45, -0.25, -0.6, -0.35, -0.5, -0.1, -0.7, -0.3, -0.65];
	const durations = [0.85, 1.1, 0.75, 0.95, 1.2, 0.8, 1.05, 0.9, 1.15, 0.7];
</script>

<div
	class="f-equalizer-bars {className}"
	data-size={size}
	data-intent={intent}
	data-playing={playing ? '' : undefined}
	role="img"
	aria-label={playing ? 'Audio playing' : 'Audio paused'}
	{...restProps}
>
	{#each Array(Math.min(16, Math.max(3, bars))) as _, i (i)}
		<span
			class="f-eq-bar"
			style="
				animation-delay: {delays[i % delays.length]}s;
				animation-duration: {durations[i % durations.length]}s;
			"
		></span>
	{/each}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-equalizer-bars {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			gap: 3px;
			box-sizing: border-box;
		}

		.f-eq-bar {
			display: inline-block;
			width: 4px;
			height: 100%;
			border-radius: 9999px;
			background: var(--f-primary);
			transform-origin: center bottom;
			transform: scaleY(0.2);
			transition: transform var(--f-duration-normal) var(--f-ease);
		}

		.f-equalizer-bars[data-playing] .f-eq-bar {
			animation-name: f-eq-bounce;
			animation-timing-function: cubic-bezier(0.45, 0.05, 0.55, 0.95);
			animation-iteration-count: infinite;
			animation-direction: alternate;
		}

		/* Sizes */
		.f-equalizer-bars[data-size='sm'] { height: 18px; gap: 2px; }
		.f-equalizer-bars[data-size='sm'] .f-eq-bar { width: 3px; }

		.f-equalizer-bars[data-size='md'] { height: 28px; gap: 3px; }
		.f-equalizer-bars[data-size='md'] .f-eq-bar { width: 4px; }

		.f-equalizer-bars[data-size='lg'] { height: 44px; gap: 5px; }
		.f-equalizer-bars[data-size='lg'] .f-eq-bar { width: 6px; }

		/* Intents */
		.f-equalizer-bars[data-intent='success'] .f-eq-bar { background: var(--f-success, #10b981); }
		.f-equalizer-bars[data-intent='warning'] .f-eq-bar { background: var(--f-warning, #f59e0b); }
		.f-equalizer-bars[data-intent='danger'] .f-eq-bar { background: var(--f-danger, #ef4444); }
		.f-equalizer-bars[data-intent='neutral'] .f-eq-bar { background: var(--f-text-muted); }

		@keyframes f-eq-bounce {
			0% {
				transform: scaleY(0.15);
			}
			50% {
				transform: scaleY(0.9);
			}
			100% {
				transform: scaleY(0.35);
			}
		}
	}
</style>
