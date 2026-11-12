<!-- @component A search field with a leading icon, a clear button, a loading state, and an optional keyboard shortcut. -->

<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luLoaderCircle, luSearch } from '@fractaldesign/icons/lucide';
	import type { Shape, Size } from '../../../internal/tokens.js';
	import { Input } from '../input/index.js';

	interface Props extends Omit<HTMLInputAttributes, 'size' | 'value' | 'type' | 'children'> {
		/** The query. Bindable; works controlled and uncontrolled. */
		value?: string;
		/** Called with the new text whenever it changes, including when it is cleared. */
		onValueChange?: (value: string) => void;
		/** Called with the current query after typing settles (250ms), and immediately when Enter is pressed. */
		onSearch?: (value: string) => void;
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
		/** Shows a spinning indicator at the end of the field — for a search that is in flight. */
		loading?: boolean;
		/** A keyboard hint shown while the field is empty, and a shortcut that focuses the field when that key is pressed. */
		shortcut?: string;
		/** The underlying `<input>` element. Bindable. */
		ref?: HTMLInputElement | null;
	}

	let {
		value = $bindable(''),
		onValueChange,
		onSearch,
		size,
		textSize,
		shape,
		variant,
		invalid,
		loading = false,
		shortcut,
		ref = $bindable(null),
		id,
		class: klass,
		onkeydown,
		...rest
	}: Props = $props();

	let timer: ReturnType<typeof setTimeout> | undefined;

	function schedule(next: string): void {
		clearTimeout(timer);
		timer = setTimeout(() => onSearch?.(next), 250);
	}

	function handleChange(next: string): void {
		onValueChange?.(next);
		schedule(next);
	}

	function handleKeydown(event: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }): void {
		onkeydown?.(event);
		if (event.defaultPrevented) return;
		if (event.key === 'Enter') {
			clearTimeout(timer);
			onSearch?.(value);
		}
	}

	function handleWindowKeydown(event: KeyboardEvent): void {
		if (!shortcut || shortcut.length !== 1) return;
		if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
		if (event.key !== shortcut) return;
		const target = event.target;
		if (target instanceof HTMLElement && target.closest('input, textarea, select, [contenteditable]')) return;
		event.preventDefault();
		ref?.focus();
	}

	$effect(() => {
		return () => clearTimeout(timer);
	});
</script>

<svelte:window onkeydown={handleWindowKeydown} />

{#snippet trailing()}
	{#if loading}
		<Icon icon={luLoaderCircle} class="anim-spin text-muted shrink-0" />
	{:else if shortcut && value === ''}
		<kbd class="kbd h-md text-xs">{shortcut}</kbd>
	{/if}
{/snippet}

<Input
	bind:value
	bind:ref
	{id}
	{size}
	{textSize}
	{shape}
	{variant}
	{invalid}
	class={klass}
	type="search"
	enterkeyhint="search"
	autocapitalize="off"
	autocomplete="off"
	spellcheck="false"
	icon={luSearch}
	clearable
	trailing={trailing}
	onValueChange={handleChange}
	onkeydown={handleKeydown}
	{...rest}
/>
