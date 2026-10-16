<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import type { FsFieldVariant, FsSize, FsShape } from '../types';
	import { FIELD_TEXT } from '../classes';

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
		variant?: FsFieldVariant;
		/** Type size only: a textarea has no fixed control height. */
		size?: FsSize;
		shape?: FsShape;
		rows?: number;
		disabled?: boolean;
		readonly?: boolean;
		id?: string;
		class?: string;
	}

	let {
		value = $bindable(''),
		label,
		helperText,
		error,
		autoResize = false,
		maxRows = 12,
		showCount = false,
		maxlength,
		variant = 'primary',
		size = 'md',
		shape = 'modern',
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
	const charCount = $derived(String(value ?? '').length);
	const COUNT_CLASSES = { ok: 'text-muted', near: 'text-warning', over: 'text-danger' };
	const countState = $derived(
		maxlength === undefined ? 'ok' : charCount > maxlength ? 'over' : charCount >= maxlength * 0.9 ? 'near' : 'ok'
	);
	const effectiveRows = $derived(
		autoResize ? Math.min(maxRows, Math.max(rows, String(value ?? '').split('\n').length)) : rows
	);
</script>

<div class="box gap-xs {className}">
	{#if label}
		<label for={textareaId} class="text-xs weight-500 text-secondary">{label}</label>
	{/if}
	<!-- data-size is left off on purpose: on .input it fixes the height. -->
	<textarea
		bind:value
		id={textareaId}
		rows={effectiveRows}
		{maxlength}
		{disabled}
		{readonly}
		aria-invalid={error ? true : undefined}
		aria-describedby={errorMessage ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
		class="input wfull py-sm lh15 {FIELD_TEXT[size]}"
		data-variant={variant}
		data-shape={shape}
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
			<span class="text-sm mono shrink-0 {COUNT_CLASSES[countState]}" aria-live="polite">
				{charCount}{#if maxlength !== undefined}&nbsp;/ {maxlength}{/if}
			</span>
		{/if}
	</div>
</div>
