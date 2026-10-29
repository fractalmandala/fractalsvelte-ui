<!-- @component A colour input with optional hex field and preset swatches. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luCheck } from '@fractaldesign/icons/lucide';
	import type { Surface, Size, Shape } from '../types';
	import Input from './Input.svelte';
	import IconButton from '../actions/IconButton.svelte';

	export type ColorFormat = 'hex' | 'rgb' | 'hsl';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Always stored as #rrggbb; `format` only changes what the text field shows. */
		value?: string;
		presets?: string[];
		label?: string;
		description?: string;
		error?: boolean | string;
		disabled?: boolean;
		/** Shows the text field next to the swatch. */
		showInput?: boolean;
		/** How the text field reads and writes the colour. */
		format?: ColorFormat;
		showPresets?: boolean;
		surface?: Surface;
		size?: Size;
		shape?: Shape;
		id?: string;
		class?: string;
	}

	let {
		value = $bindable('#10b981'),
		presets = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b', '#64748b', '#18181b'],
		label,
		description,
		error,
		disabled = false,
		showInput = true,
		format = 'hex',
		showPresets = true,
		surface = 'bg-input',
		size = 'h-lg',
		shape = 'modern',
		id,
		class: className = '',
		...restProps
	}: Props = $props();

	const uid = $props.id();
	const colorId = $derived(id || uid);
	const errorMessage = $derived(typeof error === 'string' ? error : undefined);
	let text = $state('');

	const toHex = (n: number) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0');

	function hexToRgb(hex: string): [number, number, number] {
		const n = parseInt(hex.slice(1), 16);
		return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
	}

	function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
		r /= 255; g /= 255; b /= 255;
		const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
		if (max === min) return [0, 0, Math.round(l * 100)];
		const d = max - min;
		const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
		return [Math.round(h * 60), Math.round(s * 100), Math.round(l * 100)];
	}

	function hslToHex(h: number, s: number, l: number): string {
		s /= 100; l /= 100;
		const k = (n: number) => (n + h / 30) % 12;
		const a = s * Math.min(l, 1 - l);
		const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
		return '#' + toHex(f(0) * 255) + toHex(f(8) * 255) + toHex(f(4) * 255);
	}

	function display(hex: string): string {
		if (format === 'hex') return hex;
		const [r, g, b] = hexToRgb(hex);
		if (format === 'rgb') return `rgb(${r}, ${g}, ${b})`;
		const [h, s, l] = rgbToHsl(r, g, b);
		return `hsl(${h}, ${s}%, ${l}%)`;
	}

	function parse(input: string): string | undefined {
		const v = input.trim();
		const hex = v.startsWith('#') ? v : '#' + v;
		if (/^#[0-9a-fA-F]{6}$/.test(hex)) return hex.toLowerCase();
		const nums = v.match(/-?\d+(\.\d+)?/g)?.map(Number);
		if (!nums || nums.length < 3) return undefined;
		if (/^rgb/i.test(v)) return '#' + nums.slice(0, 3).map(toHex).join('');
		if (/^hsl/i.test(v)) return hslToHex(nums[0], nums[1], nums[2]);
		return undefined;
	}

	$effect.pre(() => {
		text = display(value);
	});

	function onText(e: Event) {
		text = (e.currentTarget as HTMLInputElement).value;
		const hex = parse(text);
		if (hex) value = hex;
	}

	const isSelected = (preset: string) => value.toLowerCase() === preset.toLowerCase();
</script>

<!-- The picked colour is user data, not design: the native colour input shows
     it, and preset swatches paint it as SVG fill. No theme colour is hardcoded. -->
<div class="box gap-xs {className}" {...restProps}>
	{#if label}<label class="text-xs weight-500 text-secondary" for="{colorId}-text">{label}</label>{/if}
	{#if description}<span class="text-body-sm text-muted">{description}</span>{/if}
	<div class="row ycenter gap-sm">
		<input
			type="color"
			bind:value
			{disabled}
			aria-label="Pick colour"
			class="shrink-0 frame-1-1 el-size el-shape {size} {shape} border-strong bg-surface"
			style:width="var(--height-{size.slice(2)})"
			style:padding="0"
		/>
		{#if showInput}
			<Input
				id="{colorId}-text"
				value={text}
				{disabled}
				{surface}
				{size}
				{shape}
				placeholder={display('#000000')}
				spellcheck="false"
				error={Boolean(error)}
				class="grow min0"
				oninput={onText}
			/>
		{/if}
	</div>
	{#if showPresets && presets.length > 0}
		<div class="row ycenter gap-xs wrap" role="radiogroup" aria-label="Colour presets">
			{#each presets as preset (preset)}
				<IconButton
					label={preset}
					icon="ghost"
					size="h-sm"
					shape="round"
					role="radio"
					aria-checked={isSelected(preset)}
					{disabled}
					onclick={() => (value = preset)}
				>
					<svg viewBox="0 0 24 24" width="1.5em" height="1.5em" aria-hidden="true">
						<circle cx="12" cy="12" r={isSelected(preset) ? 11 : 10} fill={preset} />
						{#if isSelected(preset)}
							<circle cx="12" cy="12" r="11" fill="none" class="text-primary" stroke="currentColor" stroke-width="2" />
						{/if}
					</svg>
				</IconButton>
			{/each}
		</div>
		{#if presets.some(isSelected)}
			<span class="row ycenter gap-xs text-sm text-muted"><Icon icon={luCheck} /> {display(value)}</span>
		{/if}
	{/if}
	{#if errorMessage}<p class="text-body-sm text-danger" role="alert">{errorMessage}</p>{/if}
</div>
