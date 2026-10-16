<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { Icon } from 'fractalicons';
	import { luX, luEye, luEyeOff } from 'fractalicons/lucide';
	import type { FsFieldVariant, FsSize, FsShape } from '../types';
	import { FIELD_PAINT, FIELD_HEIGHT, SHAPE_RADIUS } from '../classes';

	interface Props extends Omit<HTMLInputAttributes, 'size'> {
		value?: string | number;
		type?: string;
		label?: string;
		helperText?: string;
		error?: boolean | string;
		clearable?: boolean;
		variant?: FsFieldVariant;
		size?: FsSize;
		shape?: FsShape;
		disabled?: boolean;
		readonly?: boolean;
		id?: string;
		class?: string;
		leading?: Snippet;
		trailing?: Snippet;
	}

	let {
		value = $bindable(''),
		type = 'text',
		label,
		helperText,
		error,
		clearable = false,
		variant = 'primary',
		size = 'lg',
		shape = 'modern',
		disabled = false,
		readonly = false,
		id,
		class: className = '',
		leading,
		trailing,
		...restProps
	}: Props = $props();

	let inputEl: HTMLInputElement | null = $state(null);
	let showPassword = $state(false);
	const uid = $props.id();
	const inputId = $derived(id || uid);

	const effectiveType = $derived(type === 'password' && showPassword ? 'text' : type);
	const errorMessage = $derived(typeof error === 'string' ? error : undefined);
	const canClear = $derived(clearable && !disabled && !readonly && String(value ?? '').length > 0);
	const isPassword = $derived(type === 'password' && !disabled);
	// A bare .input is the most faithful render; only affixes need the row frame.
	const framed = $derived(Boolean(leading || trailing || clearable || isPassword));
	const describedBy = $derived(
		errorMessage ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
	);

	function clear() {
		value = '';
		inputEl?.focus();
	}
</script>

<div class="box gap-xs {className}">
	{#if label}
		<label for={inputId} class="text-xs weight-500 text-secondary">{label}</label>
	{/if}

	{#if framed}
		<div class="row ycenter gap-xs px-xs {FIELD_PAINT[variant]} {FIELD_HEIGHT[size]} {SHAPE_RADIUS[shape]}">
			{#if leading}
				<span class="row ycenter shrink-0 pl-xs text-muted" aria-hidden="true">{@render leading()}</span>
			{/if}
			<input
				bind:this={inputEl}
				bind:value
				id={inputId}
				type={effectiveType}
				{disabled}
				{readonly}
				aria-invalid={error ? true : undefined}
				aria-describedby={describedBy}
				class="input grow min0 hfull"
				data-variant="ghost"
				{...restProps}
			/>
			{#if canClear}
				<button type="button" data-variant="iconbox" class="px-xs text-muted" aria-label="Clear input" onclick={clear}>
					<Icon icon={luX} />
				</button>
			{/if}
			{#if isPassword}
				<button
					type="button"
					data-variant="iconbox"
					class="px-xs text-muted"
					aria-label={showPassword ? 'Hide password' : 'Show password'}
					aria-pressed={showPassword}
					onclick={() => (showPassword = !showPassword)}
				>
					<Icon icon={showPassword ? luEyeOff : luEye} />
				</button>
			{/if}
			{#if trailing}
				<span class="row ycenter shrink-0 pr-xs text-muted" aria-hidden="true">{@render trailing()}</span>
			{/if}
		</div>
	{:else}
		<input
			bind:this={inputEl}
			bind:value
			id={inputId}
			type={effectiveType}
			{disabled}
			{readonly}
			aria-invalid={error ? true : undefined}
			aria-describedby={describedBy}
			class="input wfull"
			data-variant={variant}
			data-size={size}
			data-shape={shape}
			{...restProps}
		/>
	{/if}

	{#if errorMessage}
		<p id="{inputId}-error" class="text-body-sm text-danger" role="alert">{errorMessage}</p>
	{:else if helperText}
		<p id="{inputId}-helper" class="text-body-sm text-muted">{helperText}</p>
	{/if}
</div>
