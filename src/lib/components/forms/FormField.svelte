<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		label?: string;
		id?: string;
		required?: boolean;
		optional?: boolean;
		description?: string;
		helperText?: string;
		error?: string;
		counter?: string;
		children?: Snippet;
		labelSnippet?: Snippet;
		class?: string;
	}

	let {
		label,
		id,
		required = false,
		optional = false,
		description,
		helperText,
		error,
		counter,
		children,
		labelSnippet,
		class: className = '',
		...restProps
	}: Props = $props();

	const hasError = $derived(Boolean(error));
</script>

<div
	class="f-form-field {className}"
	data-invalid={hasError || undefined}
	{...restProps}
>
	{#if label || labelSnippet || counter}
		<div class="f-field-header">
			<div class="f-field-label-group">
				{#if labelSnippet}
					{@render labelSnippet()}
				{:else if label}
					<label class="f-field-label" for={id}>
						{label}
					</label>
				{/if}

				{#if required}
					<span class="f-field-required" title="Required field" aria-hidden="true">*</span>
				{:else if optional}
					<span class="f-field-optional">Optional</span>
				{/if}
			</div>

			{#if counter}
				<span class="f-field-counter" aria-live="polite">{counter}</span>
			{/if}
		</div>
	{/if}

	{#if description}
		<p class="f-field-description" id={id ? `${id}-desc` : undefined}>
			{description}
		</p>
	{/if}

	<div class="f-field-control">
		{#if children}
			{@render children()}
		{/if}
	</div>

	{#if error}
		<p class="f-field-message f-field-error-msg" id={id ? `${id}-error` : undefined} role="alert">
			<svg class="f-field-error-icon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<circle cx="12" cy="12" r="10"></circle>
				<line x1="12" y1="8" x2="12" y2="12"></line>
				<line x1="12" y1="16" x2="12.01" y2="16"></line>
			</svg>
			<span>{error}</span>
		</p>
	{:else if helperText}
		<p class="f-field-message f-field-helper-msg" id={id ? `${id}-helper` : undefined}>
			{helperText}
		</p>
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-form-field {
			display: flex;
			flex-direction: column;
			gap: var(--f-space-2xs);
			width: 100%;
			font-family: inherit;
			box-sizing: border-box;
		}

		.f-field-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: var(--f-space-sm);
		}

		.f-field-label-group {
			display: inline-flex;
			align-items: center;
			gap: var(--f-space-2xs);
		}

		.f-field-label {
			font-size: var(--f-text-sm);
			font-weight: 500;
			color: var(--f-text);
			user-select: none;
		}

		.f-field-required {
			color: var(--f-danger);
			font-weight: 600;
		}

		.f-field-optional {
			font-size: var(--f-text-xs);
			color: var(--f-text-muted);
			background: var(--f-sunken);
			padding: 1px 5px;
			border-radius: var(--f-radius-xs);
		}

		.f-field-counter {
			font-size: var(--f-text-xs);
			color: var(--f-text-muted);
			font-variant-numeric: tabular-nums;
		}

		.f-field-description {
			margin: 0;
			font-size: var(--f-text-xs);
			color: var(--f-text-muted);
			line-height: 1.4;
		}

		.f-field-control {
			width: 100%;
		}

		.f-field-message {
			margin: 0;
			font-size: var(--f-text-xs);
			line-height: 1.4;
			display: flex;
			align-items: center;
			gap: 4px;
		}

		.f-field-helper-msg {
			color: var(--f-text-muted);
		}

		.f-field-error-msg {
			color: var(--f-danger-text);
			font-weight: 500;
		}

		.f-field-error-icon {
			flex-shrink: 0;
			color: var(--f-danger);
		}
	}
</style>
