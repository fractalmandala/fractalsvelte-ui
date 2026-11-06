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
	const fillPercent = $derived(((value - min) / (max - min)) * 100);

	function handleInput(e: Event & { currentTarget: HTMLInputElement }) {
		value = Number(e.currentTarget.value);
		onchange?.(value);
	}
</script>

<div class="fader-root inline-flex flex-col items-center gap-xs {textsize} {className}" {...restProps}>
	{#if label || showValue}
		<div class="row xbetween ycenter w-full text-xs">
			{#if label}
				<span class="font-medium text-secondary">{label}</span>
			{/if}
			{#if showValue}
				<span class="font-mono text-muted">{value}</span>
			{/if}
		</div>
	{/if}

	<div
		class="fader-chassis relative inline-flex items-center justify-center select-none {isVertical ? 'h-48 w-12' : 'h-12 w-48'} {surface} {border} {shape} {shadow} {disabled ? 'opacity-50 pointer-events-none' : ''}"
	>
		<!-- Center Slot / Track Groove -->
		<div
			class="fader-groove absolute rounded-full bg-sunken {isVertical ? 'w-1.5 h-40' : 'h-1.5 w-40'}"
			style="box-shadow: inset 0 1px 2px rgba(0,0,0,0.3);"
		>
			<!-- Active level fill -->
			{#if isVertical}
				<div
					class="absolute bottom-0 left-0 right-0 rounded-full"
					style="height: {fillPercent}%; background-color: var(--theme-color); opacity: 0.8;"
				></div>
			{:else}
				<div
					class="absolute left-0 top-0 bottom-0 rounded-full"
					style="width: {fillPercent}%; background-color: var(--theme-color); opacity: 0.8;"
				></div>
			{/if}
		</div>

		<!-- Physical Tactile Thumb -->
		<div
			class="fader-thumb absolute pointer-events-none flex items-center justify-center bg-button shadow-md rounded-sm"
			style="{isVertical
				? `bottom: calc(${fillPercent}% - 12px); width: 34px; height: 24px;`
				: `left: calc(${fillPercent}% - 12px); width: 24px; height: 34px;`} border: 1px solid var(--border-strong);"
		>
			<!-- Center groove marks on thumb -->
			<div class="flex {isVertical ? 'flex-col gap-1' : 'flex-row gap-1'}">
				{#each Array(thumbMarks) as _, i}
					<div
						class="{isVertical ? 'w-4 h-[1.5px]' : 'w-[1.5px] h-4'} bg-white opacity-40 rounded-full"
					></div>
				{/each}
			</div>
		</div>

		<!-- Native input overlay for flawless interaction and accessibility -->
		<input
			type="range"
			{min}
			{max}
			{step}
			{value}
			{disabled}
			aria-label={label ?? 'Level Fader'}
			class="fader-input absolute inset-0 w-full h-full opacity-0 cursor-pointer {isVertical ? 'cursor-ns-resize' : 'cursor-ew-resize'}"
			style="{isVertical ? 'writing-mode: vertical-lr; direction: rtl;' : ''}"
			oninput={handleInput}
		/>
	</div>
</div>

<style>
	.fader-chassis {
		background-color: var(--bg-panel);
	}
</style>
