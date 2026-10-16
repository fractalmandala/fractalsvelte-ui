<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';
	import type { FsTone } from '../types';
	import { TEXT_SIZE, TONE_TEXT, type FsTextSize } from '../classes';

	interface Props extends SVGAttributes<SVGSVGElement> {
		bars?: number;
		playing?: boolean;
		/** Bars are 1em tall at this text size */
		size?: FsTextSize;
		tone?: FsTone;
		class?: string;
	}

	let { bars = 5, playing = true, size = 'xl', tone = 'theme', class: className = '', ...restProps }: Props = $props();

	const count = $derived(Math.min(16, Math.max(3, bars)));
	// Staggered heights and periods so the bars never move in lockstep.
	const LEVELS = ['3;9;5;8;3', '8;4;9;3;8', '5;9;3;7;5', '9;5;7;4;9', '4;8;6;9;4'];
	const PERIODS = [0.85, 1.1, 0.75, 0.95, 1.2, 0.8, 1.05, 0.9, 1.15, 0.7];
</script>

<!-- Bars grow from the baseline: SMIL animates each rect's height and y. -->
<svg
	viewBox="0 0 {count * 3 - 1} 10"
	width="{(count * 3 - 1) / 10}em"
	height="1em"
	role="img"
	aria-label={playing ? 'Audio playing' : 'Audio paused'}
	class="shrink-0 {TEXT_SIZE[size]} {TONE_TEXT[tone]} {className}"
	{...restProps}
>
	{#each Array.from({ length: count }) as _, i (i)}
		{@const levels = LEVELS[i % LEVELS.length]}
		{#if playing}
			<rect x={i * 3} width="2" rx="1" fill="currentColor" y="5" height="5">
				<animate attributeName="height" values={levels} dur="{PERIODS[i % PERIODS.length]}s" repeatCount="indefinite" />
				<animate
					attributeName="y"
					values={levels.split(';').map((v) => 10 - Number(v)).join(';')}
					dur="{PERIODS[i % PERIODS.length]}s"
					repeatCount="indefinite"
				/>
			</rect>
		{:else}
			<rect x={i * 3} width="2" rx="1" fill="currentColor" y="8" height="2" />
		{/if}
	{/each}
</svg>
