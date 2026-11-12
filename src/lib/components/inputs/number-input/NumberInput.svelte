<!-- @component A numeric field with stepper buttons, keyboard and wheel adjustment, and optional formatted display. -->

<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luChevronDown, luChevronUp } from '@fractaldesign/icons/lucide';
	import { defaultSize, type Shape, type Size } from '../../../internal/tokens.js';
	import { useFieldControl } from '../field/field.js';
	import { focusFrame, frameClasses } from '../input/frame.js';

	interface Props extends Omit<HTMLInputAttributes, 'size' | 'value' | 'children' | 'min' | 'max' | 'step' | 'type'> {
		/** The number. `null` when the field is empty. Bindable; works controlled and uncontrolled. */
		value?: number | null;
		/** Called with the new number (or `null` when cleared) whenever it changes. */
		onValueChange?: (value: number | null) => void;
		/** The inclusive lower bound. Arrow, Page, wheel and the stepper all honour it. */
		min?: number;
		/** The inclusive upper bound. */
		max?: number;
		/** How much Arrow Up/Down, the stepper and the wheel change the value. Page Up/Down move by ten times this. */
		step?: number;
		/** How many decimal places the value is rounded to. Omit it to keep every place `step` allows. */
		precision?: number;
		/** `Intl.NumberFormat` options used to present the value while the field is not being edited. */
		format?: Intl.NumberFormatOptions;
		/** The control height. Text follows this unless `textSize` is set. @default 'md' */
		size?: Size;
		/** The text scale, independent of the control height. Follows `size` when omitted. */
		textSize?: Size;
		/** The corner shape. @default 'modern' */
		shape?: Shape;
		/** `outline` is a bordered field, `filled` a tinted one without a border, `ghost` is bare until hovered or focused. @default 'outline' */
		variant?: 'outline' | 'filled' | 'ghost';
		/** Marks the field invalid (red border, `aria-invalid`). Inside a `Field` it follows the field's error unless set. */
		invalid?: boolean;
		/** The underlying `<input>` element. Bindable. */
		ref?: HTMLInputElement | null;
	}

	let {
		value = $bindable(null),
		onValueChange,
		min,
		max,
		step = 1,
		precision,
		format,
		size,
		textSize,
		shape,
		variant,
		invalid,
		ref = $bindable(null),
		id,
		required,
		disabled,
		readonly,
		class: klass,
		oninput,
		onkeydown,
		onfocus,
		onblur,
		onwheel,
		'aria-describedby': describedby,
		...rest
	}: Props = $props();

	const uid = $props.id();
	const control = useFieldControl(uid, () => ({ id, invalid, required, disabled, describedby, size, shape, variant }));

	const resolvedSize = $derived(size ?? control.size ?? defaultSize);
	const resolvedShape = $derived(shape ?? control.shape ?? 'modern');
	const resolvedVariant = $derived(variant ?? control.variant ?? 'outline');

	const classes = $derived([
		frameClasses({ variant: resolvedVariant, size: resolvedSize, textSize, shape: resolvedShape, invalid: control.invalid, disabled: control.disabled }),
		klass
	]);

	let focused = $state(false);
	let draft = $state('');
	let holdTimer: ReturnType<typeof setTimeout> | undefined;
	let holdRepeat: ReturnType<typeof setInterval> | undefined;

	const formatter = $derived(new Intl.NumberFormat(undefined, format));
	const places = $derived(precision ?? fractionDigits(step));
	const shown = $derived(focused ? draft : value === null ? '' : formatter.format(value));
	const atMin = $derived(value !== null && min !== undefined && value <= min);
	const atMax = $derived(value !== null && max !== undefined && value >= max);

	function fractionDigits(n: number): number {
		const text = String(n);
		const i = text.indexOf('.');
		return i === -1 ? 0 : text.length - i - 1;
	}

	function clamp(n: number): number {
		let next = n;
		if (min !== undefined) next = Math.max(min, next);
		if (max !== undefined) next = Math.min(max, next);
		const factor = 10 ** places;
		return Math.round(next * factor) / factor;
	}

	function set(next: number | null): void {
		value = next;
		onValueChange?.(next);
	}

	function commit(raw: string): void {
		const trimmed = raw.trim();
		if (trimmed === '' || trimmed === '-' || trimmed === '.' || trimmed === '-.') {
			set(null);
			draft = '';
			return;
		}
		const parsed = Number(trimmed.replace(/,/g, ''));
		if (!Number.isFinite(parsed)) {
			draft = value === null ? '' : String(value);
			return;
		}
		const next = clamp(parsed);
		set(next);
		draft = String(next);
	}

	function stepBy(direction: 1 | -1, multiplier = 1): void {
		if (control.disabled || readonly) return;
		const base = value ?? 0;
		set(clamp(base + direction * step * multiplier));
		if (focused) draft = String(value);
	}

	function stopHold(): void {
		clearTimeout(holdTimer);
		clearInterval(holdRepeat);
		holdTimer = undefined;
		holdRepeat = undefined;
	}

	function startHold(direction: 1 | -1, event: PointerEvent): void {
		if (control.disabled || readonly) return;
		event.preventDefault();
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
		stepBy(direction);
		ref?.focus();
		stopHold();
		holdTimer = setTimeout(() => {
			holdRepeat = setInterval(() => stepBy(direction), 60);
		}, 400);
	}

	function handleInput(event: Event & { currentTarget: EventTarget & HTMLInputElement }): void {
		draft = event.currentTarget.value;
		const trimmed = draft.trim();
		if (trimmed === '' || trimmed === '-' || trimmed === '.' || trimmed === '-.') {
			set(null);
		} else {
			const parsed = Number(trimmed.replace(/,/g, ''));
			if (Number.isFinite(parsed)) set(clamp(parsed));
		}
		oninput?.(event);
	}

	function handleFocus(event: FocusEvent & { currentTarget: EventTarget & HTMLInputElement }): void {
		focused = true;
		draft = value === null ? '' : String(value);
		onfocus?.(event);
	}

	function handleBlur(event: FocusEvent & { currentTarget: EventTarget & HTMLInputElement }): void {
		focused = false;
		commit(draft);
		onblur?.(event);
	}

	function handleKeydown(event: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }): void {
		onkeydown?.(event);
		if (event.defaultPrevented || control.disabled || readonly) return;
		if (event.key === 'ArrowUp') {
			event.preventDefault();
			stepBy(1);
		} else if (event.key === 'ArrowDown') {
			event.preventDefault();
			stepBy(-1);
		} else if (event.key === 'PageUp') {
			event.preventDefault();
			stepBy(1, 10);
		} else if (event.key === 'PageDown') {
			event.preventDefault();
			stepBy(-1, 10);
		} else if (event.key === 'Home' && min !== undefined) {
			event.preventDefault();
			set(clamp(min));
			draft = String(value);
		} else if (event.key === 'End' && max !== undefined) {
			event.preventDefault();
			set(clamp(max));
			draft = String(value);
		}
	}

	function handleWheel(event: WheelEvent & { currentTarget: EventTarget & HTMLInputElement }): void {
		onwheel?.(event);
		if (event.defaultPrevented || !focused || control.disabled || readonly) return;
		event.preventDefault();
		stepBy(event.deltaY < 0 ? 1 : -1, event.shiftKey ? 10 : 1);
	}

	$effect(() => {
		return () => stopHold();
	});
</script>

<div role="presentation" class={classes} onpointerdown={(event) => focusFrame(event, ref)}>
	<input
		bind:this={ref}
		class="bare grow wmin0 hfull tabular-nums"
		id={control.id}
		type="text"
		inputmode={places > 0 ? 'decimal' : 'numeric'}
		value={shown}
		disabled={control.disabled}
		required={control.required}
		{readonly}
		role="spinbutton"
		aria-invalid={control.invalid || undefined}
		aria-describedby={control.describedby}
		aria-valuenow={value ?? undefined}
		aria-valuemin={min}
		aria-valuemax={max}
		aria-valuetext={value === null ? undefined : formatter.format(value)}
		oninput={handleInput}
		onfocus={handleFocus}
		onblur={handleBlur}
		onkeydown={handleKeydown}
		onwheel={handleWheel}
		{...rest}
	/>
	<div class="box hfull shrink-0 bl-sub">
		<button
			type="button"
			class="bare row ycenter xcenter grow px-sm press"
			tabindex="-1"
			aria-label="Increase"
			disabled={control.disabled || readonly || atMax}
			onpointerdown={(event) => startHold(1, event)}
			onpointerup={stopHold}
			onpointercancel={stopHold}
		>
			<Icon icon={luChevronUp} />
		</button>
		<button
			type="button"
			class="bare row ycenter xcenter grow px-sm press bt-sub"
			tabindex="-1"
			aria-label="Decrease"
			disabled={control.disabled || readonly || atMin}
			onpointerdown={(event) => startHold(-1, event)}
			onpointerup={stopHold}
			onpointercancel={stopHold}
		>
			<Icon icon={luChevronDown} />
		</button>
	</div>
</div>
