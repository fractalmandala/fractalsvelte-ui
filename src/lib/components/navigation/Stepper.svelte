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
	import Icon from '$lib/components/core/Icon.svelte';
	import { klCheck, klX } from '$lib/icons/keylinestroke.js';
	import type { Orientation, TextSize } from '$lib/types.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		currentStep?: number;
		steps?: StepItem[];
		orientation?: Orientation;
		/** Completed steps can be clicked to go back */
		clickable?: boolean;
		textsize?: TextSize;
		class?: string;
		step?: Snippet<[{ step: StepItem; index: number; status: StepStatus }]>;
		onStepClick?: (index: number) => void;
	}

	let {
		currentStep = $bindable(0),
		steps = [],
		orientation = 'horizontal',
		clickable = false,
		textsize = 'text-md',
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

{#snippet glyph(s: StepItem, i: number, status: StepStatus)}
	{#if status === 'completed'}<Icon icon={klCheck} />{:else if s.error}<Icon icon={klX} class="text-danger" />{:else}<span class="font-mono text-sm">{i + 1}</span>{/if}
{/snippet}

{#snippet marker(s: StepItem, i: number, status: StepStatus)}
	{@const look = `btn-icon inline-flex row xcenter ycenter h-lg round shrink-0 ${s.error || status === 'upcoming' ? 'outline' : status === 'current' ? 'primary' : 'secondary'}`}
	<!-- Only a step you can go back to is a button; the rest are plain markers, not disabled buttons. -->
	{#if clickable && i < currentStep}
		<button type="button" class={look} aria-label="Go to step {i + 1}: {s.label}" onclick={() => go(i)}>
			{@render glyph(s, i, status)}
		</button>
	{:else}
		<span class={look} aria-label="Step {i + 1}: {s.label}" aria-current={status === 'current' ? 'step' : undefined}>
			{@render glyph(s, i, status)}
		</span>
	{/if}
{/snippet}

{#snippet text(s: StepItem, i: number, status: StepStatus)}
	{#if step}
		{@render step({ step: s, index: i, status })}
	{:else}
		<span class="text-sm weight-600 {status === 'upcoming' ? 'text-muted' : s.error ? 'text-danger' : 'text-primary'}">{s.label}</span>
		{#if s.description}<span class="text-body-sm text-muted">{s.description}</span>{/if}
	{/if}
{/snippet}

<div role="list" class="{vertical ? 'box' : 'row ytop wfull'} {textsize} {className}" aria-label="Progress" {...restProps}>
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
