<!-- @component A studio audio level fader with tactile grooved thumb marks and vertical/horizontal orientation. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Size, Surface, Border, Shape, Shadow, TextSize, Orientation } from '$lib/types.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		orientation?: Orientation;
		disabled?: boolean;
		size?: Size;
		surface?: Surface;
		border?: Border;
		shape?: Shape;
		shadow?: Shadow;
		label?: string;
		showValue?: boolean;
		thumbMarks?: number;
		textsize?: TextSize;
		class?: string;
		onchange?: (value: number) => void;
	}

	let {
		value = $bindable(50),
		min = 0,
		max = 100,
		step = 1,
		orientation = 'vertical',
		disabled = false,
		size = 'h-xl',
		surface = 'bg-panel',
		border = 'border',
		shape = 'curved',
		shadow = 'shad-sm',
		label,
		showValue = true,
		thumbMarks = 3,
		textsize = 'text-md',
		class: className = '',
		onchange,
		...restProps
	}: Props = $props();

	const isVertical = $derived(orientation === 'vertical');

	// The fader is drawn as SVG in the chassis's own pixel box, measured with
	// bind:clientWidth, so nothing writes a CSS position. Vertical faders draw
	// the same geometry rotated, with the minimum at the bottom.
	const THUMB = 24;
	const MARGIN = 4;

	let width = $state(0);
	let height = $state(0);
	let chassisEl: HTMLDivElement | null = $state(null);
	let dragging = false;

	const fraction = $derived(max <= min ? 0 : (Math.max(min, Math.min(max, value)) - min) / (max - min));
	const long = $derived(isVertical ? height : width);
	const thick = $derived(isVertical ? width : height);
	const travel = $derived(Math.max(0, long - THUMB - MARGIN * 2));
	const start = MARGIN + THUMB / 2;
	const centre = $derived(start + fraction * travel);
	const thumbAcross = $derived(Math.max(8, thick - 8));
	const marks = $derived(Array.from({ length: Math.max(0, thumbMarks) }, (_, i) => centre + (i - (thumbMarks - 1) / 2) * 4));

	function set(next: number) {
		const raw = min + Math.round((next - min) / step) * step;
		const decimals = (step.toString().split('.')[1] || '').length;
		const rounded = Number(Math.max(min, Math.min(max, raw)).toFixed(decimals));
		if (rounded === value) return;
		value = rounded;
		onchange?.(value);
	}

	function fromPointer(e: PointerEvent) {
		if (!chassisEl || disabled) return;
		const rect = chassisEl.getBoundingClientRect();
		const len = isVertical ? rect.height : rect.width;
		const pos = isVertical ? rect.bottom - e.clientY : e.clientX - rect.left;
		const ratio = Math.max(0, Math.min(1, (pos - start) / Math.max(1, len - THUMB - MARGIN * 2)));
		set(min + ratio * (max - min));
	}

	function onpointerdown(e: PointerEvent) {
		if (disabled) return;
		dragging = true;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		fromPointer(e);
	}

	function onkeydown(e: KeyboardEvent) {
		if (disabled) return;
		const map: Record<string, number> = {
			ArrowRight: value + step,
			ArrowUp: value + step,
			ArrowLeft: value - step,
			ArrowDown: value - step,
			PageUp: value + step * 10,
			PageDown: value - step * 10,
			Home: min,
			End: max
		};
		if (!(e.key in map)) return;
		e.preventDefault();
		set(map[e.key]);
	}
</script>

<div class="box gap-xs {isVertical ? 'xcenter' : ''} {isVertical ? '' : 'track-min'} {textsize} {className}" {...restProps}>
	{#if label || showValue}
		<div class="row ycenter xbetween gap-sm text-xs">
			{#if label}<span class="weight-500 text-secondary">{label}</span>{/if}
			{#if showValue}<span class="font-mono tabular-nums text-muted">{value}</span>{/if}
		</div>
	{/if}
	<div
		bind:this={chassisEl}
		bind:clientWidth={width}
		bind:clientHeight={height}
		class="relative touch-none focus-theme {size} {isVertical ? 'track-v' : 'wfull'} {surface} {border} {shape} {shadow}"
		role="slider"
		tabindex={disabled ? -1 : 0}
		aria-orientation={orientation}
		aria-valuemin={min}
		aria-valuemax={max}
		aria-valuenow={value}
		aria-label={label ?? 'Level fader'}
		aria-disabled={disabled || undefined}
		{onpointerdown}
		onpointermove={(e) => dragging && fromPointer(e)}
		onpointerup={() => (dragging = false)}
		onpointercancel={() => (dragging = false)}
		{onkeydown}
	>
		{#if width > 0 && height > 0}
			<svg class="absolute full {disabled ? 'text-muted' : 'text-theme'}" viewBox="0 0 {width} {height}" aria-hidden="true">
				<g transform={isVertical ? `translate(0 ${height}) rotate(-90)` : undefined}>
					<!-- groove, then the level filled along it -->
					<rect x={start} y={thick / 2 - 3} width={travel} height="6" rx="3" class="text-muted" fill="currentColor" opacity="0.35" />
					<rect x={start} y={thick / 2 - 3} width={fraction * travel} height="6" rx="3" fill="currentColor" />
					<!-- thumb with its grip marks -->
					<rect
						x={centre - THUMB / 2}
						y={(thick - thumbAcross) / 2}
						width={THUMB}
						height={thumbAcross}
						rx="3"
						class={disabled ? 'text-muted' : 'text-primary'}
						fill="currentColor"
					/>
					{#each marks as x, i (i)}
						<line
							x1={x}
							x2={x}
							y1={(thick - thumbAcross) / 2 + 5}
							y2={(thick + thumbAcross) / 2 - 5}
							class="text-inverse"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							opacity="0.6"
						/>
					{/each}
				</g>
			</svg>
		{/if}
	</div>
</div>
