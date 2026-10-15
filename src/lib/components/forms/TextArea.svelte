<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import type { Size } from '../../types';

	interface Props extends HTMLTextareaAttributes {
		value?: string;
		label?: string;
		helperText?: string;
		error?: boolean | string;
		autoResize?: boolean;
		showCount?: boolean;
		maxlength?: number;
		size?: Size;
		rows?: number;
		disabled?: boolean;
		readonly?: boolean;
		id?: string;
		class?: string;
	}

	let {
		value = $bindable(''),
		label,
		helperText,
		error,
		autoResize = false,
		showCount = false,
		maxlength,
		size = 'md',
		rows = 3,
		disabled = false,
		readonly = false,
		id,
		class: className = '',
		...restProps
	}: Props = $props();

	let textareaEl: HTMLTextAreaElement | null = $state(null);
	const autoId = 'f-txt-' + Math.random().toString(36).slice(2, 9);
	const textareaId = $derived(id || autoId);

	const hasError = $derived(Boolean(error));
	const errorMessage = $derived(typeof error === 'string' ? error : undefined);
	const charCount = $derived(String(value ?? '').length);
	const isNearLimit = $derived(maxlength !== undefined && charCount >= maxlength * 0.9);
	const isOverLimit = $derived(maxlength !== undefined && charCount > maxlength);

	function resize() {
		if (!autoResize || !textareaEl) return;
		textareaEl.style.height = 'auto';
		textareaEl.style.height = `${textareaEl.scrollHeight}px`;
	}

	$effect(() => {
		// Re-trigger auto-resize on value update
		if (autoResize && value !== undefined) {
			resize();
		}
	});

	function handleInput(e: Event) {
		if (autoResize) {
			resize();
		}
	}
</script>

<div
	class="f-textarea-field {className}"
	data-size={size}
	data-disabled={disabled || undefined}
	data-invalid={hasError || undefined}
>
	{#if label}
		<label for={textareaId} class="f-textarea-label">
			{label}
		</label>
	{/if}

	<div class="f-textarea-wrapper">
		<textarea
			bind:this={textareaEl}
			bind:value={value}
			id={textareaId}
			{rows}
			{maxlength}
			{disabled}
			{readonly}
			oninput={handleInput}
			aria-invalid={hasError || undefined}
			aria-describedby={errorMessage ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
			class="f-textarea"
			class:auto-resize={autoResize}
			{...restProps}
		></textarea>
	</div>

	<div class="f-textarea-footer">
		<div class="f-textarea-feedback">
			{#if errorMessage}
				<p id="{textareaId}-error" class="f-textarea-message f-textarea-error-msg" role="alert">
					{errorMessage}
				</p>
			{:else if helperText}
				<p id="{textareaId}-helper" class="f-textarea-message f-textarea-helper-msg">
					{helperText}
				</p>
			{/if}
		</div>

		{#if showCount || maxlength !== undefined}
			<span
				class="f-textarea-counter"
				class:near-limit={isNearLimit}
				class:over-limit={isOverLimit}
				aria-live="polite"
			>
				{#if maxlength !== undefined}
					{charCount} / {maxlength}
				{:else}
					{charCount}
				{/if}
			</span>
		{/if}
	</div>
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-textarea-field {
			display: flex;
			flex-direction: column;
			gap: var(--f-space-2xs);
			width: 100%;
			font-family: inherit;
			box-sizing: border-box;
		}

		.f-textarea-label {
			display: inline-block;
			font-size: var(--f-text-sm);
			font-weight: 500;
			color: var(--f-text);
			user-select: none;
		}

		.f-textarea-wrapper {
			position: relative;
			width: 100%;
			background: var(--f-input);
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-md);
			transition: border-color var(--f-duration-fast) var(--f-ease),
				box-shadow var(--f-duration-fast) var(--f-ease),
				background-color var(--f-duration-fast) var(--f-ease);
			box-sizing: border-box;
		}

		.f-textarea-wrapper:hover:not([data-disabled='true']) {
			border-color: var(--f-border-strong);
		}

		.f-textarea-wrapper:focus-within {
			border-color: var(--f-primary);
			box-shadow: 0 0 0 3px var(--f-ring);
		}

		.f-textarea {
			width: 100%;
			min-width: 0;
			border: none;
			outline: none;
			background: transparent;
			color: var(--f-text);
			font-family: inherit;
			font-size: var(--f-text-base);
			line-height: 1.5;
			padding: var(--f-space-sm) var(--f-space-md);
			resize: vertical;
			box-sizing: border-box;
		}

		.f-textarea.auto-resize {
			resize: none;
			overflow-y: hidden;
		}

		.f-textarea::placeholder {
			color: var(--f-text-subtle);
			opacity: 1;
		}

		.f-textarea:disabled {
			cursor: not-allowed;
		}

		/* Sizes */
		.f-textarea-field[data-size='sm'] .f-textarea-wrapper {
			border-radius: var(--f-radius-sm);
		}
		.f-textarea-field[data-size='sm'] .f-textarea {
			font-size: var(--f-text-sm);
			padding: var(--f-space-xs) var(--f-space-sm);
		}

		.f-textarea-field[data-size='md'] .f-textarea-wrapper {
			border-radius: var(--f-radius-md);
		}
		.f-textarea-field[data-size='md'] .f-textarea {
			font-size: var(--f-text-base);
			padding: var(--f-space-sm) var(--f-space-md);
		}

		.f-textarea-field[data-size='lg'] .f-textarea-wrapper {
			border-radius: var(--f-radius-lg);
		}
		.f-textarea-field[data-size='lg'] .f-textarea {
			font-size: var(--f-text-lg);
			padding: var(--f-space-md) var(--f-space-lg);
		}

		/* Invalid state */
		.f-textarea-field[data-invalid='true'] .f-textarea-wrapper {
			border-color: var(--f-danger);
		}
		.f-textarea-field[data-invalid='true'] .f-textarea-wrapper:focus-within {
			box-shadow: 0 0 0 3px var(--f-danger-bg);
		}

		/* Disabled state */
		.f-textarea-field[data-disabled='true'] {
			opacity: 0.6;
			cursor: not-allowed;
		}
		.f-textarea-field[data-disabled='true'] .f-textarea-wrapper {
			background: var(--f-sunken);
			border-color: var(--f-border);
			cursor: not-allowed;
		}

		/* Footer info */
		.f-textarea-footer {
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			gap: var(--f-space-sm);
		}

		.f-textarea-feedback {
			flex: 1;
			min-width: 0;
		}

		.f-textarea-message {
			margin: 0;
			font-size: var(--f-text-xs);
			line-height: 1.4;
		}

		.f-textarea-helper-msg {
			color: var(--f-text-muted);
		}

		.f-textarea-error-msg {
			color: var(--f-danger-text);
			font-weight: 500;
		}

		.f-textarea-counter {
			font-size: var(--f-text-xs);
			color: var(--f-text-muted);
			font-variant-numeric: tabular-nums;
			white-space: nowrap;
			margin-left: auto;
		}

		.f-textarea-counter.near-limit {
			color: var(--f-warning-text);
		}

		.f-textarea-counter.over-limit {
			color: var(--f-danger-text);
			font-weight: 600;
		}
	}
</style>
