<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Space } from '../../types';

	export type SelectableCardType = 'checkbox' | 'radio';
	export type IndicatorPosition = 'top-right' | 'top-left' | 'left';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
		/** Bindable selection state */
		selected?: boolean;
		/** Selection type semantics (checkbox or radio) */
		type?: SelectableCardType;
		/** Whether interaction is disabled */
		disabled?: boolean;
		/** Form submission value */
		value?: string;
		/** Group identifier for radio groups */
		name?: string;
		/** Position placement of the selection check/dot */
		indicatorPosition?: IndicatorPosition;
		/** Inner content padding token */
		padding?: Space;
		/** Corner radius scale token */
		radius?: 'sm' | 'md' | 'lg' | 'xl';
		/** Primary card title */
		title?: string;
		/** Secondary explanatory description */
		description?: string;
		/** Additional CSS classes */
		class?: string;
		/** Optional change event callback */
		onchange?: (selected: boolean) => void;
		/** Custom indicator snippet replacing default check/radio */
		indicator?: Snippet;
		/** Main content body */
		children?: Snippet;
	}

	let {
		selected = $bindable(false),
		type = 'checkbox',
		disabled = false,
		value,
		name,
		indicatorPosition = 'top-right',
		padding = 'lg',
		radius = 'lg',
		title,
		description,
		class: className = '',
		onchange,
		indicator,
		children,
		...restProps
	}: Props = $props();

	function toggle() {
		if (disabled) return;
		if (type === 'radio') {
			selected = true;
			onchange?.(true);
		} else {
			selected = !selected;
			onchange?.(selected);
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (disabled) return;
		if (event.key === ' ' || event.key === 'Enter') {
			event.preventDefault();
			toggle();
		}
	}
</script>

{#if type === 'radio'}
	<div
		role="radio"
		aria-checked={selected}
		aria-disabled={disabled || undefined}
		tabindex={disabled ? -1 : 0}
		class="f-selectable-card {className}"
		data-selected={selected ? 'true' : 'false'}
		data-disabled={disabled ? 'true' : undefined}
		data-type={type}
		data-indicator-position={indicatorPosition}
		data-padding={padding}
		data-radius={radius}
		onclick={toggle}
		onkeydown={handleKeyDown}
		{...restProps}
	>
		<div class="f-selectable-content">
			{#if indicatorPosition === 'left'}
				<div class="f-indicator" aria-hidden="true">
					{#if indicator}
						{@render indicator()}
					{:else}
						<span class="f-radio-dot"></span>
					{/if}
				</div>
			{/if}

			<div class="f-selectable-body">
				{#if title}
					<div class="f-selectable-title">{title}</div>
				{/if}
				{#if description}
					<div class="f-selectable-desc">{description}</div>
				{/if}
				{#if children}
					{@render children()}
				{/if}
			</div>

			{#if indicatorPosition !== 'left'}
				<div class="f-indicator" aria-hidden="true">
					{#if indicator}
						{@render indicator()}
					{:else}
						<span class="f-radio-dot"></span>
					{/if}
				</div>
			{/if}
		</div>
	</div>
{:else}
	<div
		role="checkbox"
		aria-checked={selected}
		aria-disabled={disabled || undefined}
		tabindex={disabled ? -1 : 0}
		class="f-selectable-card {className}"
		data-selected={selected ? 'true' : 'false'}
		data-disabled={disabled ? 'true' : undefined}
		data-type={type}
		data-indicator-position={indicatorPosition}
		data-padding={padding}
		data-radius={radius}
		onclick={toggle}
		onkeydown={handleKeyDown}
		{...restProps}
	>
		<div class="f-selectable-content">
			{#if indicatorPosition === 'left'}
				<div class="f-indicator" aria-hidden="true">
					{#if indicator}
						{@render indicator()}
					{:else}
						<svg
							class="f-check-icon"
							viewBox="0 0 16 16"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<polyline points="3.5 8.5 6.5 11.5 12.5 5" />
						</svg>
					{/if}
				</div>
			{/if}

			<div class="f-selectable-body">
				{#if title}
					<div class="f-selectable-title">{title}</div>
				{/if}
				{#if description}
					<div class="f-selectable-desc">{description}</div>
				{/if}
				{#if children}
					{@render children()}
				{/if}
			</div>

			{#if indicatorPosition !== 'left'}
				<div class="f-indicator" aria-hidden="true">
					{#if indicator}
						{@render indicator()}
					{:else}
						<svg
							class="f-check-icon"
							viewBox="0 0 16 16"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<polyline points="3.5 8.5 6.5 11.5 12.5 5" />
						</svg>
					{/if}
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	@layer fractalsvelte-ui.components {
		.f-selectable-card {
			position: relative;
			border: 1.5px solid var(--f-border);
			background: var(--f-surface);
			color: var(--f-text);
			cursor: pointer;
			user-select: none;
			outline: none;
			box-sizing: border-box;
			transition: border-color var(--f-duration-fast) var(--f-ease),
				background var(--f-duration-fast) var(--f-ease),
				box-shadow var(--f-duration-fast) var(--f-ease),
				transform var(--f-duration-fast) var(--f-ease);
		}

		.f-selectable-card:hover:not([data-disabled='true']) {
			border-color: var(--f-border-strong);
			background: var(--f-hover);
		}

		.f-selectable-card:focus-visible {
			outline: 2px solid var(--f-ring);
			outline-offset: 2px;
		}

		.f-selectable-card[data-selected='true'] {
			border-color: var(--f-primary);
			background: var(--f-primary-subtle);
			box-shadow: 0 0 0 1px var(--f-primary);
		}

		.f-selectable-card[data-disabled='true'] {
			opacity: 0.5;
			cursor: not-allowed;
			pointer-events: none;
		}

		/* Radii */
		.f-selectable-card[data-radius='sm'] {
			border-radius: var(--f-radius-sm);
		}
		.f-selectable-card[data-radius='md'] {
			border-radius: var(--f-radius-md);
		}
		.f-selectable-card[data-radius='lg'] {
			border-radius: var(--f-radius-lg);
		}
		.f-selectable-card[data-radius='xl'] {
			border-radius: var(--f-radius-xl);
		}

		/* Padding tokens */
		.f-selectable-card[data-padding='none'] {
			padding: 0;
		}
		.f-selectable-card[data-padding='3xs'] {
			padding: var(--f-space-3xs);
		}
		.f-selectable-card[data-padding='2xs'] {
			padding: var(--f-space-2xs);
		}
		.f-selectable-card[data-padding='xs'] {
			padding: var(--f-space-xs);
		}
		.f-selectable-card[data-padding='sm'] {
			padding: var(--f-space-sm);
		}
		.f-selectable-card[data-padding='md'] {
			padding: var(--f-space-md);
		}
		.f-selectable-card[data-padding='lg'] {
			padding: var(--f-space-lg);
		}
		.f-selectable-card[data-padding='xl'] {
			padding: var(--f-space-xl);
		}
		.f-selectable-card[data-padding='2xl'] {
			padding: var(--f-space-2xl);
		}

		.f-selectable-content {
			display: flex;
			align-items: flex-start;
			gap: var(--f-space-md);
			width: 100%;
		}

		.f-selectable-card[data-indicator-position='top-left'] .f-selectable-content {
			flex-direction: row-reverse;
			justify-content: flex-end;
		}

		.f-selectable-body {
			flex: 1;
			min-width: 0;
			display: flex;
			flex-direction: column;
			gap: var(--f-space-2xs);
		}

		.f-selectable-title {
			font-size: var(--f-text-base);
			font-weight: 600;
			color: var(--f-text);
			line-height: 1.35;
		}

		.f-selectable-desc {
			font-size: var(--f-text-sm);
			color: var(--f-text-muted);
			line-height: 1.45;
		}

		/* Indicator styling */
		.f-indicator {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 20px;
			height: 20px;
			flex-shrink: 0;
			border: 1.5px solid var(--f-border-strong);
			background: var(--f-surface);
			transition: border-color var(--f-duration-fast) var(--f-ease),
				background var(--f-duration-fast) var(--f-ease),
				transform var(--f-duration-fast) var(--f-ease);
		}

		.f-selectable-card[data-type='checkbox'] .f-indicator {
			border-radius: var(--f-radius-xs);
		}

		.f-selectable-card[data-type='radio'] .f-indicator {
			border-radius: var(--f-radius-full);
		}

		.f-selectable-card[data-selected='true'] .f-indicator {
			border-color: var(--f-primary);
			background: var(--f-primary);
			color: var(--f-primary-text);
		}

		.f-check-icon {
			width: 13px;
			height: 13px;
			stroke: var(--f-primary-text);
			stroke-dasharray: 20;
			stroke-dashoffset: 20;
			transition: stroke-dashoffset var(--f-duration-normal) var(--f-ease);
		}

		.f-selectable-card[data-selected='true'] .f-check-icon {
			stroke-dashoffset: 0;
		}

		.f-radio-dot {
			width: 8px;
			height: 8px;
			border-radius: var(--f-radius-full);
			background: var(--f-primary-text);
			transform: scale(0);
			transition: transform var(--f-duration-fast) var(--f-ease-spring);
		}

		.f-selectable-card[data-selected='true'] .f-radio-dot {
			transform: scale(1);
		}
	}
</style>
