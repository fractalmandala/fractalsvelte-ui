<script lang="ts">
	import { getContext } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { Size } from '../../types';

	interface RadioGroupContext {
		name?: () => string | undefined;
		value?: () => string | number | undefined;
		disabled?: () => boolean | undefined;
		size?: () => Size | undefined;
		select?: (val: string | number) => void;
	}

	interface Props extends Omit<HTMLInputAttributes, 'size'> {
		value: string | number;
		checked?: boolean;
		group?: string | number;
		name?: string;
		label?: string;
		description?: string;
		disabled?: boolean;
		size?: Size;
		id?: string;
		class?: string;
	}

	let {
		value,
		checked = $bindable(false),
		group = $bindable(undefined),
		name,
		label,
		description,
		disabled = false,
		size = 'md',
		id,
		class: className = '',
		...restProps
	}: Props = $props();

	const groupCtx = getContext<RadioGroupContext | undefined>('f-radio-group');

	const effectiveName = $derived(name ?? groupCtx?.name?.());
	const effectiveDisabled = $derived(disabled || Boolean(groupCtx?.disabled?.()));
	const effectiveSize = $derived((groupCtx?.size?.() ?? size) as Size);

	const isChecked = $derived.by(() => {
		if (groupCtx?.value) {
			return groupCtx.value() === value;
		}
		if (group !== undefined) {
			return group === value;
		}
		return checked;
	});

	const autoId = 'f-rad-' + Math.random().toString(36).slice(2, 9);
	const radioId = $derived(id || autoId);

	function handleChange() {
		if (effectiveDisabled) return;
		checked = true;
		if (group !== undefined) {
			group = value;
		}
		groupCtx?.select?.(value);
	}
</script>

<div
	class="f-radio-container {className}"
	data-size={effectiveSize}
	data-disabled={effectiveDisabled || undefined}
>
	<label class="f-radio-wrapper" for={radioId}>
		<div class="f-radio-control">
			<input
				id={radioId}
				type="radio"
				name={effectiveName}
				value={String(value)}
				checked={isChecked}
				disabled={effectiveDisabled}
				onchange={handleChange}
				class="f-radio-native"
				{...restProps}
			/>
			<div
				class="f-radio-circle"
				data-state={isChecked ? 'checked' : 'unchecked'}
				aria-hidden="true"
			>
				<span class="f-radio-dot"></span>
			</div>
		</div>

		{#if label || description}
			<div class="f-radio-text">
				{#if label}
					<span class="f-radio-label">{label}</span>
				{/if}
				{#if description}
					<span class="f-radio-description">{description}</span>
				{/if}
			</div>
		{/if}
	</label>
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-radio-container {
			display: inline-flex;
			font-family: inherit;
			box-sizing: border-box;
		}

		.f-radio-wrapper {
			display: inline-flex;
			align-items: flex-start;
			gap: var(--f-space-sm);
			cursor: pointer;
			user-select: none;
		}

		.f-radio-control {
			position: relative;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
		}

		/* Hidden native input with accessible focus */
		.f-radio-native {
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

		.f-radio-native:disabled {
			cursor: not-allowed;
		}

		/* Custom radio circle */
		.f-radio-circle {
			display: flex;
			align-items: center;
			justify-content: center;
			background: var(--f-input);
			border: 1.5px solid var(--f-border-strong);
			border-radius: var(--f-radius-full);
			transition: border-color var(--f-duration-fast) var(--f-ease),
				background var(--f-duration-fast) var(--f-ease),
				box-shadow var(--f-duration-fast) var(--f-ease);
			box-sizing: border-box;
		}

		.f-radio-wrapper:hover .f-radio-circle {
			border-color: var(--f-primary);
		}

		.f-radio-native:focus-visible + .f-radio-circle {
			outline: none;
			border-color: var(--f-primary);
			box-shadow: 0 0 0 3px var(--f-ring);
		}

		.f-radio-circle[data-state='checked'] {
			border-color: var(--f-primary);
		}

		/* Inner animated indicator dot */
		.f-radio-dot {
			display: block;
			background: var(--f-primary);
			border-radius: var(--f-radius-full);
			transform: scale(0);
			opacity: 0;
			transition: transform var(--f-duration-normal) var(--f-ease-spring),
				opacity var(--f-duration-fast) var(--f-ease);
		}

		.f-radio-circle[data-state='checked'] .f-radio-dot {
			transform: scale(1);
			opacity: 1;
		}

		/* Label and description */
		.f-radio-text {
			display: flex;
			flex-direction: column;
			gap: 2px;
			line-height: 1.35;
		}

		.f-radio-label {
			font-size: var(--f-text-base);
			font-weight: 500;
			color: var(--f-text);
		}

		.f-radio-description {
			font-size: var(--f-text-xs);
			color: var(--f-text-muted);
		}

		/* Sizes */
		.f-radio-container[data-size='sm'] .f-radio-control,
		.f-radio-container[data-size='sm'] .f-radio-circle {
			width: 16px;
			height: 16px;
		}
		.f-radio-container[data-size='sm'] .f-radio-dot {
			width: 8px;
			height: 8px;
		}
		.f-radio-container[data-size='sm'] .f-radio-label {
			font-size: var(--f-text-sm);
		}

		.f-radio-container[data-size='md'] .f-radio-control,
		.f-radio-container[data-size='md'] .f-radio-circle {
			width: 20px;
			height: 20px;
		}
		.f-radio-container[data-size='md'] .f-radio-dot {
			width: 10px;
			height: 10px;
		}
		.f-radio-container[data-size='md'] .f-radio-label {
			font-size: var(--f-text-base);
		}

		.f-radio-container[data-size='lg'] .f-radio-control,
		.f-radio-container[data-size='lg'] .f-radio-circle {
			width: 24px;
			height: 24px;
		}
		.f-radio-container[data-size='lg'] .f-radio-dot {
			width: 12px;
			height: 12px;
		}
		.f-radio-container[data-size='lg'] .f-radio-label {
			font-size: var(--f-text-lg);
		}

		/* Disabled state */
		.f-radio-container[data-disabled='true'] {
			opacity: 0.55;
			cursor: not-allowed;
		}
		.f-radio-container[data-disabled='true'] .f-radio-wrapper {
			cursor: not-allowed;
		}
		.f-radio-container[data-disabled='true'] .f-radio-circle {
			background: var(--f-sunken);
			border-color: var(--f-border);
		}
	}
</style>
