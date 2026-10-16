<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Orientation } from '../../types';

	export interface StepItem {
		label: string;
		description?: string;
		error?: boolean;
	}

	export interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Zero-based index of the currently active step */
		currentStep?: number;
		/** Array of steps representing sequential workflow phases */
		steps?: StepItem[];
		/** Layout orientation of the progress tracker */
		orientation?: Orientation;
		/** Whether users can click previously completed steps to navigate back */
		clickable?: boolean;
		/** Additional CSS classes */
		class?: string;
		/** Custom renderer snippet for each individual step stage */
		step?: Snippet<[{ step: StepItem; index: number; status: 'completed' | 'current' | 'upcoming' }]>;
		/** Callback triggered when a clickable step indicator is clicked */
		onStepClick?: (index: number) => void;
	}

	let {
		currentStep = $bindable(0),
		steps = [],
		orientation = 'horizontal',
		clickable = false,
		class: className = '',
		step,
		onStepClick,
		...restProps
	}: Props = $props();

	function getStatus(index: number): 'completed' | 'current' | 'upcoming' {
		if (index < currentStep) return 'completed';
		if (index === currentStep) return 'current';
		return 'upcoming';
	}

	function handleStepClick(index: number) {
		if (!clickable) return;
		if (index <= currentStep) {
			currentStep = index;
			onStepClick?.(index);
		}
	}
</script>

<div
	class="f-stepper {className}"
	data-orientation={orientation}
	role="list"
	aria-label="Progress Stepper"
	{...restProps}
>
	{#each steps as s, i (s.label + i)}
		{@const status = getStatus(i)}
		{@const isClickable = clickable && i <= currentStep}

		<div
			class="f-step-item"
			data-status={status}
			class:is-clickable={isClickable}
			role="listitem"
		>
			<div class="f-step-header">
				<button
					type="button"
					class="f-step-indicator"
					disabled={!isClickable}
					aria-label={`Step ${i + 1}: ${s.label}`}
					aria-current={status === 'current' ? 'step' : undefined}
					onclick={() => handleStepClick(i)}
				>
					{#if status === 'completed'}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="3"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="f-step-check"
						>
							<polyline points="20 6 9 17 4 12" />
						</svg>
					{:else if s.error}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="3"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					{:else}
						<span class="f-step-num">{i + 1}</span>
					{/if}
				</button>

				{#if i < steps.length - 1}
					<div
						class="f-step-connector"
						class:is-completed={i < currentStep}
						aria-hidden="true"
					></div>
				{/if}
			</div>

			<div class="f-step-content">
				{#if step}
					{@render step({ step: s, index: i, status })}
				{:else}
					<div class="f-step-label">{s.label}</div>
					{#if s.description}
						<div class="f-step-description">{s.description}</div>
					{/if}
				{/if}
			</div>
		</div>
	{/each}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-stepper {
			display: flex;
			box-sizing: border-box;
			width: 100%;
		}

		.f-stepper[data-orientation='horizontal'] {
			flex-direction: row;
			align-items: flex-start;
			justify-content: space-between;
		}

		.f-stepper[data-orientation='vertical'] {
			flex-direction: column;
			gap: var(--f-space-md);
		}

		.f-step-item {
			display: flex;
			position: relative;
		}

		.f-stepper[data-orientation='horizontal'] .f-step-item {
			flex: 1;
			flex-direction: column;
			align-items: center;
			text-align: center;
		}

		.f-stepper[data-orientation='horizontal'] .f-step-item:last-child {
			flex: 0 0 auto;
		}

		.f-stepper[data-orientation='vertical'] .f-step-item {
			flex-direction: row;
			align-items: flex-start;
			gap: var(--f-space-sm);
		}

		.f-step-header {
			display: flex;
			align-items: center;
			position: relative;
			width: 100%;
		}

		.f-stepper[data-orientation='horizontal'] .f-step-header {
			justify-content: center;
		}

		.f-stepper[data-orientation='vertical'] .f-step-header {
			width: auto;
			flex-direction: column;
		}

		.f-step-indicator {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 32px;
			height: 32px;
			border-radius: var(--f-radius-full);
			font-size: var(--f-text-sm);
			font-weight: 600;
			font-family: inherit;
			box-sizing: border-box;
			border: 2px solid var(--f-border);
			background: var(--f-surface);
			color: var(--f-text-muted);
			cursor: default;
			padding: 0;
			flex-shrink: 0;
			z-index: 2;
			transition: all var(--f-duration-fast) var(--f-ease);
		}

		.f-step-item.is-clickable .f-step-indicator {
			cursor: pointer;
		}

		.f-step-item.is-clickable .f-step-indicator:hover {
			filter: brightness(0.95);
			transform: scale(1.05);
		}

		.f-step-indicator:focus-visible {
			outline: 2px solid var(--f-ring);
			outline-offset: 2px;
		}

		/* Statuses */
		.f-step-item[data-status='completed'] .f-step-indicator {
			background: var(--f-primary);
			border-color: var(--f-primary);
			color: var(--f-primary-text);
		}

		.f-step-item[data-status='current'] .f-step-indicator {
			border-color: var(--f-primary);
			color: var(--f-primary);
			background: var(--f-surface);
			box-shadow: 0 0 0 4px var(--f-primary-subtle);
		}

		.f-step-item[data-status='upcoming'] .f-step-indicator {
			background: var(--f-sunken);
			border-color: var(--f-border);
			color: var(--f-text-subtle);
		}

		/* Connectors */
		.f-stepper[data-orientation='horizontal'] .f-step-connector {
			position: absolute;
			top: 50%;
			left: calc(50% + 16px);
			right: calc(-50% + 16px);
			height: 2px;
			background: var(--f-border);
			transform: translateY(-50%);
			z-index: 1;
			transition: background var(--f-duration-normal) var(--f-ease);
		}

		.f-stepper[data-orientation='horizontal'] .f-step-connector.is-completed {
			background: var(--f-primary);
		}

		.f-stepper[data-orientation='vertical'] .f-step-connector {
			width: 2px;
			height: 100%;
			min-height: 24px;
			background: var(--f-border);
			margin-top: 4px;
			margin-bottom: 4px;
			transition: background var(--f-duration-normal) var(--f-ease);
		}

		.f-stepper[data-orientation='vertical'] .f-step-connector.is-completed {
			background: var(--f-primary);
		}

		/* Content */
		.f-step-content {
			margin-top: var(--f-space-xs);
			display: flex;
			flex-direction: column;
			gap: 2px;
		}

		.f-stepper[data-orientation='vertical'] .f-step-content {
			margin-top: 4px;
			text-align: left;
		}

		.f-step-label {
			font-size: var(--f-text-sm);
			font-weight: 600;
			color: var(--f-text);
		}

		.f-step-item[data-status='upcoming'] .f-step-label {
			color: var(--f-text-muted);
			font-weight: 500;
		}

		.f-step-description {
			font-size: var(--f-text-xs);
			color: var(--f-text-muted);
		}
	}
</style>
