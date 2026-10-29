<!-- @component A knob-style dial that sets a value by dragging or arrow keys. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { MessageText, Size } from '../types';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		/** The dial is twice the control height across. */
		size?: Size;
		tone?: MessageText;
		label?: string;
		unit?: string;
		showTicks?: boolean;
		showReadout?: boolean;
		disabled?: boolean;
		class?: string;
	}

	let {
		value = $bindable(0),
		min = 0,
		max = 100,
		step = 1,
		size = 'h-lg',
		tone,
		label,
		unit = '',
		showTicks = true,
		showReadout = true,
		disabled = false,
		class: className = '',
		...restProps
	}: Props = $props();

	let dialEl: HTMLDivElement | undefined = $state();
	let dragging = false;

	// 270° sweep, 0° at 12 o'clock. Rotation is the SVG transform attribute.
	const MIN_ANGLE = -135;
	const ARC = 270;
	const angle = $derived(MIN_ANGLE + ((Math.min(max, Math.max(min, value)) - min) / (max - min || 1)) * ARC);
	const TICKS = Array.from({ length: 11 }, (_, i) => MIN_ANGLE + (i / 10) * ARC);

	// Arc path for the filled sweep (r 44 around 50,50)
	function polar(deg: number, r: number) {
		const rad = ((deg - 90) * Math.PI) / 180;
		return [50 + r * Math.cos(rad), 50 + r * Math.sin(rad)];
	}
	const arcPath = $derived.by(() => {
		const [x1, y1] = polar(MIN_ANGLE, 44);
		const [x2, y2] = polar(angle, 44);
		const large = angle - MIN_ANGLE > 180 ? 1 : 0;
		return `M ${x1} ${y1} A 44 44 0 ${large} 1 ${x2} ${y2}`;
	});

	function fromPointer(e: PointerEvent) {
		if (!dialEl || disabled) return;
		const rect = dialEl.getBoundingClientRect();
		let deg = (Math.atan2(e.clientY - (rect.top + rect.height / 2), e.clientX - (rect.left + rect.width / 2)) * 180) / Math.PI + 90;
		if (deg > 180) deg -= 360;
		const pct = (Math.min(MIN_ANGLE + ARC, Math.max(MIN_ANGLE, deg)) - MIN_ANGLE) / ARC;
		let raw = min + pct * (max - min);
		if (step > 0) raw = Math.round((raw - min) / step) * step + min;
		value = Math.min(max, Math.max(min, Number(raw.toFixed(2))));
	}

	function onkeydown(e: KeyboardEvent) {
		if (disabled) return;
		const d = step || 1;
		const map: Record<string, number> = {
			ArrowUp: value + d,
			ArrowRight: value + d,
			ArrowDown: value - d,
			ArrowLeft: value - d,
			Home: min,
			End: max
		};
		if (!(e.key in map)) return;
		e.preventDefault();
		value = Math.min(max, Math.max(min, map[e.key]));
	}
</script>

<div class="box xcenter gap-xs {className}" {...restProps}>
	{#if label}<span class="text-sm weight-500 text-secondary">{label}</span>{/if}
	<div
		bind:this={dialEl}
		role="slider"
		tabindex={disabled ? -1 : 0}
		aria-label={label ?? 'Rotary dial'}
		aria-valuemin={min}
		aria-valuemax={max}
		aria-valuenow={value}
		aria-valuetext="{value}{unit}"
		aria-disabled={disabled || undefined}
		class="radius-full {disabled ? 'text-muted' : (tone ?? 'text-theme')}"
		onpointerdown={(e) => {
			if (disabled) return;
			dragging = true;
			e.currentTarget.setPointerCapture(e.pointerId);
			fromPointer(e);
		}}
		onpointermove={(e) => dragging && fromPointer(e)}
		onpointerup={() => (dragging = false)}
		onpointercancel={() => (dragging = false)}
		{onkeydown}
	>
		<svg viewBox="0 0 100 100" width="calc(var(--height-{size.slice(2)}) * 2)" height="calc(var(--height-{size.slice(2)}) * 2)" aria-hidden="true">
			{#if showTicks}
				{#each TICKS as t (t)}
					<line
						x1="50"
						y1="2"
						x2="50"
						y2="8"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						opacity={t <= angle ? 1 : 0.25}
						transform="rotate({t} 50 50)"
					/>
				{/each}
			{/if}
			<path d={arcPath} fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity="0.5" />
			<circle cx="50" cy="50" r="34" class="text-muted" fill="currentColor" opacity="0.25" />
			<circle cx="50" cy="50" r="34" class="text-secondary" fill="none" stroke="currentColor" stroke-width="1.5" />
			<g transform="rotate({angle} 50 50)">
				<line x1="50" y1="22" x2="50" y2="36" stroke="currentColor" stroke-width="5" stroke-linecap="round" />
			</g>
			<circle cx="50" cy="50" r="6" class="text-secondary" fill="currentColor" />
		</svg>
	</div>
	{#if showReadout}<span class="chip tabular-nums bg-sunken text-secondary">{value}{unit}</span>{/if}
</div>
