<!-- @component A row of cells for one-time codes and PINs, with paste distribution, auto-advance, and a spring pop as each cell fills. -->

<script lang="ts">
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { animate } from '../../../motion/index.js';
	import { defaultSize, type Shape, type Size, type TextSize, type Variant } from '../../../internal/tokens.js';
	import { vars } from '../../../motion/index.js';
	import { useFieldControl } from '../field/field.js';
	import { frameClasses } from '../input/frame.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'disabled'> {
		value?: string;
		onValueChange?: (value: string) => void;
		onComplete?: (value: string) => void;
		length?: number;
		charset?: 'numeric' | 'alphanumeric';
		mask?: boolean;
		size?: Size;
		textSize?: TextSize;
		shape?: Shape;
		variant?: Variant;
		invalid?: boolean;
			disabled?: boolean | null;
}

	let {
		value = $bindable(''),
		onValueChange,
		onComplete,
		length = 6,
		charset = 'numeric',
		mask = false,
		size,
		textSize,
		shape,
		variant,
		invalid,
		id,
		class: className,
		'aria-describedby': describedby,
		...rest
	}: Props = $props();

	const uid = $props.id();
	const control = useFieldControl(uid, () => ({ id, invalid, describedby, size, shape, variant }));

	const resolvedSize = $derived(size ?? control.size ?? defaultSize);
	const resolvedShape = $derived(shape ?? control.shape ?? 'modern');
	const resolvedVariant = $derived<Variant>(variant ?? control.variant ?? 'outline');
	const cells = $derived(Math.max(1, Math.round(length)));
	const chars = $derived(pad(value, cells));
	const pattern = $derived(charset === 'numeric' ? /[0-9]/ : /[A-Za-z0-9]/);
	const inputmode = $derived(charset === 'numeric' ? 'numeric' : 'text');

	let inputs: HTMLInputElement[] = [];

	function register(index: number) {
		return (node: HTMLInputElement) => {
			inputs[index] = node;
			return () => {
				if (inputs[index] === node) delete inputs[index];
			};
		};
	}

	function pad(text: string, count: number): string[] {
		const cleaned = [...(text ?? '')].filter((ch) => pattern.test(ch)).slice(0, count);
		while (cleaned.length < count) cleaned.push('');
		return cleaned;
	}

	function set(next: string[], focusAt?: number): void {
		const joined = next.join('');
		const wasComplete = (value ?? '').length >= cells;
		value = joined;
		onValueChange?.(joined);
		if (joined.length === cells && !wasComplete) onComplete?.(joined);
		if (focusAt !== undefined) inputs[focusAt]?.focus();
	}

	function accept(raw: string): string[] {
		return [...raw].filter((ch) => pattern.test(ch));
	}

	function onCellInput(index: number, event: Event & { currentTarget: EventTarget & HTMLInputElement }): void {
		const incoming = accept(event.currentTarget.value);
		if (incoming.length === 0) {
			const next = chars.slice();
			next[index] = '';
			set(next);
			event.currentTarget.value = '';
			return;
		}
		if (incoming.length > 1) {
			distribute(index, incoming);
			return;
		}
		const next = chars.slice();
		const ch = incoming[0];
		next[index] = ch;
		const step = index + 1 < cells ? index + 1 : index;
		set(next, next[index] ? step : index);
		pop(event.currentTarget);
	}

	function distribute(start: number, incoming: string[]): void {
		const next = chars.slice();
		let i = start;
		for (const ch of incoming) {
			if (i >= cells) break;
			next[i] = ch;
			pop(inputs[i]);
			i += 1;
		}
		set(next, Math.min(i, cells - 1));
	}

	function onCellKeydown(index: number, event: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }): void {
		if (control.disabled) return;
		if (event.key === 'Backspace') {
			if (event.currentTarget.value === '') {
				event.preventDefault();
				if (index > 0) {
					const next = chars.slice();
					next[index - 1] = '';
					set(next, index - 1);
				}
			}
			return;
		}
		if (event.key === 'ArrowLeft' && index > 0) {
			event.preventDefault();
			inputs[index - 1]?.focus();
		} else if (event.key === 'ArrowRight' && index < cells - 1) {
			event.preventDefault();
			inputs[index + 1]?.focus();
		} else if (event.key === 'Home') {
			event.preventDefault();
			inputs[0]?.focus();
		} else if (event.key === 'End') {
			event.preventDefault();
			inputs[cells - 1]?.focus();
		}
	}

	function onPaste(index: number, event: ClipboardEvent): void {
		const text = event.clipboardData?.getData('text') ?? '';
		const incoming = accept(text);
		if (!incoming.length) return;
		event.preventDefault();
		distribute(index, incoming);
	}

	function pop(node: HTMLElement | undefined): void {
		if (!node) return;
		void animate(node, { scale: 1.08 }, { spring: 'bouncy' }).finished.then(() => {
			animate(node, { scale: 1 }, { spring: 'snappy' });
		});
	}

	const cellSize: Record<Size, string> = {
		'h-xs': '2.25rem',
		'h-sm': '2.5rem',
		'h-md': '3rem',
		'h-bs': '3.25rem',
		'h-lg': '3.5rem',
		'h-xl': '4rem',
		'h-2xl': '4.5rem',
		'h-3xl': '5rem'
	};
	const frame = $derived(
		frameClasses({ variant: resolvedVariant, size: resolvedSize, textSize, shape: resolvedShape, invalid: control.invalid, disabled: control.disabled, content: true }).filter(
			(c: string) => c !== 'wfull'
		)
	);
</script>

<div
	role="group"
	id={control.labelId ? undefined : control.id}
	class={['cells', className]}
	aria-labelledby={control.labelId}
	aria-describedby={control.describedby}
	aria-disabled={control.disabled || undefined}
	{@attach vars({ cells, cell: cellSize[resolvedSize] })}
	{...rest}
>
	{#each chars as char, index (index)}
		<div class={['motion row ycenter xcenter', frame, resolvedSize]}>
			<input
				{@attach register(index)}
				class="bare wfull hfull ta-c tabular-nums weight-600"
				id={index === 0 ? control.id : `${control.id}-${index}`}
				value={char}
				type={mask ? 'password' : 'text'}
				inputmode={inputmode}
				autocomplete={index === 0 ? 'one-time-code' : 'off'}
				autocapitalize="off"
				spellcheck="false"
				maxlength={cells}
				disabled={control.disabled}
				required={index === 0 ? control.required : undefined}
				aria-label={`Digit ${index + 1} of ${cells}`}
				aria-invalid={control.invalid || undefined}
				oninput={(event) => onCellInput(index, event)}
				onkeydown={(event) => onCellKeydown(index, event)}
				onpaste={(event) => onPaste(index, event)}
				onfocus={(event) => event.currentTarget.select()}
			/>
		</div>
	{/each}
</div>
