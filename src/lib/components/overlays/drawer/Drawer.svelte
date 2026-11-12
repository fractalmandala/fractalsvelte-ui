<!-- @component An edge-docked sheet on a native <dialog>, with a drag-to-dismiss handle on the bottom edge. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLDialogAttributes } from 'svelte/elements';
	import { luX } from '@fractaldesign/icons/lucide';
	import { dialogSync } from '../../../internal/floating.js';
	import { animate, drag, vars, type DragState } from '../../../motion/index.js';
	import { Button } from '../../actions/button/index.js';
	import {
		dialogWidth,
		surfaceClass,
		type DialogSize,
		type OverlayContent,
		type OverlaySurface,
		type OverlayTrigger
	} from '../dialog/dialog.js';
	import { sideEnter, type DrawerSide } from './drawer.js';

	interface Props extends Omit<HTMLDialogAttributes, 'title' | 'open' | 'children'> {
		/** Whether the drawer is open. Bind it, or let the `trigger` drive it. */
		open?: boolean;
		/** Called whenever the drawer opens or closes. */
		onOpenChange?: (open: boolean) => void;
		/** The heading. Wired as the accessible name (`aria-labelledby`). */
		title?: string | Snippet;
		/** A line under the heading. Wired as the accessible description (`aria-describedby`). */
		description?: string | Snippet;
		/** The edge the drawer is docked to. */
		side?: DrawerSide;
		/** The width (left or right) or height (top or bottom), on the measure ladder. `full` fills the viewport. */
		size?: DialogSize;
		/** Whether the rest of the page is inert while the drawer is open. */
		modal?: boolean;
		/** Whether Esc and a click on the backdrop close the drawer. */
		dismissible?: boolean;
		/** Shows a close button in the top-right corner. */
		closeButton?: boolean;
		/** The panel fill: opaque, or frosted glass. */
		surface?: OverlaySurface;
		/** Renders the element that opens the drawer. Spread `props` onto your own button. */
		trigger?: Snippet<[OverlayTrigger]>;
		/** The body. Receives `close`. */
		children?: Snippet<[OverlayContent]>;
		/** The action row at the bottom, aligned to the end. Receives `close`. */
		footer?: Snippet<[OverlayContent]>;
	}

	let {
		open = $bindable(false),
		onOpenChange,
		title,
		description,
		side = 'right',
		size = 'md',
		modal = true,
		dismissible = true,
		closeButton = true,
		surface = 'solid',
		trigger,
		children,
		footer,
		class: klass,
		...rest
	}: Props = $props();

	const id = $props.id();
	const titleId = `${id}-title`;
	const descId = `${id}-desc`;

	let panel: HTMLDialogElement | undefined;

	function setOpen(next: boolean) {
		if (open === next) return;
		open = next;
		onOpenChange?.(next);
	}
	const show = () => setOpen(true);
	const close = () => setOpen(false);
	const toggle = () => setOpen(!open);

	const api = $derived<OverlayTrigger>({
		props: {
			type: 'button',
			'aria-haspopup': 'dialog',
			'aria-expanded': open,
			'aria-controls': id,
			onclick: show
		},
		isOpen: open,
		open: show,
		close,
		toggle
	});

	const content: OverlayContent = { close };
	const bottom = $derived(side === 'bottom');

	function onDragEnd(state: DragState) {
		if (!panel) return;
		const height = panel.getBoundingClientRect().height;
		if (state.y > height * 0.28 || state.vy > 700) close();
		else void animate(panel, { y: 0 }, { spring: 'snappy' });
	}

	const sheetDrag = $derived(
		bottom
			? drag({
					axis: 'y',
					bounds: { top: 0, bottom: 4000 },
					snapBack: false,
					momentum: true,
					spring: 'snappy',
					onDragEnd
				})
			: undefined
	);
</script>

{#snippet text(value: string | Snippet)}
	{#if typeof value === 'string'}{value}{:else}{@render value()}{/if}
{/snippet}

{@render trigger?.(api)}

<dialog
	bind:this={panel}
	{id}
	class={[
		'dialog sheet open-column sized pop radius-lg shad-2xl',
		`at-${side}`,
		sideEnter[side],
		bottom && 'motion touch-none select-none',
		surfaceClass[surface],
		klass
	]}
	aria-labelledby={title ? titleId : undefined}
	aria-describedby={description ? descId : undefined}
	{@attach dialogSync(() => open, setOpen, { modal, dismissible })}
	{@attach vars({ size: dialogWidth[size] })}
	{@attach sheetDrag}
	{...rest}
>
	{#if bottom}
		<div class="row xcenter py-sm shrink-0">
			<div class="grip" aria-hidden="true"></div>
			<span class="sr-only">Drag down to close</span>
		</div>
	{/if}
	{#if title || description}
		<header class={['box gap-xs px-lg pt-lg pb-md', closeButton && 'pr-2xl']}>
			{#if title}
				<h2 id={titleId} class="text-lg weight-600 lh12 ls-tight-bs text-primary">{@render text(title)}</h2>
			{/if}
			{#if description}
				<p id={descId} class="text-sm lh15 text-secondary">{@render text(description)}</p>
			{/if}
		</header>
	{/if}
	{#if children}
		<div class={['px-lg text-md lh15 text-secondary grow min0 scroll-y scroll-thin', !(title || description) && !bottom && 'pt-lg', !footer && 'pb-lg']}>
			{@render children(content)}
		</div>
	{/if}
	{#if footer}
		<footer class="row xright ycenter wrap gap-sm px-lg py-bs mt-sm bt-sub shrink-0">
			{@render footer(content)}
		</footer>
	{/if}
	{#if closeButton}
		<Button variant="ghost" size="sm" icon={luX} class="btn-icon pin-tr text-muted" aria-label="Close" onclick={close} />
	{/if}
</dialog>
