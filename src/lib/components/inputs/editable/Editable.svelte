<!-- @component Inline text field that switches smoothly between static display and live editing. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { luCheck, luPencil, luX } from '@fractaldesign/icons/lucide';
	import { IconButton } from '../../actions/icon-button/index.js';
	import { type Shape, type Size } from '../../../internal/tokens.js';
	import { frameClasses } from '../input/frame.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Current value; bindable. */
		value?: string;
		/** Called whenever the value changes (both live edits and commits). */
		onValueChange?: (value: string) => void;
		/** Called when an edit is committed via Enter or blur. */
		onCommit?: (value: string) => void;
		/** Called when editing is cancelled via Escape or the cancel button. */
		onCancel?: () => void;
		/** Placeholder displayed when empty. */
		placeholder?: string;
		/** Gesture that enters edit mode: single click or double click. */
		activationMode?: 'click' | 'dblclick';
		/** Events that commit the draft value. */
		submitMode?: 'enter' | 'blur' | 'both';
		/** Show explicit edit, confirm, and cancel icon buttons. */
		withControls?: boolean;
		/** Control height and text scale on the shared size ladder. */
		size?: Size;
		/** Corner shape on the shared shape ladder. */
		shape?: Shape;
		/** Disables editing. */
		disabled?: boolean;
		/** Marks the value invalid. */
		invalid?: boolean;
	}

	let {
		value = $bindable(''),
		onValueChange,
		onCommit,
		onCancel,
		placeholder = 'Click to edit…',
		activationMode = 'click',
		submitMode = 'both',
		withControls = false,
		size = 'h-lg',
		shape = 'modern',
		disabled = false,
		invalid = false,
		class: className,
		...rest
	}: Props = $props();

	let editing = $state(false);
	let draft = $state('');
	let inputEl = $state<HTMLInputElement | null>(null);

	function enterEdit() {
		if (disabled || editing) return;
		draft = value;
		editing = true;
		queueMicrotask(() => {
			inputEl?.focus();
			inputEl?.select();
		});
	}

	function commit() {
		if (!editing) return;
		editing = false;
		value = draft;
		onValueChange?.(draft);
		onCommit?.(draft);
	}

	function cancel() {
		if (!editing) return;
		editing = false;
		draft = value;
		onCancel?.();
	}

	function handleKey(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.preventDefault();
			cancel();
		} else if (event.key === 'Enter' && (submitMode === 'enter' || submitMode === 'both')) {
			event.preventDefault();
			commit();
		}
	}

	function handleBlur() {
		if (submitMode === 'blur' || submitMode === 'both') commit();
	}

	const frame = $derived(
		frameClasses({ look: 'outline', size, shape, invalid, disabled })
	);
</script>

<div class={['inline-flex row ycenter gap-xs', className]} {...rest}>
	{#if editing}
		<div class={frame}>
			<input
				bind:this={inputEl}
				type="text"
				bind:value={draft}
				{placeholder}
				{disabled}
				aria-invalid={invalid || undefined}
				class="cover bare px-md bg-none font-sans focus-none"
				oninput={() => onValueChange?.(draft)}
				onkeydown={handleKey}
				onblur={withControls ? undefined : handleBlur}
			/>
		</div>
		{#if withControls}
			<IconButton variant="secondary" size="h-sm" icon={luCheck} label="Save changes" onclick={commit} />
			<IconButton variant="ghost" size="h-sm" icon={luX} label="Cancel editing" onclick={cancel} />
		{/if}
	{:else}
		<button
			type="button"
			{disabled}
			data-invalid={invalid || undefined}
			class={[
				'bare row ycenter px-sm text-left hover-fill focus-ring',
				size,
				shape,
				!value && 'text-muted',
				disabled && 'disabled'
			]}
			onclick={activationMode === 'click' ? enterEdit : undefined}
			ondblclick={activationMode === 'dblclick' ? enterEdit : undefined}
		>
			{value || placeholder}
		</button>
		{#if withControls && !disabled}
			<IconButton variant="ghost" size="h-sm" icon={luPencil} label="Edit" onclick={enterEdit} />
		{/if}
	{/if}
</div>
