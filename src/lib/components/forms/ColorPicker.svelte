<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Size } from '../../types';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		value?: string;
		presets?: string[];
		label?: string;
		description?: string;
		error?: boolean | string;
		disabled?: boolean;
		size?: Size;
		showHexInput?: boolean;
		showPresets?: boolean;
		id?: string;
		class?: string;
	}

	let {
		value = $bindable('#10b981'),
		presets = [
			'#10b981',
			'#3b82f6',
			'#8b5cf6',
			'#ec4899',
			'#ef4444',
			'#f59e0b',
			'#64748b',
			'#18181b'
		],
		label,
		description,
		error,
		disabled = false,
		size = 'md',
		showHexInput = true,
		showPresets = true,
		id,
		class: className = '',
		...restProps
	}: Props = $props();

	let nativeColorInput: HTMLInputElement | null = $state(null);
	let hexText = $state(value || '#10b981');

	const autoId = 'f-col-' + Math.random().toString(36).slice(2, 9);
	const colorId = $derived(id || autoId);
	const hasError = $derived(Boolean(error));
	const errorMessage = $derived(typeof error === 'string' ? error : undefined);

	$effect(() => {
		if (value && value !== hexText) {
			hexText = value;
		}
	});

	function handleHexInput(e: Event) {
		const target = e.target as HTMLInputElement;
		let val = target.value.trim();
		if (!val.startsWith('#') && /^[0-9a-fA-F]{6}$/.test(val)) {
			val = '#' + val;
		}
		hexText = val;
		if (/^#[0-9a-fA-F]{6}$/.test(val)) {
			value = val;
		}
	}

	function handleNativeColor(e: Event) {
		const target = e.target as HTMLInputElement;
		value = target.value;
		hexText = target.value;
	}

	function selectPreset(preset: string) {
		if (disabled) return;
		value = preset;
		hexText = preset;
	}
</script>

<div
	class="f-color-picker {className}"
	data-size={size}
	data-disabled={disabled || undefined}
	data-invalid={hasError || undefined}
	{...restProps}
>
	{#if label}
		<label class="f-color-label" for="{colorId}-hex">
			{label}
		</label>
	{/if}

	{#if description}
		<span class="f-color-desc">{description}</span>
	{/if}

	<div class="f-color-control">
		<button
			type="button"
			class="f-color-swatch-btn"
			{disabled}
			onclick={() => nativeColorInput?.click()}
			aria-label="Pick color"
		>
			<span class="f-color-swatch" style="background-color: {value};"></span>
		</button>

		<input
			bind:this={nativeColorInput}
			type="color"
			value={value}
			{disabled}
			class="f-color-native-input"
			oninput={handleNativeColor}
			tabindex={-1}
		/>

		{#if showHexInput}
			<div class="f-color-hex-wrapper">
				<input
					id="{colorId}-hex"
					type="text"
					value={hexText}
					{disabled}
					maxlength="7"
					placeholder="#000000"
					class="f-color-hex-input"
					oninput={handleHexInput}
				/>
			</div>
		{/if}
	</div>

	{#if showPresets && presets.length > 0}
		<div class="f-color-presets" role="radiogroup" aria-label="Color presets">
			{#each presets as preset}
				<button
					type="button"
					role="radio"
					aria-checked={value.toLowerCase() === preset.toLowerCase()}
					aria-label={preset}
					class="f-color-preset-dot"
					class:selected={value.toLowerCase() === preset.toLowerCase()}
					style="background-color: {preset};"
					{disabled}
					onclick={() => selectPreset(preset)}
				>
					{#if value.toLowerCase() === preset.toLowerCase()}
						<svg class="f-color-preset-check" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3">
							<polyline points="20 6 9 17 4 12"></polyline>
						</svg>
					{/if}
				</button>
			{/each}
		</div>
	{/if}

	{#if errorMessage}
		<p class="f-color-error-msg" role="alert">{errorMessage}</p>
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-color-picker {
			display: inline-flex;
			flex-direction: column;
			gap: var(--f-space-2xs);
			font-family: inherit;
			box-sizing: border-box;
		}

		.f-color-label {
			font-size: var(--f-text-sm);
			font-weight: 500;
			color: var(--f-text);
			user-select: none;
		}

		.f-color-desc {
			font-size: var(--f-text-xs);
			color: var(--f-text-muted);
			margin-top: -2px;
		}

		.f-color-control {
			display: flex;
			align-items: center;
			gap: var(--f-space-xs);
		}

		.f-color-swatch-btn {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			background: var(--f-input);
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-md);
			padding: 3px;
			cursor: pointer;
			outline: none;
			box-sizing: border-box;
			transition: border-color var(--f-duration-fast) var(--f-ease),
				box-shadow var(--f-duration-fast) var(--f-ease);
		}

		.f-color-swatch-btn:hover:not(:disabled) {
			border-color: var(--f-border-strong);
		}

		.f-color-swatch-btn:focus-visible {
			border-color: var(--f-primary);
			box-shadow: 0 0 0 3px var(--f-ring);
		}

		.f-color-swatch {
			width: 100%;
			height: 100%;
			border-radius: calc(var(--f-radius-md) - 2px);
			border: 1px solid rgba(0, 0, 0, 0.1);
			box-sizing: border-box;
		}

		.f-color-native-input {
			position: absolute;
			opacity: 0;
			pointer-events: none;
			width: 0;
			height: 0;
		}

		.f-color-hex-wrapper {
			display: flex;
			align-items: center;
			background: var(--f-input);
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-md);
			transition: border-color var(--f-duration-fast) var(--f-ease),
				box-shadow var(--f-duration-fast) var(--f-ease);
			box-sizing: border-box;
		}

		.f-color-hex-wrapper:focus-within {
			border-color: var(--f-primary);
			box-shadow: 0 0 0 3px var(--f-ring);
		}

		.f-color-hex-input {
			border: none;
			outline: none;
			background: transparent;
			color: var(--f-text);
			font-family: var(--f-font-mono);
			font-size: var(--f-text-sm);
			font-weight: 500;
			text-transform: uppercase;
			padding: 0 var(--f-space-sm);
			width: 90px;
			box-sizing: border-box;
		}

		/* Preset swatches */
		.f-color-presets {
			display: flex;
			align-items: center;
			gap: var(--f-space-2xs);
			flex-wrap: wrap;
			margin-top: 2px;
		}

		.f-color-preset-dot {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 22px;
			height: 22px;
			border-radius: var(--f-radius-full);
			border: 1px solid rgba(0, 0, 0, 0.15);
			cursor: pointer;
			padding: 0;
			outline: none;
			color: #ffffff;
			transition: transform var(--f-duration-fast) var(--f-ease),
				box-shadow var(--f-duration-fast) var(--f-ease);
			box-sizing: border-box;
		}

		.f-color-preset-dot:hover:not(:disabled) {
			transform: scale(1.15);
		}

		.f-color-preset-dot:focus-visible {
			box-shadow: 0 0 0 2px var(--f-ring);
		}

		.f-color-preset-dot.selected {
			box-shadow: 0 0 0 2px var(--f-primary);
		}

		/* Sizes */
		.f-color-picker[data-size='sm'] .f-color-swatch-btn {
			width: 28px;
			height: 28px;
		}
		.f-color-picker[data-size='sm'] .f-color-hex-wrapper {
			height: 28px;
		}

		.f-color-picker[data-size='md'] .f-color-swatch-btn {
			width: 36px;
			height: 36px;
		}
		.f-color-picker[data-size='md'] .f-color-hex-wrapper {
			height: 36px;
		}

		.f-color-picker[data-size='lg'] .f-color-swatch-btn {
			width: 44px;
			height: 44px;
		}
		.f-color-picker[data-size='lg'] .f-color-hex-wrapper {
			height: 44px;
		}

		/* Disabled */
		.f-color-picker[data-disabled='true'] {
			opacity: 0.6;
			cursor: not-allowed;
		}
		.f-color-picker[data-disabled='true'] .f-color-swatch-btn,
		.f-color-picker[data-disabled='true'] .f-color-hex-input,
		.f-color-picker[data-disabled='true'] .f-color-preset-dot {
			cursor: not-allowed;
		}

		.f-color-error-msg {
			margin: 0;
			font-size: var(--f-text-xs);
			color: var(--f-danger-text);
			font-weight: 500;
		}
	}
</style>
