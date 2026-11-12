<!-- @component A field of tokens: add a tag with Enter, a comma or paste, and remove it with Backspace or its × button. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luX } from '@fractaldesign/icons/lucide';
	import { springScale } from '../../../motion/index.js';
	import { defaultSize, type Shape, type Size } from '../../../internal/tokens.js';
	import { useFieldControl } from '../field/field.js';
	import { focusFrame, frameClasses } from '../input/frame.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/** The tags. Bindable; works controlled and uncontrolled. */
		value?: string[];
		/** Called with the new list whenever a tag is added or removed. */
		onValueChange?: (value: string[]) => void;
		/** The most tags allowed. Further additions are ignored. */
		max?: number;
		/** Return `true` to accept a tag, `false` or an error message to reject it. */
		validate?: (tag: string) => boolean | string;
		/** When true, a tag that is already in the list can be added again. */
		allowDuplicates?: boolean;
		/** Placeholder shown in the typing area while the list is empty. */
		placeholder?: string;
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
	}

	let {
		value = $bindable([]),
		onValueChange,
		max,
		validate,
		allowDuplicates = false,
		placeholder,
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
	const messageId = `${uid}-message`;
	const control = useFieldControl(uid, () => ({
		id,
		invalid,
		describedby: [describedby, message ? messageId : null].filter(Boolean).join(' ') || null,
		size,
		shape,
		variant
	}));

	const resolvedSize = $derived(size ?? control.size ?? defaultSize);
	const resolvedShape = $derived(shape ?? control.shape ?? 'modern');
	const resolvedVariant = $derived(variant ?? control.variant ?? 'outline');

	let draft = $state('');
	let message = $state<string | null>(null);
	let input: HTMLInputElement | null = $state(null);

	const tags = $derived(value ?? []);
	const atMax = $derived(max !== undefined && tags.length >= max);
	const frame = $derived(
		frameClasses({
			variant: resolvedVariant,
			size: resolvedSize,
			textSize,
			shape: resolvedShape,
			invalid: control.invalid,
			disabled: control.disabled,
			grow: true
		})
	);

	function set(next: string[]): void {
		value = next;
		onValueChange?.(next);
	}

	function reject(reason: string): void {
		message = reason;
	}

	function addMany(raw: string[]): void {
		if (control.disabled || atMax) return;
		let next = tags.slice();
		let lastError: string | null = null;
		for (const piece of raw) {
			const tag = piece.trim();
			if (!tag) continue;
			if (max !== undefined && next.length >= max) {
				lastError = `At most ${max} tags.`;
				break;
			}
			if (!allowDuplicates && next.some((t) => t.toLowerCase() === tag.toLowerCase())) {
				lastError = `“${tag}” is already in the list.`;
				continue;
			}
			const result = validate?.(tag);
			if (result === false) {
				lastError = `“${tag}” is not allowed.`;
				continue;
			}
			if (typeof result === 'string') {
				lastError = result;
				continue;
			}
			next = [...next, tag];
		}
		if (next !== tags && next.length !== tags.length) set(next);
		message = lastError;
		draft = '';
	}

	function addDraft(): void {
		if (!draft.trim()) return;
		addMany(split(draft));
	}

	function split(text: string): string[] {
		return text.split(/[,\n\r\t]+/);
	}

	function remove(index: number): void {
		if (control.disabled) return;
		set(tags.filter((_, i) => i !== index));
		message = null;
		input?.focus();
	}

	function handleKeydown(event: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }): void {
		if (event.key === 'Enter' || event.key === ',') {
			event.preventDefault();
			addDraft();
			return;
		}
		if (event.key === 'Backspace' && draft === '' && tags.length) {
			event.preventDefault();
			remove(tags.length - 1);
		}
	}

	function handlePaste(event: ClipboardEvent): void {
		const text = event.clipboardData?.getData('text') ?? '';
		if (!/[,\n\r]/.test(text)) return;
		event.preventDefault();
		addMany(split((draft ? draft + ',' : '') + text));
	}

	function handleBlur(): void {
		addDraft();
	}
</script>

<div class={['box gap-xs wfull', klass]}>
	<div
		role="presentation"
		class={frame}
		onpointerdown={(event) => focusFrame(event, input)}
		{...rest}
	>
		<div class="row wrap ycenter gap-xs grow wmin0">
			{#each tags as tag, index (allowDuplicates ? `${tag}-${index}` : tag)}
				<span class="tag row ycenter gap-xs text-sm ink-auto" transition:springScale={{ start: 0.85 }}>
					{tag}
					<button
						type="button"
						class="bare tag-remove row ycenter xcenter radius-full press"
						aria-label={`Remove ${tag}`}
						disabled={control.disabled}
						onclick={() => remove(index)}
					>
						<Icon icon={luX} />
					</button>
				</span>
			{/each}
			<input
				bind:this={input}
				class="bare grow wmin0 hfull"
				id={control.id}
				value={draft}
				placeholder={tags.length ? undefined : placeholder}
				disabled={control.disabled || atMax}
				aria-invalid={control.invalid || undefined}
				aria-describedby={control.describedby}
				aria-disabled={atMax || undefined}
				oninput={(event) => {
					draft = event.currentTarget.value;
					message = null;
				}}
				onkeydown={handleKeydown}
				onpaste={handlePaste}
				onblur={handleBlur}
			/>
		</div>
	</div>
	{#if message}
		<p id={messageId} class="text-sm text-danger">{message}</p>
	{/if}
</div>
