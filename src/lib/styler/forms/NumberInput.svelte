<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { Icon } from 'fractalicons';
	import { luMinus, luPlus } from 'fractalicons/lucide';
	import type { FsFieldVariant, FsSize, FsShape } from '../types';
	import { FIELD_PAINT, FIELD_HEIGHT, SHAPE_RADIUS } from '../classes';

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
		variant?: FsFieldVariant;
		size?: FsSize;
		shape?: FsShape;
		id?: string;
		class?: string;
	}

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
		variant = 'primary',
		size = 'lg',
		shape = 'modern',
		id,
		class: className = '',
		...restProps
	}: Props = $props();

	const uid = $props.id();
	const inputId = $derived(id || uid);
	const errorMessage = $derived(typeof error === 'string' ? error : undefined);
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
	<div class="row ycenter gap-xs px-xs {FIELD_PAINT[variant]} {FIELD_HEIGHT[size]} {SHAPE_RADIUS[shape]}">
		{#if controls}
			<button
				type="button"
				data-variant="iconbox"
				class="px-xs"
				disabled={!canDec}
				tabindex={-1}
				aria-label="Decrease value"
				onpointerdown={() => startStepping(-step)}
				onpointerup={stopStepping}
				onpointerleave={stopStepping}
			>
				<Icon icon={luMinus} />
			</button>
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
			class="input grow min0 hfull ta-c mono"
			data-variant="ghost"
			{onchange}
			onkeydown={(e) => {
				if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
					e.preventDefault();
					stepBy(e.key === 'ArrowUp' ? step : -step);
				}
			}}
			aria-invalid={error ? true : undefined}
			aria-describedby={errorMessage ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
			{...restProps}
		/>
		{#if controls}
			<button
				type="button"
				data-variant="iconbox"
				class="px-xs"
				disabled={!canInc}
				tabindex={-1}
				aria-label="Increase value"
				onpointerdown={() => startStepping(step)}
				onpointerup={stopStepping}
				onpointerleave={stopStepping}
			>
				<Icon icon={luPlus} />
			</button>
		{/if}
	</div>
	{#if errorMessage}
		<p id="{inputId}-error" class="text-body-sm text-danger" role="alert">{errorMessage}</p>
	{:else if helperText}
		<p id="{inputId}-helper" class="text-body-sm text-muted">{helperText}</p>
	{/if}
</div>
