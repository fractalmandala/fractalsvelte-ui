<!-- @component A multi-line text input with optional auto-resize and character count. -->

<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import type { Surface, Shape, Shadow } from '../types';
	import { getFieldLook } from './field-context';

	interface Props extends HTMLTextareaAttributes {
		value?: string;
		label?: string;
		helperText?: string;
		error?: boolean | string;
		/** Grows the rows attribute with the line count (no CSS height involved). */
		autoResize?: boolean;
		/** Upper bound for autoResize */
		maxRows?: number;
		showCount?: boolean;
		maxlength?: number;
		surface?: Surface;
		shape?: Shape;
		shadow?: Shadow;
		rows?: number;
		disabled?: boolean;
		readonly?: boolean;
		id?: string;
		class?: string;
	}

	const field = getFieldLook();

	let {
		value = $bindable(''),
		label,
		helperText,
		error,
		autoResize = false,
		maxRows = 12,
		showCount = false,
		maxlength,
		surface = field.surface ?? 'bg-input',
		shape = field.shape ?? 'modern',
		shadow = field.shadow ?? 'shad-none',
		rows = 3,
		disabled = false,
		readonly = false,
		id,
		class: className = '',
		...restProps
	}: Props = $props();

	const uid = $props.id();
	const textareaId = $derived(id || uid);
	const errorMessage = $derived(typeof error === 'string' ? error : undefined);
	const invalid = $derived(Boolean(error) || Boolean(field.invalid));
	const charCount = $derived(String(value ?? '').length);
	const COUNT_CLASSES = { ok: 'text-muted', near: 'text-warning', over: 'text-danger' };
	const countState = $derived(
		maxlength === undefined ? 'ok' : charCount > maxlength ? 'over' : charCount >= maxlength * 0.9 ? 'near' : 'ok'
	);
	const countText = $derived(String(charCount).padStart(String(maxlength ?? '').length, '\u2007'));
	const effectiveRows = $derived(
		autoResize ? Math.min(maxRows, Math.max(rows, String(value ?? '').split('\n').length)) : rows
	);
</script>

<div class="box gap-xs {className}">
	{#if label}
		<label for={textareaId} class="text-xs weight-500 text-secondary">{label}</label>
	{/if}
	<textarea
		bind:value
		id={textareaId}
		rows={effectiveRows}
		{maxlength}
		{disabled}
		{readonly}
		aria-invalid={invalid || undefined}
		aria-describedby={errorMessage ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
		class="input wfull py-sm px-sm lh15 text-sm border el-shape {surface} {shape} {shadow} {invalid ? 'is-invalid' : ''}"
		style:height="auto"
		{...restProps}
	></textarea>
	<div class="row ytop xbetween gap-sm">
		<div class="grow min0">
			{#if errorMessage}
				<p id="{textareaId}-error" class="text-body-sm text-danger" role="alert">{errorMessage}</p>
			{:else if helperText}
				<p id="{textareaId}-helper" class="text-body-sm text-muted">{helperText}</p>
			{/if}
		</div>
		{#if showCount || maxlength !== undefined}
			<span class="text-sm tabular-nums shrink-0 {COUNT_CLASSES[countState]}" aria-live="polite">
				{countText}{#if maxlength !== undefined}&nbsp;/ {maxlength}{/if}
			</span>
		{/if}
	</div>
</div>
