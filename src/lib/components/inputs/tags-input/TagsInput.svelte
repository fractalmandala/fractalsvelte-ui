<!-- @component A field of tokens: add a tag with Enter, a comma or paste, and remove it with Backspace or its × button. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luX } from '@fractaldesign/icons/lucide';
	import { springScale } from '../../../motion/index.js';
	import { defaultSize, type Shape, type Size, type TextSize } from '../../../internal/tokens.js';
	import { useFieldControl } from '../field/field.js';
	import { focusFrame, frameClasses } from '../input/frame.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'disabled'> {
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
		/** Allow double-clicking an existing tag to edit it inline. */
		editable?: boolean;
		/** Delimiter character or RegExp used to split drafted or pasted tags. */
		delimiter?: string | RegExp;
		/** Placeholder shown in the typing area while the list is empty. */
		placeholder?: string;
		/** The control height. Text follows this unless `textSize` is set. @default 'lg' */
		size?: Size;
		/** The text scale, independent of the control height. Follows `size` when omitted. */
		textSize?: TextSize;
		/** The corner shape. @default 'modern' */
		shape?: Shape;
		/** `outline` is a bordered field, `filled` a tinted one without a border, `ghost` is bare until hovered or focused. @default 'outline' */
		look?: 'outline' | 'filled' | 'ghost';
		/** Marks the field invalid (red border, `aria-invalid`). Inside a `Field` it follows the field's error unless set. */
		invalid?: boolean;
			/** Blocks pointer and keyboard input, and dims the frame. */
		disabled?: boolean | null;
}

	let {
		value = $bindable([]),
		onValueChange,
		max,
		validate,
		allowDuplicates = false,
		editable = false,
		delimiter = ',',
		placeholder,
		size,
		textSize,
		shape,
		look,
		invalid,
		id,
		class: className,
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
		look
	}));

	const resolvedSize = $derived(size ?? control.size ?? defaultSize);
	const resolvedShape = $derived(shape ?? control.shape ?? 'modern');
	const resolvedVariant = $derived(look ?? control.look ?? 'outline');

	let draft = $state('');
	let message = $state<string | null>(null);
	let input: HTMLInputElement | null = $state(null);
	let editingIndex = $state<number | null>(null);
	let editingDraft = $state('');
	let editInput: HTMLInputElement | null = $state(null);

	const tags = $derived(value ?? []);
	const atMax = $derived(max !== undefined && tags.length >= max);
	const frame = $derived(
		frameClasses({
			look: resolvedVariant,
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
		if (delimiter instanceof RegExp) return text.split(delimiter);
		const escaped = delimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		return text.split(new RegExp(`(?:${escaped}|[\\n\\r\\t])+`));
	}

	function beginEdit(index: number): void {
		if (!editable || control.disabled) return;
		editingIndex = index;
		editingDraft = tags[index] ?? '';
		queueMicrotask(() => {
			editInput?.focus();
			editInput?.select();
		});
	}

	function commitEdit(): void {
		if (editingIndex === null) return;
		const idx = editingIndex;
		const trimmed = editingDraft.trim();
		editingIndex = null;
		if (!trimmed) {
			remove(idx);
			return;
		}
		if (trimmed === tags[idx]) return;
		if (!allowDuplicates && tags.some((t, i) => i !== idx && t.toLowerCase() === trimmed.toLowerCase())) {
			reject(`“${trimmed}” is already in the list.`);
			return;
		}
		const result = validate?.(trimmed);
		if (result === false) {
			reject(`“${trimmed}” is not allowed.`);
			return;
		}
		if (typeof result === 'string') {
			reject(result);
			return;
		}
		message = null;
		set(tags.map((t, i) => (i === idx ? trimmed : t)));
	}

	function remove(index: number): void {
		if (control.disabled) return;
		set(tags.filter((_, i) => i !== index));
		message = null;
		input?.focus();
	}

	function handleKeydown(event: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }): void {
		if (event.key === 'Enter' || (typeof delimiter === 'string' && event.key === delimiter)) {
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
		const parts = split(text);
		if (parts.length <= 1 && !/[\n\r]/.test(text)) return;
		event.preventDefault();
		addMany(split((draft ? draft + (typeof delimiter === 'string' ? delimiter : ',') : '') + text));
	}

	function handleBlur(): void {
		addDraft();
	}
</script>

<div class={['box gap-xs wfull', className]}>
	<div
		role="presentation"
		class={frame}
		onpointerdown={(event) => focusFrame(event, input)}
		{...rest}
	>
		<div class="row wrap ycenter gap-xs grow wmin0">
			{#each tags as tag, index (allowDuplicates ? `${tag}-${index}` : tag)}
				{#if editingIndex === index}
					<input
						bind:this={editInput}
						type="text"
						class="bare tag text-sm px-sm focus-ring"
						aria-label={`Edit tag ${tag}`}
						bind:value={editingDraft}
						onblur={commitEdit}
						onkeydown={(e) => {
							if (e.key === 'Enter') {
								e.preventDefault();
								commitEdit();
							} else if (e.key === 'Escape') {
								e.preventDefault();
								editingIndex = null;
								input?.focus();
							}
						}}
					/>
				{:else}
					<span
						role="presentation"
						class="tag row ycenter gap-xs text-sm ink-auto"
						transition:springScale={{ start: 0.85 }}
						ondblclick={() => beginEdit(index)}
					>
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
				{/if}
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
