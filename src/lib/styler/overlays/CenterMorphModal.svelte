<!-- @component A trigger button that opens a centred dialog. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '../actions/Button.svelte';
	import Dialog from './Dialog.svelte';
	import type { Surface, Border, Shadow, Shape } from '../types';

	interface Props {
		open?: boolean;
		triggerLabel?: string;
		title?: string;
		description?: string;
		surface?: Surface;
		border?: Border;
		shadow?: Shadow;
		shape?: Shape;
		class?: string;
		trigger?: Snippet<[{ open: () => void }]>;
		children?: Snippet<[{ close: () => void }]>;
		footer?: Snippet<[{ close: () => void }]>;
		onopenchange?: (open: boolean) => void;
	}

	let {
		open = $bindable(false),
		triggerLabel = 'Open modal',
		title = 'Modal dialog',
		description,
		surface = 'bg-surface',
		border = 'border',
		shadow = 'shad-2xl',
		shape = 'curved',
		class: className = '',
		trigger,
		children,
		footer: footerSnippet,
		onopenchange
	}: Props = $props();

	// The original grows out of its trigger with a CSS transform. fractalstyler
	// has no motion utilities, so this edition opens the same content in a
	// native modal dialog without the morph.
	function setOpen(v: boolean) {
		open = v;
		onopenchange?.(v);
	}
	const close = () => setOpen(false);
</script>

{#if trigger}
	{@render trigger({ open: () => setOpen(true) })}
{:else}
	<Button variant="secondary" size="h-lg" onclick={() => setOpen(true)}>{triggerLabel}</Button>
{/if}

{#snippet footer()}
	{@render footerSnippet?.({ close })}
{/snippet}

<Dialog
	bind:open
	{title}
	{description}
	{surface}
	{border}
	{shadow}
	{shape}
	class={className}
	footer={footerSnippet ? footer : undefined}
	onclose={() => onopenchange?.(false)}
>
	{#if children}
		{@render children({ close })}
	{:else}
		<p class="text-body-sm text-secondary">Content opens in a native modal dialog.</p>
	{/if}
</Dialog>
