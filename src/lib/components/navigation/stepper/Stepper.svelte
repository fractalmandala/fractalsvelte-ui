<!-- @component A sequence of steps, with a connector that fills as each one is completed. -->

<script lang="ts">
	import type {  ComponentProps, Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luCheck } from '@fractaldesign/icons/lucide';
	import { Button } from '../../actions/button/index.js';
	import { vars } from '../../../motion/index.js';
	import type { ChildTextColor, ChildTextSize, Orientation, Shape, Size, TextColor, TextSize } from '../../../internal/tokens.js';
	import type {  StepItem, StepStatus  } from './steps.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		steps: StepItem[];
		value?: string | null;
		onValueChange?: (value: string | null) => void;
		orientation?: Orientation;
		linear?: boolean;
		clickable?: boolean;
		showControls?: boolean;
		completedContent?: Snippet;
		onComplete?: () => void;
		label?: string;
		size?: Size;
		shape?: Shape;
		textSize?: TextSize;
		textColor?: TextColor;
		childTextSize?: ChildTextSize;
		childTextColor?: ChildTextColor;
		backButtonProps?: ComponentProps<typeof Button>;
		nextButtonProps?: ComponentProps<typeof Button>;
	}

	let {
		backButtonProps,
		nextButtonProps,
		steps,
		value = $bindable(null),
		onValueChange,
		orientation = 'horizontal',
		linear = true,
		clickable = true,
		showControls = false,
		completedContent,
		onComplete,
		label,
		size = 'h-lg',
		shape = 'round',
		textSize = 'text-sm',
		textColor = 'text-muted',
		childTextSize = 'text-xs',
		childTextColor = 'text-muted',
		class: className,
		...rest
	}: Props = $props();

	let finished = $state(false);
	const currentIndex = $derived(steps.findIndex((step) => step.value === value));

	function stepPrev() {
		finished = false;
		const idx = currentIndex <= 0 ? 0 : currentIndex - 1;
		const prevStep = steps[idx];
		if (!prevStep) return;
		value = prevStep.value;
		onValueChange?.(prevStep.value);
	}

	function stepNext() {
		if (currentIndex < 0 && steps[0]) {
			value = steps[0].value;
			onValueChange?.(steps[0].value);
			return;
		}
		if (currentIndex >= steps.length - 1) {
			finished = true;
			value = null;
			onValueChange?.(null);
			onComplete?.();
			return;
		}
		const nextStep = steps[currentIndex + 1];
		if (!nextStep) return;
		value = nextStep.value;
		onValueChange?.(nextStep.value);
	}

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
		complete: 'primary border-none',
		current: 'bg-surface text-theme border-strong glow',
		upcoming: 'bg-surface text-muted border',
		error: 'danger border-none'
	};

	const labelClass: Record<StepStatus, string> = {
		complete: '',
		current: '',
		upcoming: '',
		error: 'text-danger'
	};
</script>

<nav aria-label={label} class={className} {...rest}>
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
								'bare inline-flex xcenter ycenter shrink-0 square weight-500 focus-ring',
								shape,
								size,
								textSize,
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
								'inline-flex xcenter ycenter shrink-0 square weight-500',
								shape,
								size,
								textSize,
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
					<p class={[textSize, 'weight-500', status === 'upcoming' ? textColor : labelClass[status]]}>
						{step.label}
					</p>
					{#if step.description}
						<p class={[childTextSize, childTextColor]}>{step.description}</p>
					{/if}
				</div>
			</li>
		{/each}
	</ol>
	{#if finished && completedContent}
		<div class="pt-md">
			{@render completedContent()}
		</div>
	{/if}
	{#if showControls && steps.length > 0}
		<div class="row ycenter xbetween pt-md">
			<Button variant="outline" size="h-sm" disabled={currentIndex <= 0 && !finished} onclick={stepPrev} {...backButtonProps}>
				Back
			</Button>
			<Button variant="themed" size="h-sm" disabled={finished} onclick={stepNext} {...nextButtonProps}>
				{currentIndex >= steps.length - 1 ? 'Finish' : 'Next'}
			</Button>
		</div>
	{/if}
</nav>
