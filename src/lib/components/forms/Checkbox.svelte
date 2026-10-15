<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { Size } from '../../types';

	interface Props extends Omit<HTMLInputAttributes, 'size'> {
		checked?: boolean;
		indeterminate?: boolean;
		label?: string;
		description?: string;
		error?: boolean | string;
		size?: Size;
		disabled?: boolean;
		value?: string;
		name?: string;
		id?: string;
		class?: string;
	}

	let {
		checked = $bindable(false),
		indeterminate = $bindable(false),
		label,
		description,
		error,
		size = 'md',
		disabled = false,
		value,
		name,
		id,
		class: className = '',
		...restProps
	}: Props = $props();

	let inputEl: HTMLInputElement | null = $state(null);
	const autoId = 'f-chk-' + Math.random().toString(36).slice(2, 9);
	const checkboxId = $derived(id || autoId);
	const hasError = $derived(Boolean(error));

	$effect(() => {
		if (inputEl) {
			inputEl.indeterminate = indeterminate;
		}
	});

	function handleChange(e: Event) {
		const target = e.target as HTMLInputElement;
		checked = target.checked;
		if (indeterminate) {
			indeterminate = false;
		}
	}
</script>

<div
	class="f-checkbox-container {className}"
	data-size={size}
	data-disabled={disabled || undefined}
	data-invalid={hasError || undefined}
>
	<label class="f-checkbox-wrapper" for={checkboxId}>
		<div class="f-checkbox-control">
			<input
				bind:this={inputEl}
				id={checkboxId}
				type="checkbox"
				{name}
				{value}
				{disabled}
				checked={checked}
				onchange={handleChange}
				aria-invalid={hasError || undefined}
				class="f-checkbox-native"
				{...restProps}
			/>
			<div
				class="f-checkbox-box"
				data-state={indeterminate ? 'indeterminate' : checked ? 'checked' : 'unchecked'}
				aria-hidden="true"
			>
				{#if indeterminate}
					<!-- Dash / Minus SVG for indeterminate -->
					<svg
						class="f-checkbox-icon f-checkbox-icon-dash"
						viewBox="0 0 24 24"
						width="14"
						height="14"
						fill="none"
						stroke="currentColor"
						stroke-width="3"
						stroke-linecap="round"
					>
						<line x1="5" y1="12" x2="19" y2="12"></line>
					</svg>
				{:else if checked}
					<!-- Checkmark SVG -->
					<svg
						class="f-checkbox-icon f-checkbox-icon-check"
						viewBox="0 0 24 24"
						width="14"
						height="14"
						fill="none"
						stroke="currentColor"
						stroke-width="3"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<polyline points="20 6 9 17 4 12"></polyline>
					</svg>
				{/if}
			</div>
		</div>

		{#if label || description}
			<div class="f-checkbox-text">
				{#if label}
					<span class="f-checkbox-label">{label}</span>
				{/if}
				{#if description}
					<span class="f-checkbox-description">{description}</span>
				{/if}
			</div>
		{/if}
	</label>

	{#if typeof error === 'string'}
		<p class="f-checkbox-error-msg" role="alert">{error}</p>
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-checkbox-container {
			display: inline-flex;
			flex-direction: column;
			gap: var(--f-space-3xs);
			font-family: inherit;
			box-sizing: border-box;
		}

		.f-checkbox-wrapper {
			display: inline-flex;
			align-items: flex-start;
			gap: var(--f-space-sm);
			cursor: pointer;
			user-select: none;
		}

		.f-checkbox-control {
			position: relative;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
		}

		/* Hidden native input, perfectly positioned for focus and accessibility */
		.f-checkbox-native {
			position: absolute;
			opacity: 0;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			margin: 0;
			padding: 0;
			cursor: pointer;
			z-index: 1;
		}

		.f-checkbox-native:disabled {
			cursor: not-allowed;
		}

		/* Custom styled box */
		.f-checkbox-box {
			display: flex;
			align-items: center;
			justify-content: center;
			background: var(--f-input);
			border: 1.5px solid var(--f-border-strong);
			border-radius: var(--f-radius-sm);
			color: var(--f-primary-text);
			transition: background var(--f-duration-fast) var(--f-ease),
				border-color var(--f-duration-fast) var(--f-ease),
				box-shadow var(--f-duration-fast) var(--f-ease),
				transform var(--f-duration-fast) var(--f-ease);
			box-sizing: border-box;
		}

		.f-checkbox-wrapper:hover .f-checkbox-box {
			border-color: var(--f-primary);
		}

		.f-checkbox-native:focus-visible + .f-checkbox-box {
			outline: none;
			border-color: var(--f-primary);
			box-shadow: 0 0 0 3px var(--f-ring);
		}

		.f-checkbox-box[data-state='checked'],
		.f-checkbox-box[data-state='indeterminate'] {
			background: var(--f-primary);
			border-color: var(--f-primary);
		}

		.f-checkbox-icon {
			display: block;
			animation: f-chk-pop 0.15s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		}

		@keyframes f-chk-pop {
			0% {
				transform: scale(0.6);
				opacity: 0;
			}
			100% {
				transform: scale(1);
				opacity: 1;
			}
		}

		/* Label and description */
		.f-checkbox-text {
			display: flex;
			flex-direction: column;
			gap: 2px;
			line-height: 1.35;
		}

		.f-checkbox-label {
			font-size: var(--f-text-base);
			font-weight: 500;
			color: var(--f-text);
		}

		.f-checkbox-description {
			font-size: var(--f-text-xs);
			color: var(--f-text-muted);
		}

		/* Sizes */
		.f-checkbox-container[data-size='sm'] .f-checkbox-control,
		.f-checkbox-container[data-size='sm'] .f-checkbox-box {
			width: 16px;
			height: 16px;
		}
		.f-checkbox-container[data-size='sm'] .f-checkbox-icon {
			width: 11px;
			height: 11px;
		}
		.f-checkbox-container[data-size='sm'] .f-checkbox-label {
			font-size: var(--f-text-sm);
		}

		.f-checkbox-container[data-size='md'] .f-checkbox-control,
		.f-checkbox-container[data-size='md'] .f-checkbox-box {
			width: 20px;
			height: 20px;
		}
		.f-checkbox-container[data-size='md'] .f-checkbox-icon {
			width: 14px;
			height: 14px;
		}
		.f-checkbox-container[data-size='md'] .f-checkbox-label {
			font-size: var(--f-text-base);
		}

		.f-checkbox-container[data-size='lg'] .f-checkbox-control,
		.f-checkbox-container[data-size='lg'] .f-checkbox-box {
			width: 24px;
			height: 24px;
		}
		.f-checkbox-container[data-size='lg'] .f-checkbox-icon {
			width: 17px;
			height: 17px;
		}
		.f-checkbox-container[data-size='lg'] .f-checkbox-label {
			font-size: var(--f-text-lg);
		}

		/* Invalid state */
		.f-checkbox-container[data-invalid='true'] .f-checkbox-box {
			border-color: var(--f-danger);
		}
		.f-checkbox-container[data-invalid='true'] .f-checkbox-native:focus-visible + .f-checkbox-box {
			box-shadow: 0 0 0 3px var(--f-danger-bg);
		}
		.f-checkbox-error-msg {
			margin: 0;
			font-size: var(--f-text-xs);
			color: var(--f-danger-text);
			font-weight: 500;
		}

		/* Disabled state */
		.f-checkbox-container[data-disabled='true'] {
			opacity: 0.55;
			cursor: not-allowed;
		}
		.f-checkbox-container[data-disabled='true'] .f-checkbox-wrapper {
			cursor: not-allowed;
		}
		.f-checkbox-container[data-disabled='true'] .f-checkbox-box {
			background: var(--f-sunken);
			border-color: var(--f-border);
		}
	}
</style>
