<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { Icon } from 'fractalicons';
	import { luSearch, luX } from 'fractalicons/lucide';
	import type { FsFieldVariant, FsSize, FsShape } from '../types';
	import { FIELD_PAINT, FIELD_HEIGHT, SHAPE_RADIUS } from '../classes';
	import Spinner from '../display/Spinner.svelte';

	interface Props extends Omit<HTMLInputAttributes, 'size'> {
		value?: string;
		placeholder?: string;
		shortcut?: string;
		/** Focus the field on ⌘K / Ctrl+K */
		listenForShortcut?: boolean;
		loading?: boolean;
		clearable?: boolean;
		variant?: FsFieldVariant;
		size?: FsSize;
		shape?: FsShape;
		disabled?: boolean;
		id?: string;
		class?: string;
		leading?: Snippet;
		trailing?: Snippet;
	}

	let {
		value = $bindable(''),
		placeholder = 'Search…',
		shortcut = '⌘K',
		listenForShortcut = false,
		loading = false,
		clearable = true,
		variant = 'secondary',
		size = 'lg',
		shape = 'modern',
		disabled = false,
		id,
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

<!-- The canonical fractalstyler search bar: a row frame around a ghost .input. -->
<div class="row ycenter gap-xs px-sm {FIELD_PAINT[variant]} {FIELD_HEIGHT[size]} {SHAPE_RADIUS[shape]} {className}">
	<span class="row ycenter shrink-0 text-muted" aria-hidden="true">
		{#if leading}{@render leading()}{:else}<Icon icon={luSearch} />{/if}
	</span>
	<input
		bind:this={inputEl}
		bind:value
		id={id || uid}
		type="search"
		{placeholder}
		{disabled}
		aria-label={restProps['aria-label'] ?? placeholder}
		class="input grow min0 hfull"
		data-variant="ghost"
		{...restProps}
	/>
	{#if loading}
		<Spinner label="Searching" class="text-muted" />
	{:else if canClear}
		<button
			type="button"
			data-variant="iconbox"
			class="px-xs text-muted"
			aria-label="Clear search"
			onclick={() => {
				value = '';
				inputEl?.focus();
			}}
		>
			<Icon icon={luX} />
		</button>
	{:else if shortcut}
		<kbd class="chip mono bg-sunken border text-muted shrink-0" aria-hidden="true">{shortcut}</kbd>
	{/if}
	{#if trailing}<span class="row ycenter shrink-0" aria-hidden="true">{@render trailing()}</span>{/if}
</div>
