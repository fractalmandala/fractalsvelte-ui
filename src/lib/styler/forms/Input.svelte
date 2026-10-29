<!-- @component A text input with label, helper or error text, leading and trailing slots, and a clear button. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luEye, luEyeOff } from '@fractaldesign/icons/lucide';
	import IconButton from '../actions/IconButton.svelte';
	import CloseButton from '../actions/CloseButton.svelte';
	import type { Surface, Size, Shape, Shadow } from '../types';
	import { getFieldLook } from './field-context';

	interface Props extends Omit<HTMLInputAttributes, 'size'> {
		value?: string | number;
		type?: string;
		label?: string;
		helperText?: string;
		error?: boolean | string;
		clearable?: boolean;
		surface?: Surface;
		size?: Size;
		shape?: Shape;
		shadow?: Shadow;
		disabled?: boolean;
		readonly?: boolean;
		id?: string;
		class?: string;
		leading?: Snippet;
		trailing?: Snippet;
	}

	const field = getFieldLook();

	let {
		value = $bindable(''),
		type = 'text',
		label,
		helperText,
		error,
		clearable = false,
		surface = field.surface ?? 'bg-input',
		size = field.size ?? 'h-lg',
		shape = field.shape ?? 'modern',
		shadow = field.shadow ?? 'shad-none',
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
	const invalid = $derived(Boolean(error) || Boolean(field.invalid));
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
		<div class="row ycenter gap-xs px-xs border el-size el-shape {surface} {size} {shape} {shadow} {invalid ? 'is-invalid' : ''}">
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
				aria-invalid={invalid || undefined}
				aria-describedby={describedBy}
				class="input grow min0 hfull border-none"
				style:background="transparent"
				{...restProps}
			/>
			{#if canClear}
				<CloseButton label="Clear input" size="h-sm" onclick={clear} />
			{/if}
			{#if isPassword}
				<IconButton
					icon="ghost"
					size="h-sm"
					label={showPassword ? 'Hide password' : 'Show password'}
					aria-pressed={showPassword}
					onclick={() => (showPassword = !showPassword)}
				>
					<Icon icon={showPassword ? luEyeOff : luEye} />
				</IconButton>
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
			aria-invalid={invalid || undefined}
			aria-describedby={describedBy}
			class="input wfull border el-size el-shape {surface} {size} {shape} {shadow} {invalid ? 'is-invalid' : ''}"
			{...restProps}
		/>
	{/if}

	{#if errorMessage}
		<p id="{inputId}-error" class="text-body-sm text-danger" role="alert">{errorMessage}</p>
	{:else if helperText}
		<p id="{inputId}-helper" class="text-body-sm text-muted">{helperText}</p>
	{/if}
</div>
