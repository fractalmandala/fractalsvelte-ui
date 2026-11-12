<!-- @component A saturation-brightness area, hue slider and optional alpha slider for picking a CSS colour, in hex, rgb or oklch. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luPipette } from '@fractaldesign/icons/lucide';
	import { vars } from '../../../motion/index.js';
	import { textClass } from '../../../internal/tokens.js';
	import { equalHsv, formatColor, formatSolid, parseColor, type ColorFormat, type Hsv } from './color.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/** The colour as a CSS string in the current `format`. Bindable. */
		value?: string;
		/** Called whenever the person changes the colour. */
		onValueChange?: (value: string) => void;
		/** The CSS notation used for `value` and the text field. */
		format?: ColorFormat;
		/** Quick-pick colours listed under the sliders. */
		swatches?: string[];
		/** Shows an alpha slider and includes alpha in the CSS string. */
		alpha?: boolean;
		/** Blocks pointer and keyboard input. */
		disabled?: boolean;
		/** The name of the hidden input that carries the CSS colour in a form submission. */
		name?: string;
		/** Accessible name of the picker. */
		label?: string;
	}

	let {
		value = $bindable('#2563eb'),
		onValueChange,
		format = 'hex',
		swatches,
		alpha = false,
		disabled = false,
		name,
		label,
		class: klass,
		...rest
	}: Props = $props();

	const fallback: Hsv = { h: 221, s: 0.83, v: 0.92, a: 1 };

	function fromValue(raw: string): Hsv {
		return parseColor(raw) ?? fallback;
	}

	let hsv = $state<Hsv>(fromValue(typeof value === 'string' ? value : '#2563eb'));
	let draft = $state(typeof value === 'string' ? value : '#2563eb');
	let hasEye = $state(false);

	$effect(() => {
		hasEye = typeof window !== 'undefined' && 'EyeDropper' in window;
	});

	let lastFormat: ColorFormat | undefined;
	$effect(() => {
		const current = format;
		if (lastFormat === undefined) {
			lastFormat = current;
			return;
		}
		if (lastFormat === current) return;
		lastFormat = current;
		commit(hsv);
	});

	$effect(() => {
		const parsed = parseColor(value);
		if (!parsed) return;
		if (
			Math.abs(parsed.h - hsv.h) < 0.5 &&
			Math.abs(parsed.s - hsv.s) < 0.005 &&
			Math.abs(parsed.v - hsv.v) < 0.005 &&
			Math.abs(parsed.a - hsv.a) < 0.005
		)
			return;
		hsv = parsed;
		draft = formatColor(parsed, format);
	});

	const css = $derived(formatColor(hsv, format));
	const solid = $derived(formatSolid(hsv, 'hex'));
	const vx = $derived(hsv.s);
	const vy = $derived(1 - hsv.v);

	function commit(next: Hsv) {
		const colour = { ...next, a: alpha ? next.a : 1 };
		hsv = colour;
		const out = formatColor(colour, format);
		draft = out;
		if (value !== out) {
			value = out;
			onValueChange?.(out);
		}
	}

	function applyText() {
		const parsed = parseColor(draft);
		if (parsed) commit(parsed);
		else draft = css;
	}

	let plane = $state<HTMLElement>();
	let dragging = $state<'plane' | 'hue' | 'alpha' | null>(null);

	function fromPlane(event: PointerEvent): { s: number; v: number } {
		const box = plane?.getBoundingClientRect();
		if (!box) return { s: hsv.s, v: hsv.v };
		return {
			s: Math.min(1, Math.max(0, (event.clientX - box.left) / box.width)),
			v: Math.min(1, Math.max(0, 1 - (event.clientY - box.top) / box.height))
		};
	}

	function planeDown(event: PointerEvent) {
		if (disabled || event.button !== 0) return;
		dragging = 'plane';
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
		const { s, v } = fromPlane(event);
		commit({ ...hsv, s, v });
		(event.currentTarget as HTMLElement).focus();
		event.preventDefault();
	}

	function planeMove(event: PointerEvent) {
		if (dragging !== 'plane') return;
		const { s, v } = fromPlane(event);
		commit({ ...hsv, s, v });
	}

	function up(event: PointerEvent) {
		if (!dragging) return;
		dragging = null;
		(event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
	}

	function planeKey(event: KeyboardEvent) {
		if (disabled) return;
		const step = event.shiftKey ? 0.1 : 0.02;
		let s = hsv.s;
		let v = hsv.v;
		switch (event.key) {
			case 'ArrowLeft':
				s -= step;
				break;
			case 'ArrowRight':
				s += step;
				break;
			case 'ArrowDown':
				v -= step;
				break;
			case 'ArrowUp':
				v += step;
				break;
			default:
				return;
		}
		event.preventDefault();
		commit({ ...hsv, s: Math.min(1, Math.max(0, s)), v: Math.min(1, Math.max(0, v)) });
	}

	let hueTrack = $state<HTMLElement>();
	let alphaTrack = $state<HTMLElement>();

	function along(event: PointerEvent, node: HTMLElement | undefined): number {
		const box = node?.getBoundingClientRect();
		if (!box) return 0;
		return Math.min(1, Math.max(0, (event.clientX - box.left) / box.width));
	}

	function hueDown(event: PointerEvent) {
		if (disabled || event.button !== 0) return;
		dragging = 'hue';
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
		commit({ ...hsv, h: along(event, hueTrack) * 360 });
		event.preventDefault();
	}

	function hueMove(event: PointerEvent) {
		if (dragging !== 'hue') return;
		commit({ ...hsv, h: along(event, hueTrack) * 360 });
	}

	function hueKey(event: KeyboardEvent) {
		if (disabled) return;
		const step = event.shiftKey ? 15 : 2;
		let h: number | undefined;
		switch (event.key) {
			case 'ArrowLeft':
			case 'ArrowDown':
				h = hsv.h - step;
				break;
			case 'ArrowRight':
			case 'ArrowUp':
				h = hsv.h + step;
				break;
			case 'Home':
				h = 0;
				break;
			case 'End':
				h = 360;
				break;
			default:
				return;
		}
		event.preventDefault();
		commit({ ...hsv, h: (h + 360) % 360 });
	}

	function alphaDown(event: PointerEvent) {
		if (disabled || event.button !== 0) return;
		dragging = 'alpha';
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
		commit({ ...hsv, a: along(event, alphaTrack) });
		event.preventDefault();
	}

	function alphaMove(event: PointerEvent) {
		if (dragging !== 'alpha') return;
		commit({ ...hsv, a: along(event, alphaTrack) });
	}

	function alphaKey(event: KeyboardEvent) {
		if (disabled) return;
		const step = event.shiftKey ? 0.1 : 0.02;
		let a: number | undefined;
		switch (event.key) {
			case 'ArrowLeft':
			case 'ArrowDown':
				a = hsv.a - step;
				break;
			case 'ArrowRight':
			case 'ArrowUp':
				a = hsv.a + step;
				break;
			case 'Home':
				a = 0;
				break;
			case 'End':
				a = 1;
				break;
			default:
				return;
		}
		event.preventDefault();
		commit({ ...hsv, a: Math.min(1, Math.max(0, a)) });
	}

	async function eyeDrop() {
		if (disabled || typeof window === 'undefined' || !('EyeDropper' in window)) return;
		type EyeDropperCtor = new () => { open: () => Promise<{ sRGBHex: string }> };
		const Eye = (window as unknown as { EyeDropper: EyeDropperCtor }).EyeDropper;
		try {
			const { sRGBHex } = await new Eye().open();
			const parsed = parseColor(sRGBHex);
			if (parsed) commit(parsed);
		} catch {
			/* the person cancelled */
		}
	}

	function swatchOn(colour: string): boolean {
		const parsed = parseColor(colour);
		if (!parsed) return false;
		const left = alpha ? hsv : { ...hsv, a: 1 };
		const right = alpha ? parsed : { ...parsed, a: 1 };
		return equalHsv(left, right);
	}

	function pickSwatch(colour: string) {
		const parsed = parseColor(colour);
		if (parsed) commit({ ...parsed, a: alpha ? parsed.a : 1 });
	}
</script>

<div
	class={['box gap-sm measure-xs', textClass.md, disabled && 'disabled', klass]}
	{@attach vars({ angle: hsv.h, color: css, 'color-solid': solid })}
	{...rest}
>
	<div
		bind:this={plane}
		role="slider"
		tabindex={disabled ? -1 : 0}
		aria-label={label ? `${label} saturation and brightness` : 'Saturation and brightness'}
		aria-valuemin={0}
		aria-valuemax={100}
		aria-valuenow={Math.round(hsv.s * 100)}
		aria-valuetext={`Saturation ${Math.round(hsv.s * 100)}%, brightness ${Math.round(hsv.v * 100)}%`}
		aria-disabled={disabled || undefined}
		class={['plane relative wfull frame-3-2 modern overflow-hidden', disabled ? 'disabled' : 'pointer touch-none']}
		onpointerdown={planeDown}
		onpointermove={planeMove}
		onpointerup={up}
		onpointercancel={up}
		onkeydown={planeKey}
	>
		<div class="thumb free h-md border" {@attach vars({ vx, vy })}></div>
	</div>

	<div
		bind:this={hueTrack}
		role="slider"
		tabindex={disabled ? -1 : 0}
		aria-label={label ? `${label} hue` : 'Hue'}
		aria-valuemin={0}
		aria-valuemax={360}
		aria-valuenow={Math.round(hsv.h)}
		aria-valuetext={`${Math.round(hsv.h)} degrees`}
		aria-disabled={disabled || undefined}
		class={['track spectrum relative wfull h-sm', disabled ? 'disabled' : 'pointer touch-none']}
		onpointerdown={hueDown}
		onpointermove={hueMove}
		onpointerup={up}
		onpointercancel={up}
		onkeydown={hueKey}
	>
		<div class="thumb h-md" {@attach vars({ value: hsv.h / 360 })}></div>
	</div>

	{#if alpha}
		<div
			bind:this={alphaTrack}
			role="slider"
			tabindex={disabled ? -1 : 0}
			aria-label={label ? `${label} opacity` : 'Opacity'}
			aria-valuemin={0}
			aria-valuemax={100}
			aria-valuenow={Math.round(hsv.a * 100)}
			aria-valuetext={`${Math.round(hsv.a * 100)}%`}
			aria-disabled={disabled || undefined}
			class={['track fade relative wfull h-sm', disabled ? 'disabled' : 'pointer touch-none']}
			onpointerdown={alphaDown}
			onpointermove={alphaMove}
			onpointerup={up}
			onpointercancel={up}
			onkeydown={alphaKey}
		>
			<div class="thumb h-md" {@attach vars({ value: hsv.a })}></div>
		</div>
	{/if}

	<div class="row ycenter gap-sm">
		<div class="swatch square h-xl modern shrink-0 border" {@attach vars({ color: css })} aria-hidden="true"></div>
		<input
			type="text"
			class="input grow bg-input border modern h-lg text-sm font-mono"
			spellcheck="false"
			autocomplete="off"
			aria-label={label ? `${label} colour value` : 'Colour value'}
			{disabled}
			value={draft}
			oninput={(e) => (draft = (e.currentTarget as HTMLInputElement).value)}
			onchange={applyText}
			onkeydown={(e) => e.key === 'Enter' && applyText()}
		/>
		{#if hasEye}
			<button type="button" class="button btn-icon ghost modern h-lg" aria-label="Pick a colour from the screen" {disabled} onclick={eyeDrop}>
				<Icon icon={luPipette} />
			</button>
		{/if}
	</div>

	{#if swatches?.length}
		<div class="row wrap gap-xs" role="group" aria-label="Swatches">
			{#each swatches as colour (colour)}
				<button
					type="button"
					class={['cell swatch h-lg', swatchOn(colour) && 'selected']}
					aria-label={colour}
					aria-pressed={swatchOn(colour)}
					{disabled}
					onclick={() => pickSwatch(colour)}
					{@attach vars({ color: colour })}
				></button>
			{/each}
		</div>
	{/if}

	{#if name}
		<input type="hidden" {name} value={css} {disabled} />
	{/if}
</div>
