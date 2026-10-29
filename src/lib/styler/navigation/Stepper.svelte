<!-- @component A step-by-step progress indicator for multi-step flows. -->

<script lang="ts" module>
	export interface StepItem {
		label: string;
		description?: string;
		error?: boolean;
	}
	export type StepStatus = 'completed' | 'current' | 'upcoming';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luCheck, luX } from '@fractaldesign/icons/lucide';
	import type { Orientation } from '../types';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		currentStep?: number;
		steps?: StepItem[];
		orientation?: Orientation;
		/** Completed steps can be clicked to go back */
		clickable?: boolean;
		class?: string;
		step?: Snippet<[{ step: StepItem; index: number; status: StepStatus }]>;
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

	const statusOf = (i: number): StepStatus => (i < currentStep ? 'completed' : i === currentStep ? 'current' : 'upcoming');
	const vertical = $derived(orientation === 'vertical');

	function go(i: number) {
		if (!clickable || i > currentStep) return;
		currentStep = i;
		onStepClick?.(i);
	}
</script>

{#snippet marker(s: StepItem, i: number, status: StepStatus)}
	<button
		type="button"
		class="frame-1-1 px-xs radius-full shrink-0"
		data-variant={s.error ? 'outline' : status === 'upcoming' ? 'outline' : status === 'current' ? 'primary' : 'soft'}
		data-size="lg"
		data-shape="round"
		disabled={!(clickable && i <= currentStep)}
		aria-label="Step {i + 1}: {s.label}"
		aria-current={status === 'current' ? 'step' : undefined}
		onclick={() => go(i)}
	>
		{#if status === 'completed'}<Icon icon={luCheck} />{:else if s.error}<Icon icon={luX} class="text-danger" />{:else}<span class="mono">{i + 1}</span>{/if}
	</button>
{/snippet}

{#snippet text(s: StepItem, i: number, status: StepStatus)}
	{#if step}
		{@render step({ step: s, index: i, status })}
	{:else}
		<span class="text-sm weight-600 {status === 'upcoming' ? 'text-muted' : s.error ? 'text-danger' : 'text-primary'}">{s.label}</span>
		{#if s.description}<span class="text-body-sm text-muted">{s.description}</span>{/if}
	{/if}
{/snippet}

<div role="list" class="{vertical ? 'box' : 'row ytop'} {className}" aria-label="Progress" {...restProps}>
	{#each steps as s, i (s.label + i)}
		{@const status = statusOf(i)}
		{@const last = i === steps.length - 1}
		{#if vertical}
			<div role="listitem" class="row gap-sm">
				<div class="box xcenter shrink-0">
					{@render marker(s, i, status)}
					{#if !last}<span class="grow py-md {i < currentStep ? 'bl-str' : 'bl-sub'}" aria-hidden="true"></span>{/if}
				</div>
				<div class="box gap-xs pb-md">{@render text(s, i, status)}</div>
			</div>
		{:else}
			<div role="listitem" class="box gap-sm {last ? '' : 'grow'} min0">
				<div class="row ycenter gap-sm">
					{@render marker(s, i, status)}
					{#if !last}<span class="grow {i < currentStep ? 'bb-str' : 'bb-sub'}" aria-hidden="true"></span>{/if}
				</div>
				<div class="box gap-xs pr-sm">{@render text(s, i, status)}</div>
			</div>
		{/if}
	{/each}
</div>
