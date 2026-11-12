<!-- @component The live theme editor: mode, named theme, colour, radius, density, motion, a preview, and copy or reset. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luCheck, luCopy, luRotateCcw } from '@fractaldesign/icons/lucide';
	import { Button } from '../../actions/button/index.js';
	import { roving } from '../../../internal/roving.js';
	import { vars } from '../../../motion/index.js';
	import {
		defaultTheme,
		theme as shared,
		themes,
		type ThemeDensity,
		type ThemeMotion,
		type ThemeMode,
		type ThemeName,
		type ThemeRadius,
		type ThemeSettings
	} from '../../../theme/index.js';
	import { ModeToggle } from '../mode-toggle/index.js';
	import { ThemePicker } from '../theme-picker/index.js';
	import { ThemeProvider } from '../theme-provider/index.js';
	import type { CustomizerSection } from './sections.js';

	const ALL: CustomizerSection[] = ['mode', 'theme', 'color', 'radius', 'density', 'motion', 'preview'];
	const radii: { id: ThemeRadius; name: string }[] = [
		{ id: 'sharp', name: 'Sharp' },
		{ id: 'soft', name: 'Soft' },
		{ id: 'round', name: 'Round' }
	];
	const densities: { id: ThemeDensity; name: string }[] = [
		{ id: 'compact', name: 'Compact' },
		{ id: 'cozy', name: 'Cozy' },
		{ id: 'comfortable', name: 'Comfortable' }
	];
	const motions: { id: ThemeMotion; name: string }[] = [
		{ id: 'off', name: 'Off' },
		{ id: 'calm', name: 'Calm' },
		{ id: 'snappy', name: 'Snappy' },
		{ id: 'playful', name: 'Playful' }
	];

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/** The settings. Bindable. Leave it undefined to read and write the shared `theme`. */
		value?: ThemeSettings;
		/** Called with the new settings whenever a control changes. */
		onValueChange?: (value: ThemeSettings) => void;
		/** Which sections to show, in order. Defaults to every section. */
		sections?: CustomizerSection[];
	}

	let {
		value = $bindable(),
		onValueChange,
		sections = ALL,
		class: klass,
		...rest
	}: Props = $props();

	const controlled = $derived(value !== undefined);
	const settings = $derived<ThemeSettings>(value ?? shared.settings);
	const preset = $derived(themes.find((t) => t.id === settings.theme) ?? themes[0]);
	const hue = $derived(settings.hue ?? preset.hue);
	const chroma = $derived(settings.chroma ?? preset.chroma);
	const tint = $derived(settings.tint ?? preset.tint);
	const shown = $derived(sections.length ? sections : ALL);

	let copied = $state<'css' | 'config' | null>(null);
	let copyTimer: ReturnType<typeof setTimeout> | undefined;

	function emit(next: ThemeSettings): void {
		if (controlled) value = next;
		else shared.set(next);
		onValueChange?.(next);
	}

	function patch(partial: Partial<ThemeSettings>): void {
		emit({ ...settings, ...partial });
	}

	function setTheme(name: ThemeName): void {
		emit({ ...settings, theme: name, hue: null, chroma: null, tint: null });
	}

	function setMode(mode: ThemeMode): void {
		if (!controlled) void shared.setMode(mode);
		else patch({ mode });
	}

	function reset(): void {
		if (controlled) emit({ ...defaultTheme });
		else {
			shared.reset();
			onValueChange?.(defaultTheme);
		}
	}

	function cssText(): string {
		const lines = [
			`data-theme="${settings.theme}"`,
			`data-mode="${settings.mode}"`,
			`data-radius="${settings.radius}"`,
			`data-density="${settings.density}"`,
			`data-motion="${settings.motion}"`
		];
		if (settings.hue !== null) lines.push(`--hue: ${settings.hue};`);
		if (settings.chroma !== null) lines.push(`--chroma: ${settings.chroma};`);
		if (settings.tint !== null) lines.push(`--tint: ${settings.tint};`);
		return lines.join('\n');
	}

	async function copy(kind: 'css' | 'config'): Promise<void> {
		const text = kind === 'css' ? cssText() : JSON.stringify(settings, null, 2);
		try {
			await navigator.clipboard.writeText(text);
		} catch {
			return;
		}
		copied = kind;
		clearTimeout(copyTimer);
		copyTimer = setTimeout(() => (copied = null), 1600);
	}

	function has(section: CustomizerSection): boolean {
		return shown.includes(section);
	}

	$effect(() => {
		return () => clearTimeout(copyTimer);
	});
</script>

{#snippet slider(name: string, min: number, max: number, step: number, current: number, display: string, track: string, change: (value: number) => void)}
	<div class="box gap-xs">
		<div class="row ycenter xbetween">
			<span class="text-sm text-secondary">{name}</span>
			<span class="text-sm tabular-nums text-muted">{display}</span>
		</div>
		<div class={['rail track relative', track]} {@attach vars({ value: (current - min) / (max - min), hue, 'ramp-max': 0.3 })}>
			<span class="thumb"></span>
			<input
				class="scrub"
				type="range"
				{min}
				{max}
				{step}
				value={current}
				aria-label={name}
				oninput={(event) => change(Number(event.currentTarget.value))}
			/>
		</div>
	</div>
{/snippet}

<div class={['box gap-lg pad-lg radius-lg border bg-panel', klass]} {...rest}>
	{#if has('mode')}
		<div class="box gap-sm">
			<p class="text-sm weight-500">Mode</p>
			<ModeToggle variant="segmented" withSystem value={settings.mode} onValueChange={setMode} />
		</div>
	{/if}

	{#if has('theme')}
		<div class="box gap-sm">
			<p class="text-sm weight-500">Theme</p>
			<ThemePicker showLabels value={settings.theme} onValueChange={setTheme} />
		</div>
	{/if}

	{#if has('color')}
		<div class="box gap-md">
			<p class="text-sm weight-500">Colour</p>
			{@render slider('Hue', 0, 360, 1, hue, String(Math.round(hue)), 'hue-track', (v) => patch({ hue: v }))}
			{@render slider('Chroma', 0, 0.3, 0.005, chroma, chroma.toFixed(3), 'ramp', (v) => patch({ chroma: v }))}
			{@render slider('Tint', 0, 0.04, 0.001, tint, tint.toFixed(3), 'ramp', (v) => patch({ tint: v }))}
		</div>
	{/if}

	{#if has('radius')}
		<div class="box gap-sm">
			<p class="text-sm weight-500">Radius</p>
			<div role="radiogroup" aria-label="Radius" class="choice-group text-sm" {@attach roving({ orientation: 'horizontal', onNavigate: (item) => item.click() })}>
				{#each radii as option (option.id)}
					<button type="button" role="radio" aria-checked={option.id === settings.radius} tabindex={option.id === settings.radius ? 0 : -1} class="bare choice weight-500" onclick={() => patch({ radius: option.id })}>
						{option.name}
					</button>
				{/each}
			</div>
		</div>
	{/if}

	{#if has('density')}
		<div class="box gap-sm">
			<p class="text-sm weight-500">Density</p>
			<div role="radiogroup" aria-label="Density" class="choice-group text-sm" {@attach roving({ orientation: 'horizontal', onNavigate: (item) => item.click() })}>
				{#each densities as option (option.id)}
					<button type="button" role="radio" aria-checked={option.id === settings.density} tabindex={option.id === settings.density ? 0 : -1} class="bare choice weight-500" onclick={() => patch({ density: option.id })}>
						{option.name}
					</button>
				{/each}
			</div>
		</div>
	{/if}

	{#if has('motion')}
		<div class="box gap-sm">
			<p class="text-sm weight-500">Motion</p>
			<div role="radiogroup" aria-label="Motion" class="choice-group text-sm" {@attach roving({ orientation: 'horizontal', onNavigate: (item) => item.click() })}>
				{#each motions as option (option.id)}
					<button type="button" role="radio" aria-checked={option.id === settings.motion} tabindex={option.id === settings.motion ? 0 : -1} class="bare choice weight-500" onclick={() => patch({ motion: option.id })}>
						{option.name}
					</button>
				{/each}
			</div>
		</div>
	{/if}

	{#if has('preview')}
		<ThemeProvider
			theme={settings.theme}
			mode={settings.mode}
			hue={hue}
			chroma={chroma}
			tint={tint}
			radius={settings.radius}
			density={settings.density}
			motion={settings.motion}
			class="box gap-sm pad-bs radius-md border"
		>
			<p class="text-xs text-muted">Preview</p>
			<p class="weight-600">Invoice INV-2048</p>
			<p class="text-sm text-secondary tabular-nums">$1,284.00 due 18 Nov</p>
			<div class="row wrap gap-sm">
				<Button size="sm">Pay now</Button>
				<Button size="sm" variant="secondary">Download PDF</Button>
				<Button size="sm" variant="themed">Accent</Button>
				<span class="tag ink-auto">Published</span>
			</div>
		</ThemeProvider>
	{/if}

	<div class="row wrap gap-sm">
		<Button size="sm" variant="secondary" onclick={reset}>
			<Icon icon={luRotateCcw} />
			Reset
		</Button>
		<Button size="sm" variant="outline" onclick={() => copy('css')}>
			<Icon icon={copied === 'css' ? luCheck : luCopy} />
			{copied === 'css' ? 'Copied CSS' : 'Copy CSS'}
		</Button>
		<Button size="sm" variant="outline" onclick={() => copy('config')}>
			<Icon icon={copied === 'config' ? luCheck : luCopy} />
			{copied === 'config' ? 'Copied config' : 'Copy config'}
		</Button>
	</div>
</div>
