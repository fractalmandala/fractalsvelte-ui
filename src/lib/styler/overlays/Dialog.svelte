<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Icon } from 'fractalicons';
	import { luX } from 'fractalicons/lucide';
	import Modal from './Modal.svelte';

	/**
	 * prose — panel capped at the 65ch reading measure
	 * full  — panel as wide as the viewport allows
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
		class: className = '',
		onclose,
		trigger,
		header,
		footer,
		children
	}: Props = $props();

	const uid = $props.id();
	const hasHeader = $derived(Boolean(header || title || description));
</script>

{@render trigger?.({ open: () => (open = true) })}

<Modal
	bind:open
	{closeOnBackdrop}
	{closeOnEscape}
	{onclose}
	aria-labelledby={title ? `${uid}-title` : undefined}
	aria-describedby={description ? `${uid}-desc` : undefined}
	panelClass="{size === 'full' ? 'wfull' : 'prose'} {className}"
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
				<button type="button" data-variant="iconbox" data-size="icon-bs" class="px-xs text-muted shrink-0" aria-label="Close dialog" onclick={() => (open = false)}>
					<Icon icon={luX} />
				</button>
			{/if}
		</header>
	{/if}
	{#if children}<div class="box gap-sm px-md pb-md text-body-sm">{@render children()}</div>{/if}
	{#if footer}
		<footer class="row ycenter xright gap-xs wrap px-md py-sm bt bg-raised">{@render footer()}</footer>
	{/if}
</Modal>
