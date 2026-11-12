<!-- @component A field frame that holds an input with leading and trailing addons — text, icons or buttons. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { defaultSize, type Shape, type Size } from '../../../internal/tokens.js';
	import { useFieldControl } from '../field/field.js';
	import { focusFrame, frameClasses } from '../input/frame.js';
	import { setInputGroupContext } from './context.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** The control height. Text follows this unless `textSize` is set. @default 'md' */
		size?: Size;
		/** The text scale, independent of the control height. Follows `size` when omitted. */
		textSize?: Size;
		/** The corner shape. @default 'modern' */
		shape?: Shape;
		/** `outline` is a bordered field, `filled` a tinted one without a border, `ghost` is bare until hovered or focused. @default 'outline' */
		variant?: 'outline' | 'filled' | 'ghost';
		/** Marks the group invalid (red border). Inside a `Field` it follows the field's error unless set. */
		invalid?: boolean;
		/** Disables the input inside and dims the frame. */
		disabled?: boolean;
		/** The addons and the input. */
		children?: Snippet;
	}

	let {
		size,
		textSize,
		shape,
		variant,
		invalid,
		disabled,
		id,
		class: klass,
		children,
		...rest
	}: Props = $props();

	const uid = $props.id();
	const control = useFieldControl(uid, () => ({ id, invalid, disabled, size, shape, variant }));

	const resolvedSize = $derived(size ?? control.size ?? defaultSize);
	const resolvedShape = $derived(shape ?? control.shape ?? 'modern');
	const resolvedVariant = $derived(variant ?? control.variant ?? 'outline');
	let frame = $state<HTMLElement | null>(null);

	setInputGroupContext({
		get id() {
			return control.id;
		},
		get invalid() {
			return control.invalid;
		},
		get disabled() {
			return control.disabled;
		},
		get required() {
			return control.required;
		},
		get describedby() {
			return control.describedby;
		},
		get size() {
			return resolvedSize;
		},
		get textSize() {
			return textSize;
		}
	});

	const classes = $derived([
		frameClasses({ variant: resolvedVariant, size: resolvedSize, textSize, shape: resolvedShape, invalid: control.invalid, disabled: control.disabled }),
		klass
	]);

	function focusInner(event: PointerEvent): void {
		const input = frame?.querySelector('input, textarea');
		focusFrame(event, input instanceof HTMLElement ? input : null);
	}
</script>

<div bind:this={frame} role="presentation" class={classes} onpointerdown={focusInner} {...rest}>
	{@render children?.()}
</div>
