<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { FsSize, FsTone } from '../types';
	import Bar from './Bar.svelte';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		value?: number;
		max?: number;
		size?: FsSize;
		tone?: FsTone;
		indeterminate?: boolean;
		striped?: boolean;
		animated?: boolean;
		showValue?: boolean;
		label?: string;
		class?: string;
	}

	let {
		value = 0,
		max = 100,
		size = 'md',
		tone = 'theme',
		indeterminate = false,
		striped = false,
		animated = false,
		showValue = false,
		label,
		class: className = '',
		...restProps
	}: Props = $props();

	const fraction = $derived(indeterminate ? 0 : Math.min(1, Math.max(0, value / (max || 100))));
</script>

<div class="box gap-xs {className}" {...restProps}>
	{#if label || (showValue && !indeterminate)}
		<div class="row ycenter xbetween gap-sm">
			{#if label}<span class="text-sm weight-500 text-secondary">{label}</span>{/if}
			{#if showValue && !indeterminate}
				<span class="text-sm mono text-muted">{Math.round(fraction * 100)}%</span>
			{/if}
		</div>
	{/if}
	<div
		role="progressbar"
		aria-valuenow={indeterminate ? undefined : Math.round(fraction * 100)}
		aria-valuemin={0}
		aria-valuemax={100}
		aria-label={label}
		class="wfull"
	>
		<Bar {fraction} {tone} {size} {indeterminate} {striped} {animated} />
	</div>
</div>
