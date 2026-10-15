<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { Size } from '../../types';

	interface Props extends Omit<HTMLInputAttributes, 'size'> {
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		label?: string;
		helperText?: string;
		error?: boolean | string;
		disabled?: boolean;
		readonly?: boolean;
		controls?: boolean;
		size?: Size;
		id?: string;
		class?: string;
	}

	let {
		value = $bindable(0),
		min,
		max,
		step = 1,
		label,
		helperText,
		error,
		disabled = false,
		readonly = false,
		controls = true,
		size = 'md',
		id,
		class: className = '',
		...restProps
	}: Props = $props();

	let inputEl: HTMLInputElement | null = $state(null);
	let timer: any = null;
	const autoId = 'f-num-' + Math.random().toString(36).slice(2, 9);
	const inputId = $derived(id || autoId);

	const hasError = $derived(Boolean(error));
	const errorMessage = $derived(typeof error === 'string' ? error : undefined);

	const canDecrement = $derived(
		!disabled && !readonly && (min === undefined || (value ?? 0) > min)
	);
	const canIncrement = $derived(
		!disabled && !readonly && (max === undefined || (value ?? 0) < max)
	);

	function getDecimals(num: number): number {
		const str = num.toString();
		return str.includes('.') ? str.split('.')[1].length : 0;
	}

	function clamp(val: number): number {
		let res = val;
		if (min !== undefined && res < min) res = min;
		if (max !== undefined && res > max) res = max;
		const decimals = getDecimals(step);
		return Number(res.toFixed(decimals));
	}

	function stepBy(amount: number) {
		if (disabled || readonly) return;
		const current = value ?? 0;
		value = clamp(current + amount);
	}

	function handleInputChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const num = parseFloat(target.value);
		if (isNaN(num)) {
			value = min ?? 0;
		} else {
			value = clamp(num);
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (disabled || readonly) return;
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			stepBy(step);
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			stepBy(-step);
		}
	}

	function startStepping(amount: number) {
		stepBy(amount);
		timer = setInterval(() => {
			stepBy(amount);
		}, 100);
	}

	function stopStepping() {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	}
</script>

<div
	class="f-number-field {className}"
	data-size={size}
	data-disabled={disabled || undefined}
	data-invalid={hasError || undefined}
>
	{#if label}
		<label for={inputId} class="f-number-label">
			{label}
		</label>
	{/if}

	<div class="f-number-wrapper">
		{#if controls}
			<button
				type="button"
				class="f-number-btn f-number-btn-dec"
				disabled={!canDecrement}
				tabindex={-1}
				aria-label="Decrease value"
				onmousedown={() => startStepping(-step)}
				onmouseup={stopStepping}
				onmouseleave={stopStepping}
			>
				<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
					<line x1="5" y1="12" x2="19" y2="12"></line>
				</svg>
			</button>
		{/if}

		<input
			bind:this={inputEl}
			id={inputId}
			type="number"
			value={value}
			{min}
			{max}
			{step}
			{disabled}
			{readonly}
			class="f-number-input"
			onchange={handleInputChange}
			onkeydown={handleKeyDown}
			aria-invalid={hasError || undefined}
			aria-describedby={errorMessage ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
			{...restProps}
		/>

		{#if controls}
			<button
				type="button"
				class="f-number-btn f-number-btn-inc"
				disabled={!canIncrement}
				tabindex={-1}
				aria-label="Increase value"
				onmousedown={() => startStepping(step)}
				onmouseup={stopStepping}
				onmouseleave={stopStepping}
			>
				<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
					<line x1="12" y1="5" x2="12" y2="19"></line>
					<line x1="5" y1="12" x2="19" y2="12"></line>
				</svg>
			</button>
		{/if}
	</div>

	{#if errorMessage}
		<p id="{inputId}-error" class="f-number-message f-number-error-msg" role="alert">
			{errorMessage}
		</p>
	{:else if helperText}
		<p id="{inputId}-helper" class="f-number-message f-number-helper-msg">
			{helperText}
		</p>
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-number-field {
			display: flex;
			flex-direction: column;
			gap: var(--f-space-2xs);
			width: 100%;
			font-family: inherit;
			box-sizing: border-box;
		}

		.f-number-label {
			font-size: var(--f-text-sm);
			font-weight: 500;
			color: var(--f-text);
			user-select: none;
		}

		.f-number-wrapper {
			position: relative;
			display: flex;
			align-items: center;
			width: 100%;
			background: var(--f-input);
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-md);
			transition: border-color var(--f-duration-fast) var(--f-ease),
				box-shadow var(--f-duration-fast) var(--f-ease);
			box-sizing: border-box;
			overflow: hidden;
		}

		.f-number-wrapper:hover:not([data-disabled='true']) {
			border-color: var(--f-border-strong);
		}

		.f-number-wrapper:focus-within {
			border-color: var(--f-primary);
			box-shadow: 0 0 0 3px var(--f-ring);
		}

		.f-number-input {
			flex: 1;
			width: 100%;
			min-width: 0;
			border: none;
			outline: none;
			background: transparent;
			color: var(--f-text);
			font-family: var(--f-font-mono);
			font-size: var(--f-text-base);
			font-weight: 500;
			text-align: center;
			padding: 0 var(--f-space-sm);
			box-sizing: border-box;
			appearance: textfield;
			-moz-appearance: textfield;
		}

		.f-number-input::-webkit-outer-spin-button,
		.f-number-input::-webkit-inner-spin-button {
			-webkit-appearance: none;
			margin: 0;
		}

		.f-number-input:disabled {
			cursor: not-allowed;
		}

		.f-number-btn {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			background: var(--f-sunken);
			border: none;
			color: var(--f-text);
			cursor: pointer;
			user-select: none;
			transition: background var(--f-duration-fast) var(--f-ease),
				color var(--f-duration-fast) var(--f-ease);
			flex-shrink: 0;
		}

		.f-number-btn:hover:not(:disabled) {
			background: var(--f-hover);
			color: var(--f-primary);
		}

		.f-number-btn:active:not(:disabled) {
			background: var(--f-active);
		}

		.f-number-btn:disabled {
			opacity: 0.4;
			cursor: not-allowed;
		}

		.f-number-btn-dec {
			border-right: 1px solid var(--f-border);
		}

		.f-number-btn-inc {
			border-left: 1px solid var(--f-border);
		}

		/* Sizes */
		.f-number-field[data-size='sm'] .f-number-wrapper {
			min-height: 32px;
			border-radius: var(--f-radius-sm);
		}
		.f-number-field[data-size='sm'] .f-number-input {
			font-size: var(--f-text-sm);
		}
		.f-number-field[data-size='sm'] .f-number-btn {
			width: 30px;
			height: 30px;
		}

		.f-number-field[data-size='md'] .f-number-wrapper {
			min-height: 40px;
			border-radius: var(--f-radius-md);
		}
		.f-number-field[data-size='md'] .f-number-input {
			font-size: var(--f-text-base);
		}
		.f-number-field[data-size='md'] .f-number-btn {
			width: 38px;
			height: 38px;
		}

		.f-number-field[data-size='lg'] .f-number-wrapper {
			min-height: 48px;
			border-radius: var(--f-radius-lg);
		}
		.f-number-field[data-size='lg'] .f-number-input {
			font-size: var(--f-text-lg);
		}
		.f-number-field[data-size='lg'] .f-number-btn {
			width: 46px;
			height: 46px;
		}

		/* Invalid state */
		.f-number-field[data-invalid='true'] .f-number-wrapper {
			border-color: var(--f-danger);
		}
		.f-number-field[data-invalid='true'] .f-number-wrapper:focus-within {
			box-shadow: 0 0 0 3px var(--f-danger-bg);
		}

		/* Disabled */
		.f-number-field[data-disabled='true'] {
			opacity: 0.6;
			cursor: not-allowed;
		}
		.f-number-field[data-disabled='true'] .f-number-wrapper {
			background: var(--f-sunken);
			cursor: not-allowed;
		}

		.f-number-message {
			margin: 0;
			font-size: var(--f-text-xs);
			line-height: 1.4;
		}

		.f-number-helper-msg {
			color: var(--f-text-muted);
		}

		.f-number-error-msg {
			color: var(--f-danger-text);
			font-weight: 500;
		}
	}
</style>
