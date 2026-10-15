<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Size } from '../../types';

	export interface SegmentedOption {
		value: string;
		label: string;
		icon?: Snippet;
		disabled?: boolean;
	}

	export interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Array of selectable segments */
		options?: SegmentedOption[];
		/** Value of the currently selected option */
		value?: string;
		/** Size scale tier */
		size?: Size;
		/** Whether the entire control is disabled */
		disabled?: boolean;
		/** Form field name for native form submission */
		name?: string;
		/** Additional CSS classes */
		class?: string;
		/** Custom renderer snippet for each individual option */
		option?: Snippet<[{ option: SegmentedOption; selected: boolean }]>;
	}

	let {
		options = [],
		value = $bindable(''),
		size = 'md',
		disabled = false,
		name = '',
		class: className = '',
		option,
		...restProps
	}: Props = $props();

	let containerEl = $state<HTMLDivElement | null>(null);
	let indicatorStyle = $state<string>('');

	// Select first option if value not initialized
	$effect(() => {
		if (!value && options.length > 0) {
			const first = options.find((o) => !o.disabled);
			if (first) {
				value = first.value;
			}
		}
	});

	// Measure and slide indicator to active button
	$effect(() => {
		if (!containerEl || !value) {
			indicatorStyle = 'opacity: 0;';
			return;
		}

		// Find button corresponding to value
		const btn = containerEl.querySelector<HTMLButtonElement>(`button[data-value="${CSS.escape(value)}"]`);
		if (btn) {
			const left = btn.offsetLeft;
			const width = btn.offsetWidth;
			indicatorStyle = `left: ${left}px; width: ${width}px; opacity: 1;`;
		} else {
			indicatorStyle = 'opacity: 0;';
		}
	});

	function selectOption(optValue: string, isDisabled?: boolean) {
		if (disabled || isDisabled) return;
		value = optValue;
	}

	function handleKeydown(event: KeyboardEvent, index: number) {
		if (disabled || options.length === 0) return;
		const enabledOpts = options.map((o, idx) => ({ ...o, origIndex: idx })).filter((o) => !o.disabled);
		const currentIdx = enabledOpts.findIndex((o) => o.value === options[index].value);

		let nextIdx = -1;
		if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
			nextIdx = (currentIdx + 1) % enabledOpts.length;
		} else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
			nextIdx = (currentIdx - 1 + enabledOpts.length) % enabledOpts.length;
		}

		if (nextIdx !== -1) {
			event.preventDefault();
			const target = enabledOpts[nextIdx];
			value = target.value;
			const targetBtn = containerEl?.querySelector<HTMLButtonElement>(`button[data-value="${CSS.escape(target.value)}"]`);
			targetBtn?.focus();
		}
	}
</script>

<div
	bind:this={containerEl}
	class="f-segmented-control {className}"
	data-size={size}
	data-disabled={disabled}
	role="radiogroup"
	aria-disabled={disabled || undefined}
	{...restProps}
>
	{#if name}
		<input type="hidden" {name} {value} />
	{/if}

	<!-- Sliding backdrop highlight indicator -->
	<div class="f-segmented-indicator" style={indicatorStyle} aria-hidden="true"></div>

	{#each options as opt, i (opt.value)}
		{@const isSelected = opt.value === value}
		{@const isDisabled = disabled || Boolean(opt.disabled)}

		<button
			type="button"
			role="radio"
			class="f-segmented-btn"
			class:is-selected={isSelected}
			disabled={isDisabled}
			aria-checked={isSelected}
			tabindex={isSelected ? 0 : -1}
			data-value={opt.value}
			onclick={() => selectOption(opt.value, opt.disabled)}
			onkeydown={(e) => handleKeydown(e, i)}
		>
			{#if option}
				{@render option({ option: opt, selected: isSelected })}
			{:else}
				{#if opt.icon}
					<span class="f-segmented-icon">
						{@render opt.icon()}
					</span>
				{/if}
				<span class="f-segmented-label">{opt.label}</span>
			{/if}
		</button>
	{/each}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-segmented-control {
			display: inline-flex;
			align-items: center;
			position: relative;
			background: var(--f-sunken);
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-full);
			padding: 3px;
			box-sizing: border-box;
			user-select: none;
		}

		.f-segmented-control[data-disabled='true'] {
			opacity: 0.5;
			cursor: not-allowed;
			pointer-events: none;
		}

		.f-segmented-indicator {
			position: absolute;
			top: 3px;
			bottom: 3px;
			background: var(--f-surface);
			border-radius: var(--f-radius-full);
			box-shadow: var(--f-shadow-sm);
			transition: left var(--f-duration-fast) var(--f-ease),
				width var(--f-duration-fast) var(--f-ease),
				opacity var(--f-duration-fast) var(--f-ease);
			pointer-events: none;
			z-index: 1;
		}

		.f-segmented-btn {
			position: relative;
			z-index: 2;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			gap: var(--f-space-2xs);
			background: transparent;
			border: none;
			color: var(--f-text-muted);
			font-family: inherit;
			font-weight: 500;
			cursor: pointer;
			white-space: nowrap;
			border-radius: var(--f-radius-full);
			transition: color var(--f-duration-fast) var(--f-ease);
		}

		.f-segmented-btn:hover:not(:disabled) {
			color: var(--f-text);
		}

		.f-segmented-btn:focus-visible {
			outline: 2px solid var(--f-ring);
			outline-offset: 1px;
		}

		.f-segmented-btn:disabled {
			opacity: 0.4;
			cursor: not-allowed;
		}

		.f-segmented-btn.is-selected {
			color: var(--f-text);
			font-weight: 600;
		}

		.f-segmented-icon {
			display: inline-flex;
			align-items: center;
			justify-content: center;
		}

		/* Sizes */
		.f-segmented-control[data-size='xs'] .f-segmented-btn {
			font-size: var(--f-text-xs);
			padding: var(--f-space-3xs) var(--f-space-xs);
			height: 22px;
		}

		.f-segmented-control[data-size='sm'] .f-segmented-btn {
			font-size: var(--f-text-sm);
			padding: var(--f-space-2xs) var(--f-space-sm);
			height: 28px;
		}

		.f-segmented-control[data-size='md'] .f-segmented-btn {
			font-size: var(--f-text-base);
			padding: var(--f-space-xs) var(--f-space-md);
			height: 34px;
		}

		.f-segmented-control[data-size='lg'] .f-segmented-btn {
			font-size: var(--f-text-lg);
			padding: var(--f-space-sm) var(--f-space-lg);
			height: 42px;
		}

		.f-segmented-control[data-size='xl'] .f-segmented-btn {
			font-size: var(--f-text-xl);
			padding: var(--f-space-md) var(--f-space-xl);
			height: 50px;
		}
	}
</style>
