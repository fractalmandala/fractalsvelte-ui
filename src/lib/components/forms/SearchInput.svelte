<!-- @component A search field with clear button, loading spinner and optional ⌘K shortcut. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import Icon from '$lib/components/core/Icon.svelte';
	import { klSearch } from '$lib/icons/keylinestroke.js';
	import type { Surface, Size, Shape, Shadow, TextSize } from '$lib/types.js';
	import { getFieldLook } from './field-context.js';
	import Spinner from '../display/Spinner.svelte';
	import Kbd from '../display/Kbd.svelte';
	import CloseButton from '../actions/CloseButton.svelte';

	interface Props extends Omit<HTMLInputAttributes, 'size'> {
		value?: string;
		placeholder?: string;
		shortcut?: string;
		/** Focus the field on ⌘K / Ctrl+K */
		listenForShortcut?: boolean;
		loading?: boolean;
		clearable?: boolean;
		surface?: Surface;
		size?: Size;
		shape?: Shape;
		shadow?: Shadow;
		disabled?: boolean;
		id?: string;
		textsize?: TextSize;
		class?: string;
		leading?: Snippet;
		trailing?: Snippet;
	}

	const field = getFieldLook();
	const invalid = Boolean(field.invalid);

	let {
		value = $bindable(''),
		placeholder = 'Search…',
		shortcut = '⌘K',
		listenForShortcut = false,
		loading = false,
		clearable = true,
		surface = field.surface ?? 'bg-input',
		size = field.size ?? 'h-lg',
		shape = field.shape ?? 'modern',
		shadow = field.shadow ?? 'shad-none',
		disabled = false,
		id,
		textsize = 'text-md',
		class: className = '',
		leading,
		trailing,
		...restProps
	}: Props = $props();

	let inputEl: HTMLInputElement | null = $state(null);
	const uid = $props.id();
	const canClear = $derived(clearable && !disabled && !loading && (value?.length ?? 0) > 0);

	$effect(() => {
		if (!listenForShortcut) return;
		const onKey = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault();
				inputEl?.focus();
				inputEl?.select();
			}
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
</script>

<div class="field row ycenter gap-xs px-xs border {surface} {size} {shape} {shadow} {invalid ? 'is-invalid' : ''} {textsize} {className}">
	<span class="row ycenter shrink-0 pl-xs text-muted" aria-hidden="true">
		{#if leading}{@render leading()}{:else}<Icon icon={klSearch} />{/if}
	</span>
	<input
		bind:this={inputEl}
		bind:value
		id={id || uid}
		type="search"
		{placeholder}
		{disabled}
		aria-label={restProps['aria-label'] ?? placeholder}
		class="input grow min0 hfull border-none bg-none"
		{...restProps}
	/>
	{#if loading}
		<Spinner label="Searching" class="text-muted" />
	{:else if canClear}
		<CloseButton
			label="Clear search"
			size="h-sm"
			onclick={() => {
				value = '';
				inputEl?.focus();
			}}
		/>
	{:else if shortcut}
		<Kbd static aria-hidden="true">{shortcut}</Kbd>
	{/if}
	{#if trailing}<span class="row ycenter shrink-0 pr-xs" aria-hidden="true">{@render trailing()}</span>{/if}
</div>
