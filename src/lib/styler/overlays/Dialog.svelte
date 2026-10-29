<!-- @component A modal dialog with title, description, body and footer. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import CloseButton from '../actions/CloseButton.svelte';
	import type { Surface, Border, Shadow, Shape } from '../types';
	import Modal from './Modal.svelte';

	/**
	 * prose — 36em reading width
	 * full  — up to 64em, as wide as the viewport allows
	 */
	export type DialogSize = 'prose' | 'full';

	interface Props {
		open?: boolean;
		title?: string;
		description?: string;
		size?: DialogSize;
		closeOnBackdrop?: boolean;
		closeOnEscape?: boolean;
		showCloseButton?: boolean;
		surface?: Surface;
		border?: Border;
		shadow?: Shadow;
		shape?: Shape;
		class?: string;
		onclose?: () => void;
		trigger?: Snippet<[{ open: () => void }]>;
		header?: Snippet;
		footer?: Snippet;
		children?: Snippet;
	}

	let {
		open = $bindable(false),
		title,
		description,
		size = 'prose',
		closeOnBackdrop = true,
		closeOnEscape = true,
		showCloseButton = true,
		surface = 'bg-surface',
		border = 'border',
		shadow = 'shad-2xl',
		shape = 'curved',
		class: className = '',
		onclose,
		trigger,
		header,
		footer,
		children
	}: Props = $props();

	const WIDTHS: Record<DialogSize, string> = { prose: '36em', full: 'min(64em, 100%)' };
	const uid = $props.id();
	const hasHeader = $derived(Boolean(header || title || description));
</script>

{@render trigger?.({ open: () => (open = true) })}

<Modal
	bind:open
	{closeOnBackdrop}
	{closeOnEscape}
	{onclose}
	{surface}
	{border}
	{shadow}
	{shape}
	aria-labelledby={title ? `${uid}-title` : undefined}
	aria-describedby={description ? `${uid}-desc` : undefined}
	width={WIDTHS[size]}
	panelClass={className}
>
	{#if hasHeader || showCloseButton}
		<header class="row ytop xbetween gap-md px-md pt-md pb-sm">
			<div class="box gap-xs min0">
				{#if header}
					{@render header()}
				{:else}
					{#if title}<h2 id="{uid}-title" class="page-heading-lg">{title}</h2>{/if}
					{#if description}<p id="{uid}-desc" class="text-body-sm text-secondary">{description}</p>{/if}
				{/if}
			</div>
			{#if showCloseButton}
				<CloseButton label="Close dialog" size="h-sm" class="shrink-0" onclick={() => (open = false)} />
			{/if}
		</header>
	{/if}
	{#if children}<div class="box gap-sm px-md pb-md text-body-sm">{@render children()}</div>{/if}
	{#if footer}
		<footer class="row ycenter xright gap-xs wrap px-md py-sm bt bg-raised">{@render footer()}</footer>
	{/if}
</Modal>
