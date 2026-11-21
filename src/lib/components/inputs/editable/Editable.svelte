<!-- @component Inline text field that switches smoothly between static display and live editing. -->

<script lang="ts">
	import type {  ComponentProps  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { luCheck, luPencil, luX } from '@fractaldesign/icons/lucide';
	import { IconButton } from '../../actions/icon-button/index.js';
	import { type Gap, type Shape, type Size, type TextColor, type Variant } from '../../../internal/tokens.js';
	import { frameClasses } from '../input/frame.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		value?: string;
		onValueChange?: (value: string) => void;
		onCommit?: (value: string) => void;
		onCancel?: () => void;
		placeholder?: string;
		activationMode?: 'click' | 'dblclick';
		submitMode?: 'enter' | 'blur' | 'both';
		withControls?: boolean;
		size?: Size;
		gap?: Gap;
		shape?: Shape;
		textColor?: TextColor;
		disabled?: boolean;
		invalid?: boolean;
		saveButtonProps?: Partial<ComponentProps<typeof IconButton>>;
		cancelButtonProps?: Partial<ComponentProps<typeof IconButton>>;
		editButtonProps?: Partial<ComponentProps<typeof IconButton>>;
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
		gap = 'gap-xs',
		shape = 'modern',
		textColor = 'text-muted',
		disabled = false,
		invalid = false,
		saveButtonProps,
		cancelButtonProps,
		editButtonProps,
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
		frameClasses({ variant: 'outline', size, shape, invalid, disabled })
	);
</script>

<div class={['inline-flex row ycenter', gap, className]} {...rest}>
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
			<IconButton variant="secondary" size="h-sm" icon={luCheck} label="Save changes" onclick={commit} {...saveButtonProps} />
			<IconButton variant="ghost" size="h-sm" icon={luX} label="Cancel editing" onclick={cancel} {...cancelButtonProps} />
		{/if}
	{:else}
		<button
			type="button"
			{disabled}
			data-invalid={invalid || undefined}
			class={[
				'bare row ycenter px-sm ta-l hover-fill focus-ring',
				size,
				shape,
				!value && textColor,
				disabled && 'disabled'
			]}
			onclick={activationMode === 'click' ? enterEdit : undefined}
			ondblclick={activationMode === 'dblclick' ? enterEdit : undefined}
		>
			{value || placeholder}
		</button>
		{#if withControls && !disabled}
			<IconButton variant="ghost" size="h-sm" icon={luPencil} label="Edit" onclick={enterEdit} {...editButtonProps} />
		{/if}
	{/if}
</div>
