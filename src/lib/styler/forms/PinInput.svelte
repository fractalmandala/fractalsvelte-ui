<!-- @component A row of single-character boxes for entering a PIN or one-time code. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Size } from '../types';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		value?: string;
		length?: number;
		type?: 'numeric' | 'text' | 'password';
		mask?: boolean;
		label?: string;
		helperText?: string;
		error?: boolean | string;
		disabled?: boolean;
		size?: Size;
		autofocus?: boolean;
		class?: string;
	}

	let {
		value = $bindable(''),
		length = 6,
		type = 'numeric',
		mask = false,
		label,
		helperText,
		error,
		disabled = false,
		size = 'h-lg',
		autofocus = false,
		class: className = '',
		...restProps
	}: Props = $props();

	const uid = $props.id();
	let inputEls: HTMLInputElement[] = $state([]);
	const errorMessage = $derived(typeof error === 'string' ? error : undefined);
	const digits = $derived(Array.from({ length }, (_, i) => value[i] ?? ''));

	// Cells take the shared control height (el-size) and stay square via frame-1-1.

	$effect(() => {
		if (autofocus) inputEls[0]?.focus();
	});

	function commit(arr: string[]) {
		value = arr.join('').slice(0, length);
	}

	function onInput(index: number, e: Event) {
		const target = e.target as HTMLInputElement;
		const char = target.value.slice(-1);
		if (type === 'numeric' && char && !/^\d$/.test(char)) {
			target.value = digits[index] || '';
			return;
		}
		const next = [...digits];
		next[index] = char;
		commit(next);
		if (char && index < length - 1) {
			inputEls[index + 1]?.focus();
			inputEls[index + 1]?.select();
		}
	}

	function onKeydown(index: number, e: KeyboardEvent) {
		if (e.key === 'Backspace') {
			const next = [...digits];
			if (!digits[index] && index > 0) {
				e.preventDefault();
				next[index - 1] = '';
				commit(next);
				inputEls[index - 1]?.focus();
			} else {
				next[index] = '';
				commit(next);
			}
		} else if (e.key === 'ArrowLeft' && index > 0) {
			e.preventDefault();
			inputEls[index - 1]?.focus();
		} else if (e.key === 'ArrowRight' && index < length - 1) {
			e.preventDefault();
			inputEls[index + 1]?.focus();
		}
	}

	function onPaste(e: ClipboardEvent) {
		e.preventDefault();
		const pasted = e.clipboardData?.getData('text') ?? '';
		const chars = (type === 'numeric' ? pasted.replace(/\D/g, '') : pasted).slice(0, length).split('');
		if (!chars.length) return;
		commit(Array.from({ length }, (_, i) => chars[i] ?? ''));
		inputEls[Math.min(chars.length, length - 1)]?.focus();
	}
</script>

<div class="box gap-xs {className}" {...restProps}>
	{#if label}<span id="{uid}-label" class="text-sm weight-500 text-secondary">{label}</span>{/if}
	<div class="row ycenter gap-xs" role="group" aria-labelledby={label ? `${uid}-label` : undefined} onpaste={onPaste}>
		{#each digits as digit, index (index)}
			<input
				bind:this={inputEls[index]}
				type={mask || type === 'password' ? 'password' : 'text'}
				inputmode={type === 'numeric' ? 'numeric' : 'text'}
				pattern={type === 'numeric' ? '[0-9]*' : undefined}
				maxlength="1"
				size={1}
				autocomplete="one-time-code"
				value={digit}
				{disabled}
				aria-label="Digit {index + 1} of {length}"
				aria-invalid={error ? true : undefined}
				class="frame-1-1 ta-c tabular-nums weight-600 radius-sm bg-input border-strong el-size {size} {error ? 'is-invalid text-danger' : 'text-primary'}"
				style:padding="0"
				oninput={(e) => onInput(index, e)}
				onkeydown={(e) => onKeydown(index, e)}
				onfocus={(e) => (e.currentTarget as HTMLInputElement).select()}
			/>
		{/each}
	</div>
	{#if errorMessage}
		<p class="text-body-sm text-danger" role="alert">{errorMessage}</p>
	{:else if helperText}
		<p class="text-body-sm text-muted">{helperText}</p>
	{/if}
</div>
