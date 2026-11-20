<!-- @component Text input or textarea with context-triggered `@` / `/` command suggestion popup. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { anchor, floating, popoverSync } from '../../../internal/helpers.js';
	import { defaultSize, type Shape, type Size } from '../../../internal/tokens.js';
	import { frameClasses } from '../../inputs/input/frame.js';
	import {
		detectTrigger,
		type ActiveTriggerMatch,
		type TriggerConfig,
		type TriggerMenuItem
	} from './trigger-menu.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Trigger definitions mapping characters (`@`, `/`, `#`) to option lists. */
		triggers?: TriggerConfig[];
		/** Text input content; bindable. */
		value?: string;
		/** Called whenever text changes or a trigger insertion completes. */
		onValueChange?: (value: string) => void;
		/** Called when an item is chosen from the trigger menu. */
		onSelect?: (item: TriggerMenuItem, trigger: string) => void;
		/** Render a multi-line `<textarea>` rather than a single-line `<input>`. */
		multiline?: boolean;
		/** Visible row count when `multiline` is true. */
		rows?: number;
		/** Input placeholder text. */
		placeholder?: string;
		/** Control height and text scale on the shared size ladder. */
		size?: Size;
		/** Corner shape. */
		shape?: Shape;
		/** Disable editing and trigger popups. */
		disabled?: boolean;
	}

	let {
		triggers = [],
		value = $bindable(''),
		onValueChange,
		onSelect,
		multiline = false,
		rows = 3,
		placeholder = 'Type @ to mention or / for commands…',
		size = defaultSize,
		shape = 'modern',
		disabled = false,
		class: className,
		...rest
	}: Props = $props();

	const uid = $props.id();
	const menuId = `${uid}-menu`;

	let fieldEl = $state<HTMLInputElement | HTMLTextAreaElement | null>(null);
	let menuEl = $state<HTMLDivElement | null>(null);
	let match = $state<ActiveTriggerMatch | null>(null);
	let activeIndex = $state(0);

	const triggerChars = $derived(triggers.map((t) => t.trigger));
	const activeConfig = $derived(
		match ? triggers.find((t) => t.trigger === match!.trigger) : undefined
	);
	const items = $derived.by(() => {
		if (!activeConfig || !match) return [];
		const q = match.query.toLowerCase();
		if (!q) return activeConfig.items;
		return activeConfig.items.filter(
			(item) =>
				item.label.toLowerCase().includes(q) ||
				item.value.toLowerCase().includes(q) ||
				(item.description?.toLowerCase().includes(q) ?? false)
		);
	});

	const open = $derived(Boolean(!disabled && match && activeConfig));

	function scanCaret() {
		if (disabled || !fieldEl) {
			match = null;
			return;
		}
		const caret = fieldEl.selectionStart ?? value.length;
		const nextMatch = detectTrigger(value, caret, triggerChars);
		match = nextMatch;
		if (nextMatch) activeIndex = 0;
	}

	function onInput(event: Event) {
		const target = event.currentTarget as HTMLInputElement | HTMLTextAreaElement;
		value = target.value;
		onValueChange?.(value);
		scanCaret();
	}

	function insertItem(item: TriggerMenuItem) {
		if (!match || !fieldEl || item.disabled) return;
		const caret = fieldEl.selectionStart ?? value.length;
		const replacement = item.insertText ?? `${match.trigger}${item.label} `;
		const nextValue = value.slice(0, match.start) + replacement + value.slice(caret);
		const nextCaret = match.start + replacement.length;

		value = nextValue;
		onValueChange?.(nextValue);
		onSelect?.(item, match.trigger);
		match = null;

		requestAnimationFrame(() => {
			if (!fieldEl) return;
			fieldEl.focus();
			fieldEl.setSelectionRange(nextCaret, nextCaret);
		});
	}

	function onKeyDown(event: KeyboardEvent) {
		if (!open) return;
		if (event.key === 'Escape') {
			event.preventDefault();
			match = null;
			return;
		}
		const count = items.length;
		if (count === 0) return;

		if (event.key === 'ArrowDown') {
			event.preventDefault();
			activeIndex = (activeIndex + 1 + count) % count;
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			activeIndex = (activeIndex - 1 + count) % count;
		} else if (event.key === 'Enter' || event.key === 'Tab') {
			const candidate = items[activeIndex];
			if (candidate && !candidate.disabled) {
				event.preventDefault();
				insertItem(candidate);
			}
		}
	}

	function onBlur(event: FocusEvent) {
		const related = event.relatedTarget as Node | null;
		if (related && menuEl?.contains(related)) return;
		match = null;
	}

	const frame = $derived(
		frameClasses({ look: 'outline', size, shape, invalid: false, disabled, content: multiline })
	);
</script>

<div class={['anchor wfull', frame, className]} {@attach anchor(uid)} {...rest}>
	{#if multiline}
		<textarea
			bind:this={fieldEl}
			{rows}
			{placeholder}
			{disabled}
			{value}
			role="combobox"
			aria-autocomplete="list"
			aria-expanded={open}
			aria-controls={menuId}
			aria-activedescendant={open && items[activeIndex] ? `${uid}-tm-${activeIndex}` : undefined}
			class="wfull bare pad-sm bg-none font-sans focus-none resize-y"
			oninput={onInput}
			onclick={scanCaret}
			onkeydown={onKeyDown}
			onblur={onBlur}
		></textarea>
	{:else}
		<input
			bind:this={fieldEl}
			type="text"
			{placeholder}
			{disabled}
			{value}
			role="combobox"
			aria-autocomplete="list"
			aria-expanded={open}
			aria-controls={menuId}
			aria-activedescendant={open && items[activeIndex] ? `${uid}-tm-${activeIndex}` : undefined}
			class="cover bare px-md bg-none font-sans focus-none"
			oninput={onInput}
			onclick={scanCaret}
			onkeydown={onKeyDown}
			onblur={onBlur}
		/>
	{/if}
</div>

<div
	bind:this={menuEl}
	id={menuId}
	popover="manual"
	role="listbox"
	tabindex="-1"
	class={[
		'floating at-bottom-start match-anchor pop enter-down spring-snappy glass border rim shad-lg modern pad-xs scroll-y scroll-thin box gap-xs focus-none',
		size
	]}
	{@attach floating(uid)}
	{@attach popoverSync(() => open, (v) => { if (!v) match = null; })}
>
	{#if activeConfig?.label}
		<div class="text-xs text-muted weight-500 px-sm pt-xs pb-xs select-none">{activeConfig.label}</div>
	{/if}
	{#if items.length === 0}
		<div class="px-sm py-sm text-sm text-muted">No matching items</div>
	{:else}
		{#each items as item, i (item.value)}
			<button
				id={`${uid}-tm-${i}`}
				type="button"
				role="option"
				tabindex="-1"
				aria-selected={i === activeIndex}
				aria-disabled={item.disabled || undefined}
				disabled={item.disabled}
				class={['item row ycenter gap-sm', i === activeIndex && 'highlighted', item.disabled && 'disabled']}
				onmousedown={(e) => {
					e.preventDefault();
					insertItem(item);
				}}
			>
				{#if item.icon}
					<Icon icon={item.icon} class="text-muted shrink-0" />
				{/if}
				<span class="column xleft min0">
					<span class="truncate weight-500">{item.label}</span>
					{#if item.description}
						<span class="text-xs text-muted truncate">{item.description}</span>
					{/if}
				</span>
			</button>
		{/each}
	{/if}
</div>
