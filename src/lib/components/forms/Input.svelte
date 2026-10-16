<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { Size } from '../../types';

	interface Props extends Omit<HTMLInputAttributes, 'size'> {
		value?: string | number;
		type?: string;
		label?: string;
		helperText?: string;
		error?: boolean | string;
		clearable?: boolean;
		size?: Size;
		disabled?: boolean;
		readonly?: boolean;
		id?: string;
		class?: string;
		leading?: Snippet;
		trailing?: Snippet;
	}

	let {
		value = $bindable(''),
		type = 'text',
		label,
		helperText,
		error,
		clearable = false,
		size = 'md',
		disabled = false,
		readonly = false,
		id,
		class: className = '',
		leading,
		trailing,
		...restProps
	}: Props = $props();

	let inputEl: HTMLInputElement | null = $state(null);
	let showPassword = $state(false);
	const autoId = 'f-inp-' + Math.random().toString(36).slice(2, 9);
	const inputId = $derived(id || autoId);

	const effectiveType = $derived(
		type === 'password' ? (showPassword ? 'text' : 'password') : type
	);

	const hasError = $derived(Boolean(error));
	const errorMessage = $derived(typeof error === 'string' ? error : undefined);
	const isClearable = $derived(clearable && !disabled && !readonly && String(value ?? '').length > 0);

	function handleClear(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		value = '';
		inputEl?.focus();
	}

	function togglePassword(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		showPassword = !showPassword;
	}
</script>

<div
	class="f-input-field {className}"
	data-size={size}
	data-disabled={disabled || undefined}
	data-invalid={hasError || undefined}
>
	{#if label}
		<label for={inputId} class="f-input-label">
			{label}
		</label>
	{/if}

	<div class="f-input-wrapper">
		{#if leading}
			<span class="f-input-affix f-input-leading" aria-hidden="true">
				{@render leading()}
			</span>
		{/if}

		<input
			bind:this={inputEl}
			bind:value={value}
			id={inputId}
			type={effectiveType}
			{disabled}
			{readonly}
			aria-invalid={hasError || undefined}
			aria-describedby={errorMessage ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
			class="f-input"
			{...restProps}
		/>

		{#if isClearable}
			<button
				type="button"
				class="f-input-action f-input-clear"
				onclick={handleClear}
				tabindex={-1}
				aria-label="Clear input value"
			>
				<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</button>
		{/if}

		{#if type === 'password' && !disabled}
			<button
				type="button"
				class="f-input-action f-input-password-toggle"
				onclick={togglePassword}
				tabindex={-1}
				aria-label={showPassword ? 'Hide password' : 'Show password'}
			>
				{#if showPassword}
					<!-- Eye Off SVG -->
					<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
						<path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
						<path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
						<line x1="2" y1="2" x2="22" y2="22"></line>
					</svg>
				{:else}
					<!-- Eye SVG -->
					<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
						<circle cx="12" cy="12" r="3"></circle>
					</svg>
				{/if}
			</button>
		{/if}

		{#if trailing}
			<span class="f-input-affix f-input-trailing" aria-hidden="true">
				{@render trailing()}
			</span>
		{/if}
	</div>

	{#if errorMessage}
		<p id="{inputId}-error" class="f-input-message f-input-error-msg" role="alert">
			{errorMessage}
		</p>
	{:else if helperText}
		<p id="{inputId}-helper" class="f-input-message f-input-helper-msg">
			{helperText}
		</p>
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-input-field {
			display: flex;
			flex-direction: column;
			gap: var(--f-space-2xs);
			width: 100%;
			font-family: inherit;
			box-sizing: border-box;
		}

		.f-input-label {
			display: inline-block;
			font-size: var(--f-text-sm);
			font-weight: 500;
			color: var(--f-text);
			user-select: none;
		}

		.f-input-wrapper {
			position: relative;
			display: flex;
			align-items: center;
			width: 100%;
			background: var(--f-input);
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-md);
			transition: border-color var(--f-duration-fast) var(--f-ease),
				box-shadow var(--f-duration-fast) var(--f-ease),
				background-color var(--f-duration-fast) var(--f-ease);
			box-sizing: border-box;
		}

		.f-input-wrapper:hover:not([data-disabled='true']) {
			border-color: var(--f-border-strong);
		}

		.f-input-wrapper:focus-within {
			border-color: var(--f-primary);
			box-shadow: 0 0 0 3px var(--f-ring);
		}

		.f-input {
			flex: 1;
			width: 100%;
			min-width: 0;
			border: none;
			outline: none;
			background: transparent;
			color: var(--f-text);
			font-family: inherit;
			font-size: var(--f-text-base);
			padding: 0 var(--f-space-md);
			box-sizing: border-box;
		}

		.f-input::placeholder {
			color: var(--f-text-subtle);
			opacity: 1;
		}

		.f-input:disabled {
			cursor: not-allowed;
		}

		/* Affixes & Actions */
		.f-input-affix {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			color: var(--f-text-muted);
			flex-shrink: 0;
		}

		.f-input-leading {
			padding-left: var(--f-space-md);
		}

		.f-input-trailing {
			padding-right: var(--f-space-md);
		}

		.f-input-action {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			background: none;
			border: none;
			padding: var(--f-space-2xs);
			margin-right: var(--f-space-xs);
			color: var(--f-text-muted);
			border-radius: var(--f-radius-sm);
			cursor: pointer;
			flex-shrink: 0;
			transition: color var(--f-duration-fast) var(--f-ease),
				background-color var(--f-duration-fast) var(--f-ease);
		}

		.f-input-action:hover {
			color: var(--f-text);
			background-color: var(--f-hover);
		}

		.f-input-action:focus-visible {
			outline: 2px solid var(--f-primary);
			outline-offset: 1px;
		}

		/* Sizes */
		.f-input-field[data-size='sm'] .f-input-wrapper {
			min-height: 32px;
			border-radius: var(--f-radius-sm);
		}
		.f-input-field[data-size='sm'] .f-input {
			font-size: var(--f-text-sm);
			padding: 0 var(--f-space-sm);
		}
		.f-input-field[data-size='sm'] .f-input-leading {
			padding-left: var(--f-space-sm);
		}
		.f-input-field[data-size='sm'] .f-input-trailing {
			padding-right: var(--f-space-sm);
		}

		.f-input-field[data-size='md'] .f-input-wrapper {
			min-height: 40px;
			border-radius: var(--f-radius-md);
		}
		.f-input-field[data-size='md'] .f-input {
			font-size: var(--f-text-base);
			padding: 0 var(--f-space-md);
		}

		.f-input-field[data-size='lg'] .f-input-wrapper {
			min-height: 48px;
			border-radius: var(--f-radius-lg);
		}
		.f-input-field[data-size='lg'] .f-input {
			font-size: var(--f-text-lg);
			padding: 0 var(--f-space-lg);
		}
		.f-input-field[data-size='lg'] .f-input-leading {
			padding-left: var(--f-space-lg);
		}
		.f-input-field[data-size='lg'] .f-input-trailing {
			padding-right: var(--f-space-lg);
		}

		/* Invalid state */
		.f-input-field[data-invalid='true'] .f-input-wrapper {
			border-color: var(--f-danger);
		}
		.f-input-field[data-invalid='true'] .f-input-wrapper:focus-within {
			box-shadow: 0 0 0 3px var(--f-danger-bg);
		}

		/* Disabled state */
		.f-input-field[data-disabled='true'] {
			opacity: 0.6;
			cursor: not-allowed;
		}
		.f-input-field[data-disabled='true'] .f-input-wrapper {
			background: var(--f-sunken);
			border-color: var(--f-border);
			cursor: not-allowed;
		}

		/* Messages */
		.f-input-message {
			margin: 0;
			font-size: var(--f-text-xs);
			line-height: 1.4;
		}

		.f-input-helper-msg {
			color: var(--f-text-muted);
		}

		.f-input-error-msg {
			color: var(--f-danger-text);
			font-weight: 500;
		}
	}
</style>
