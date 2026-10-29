<!-- @component A panel that slides in from a screen edge. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import CloseButton from '../actions/CloseButton.svelte';
	import type { Surface, Border, Shadow, Shape } from '../types';
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
		placement = 'right',
		title,
		description,
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
	{surface}
	{border}
	{shadow}
	{shape}
	aria-labelledby={title ? `${uid}-title` : undefined}
	aria-describedby={description ? `${uid}-desc` : undefined}
	width={placement === 'left' || placement === 'right' ? '24em' : undefined}
	minWidth={placement === 'left' || placement === 'right' ? 'min(20em, 100%)' : undefined}
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
				<CloseButton label="Close drawer" size="h-sm" class="shrink-0" onclick={() => (open = false)} />
			{/if}
		</header>
	{/if}
	<div class="box gap-sm pad-md grow min0 scroll-y text-body-sm">{@render children?.()}</div>
	{#if footer}<footer class="row ycenter xright gap-xs pad-md bt bg-raised">{@render footer()}</footer>{/if}
</Modal>
