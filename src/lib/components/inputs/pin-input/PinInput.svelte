<!-- @component A row of cells for one-time codes and PINs, with paste distribution, auto-advance, and a spring pop as each cell fills. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { animate } from '../../../motion/index.js';
	import { defaultSize, heightClass, type Shape, type Size } from '../../../internal/tokens.js';
	import { vars } from '../../../motion/index.js';
	import { useFieldControl } from '../field/field.js';
	import { frameClasses } from '../input/frame.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/** The code. Bindable; works controlled and uncontrolled. Length is padded or trimmed to `length`. */
		value?: string;
		/** Called with the new code whenever a cell changes. */
		onValueChange?: (value: string) => void;
		/** Called once when every cell is filled. */
		onComplete?: (value: string) => void;
		/** How many cells to show. */
		length?: number;
		/** `numeric` accepts digits only; `alphanumeric` accepts letters and digits. */
		type?: 'numeric' | 'alphanumeric';
		/** Hides the characters, as a password field would. */
		mask?: boolean;
		/** The cell height. Text follows this unless `textSize` is set. @default 'md' */
		size?: Size;
		/** The text scale, independent of the cell height. Follows `size` when omitted. */
		textSize?: Size;
		/** The corner shape of each cell. @default 'modern' */
		shape?: Shape;
		/** `outline` is a bordered cell, `filled` a tinted one without a border, `ghost` is bare until hovered or focused. @default 'outline' */
		variant?: 'outline' | 'filled' | 'ghost';
		/** Marks the group invalid (red border, `aria-invalid`). Inside a `Field` it follows the field's error unless set. */
		invalid?: boolean;
	}

	let {
		value = $bindable(''),
		onValueChange,
		onComplete,
		length = 6,
		type = 'numeric',
		mask = false,
		size,
		textSize,
		shape,
		variant,
		invalid,
		id,
		class: klass,
		'aria-describedby': describedby,
		...rest
	}: Props = $props();

	const uid = $props.id();
	const control = useFieldControl(uid, () => ({ id, invalid, describedby, size, shape, variant }));

	const resolvedSize = $derived(size ?? control.size ?? defaultSize);
	const resolvedShape = $derived(shape ?? control.shape ?? 'modern');
	const resolvedVariant = $derived(variant ?? control.variant ?? 'outline');
	const cells = $derived(Math.max(1, Math.round(length)));
	const chars = $derived(pad(value, cells));
	const pattern = $derived(type === 'numeric' ? /[0-9]/ : /[A-Za-z0-9]/);
	const inputmode = $derived(type === 'numeric' ? 'numeric' : 'text');

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

	const cellSize = { xs: '2.25rem', sm: '2.5rem', md: '3rem', lg: '3.5rem', xl: '4rem' } as const;
	const frame = $derived(
		frameClasses({ variant: resolvedVariant, size: resolvedSize, textSize, shape: resolvedShape, invalid: control.invalid, disabled: control.disabled, content: true }).filter(
			(c) => c !== 'wfull'
		)
	);
</script>

<div
	role="group"
	id={control.labelId ? undefined : control.id}
	class={['cells', klass]}
	aria-labelledby={control.labelId}
	aria-describedby={control.describedby}
	aria-disabled={control.disabled || undefined}
	{@attach vars({ cells, cell: cellSize[resolvedSize] })}
	{...rest}
>
	{#each chars as char, index (index)}
		<div class={['motion row ycenter xcenter', frame, heightClass[resolvedSize]]}>
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
