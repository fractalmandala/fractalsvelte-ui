<!-- @component A search field with a leading icon, a clear button, a loading state, and an optional keyboard shortcut. -->

<script lang="ts">
	import type {  HTMLInputAttributes  } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luLoaderCircle, luSearch } from '@fractaldesign/icons/lucide';
	import type {  Shape, Size, TextColor, TextSize, Variant  } from '../../../internal/tokens.js';
	import { Input } from '../input/index.js';

	interface Props extends Omit<HTMLInputAttributes, 'size' | 'value' | 'type' | 'children' | 'disabled'> {
		value?: string;
		onValueChange?: (value: string) => void;
		onSearch?: (value: string) => void;
		size?: Size;
		textSize?: TextSize;
		textColor?: TextColor;
		shape?: Shape;
		variant?: Variant;
		invalid?: boolean;
		loading?: boolean;
		shortcut?: string;
		ref?: HTMLInputElement | null;
			disabled?: boolean | null;
}

	let {
		value = $bindable(''),
		onValueChange,
		onSearch,
		size,
		textSize,
		textColor = 'text-muted',
		shape,
		variant = 'ghost',
		invalid,
		loading = false,
		shortcut,
		ref = $bindable(null),
		id,
		class: className,
		onkeydown,
		...rest
	}: Props = $props();

	const shortcutSize = $derived(size ?? 'h-md');
	const shortcutText = $derived(textSize ?? 'text-xs');

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
		<Icon icon={luLoaderCircle} class={['anim-spin shrink-0', textColor]} />
	{:else if shortcut && value === ''}
		<kbd class={['kbd', shortcutSize, shortcutText]}>{shortcut}</kbd>
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
	class={className}
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
