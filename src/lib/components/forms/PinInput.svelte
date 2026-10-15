<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Size } from '../../types';

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
		id?: string;
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
		size = 'md',
		autofocus = false,
		id,
		class: className = '',
		...restProps
	}: Props = $props();

	let inputEls: HTMLInputElement[] = $state([]);
	const autoId = 'f-pin-' + Math.random().toString(36).slice(2, 9);
	const pinId = $derived(id || autoId);

	const hasError = $derived(Boolean(error));
	const errorMessage = $derived(typeof error === 'string' ? error : undefined);

	// Digits array representing each cell
	const digits = $derived(
		Array.from({ length }, (_, i) => value[i] ?? '')
	);

	$effect(() => {
		if (autofocus && inputEls[0]) {
			inputEls[0].focus();
		}
	});

	function updateDigits(newDigits: string[]) {
		value = newDigits.join('').slice(0, length);
	}

	function handleInput(index: number, e: Event) {
		const target = e.target as HTMLInputElement;
		const char = target.value.slice(-1);

		if (type === 'numeric' && char && !/^\d$/.test(char)) {
			target.value = digits[index] || '';
			return;
		}

		const newArr = [...digits];
		newArr[index] = char;
		updateDigits(newArr);

		if (char && index < length - 1) {
			inputEls[index + 1]?.focus();
			inputEls[index + 1]?.select();
		}
	}

	function handleKeyDown(index: number, e: KeyboardEvent) {
		if (e.key === 'Backspace') {
			if (!digits[index] && index > 0) {
				e.preventDefault();
				const newArr = [...digits];
				newArr[index - 1] = '';
				updateDigits(newArr);
				inputEls[index - 1]?.focus();
			} else {
				const newArr = [...digits];
				newArr[index] = '';
				updateDigits(newArr);
			}
		} else if (e.key === 'ArrowLeft' && index > 0) {
			e.preventDefault();
			inputEls[index - 1]?.focus();
		} else if (e.key === 'ArrowRight' && index < length - 1) {
			e.preventDefault();
			inputEls[index + 1]?.focus();
		}
	}

	function handlePaste(e: ClipboardEvent) {
		e.preventDefault();
		const pasted = e.clipboardData?.getData('text') ?? '';
		const filtered = type === 'numeric' ? pasted.replace(/\D/g, '') : pasted;
		if (!filtered) return;

		const chars = filtered.slice(0, length).split('');
		const newArr = Array.from({ length }, (_, i) => chars[i] ?? '');
		updateDigits(newArr);

		const nextFocusIdx = Math.min(chars.length, length - 1);
		inputEls[nextFocusIdx]?.focus();
	}
</script>

<div
	class="f-pin-container {className}"
	data-size={size}
	data-disabled={disabled || undefined}
	data-invalid={hasError || undefined}
	{...restProps}
>
	{#if label}
		<span class="f-pin-label">{label}</span>
	{/if}

	<div class="f-pin-boxes" onpaste={handlePaste}>
		{#each Array.from({ length }) as _, index}
			<input
				bind:this={inputEls[index]}
				type={mask || type === 'password' ? 'password' : 'text'}
				inputmode={type === 'numeric' ? 'numeric' : 'text'}
				pattern={type === 'numeric' ? '[0-9]*' : undefined}
				maxlength="1"
				value={digits[index]}
				{disabled}
				aria-label={`Digit ${index + 1} of ${length}`}
				class="f-pin-box"
				oninput={(e) => handleInput(index, e)}
				onkeydown={(e) => handleKeyDown(index, e)}
				onfocus={(e) => (e.target as HTMLInputElement).select()}
			/>
		{/each}
	</div>

	{#if errorMessage}
		<p class="f-pin-error-msg" role="alert">{errorMessage}</p>
	{:else if helperText}
		<p class="f-pin-helper-msg">{helperText}</p>
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-pin-container {
			display: inline-flex;
			flex-direction: column;
			gap: var(--f-space-2xs);
			font-family: inherit;
			box-sizing: border-box;
		}

		.f-pin-label {
			font-size: var(--f-text-sm);
			font-weight: 500;
			color: var(--f-text);
			user-select: none;
		}

		.f-pin-boxes {
			display: flex;
			align-items: center;
			gap: var(--f-space-xs);
		}

		.f-pin-box {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			text-align: center;
			background: var(--f-input);
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-md);
			color: var(--f-text);
			font-family: var(--f-font-mono);
			font-weight: 600;
			outline: none;
			box-sizing: border-box;
			transition: border-color var(--f-duration-fast) var(--f-ease),
				box-shadow var(--f-duration-fast) var(--f-ease);
		}

		.f-pin-box:hover:not(:disabled) {
			border-color: var(--f-border-strong);
		}

		.f-pin-box:focus {
			border-color: var(--f-primary);
			box-shadow: 0 0 0 3px var(--f-ring);
		}

		.f-pin-box:disabled {
			background: var(--f-sunken);
			cursor: not-allowed;
			opacity: 0.6;
		}

		/* Sizes */
		.f-pin-container[data-size='sm'] .f-pin-box {
			width: 32px;
			height: 36px;
			font-size: var(--f-text-sm);
			border-radius: var(--f-radius-sm);
		}

		.f-pin-container[data-size='md'] .f-pin-box {
			width: 42px;
			height: 48px;
			font-size: var(--f-text-lg);
			border-radius: var(--f-radius-md);
		}

		.f-pin-container[data-size='lg'] .f-pin-box {
			width: 52px;
			height: 58px;
			font-size: var(--f-text-xl);
			border-radius: var(--f-radius-lg);
		}

		/* Invalid state */
		.f-pin-container[data-invalid='true'] .f-pin-box {
			border-color: var(--f-danger);
		}
		.f-pin-container[data-invalid='true'] .f-pin-box:focus {
			box-shadow: 0 0 0 3px var(--f-danger-bg);
		}

		.f-pin-helper-msg {
			margin: 0;
			font-size: var(--f-text-xs);
			color: var(--f-text-muted);
		}

		.f-pin-error-msg {
			margin: 0;
			font-size: var(--f-text-xs);
			color: var(--f-danger-text);
			font-weight: 500;
		}
	}
</style>
