<!-- @component A numeric input with min, max, step and optional − / + stepper buttons. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luMinus, luPlus } from '@fractaldesign/icons/lucide';
	import IconButton from '../actions/IconButton.svelte';
	import type { Surface, Size, Shape, Shadow } from '../types';
	import { getFieldLook } from './field-context';

	interface Props extends Omit<HTMLInputAttributes, 'size'> {
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		label?: string;
		helperText?: string;
		error?: boolean | string;
		disabled?: boolean;
		readonly?: boolean;
		/** Show the − / + stepper buttons */
		controls?: boolean;
		surface?: Surface;
		size?: Size;
		shape?: Shape;
		shadow?: Shadow;
		id?: string;
		class?: string;
		leading?: Snippet;
		trailing?: Snippet;
	}

	const field = getFieldLook();

	let {
		value = $bindable(0),
		min,
		max,
		step = 1,
		label,
		helperText,
		error,
		disabled = false,
		readonly = false,
		controls = true,
		surface = field.surface ?? 'bg-input',
		size = field.size ?? 'h-lg',
		shape = field.shape ?? 'modern',
		shadow = field.shadow ?? 'shad-none',
		id,
		class: className = '',
		leading,
		trailing,
		...restProps
	}: Props = $props();

	const uid = $props.id();
	const inputId = $derived(id || uid);
	const errorMessage = $derived(typeof error === 'string' ? error : undefined);
	const invalid = $derived(Boolean(error) || Boolean(field.invalid));
	let timer: ReturnType<typeof setInterval> | null = null;

	const canDec = $derived(!disabled && !readonly && (min === undefined || (value ?? 0) > min));
	const canInc = $derived(!disabled && !readonly && (max === undefined || (value ?? 0) < max));

	function clamp(val: number): number {
		let res = val;
		if (min !== undefined && res < min) res = min;
		if (max !== undefined && res > max) res = max;
		const decimals = (step.toString().split('.')[1] || '').length;
		return Number(res.toFixed(decimals));
	}

	function stepBy(amount: number) {
		if (disabled || readonly) return;
		value = clamp((value ?? 0) + amount);
	}

	function startStepping(amount: number) {
		stepBy(amount);
		timer = setInterval(() => stepBy(amount), 100);
	}

	function stopStepping() {
		if (timer) clearInterval(timer);
		timer = null;
	}

	function onchange(e: Event) {
		const num = parseFloat((e.currentTarget as HTMLInputElement).value);
		value = isNaN(num) ? (min ?? 0) : clamp(num);
	}
</script>

<div class="box gap-xs {className}">
	{#if label}<label for={inputId} class="text-xs weight-500 text-secondary">{label}</label>{/if}
	<div class="row ycenter gap-xs px-xs border el-size el-shape {surface} {size} {shape} {shadow} {invalid ? 'is-invalid' : ''}">
		{#if leading}
			<span class="row ycenter shrink-0 pl-xs text-muted" aria-hidden="true">{@render leading()}</span>
		{/if}
		{#if controls}
			<IconButton
				icon="ghost"
				size="h-sm"
				label="Decrease value"
				disabled={!canDec}
				tabindex={-1}
				onpointerdown={() => startStepping(-step)}
				onpointerup={stopStepping}
				onpointerleave={stopStepping}
			>
				<Icon icon={luMinus} />
			</IconButton>
		{/if}
		<input
			id={inputId}
			type="number"
			{value}
			{min}
			{max}
			{step}
			{disabled}
			{readonly}
			class="input grow min0 hfull ta-c tabular-nums border-none"
			style:background="transparent"
			{onchange}
			onkeydown={(e) => {
				if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
					e.preventDefault();
					stepBy(e.key === 'ArrowUp' ? step : -step);
				}
			}}
			aria-invalid={invalid || undefined}
			aria-describedby={errorMessage ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
			{...restProps}
		/>
		{#if controls}
			<IconButton
				icon="ghost"
				size="h-sm"
				label="Increase value"
				disabled={!canInc}
				tabindex={-1}
				onpointerdown={() => startStepping(step)}
				onpointerup={stopStepping}
				onpointerleave={stopStepping}
			>
				<Icon icon={luPlus} />
			</IconButton>
		{/if}
		{#if trailing}
			<span class="row ycenter shrink-0 pr-xs text-muted" aria-hidden="true">{@render trailing()}</span>
		{/if}
	</div>
	{#if errorMessage}
		<p id="{inputId}-error" class="text-body-sm text-danger" role="alert">{errorMessage}</p>
	{:else if helperText}
		<p id="{inputId}-helper" class="text-body-sm text-muted">{helperText}</p>
	{/if}
</div>
