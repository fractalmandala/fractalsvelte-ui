<!-- @component An interactive audio waveform visualizer and scrubber with progress fill and seek support. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Size, Surface, Border, Shape, Shadow, TextSize, Variant, Message } from '$lib/types.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Bar heights from 0 to 1, one per bar. */
		peaks?: number[];
		progress?: number;
		duration?: number;
		barWidth?: number;
		barGap?: number;
		/** Lets the user click or drag to seek, which fires `onseek`. */
		interactive?: boolean;
		variant?: Variant | Message;
		surface?: Surface;
		border?: Border;
		shape?: Shape;
		shadow?: Shadow;
		textsize?: TextSize;
		class?: string;
		onseek?: (progress: number) => void;
	}

	// Default representative audio waveform peaks
	const defaultPeaks = [
		0.2, 0.35, 0.6, 0.45, 0.8, 0.95, 0.7, 0.5, 0.65, 0.85,
		0.4, 0.3, 0.55, 0.75, 0.9, 0.6, 0.45, 0.7, 0.8, 0.5,
		0.35, 0.6, 0.85, 0.95, 0.65, 0.4, 0.55, 0.7, 0.9, 0.75,
		0.5, 0.35, 0.6, 0.7, 0.85, 0.65, 0.45, 0.3, 0.5, 0.25
	];

	let {
		peaks = defaultPeaks,
		progress = $bindable(35),
		duration,
		barWidth = 4,
		barGap = 2,
		interactive = true,
		variant = 'primary',
		surface = 'bg-panel',
		border = 'border',
		shape = 'curved',
		shadow = 'shad-sm',
		textsize = 'text-md',
		class: className = '',
		onseek,
		...restProps
	}: Props = $props();

	let containerEl: HTMLDivElement | undefined = $state();
	let width = $state(0);
	let height = $state(0);
	let isDragging = $state(false);

	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
	}

	function handlePointer(clientX: number) {
		if (!containerEl || !interactive) return;
		const rect = containerEl.getBoundingClientRect();
		const raw = (clientX - rect.left) / rect.width;
		const clamped = Math.max(0, Math.min(100, Math.round(raw * 100)));
		progress = clamped;
		onseek?.(clamped);
	}

	function handlePointerDown(e: PointerEvent) {
		if (!interactive) return;
		isDragging = true;
		containerEl?.setPointerCapture(e.pointerId);
		handlePointer(e.clientX);
	}

	function handlePointerMove(e: PointerEvent) {
		if (!isDragging || !interactive) return;
		handlePointer(e.clientX);
	}

	function handlePointerUp(e: PointerEvent) {
		if (!isDragging) return;
		isDragging = false;
		try {
			containerEl?.releasePointerCapture(e.pointerId);
		} catch {}
	}
</script>

<div class="box gap-xs {textsize} {className}">
	<!-- The bars are drawn as SVG in the container's own pixel box, measured
	     with bind:clientWidth, so nothing writes a CSS position. -->
	<div
		bind:this={containerEl}
		bind:clientWidth={width}
		bind:clientHeight={height}
		role="slider"
		tabindex={interactive ? 0 : -1}
		aria-label="Audio waveform"
		aria-valuemin={0}
		aria-valuemax={100}
		aria-valuenow={progress}
		class="relative wfull h-3xl touch-none focus-theme {shape} {surface} {border} {shadow} {interactive ? 'pointer' : ''}"
		onpointerdown={handlePointerDown}
		onpointermove={handlePointerMove}
		onpointerup={handlePointerUp}
		{...restProps}
	>
		{#if width > 0 && height > 0}
			{@const slot = width / peaks.length}
			<svg class="absolute full text-theme" viewBox="0 0 {width} {height}" aria-hidden="true">
				{#each peaks as peak, i (i)}
					{@const played = (i / peaks.length) * 100 <= progress}
					{@const h = Math.max(0.12, Math.min(1, peak)) * (height - 16)}
					<rect
						x={i * slot + (slot - barWidth) / 2}
						y={(height - h) / 2}
						width={barWidth}
						height={h}
						rx={barWidth / 2}
						class={played ? '' : 'text-muted'}
						fill="currentColor"
						opacity={played ? 1 : 0.45}
					/>
				{/each}
				{#if interactive}
					<line x1={(progress / 100) * width} x2={(progress / 100) * width} y1="6" y2={height - 6} stroke="currentColor" stroke-width="2" stroke-linecap="round" />
				{/if}
			</svg>
		{/if}
	</div>

	{#if duration}
		<div class="row xbetween text-xs text-secondary font-mono tabular-nums px-xs">
			<span>{formatTime((progress / 100) * duration)}</span>
			<span>{formatTime(duration)}</span>
		</div>
	{/if}
</div>
