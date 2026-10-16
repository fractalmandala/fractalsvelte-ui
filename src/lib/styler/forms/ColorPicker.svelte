<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from 'fractalicons';
	import { luCheck } from 'fractalicons/lucide';
	import type { FsFieldVariant, FsSize, FsShape } from '../types';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		value?: string;
		presets?: string[];
		label?: string;
		description?: string;
		error?: boolean | string;
		disabled?: boolean;
		showHexInput?: boolean;
		showPresets?: boolean;
		variant?: FsFieldVariant;
		size?: FsSize;
		shape?: FsShape;
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
		showHexInput = true,
		showPresets = true,
		variant = 'primary',
		size = 'lg',
		shape = 'modern',
		id,
		class: className = '',
		...restProps
	}: Props = $props();

	const uid = $props.id();
	const colorId = $derived(id || uid);
	const errorMessage = $derived(typeof error === 'string' ? error : undefined);
	let hexText = $state('');

	$effect.pre(() => {
		hexText = value;
	});

	function onHex(e: Event) {
		let val = (e.currentTarget as HTMLInputElement).value.trim();
		if (!val.startsWith('#') && /^[0-9a-fA-F]{6}$/.test(val)) val = '#' + val;
		hexText = val;
		if (/^#[0-9a-fA-F]{6}$/.test(val)) value = val;
	}

	const isSelected = (preset: string) => value.toLowerCase() === preset.toLowerCase();
</script>

<!-- The picked colour is user data, not design: the native colour input shows
     it, and preset swatches paint it as SVG fill. No theme colour is hardcoded. -->
<div class="box gap-xs {className}" {...restProps}>
	{#if label}<label class="text-xs weight-500 text-secondary" for="{colorId}-hex">{label}</label>{/if}
	{#if description}<span class="text-body-sm text-muted">{description}</span>{/if}
	<div class="row ycenter gap-sm">
		<input
			type="color"
			bind:value
			{disabled}
			aria-label="Pick colour"
			class="shrink-0 frame-1-1 h-lg radius-sm border-strong bg-surface"
		/>
		{#if showHexInput}
			<input
				id="{colorId}-hex"
				type="text"
				value={hexText}
				{disabled}
				maxlength={7}
				placeholder="#000000"
				spellcheck="false"
				aria-invalid={error ? true : undefined}
				class="input mono grow min0"
				data-variant={variant}
				data-size={size}
				data-shape={shape}
				oninput={onHex}
			/>
		{/if}
	</div>
	{#if showPresets && presets.length > 0}
		<div class="row ycenter gap-xs wrap" role="radiogroup" aria-label="Colour presets">
			{#each presets as preset (preset)}
				<button
					type="button"
					role="radio"
					aria-checked={isSelected(preset)}
					aria-label={preset}
					data-variant="iconbox"
					class="px-xs"
					data-size="icon-lg"
					data-shape="round"
					{disabled}
					onclick={() => (value = preset)}
				>
					<svg viewBox="0 0 24 24" width="1.75em" height="1.75em" aria-hidden="true">
						<circle cx="12" cy="12" r={isSelected(preset) ? 11 : 10} fill={preset} />
						{#if isSelected(preset)}
							<circle cx="12" cy="12" r="11" fill="none" class="text-primary" stroke="currentColor" stroke-width="2" />
						{/if}
					</svg>
				</button>
			{/each}
		</div>
		{#if presets.some(isSelected)}
			<span class="row ycenter gap-xs text-sm text-muted"><Icon icon={luCheck} /> {value}</span>
		{/if}
	{/if}
	{#if errorMessage}<p class="text-body-sm text-danger" role="alert">{errorMessage}</p>{/if}
</div>
