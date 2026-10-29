<!-- @component A progress bar, determinate or indeterminate, with optional value label. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Size, MessageText } from '../types';
	import Bar from './Bar.svelte';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		value?: number;
		max?: number;
		size?: Size;
		/** Bar colour. Unset, it uses the theme colour (text-theme). */
		tone?: MessageText;
		direction?: 'horizontal' | 'vertical';
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
		size = 'h-md',
		tone,
		direction = 'horizontal',
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

<div class="box gap-xs {direction === 'vertical' ? 'xcenter' : ''} {className}" {...restProps}>
	{#if label || (showValue && !indeterminate)}
		<div class="{direction === 'vertical' ? 'box xcenter' : 'row ycenter xbetween'} gap-sm">
			{#if label}<span class="text-sm weight-500 text-secondary">{label}</span>{/if}
			{#if showValue && !indeterminate}
				<span class="text-sm tabular-nums text-muted">{String(Math.round(fraction * 100)).padStart(3, '\u2007')}%</span>
			{/if}
		</div>
	{/if}
	<div
		role="progressbar"
		aria-valuenow={indeterminate ? undefined : Math.round(fraction * 100)}
		aria-valuemin={0}
		aria-valuemax={100}
		aria-label={label}
		class={direction === 'vertical' ? 'row xcenter' : 'wfull'}
	>
		<Bar {fraction} {tone} {size} {indeterminate} {striped} {animated} {direction} />
	</div>
</div>
