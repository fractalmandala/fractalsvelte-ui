<!-- @component A sequence of steps, with a connector that fills as each one is completed. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luCheck } from '@fractaldesign/icons/lucide';
	import { vars } from '../../../motion/index.js';
	import type { Orientation } from '../../../internal/tokens.js';
	import type { StepItem, StepStatus } from './steps.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		/** The steps, in order. */
		steps: StepItem[];
		/** The current step's value. Two-way bindable. */
		value?: string | null;
		/** Called whenever the current step changes. */
		onValueChange?: (value: string | null) => void;
		/** Lays the steps out in a row or a column. */
		orientation?: Orientation;
		/** When true, only the current step and earlier ones can be selected. */
		linear?: boolean;
		/** When true, a step's marker is a button that selects it, subject to `linear`. */
		clickable?: boolean;
		/** Accessible name of the stepper. */
		label?: string;
	}

	let {
		steps,
		value = $bindable(null),
		onValueChange,
		orientation = 'horizontal',
		linear = true,
		clickable = true,
		label,
		class: klass,
		...rest
	}: Props = $props();

	const currentIndex = $derived(steps.findIndex((step) => step.value === value));

	function statusOf(step: StepItem, index: number): StepStatus {
		if (step.status) return step.status;
		if (currentIndex < 0) return 'upcoming';
		if (index < currentIndex) return 'complete';
		if (index === currentIndex) return 'current';
		return 'upcoming';
	}

	function canSelect(step: StepItem, index: number): boolean {
		if (!clickable || step.disabled) return false;
		if (!linear) return true;
		if (currentIndex < 0) return index === 0;
		return index <= currentIndex;
	}

	function select(step: StepItem, index: number) {
		if (!canSelect(step, index) || value === step.value) return;
		value = step.value;
		onValueChange?.(step.value);
	}

	function fillAfter(index: number): number {
		const step = steps[index];
		if (!step) return 0;
		const status = statusOf(step, index);
		return status === 'complete' ? 1 : 0;
	}

	const vertical = $derived(orientation === 'vertical');

	const markerClass: Record<StepStatus, string> = {
		complete: 'bg-button text-inverse border-none',
		current: 'bg-surface text-theme border-strong glow',
		upcoming: 'bg-surface text-muted border',
		error: 'bg-danger text-inverse border-none'
	};
</script>

<nav aria-label={label} class={klass} {...rest}>
	<ol class={['ycenter', vertical ? 'column gap-xs' : 'row']}>
		{#each steps as step, index (step.value)}
			{@const status = statusOf(step, index)}
			{@const last = index === steps.length - 1}
			{@const allowed = canSelect(step, index)}
			<li class={['min0', vertical ? 'row gap-sm ytop wfull' : 'column gap-sm', !vertical && !last && 'grow']}>
				<div class={['ycenter', vertical ? 'column shrink-0' : 'row']}>
					{#if clickable}
						<button
							type="button"
							class={[
								'bare circle inline-flex xcenter ycenter shrink-0 square h-lg text-sm weight-500 focus-ring',
								markerClass[status],
								!allowed && 'disabled'
							]}
							disabled={!allowed}
							aria-current={status === 'current' ? 'step' : undefined}
							aria-disabled={!allowed || undefined}
							onclick={() => select(step, index)}
						>
							{#if step.icon}
								<Icon icon={step.icon} />
							{:else if status === 'complete'}
								<Icon icon={luCheck} />
							{:else}
								<span class="tabular-nums">{index + 1}</span>
							{/if}
						</button>
					{:else}
						<div
							class={[
								'circle inline-flex xcenter ycenter shrink-0 square h-lg text-sm weight-500',
								markerClass[status]
							]}
							aria-current={status === 'current' ? 'step' : undefined}
						>
							{#if step.icon}
								<Icon icon={step.icon} />
							{:else if status === 'complete'}
								<Icon icon={luCheck} />
							{:else}
								<span class="tabular-nums">{index + 1}</span>
							{/if}
						</div>
					{/if}
					{#if !last}
						<div
							class={['track connector', vertical ? 'vertical grow my-sm' : 'grow mx-sm']}
							{@attach vars({ value: fillAfter(index) })}
							aria-hidden="true"
						>
							<div class="fill spring spring-snappy"></div>
						</div>
					{/if}
				</div>
				<div class={['min0', !vertical && 'pr-md']}>
					<p class={['text-sm weight-500', status === 'upcoming' ? 'text-muted' : status === 'error' ? 'text-danger' : 'text-primary']}>
						{step.label}
					</p>
					{#if step.description}
						<p class="text-xs text-muted">{step.description}</p>
					{/if}
				</div>
			</li>
		{/each}
	</ol>
</nav>
