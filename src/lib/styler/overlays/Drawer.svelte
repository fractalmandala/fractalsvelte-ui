<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Icon } from 'fractalicons';
	import { luX } from 'fractalicons/lucide';
	import Modal, { type ModalPlacement } from './Modal.svelte';

	export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

	interface Props {
		open?: boolean;
		placement?: DrawerPlacement;
		title?: string;
		description?: string;
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
		placement = 'right',
		title,
		description,
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
	// The panel stretches along its edge: full height at left/right (row
	// stretch), full width at top/bottom (column stretch).
	const PLACE: Record<DrawerPlacement, ModalPlacement> = {
		left: 'left',
		right: 'right',
		top: 'top-edge',
		bottom: 'bottom-edge'
	};
	const hasHeader = $derived(Boolean(header || title || description));
</script>

{@render trigger?.({ open: () => (open = true) })}

<Modal
	bind:open
	placement={PLACE[placement]}
	{closeOnBackdrop}
	{closeOnEscape}
	{onclose}
	aria-labelledby={title ? `${uid}-title` : undefined}
	aria-describedby={description ? `${uid}-desc` : undefined}
	panelClass={className}
>
	{#if hasHeader || showCloseButton}
		<header class="row ytop xbetween gap-md pad-md bb">
			<div class="box gap-xs min0">
				{#if header}
					{@render header()}
				{:else}
					{#if title}<h2 id="{uid}-title" class="page-heading-lg">{title}</h2>{/if}
					{#if description}<p id="{uid}-desc" class="text-body-sm text-secondary">{description}</p>{/if}
				{/if}
			</div>
			{#if showCloseButton}
				<button type="button" data-variant="iconbox" data-size="icon-bs" class="px-xs text-muted shrink-0" aria-label="Close drawer" onclick={() => (open = false)}>
					<Icon icon={luX} />
				</button>
			{/if}
		</header>
	{/if}
	<div class="box gap-sm pad-md grow min0 scroll-y text-body-sm">{@render children?.()}</div>
	{#if footer}<footer class="row ycenter xright gap-xs pad-md bt bg-raised">{@render footer()}</footer>{/if}
</Modal>
