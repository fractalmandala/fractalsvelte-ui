<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Size, Orientation } from '../../types';
	import Radio from './Radio.svelte';

	export interface RadioOption {
		value: string | number;
		label: string;
		description?: string;
		disabled?: boolean;
	}

	interface Props extends HTMLAttributes<HTMLDivElement> {
		value?: string | number;
		name?: string;
		label?: string;
		description?: string;
		helperText?: string;
		error?: boolean | string;
		orientation?: Orientation;
		options?: RadioOption[];
		disabled?: boolean;
		size?: Size;
		children?: Snippet;
		class?: string;
	}

	let {
		value = $bindable(undefined),
		name,
		label,
		description,
		helperText,
		error,
		orientation = 'vertical',
		options = [],
		disabled = false,
		size = 'md',
		children,
		class: className = '',
		...restProps
	}: Props = $props();

	const autoName = 'f-rad-grp-' + Math.random().toString(36).slice(2, 9);
	const groupName = $derived(name || autoName);
	const hasError = $derived(Boolean(error));
	const errorMessage = $derived(typeof error === 'string' ? error : undefined);

	// Context for child Radio components
	setContext('f-radio-group', {
		name: () => groupName,
		value: () => value,
		disabled: () => disabled,
		size: () => size,
		select: (val: string | number) => {
			value = val;
		}
	});

	function handleKeyDown(e: KeyboardEvent) {
		if (options.length === 0 || disabled) return;

		const enabledOptions = options.filter((o) => !o.disabled);
		if (enabledOptions.length === 0) return;

		const currentIndex = enabledOptions.findIndex((o) => o.value === value);

		if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
			e.preventDefault();
			const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % enabledOptions.length;
			value = enabledOptions[nextIndex].value;
		} else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
			e.preventDefault();
			const prevIndex =
				currentIndex === -1
					? enabledOptions.length - 1
					: (currentIndex - 1 + enabledOptions.length) % enabledOptions.length;
			value = enabledOptions[prevIndex].value;
		}
	}
</script>

<div
	class="f-radio-group-container {className}"
	data-orientation={orientation}
	data-size={size}
	data-disabled={disabled || undefined}
	data-invalid={hasError || undefined}
	{...restProps}
>
	{#if label}
		<span class="f-radio-group-label" id="{groupName}-label">
			{label}
		</span>
	{/if}

	{#if description}
		<span class="f-radio-group-desc" id="{groupName}-desc">
			{description}
		</span>
	{/if}

	<div
		class="f-radio-group"
		role="radiogroup"
		aria-labelledby={label ? `${groupName}-label` : undefined}
		aria-describedby={description ? `${groupName}-desc` : undefined}
		aria-orientation={orientation}
		tabindex="0"
		onkeydown={handleKeyDown}
	>
		{#if options.length > 0}
			{#each options as opt}
				<Radio
					value={opt.value}
					label={opt.label}
					description={opt.description}
					disabled={disabled || opt.disabled}
					name={groupName}
				/>
			{/each}
		{/if}

		{#if children}
			{@render children()}
		{/if}
	</div>

	{#if errorMessage}
		<p class="f-radio-group-error-msg" role="alert">{errorMessage}</p>
	{:else if helperText}
		<p class="f-radio-group-helper-msg">{helperText}</p>
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-radio-group-container {
			display: flex;
			flex-direction: column;
			gap: var(--f-space-xs);
			font-family: inherit;
			box-sizing: border-box;
		}

		.f-radio-group-label {
			font-size: var(--f-text-sm);
			font-weight: 600;
			color: var(--f-text);
			user-select: none;
		}

		.f-radio-group-desc {
			font-size: var(--f-text-xs);
			color: var(--f-text-muted);
			margin-top: -2px;
		}

		.f-radio-group {
			display: flex;
			gap: var(--f-space-sm);
			outline: none;
		}

		.f-radio-group-container[data-orientation='vertical'] .f-radio-group {
			flex-direction: column;
		}

		.f-radio-group-container[data-orientation='horizontal'] .f-radio-group {
			flex-direction: row;
			flex-wrap: wrap;
			align-items: center;
		}

		.f-radio-group:focus-visible {
			outline: 2px solid var(--f-ring);
			outline-offset: 4px;
			border-radius: var(--f-radius-sm);
		}

		.f-radio-group-helper-msg {
			margin: 0;
			font-size: var(--f-text-xs);
			color: var(--f-text-muted);
		}

		.f-radio-group-error-msg {
			margin: 0;
			font-size: var(--f-text-xs);
			color: var(--f-danger-text);
			font-weight: 500;
		}

		.f-radio-group-container[data-disabled='true'] {
			opacity: 0.6;
			cursor: not-allowed;
		}
	}
</style>
