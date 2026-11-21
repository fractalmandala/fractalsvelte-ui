<!-- @component An edge-docked sheet on a native <dialog>, with a drag-to-dismiss handle on the bottom edge. -->

<script lang="ts">
	import type {  ComponentProps, Snippet  } from 'svelte';
	import type {  HTMLDialogAttributes  } from 'svelte/elements';
	import { luX } from '@fractaldesign/icons/lucide';
	import { dialogSync } from '../../../internal/helpers.js';
	import type { ChildTextColor, ChildTextSize, Measure, Placement, TextSize, Surface } from '../../../internal/tokens.js';
	import { animate, drag, vars, type DragState } from '../../../motion/index.js';
	import { Button } from '../../actions/button/index.js';
	import {type OverlayContent,
		type OverlayTrigger} from '../dialog/dialog.js';
	import { sideEnter } from './drawer.js';

	interface Props extends Omit<HTMLDialogAttributes, 'title' | 'open' | 'children'> {
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		title?: string | Snippet;
		description?: string | Snippet;
		placement?: Placement;
		width?: Measure;
		textSize?: TextSize;
		childTextSize?: ChildTextSize;
		bodyTextSize?: TextSize;
		childTextColor?: ChildTextColor;
		modal?: boolean;
		dismissible?: boolean;
		closeButton?: boolean;
		closeButtonProps?: ComponentProps<typeof Button>;
		surface?: Surface;
		trigger?: Snippet<[OverlayTrigger]>;
		children?: Snippet<[OverlayContent]>;
		footer?: Snippet<[OverlayContent]>;
	}

	let {
		open = $bindable(false),
		onOpenChange,
		title,
		description,
		placement = 'right',
		width = 'measure-md',
		textSize = 'text-lg',
		childTextSize = 'text-sm',
		bodyTextSize = 'text-md',
		childTextColor = 'text-secondary',
		modal = true,
		dismissible = true,
		closeButton = true,
		closeButtonProps,
		surface = 'overlayed',
		trigger,
		children,
		footer,
		class: className,
		...rest
	}: Props = $props();

	const id = $props.id();
	const titleId = `${id}card-title`;
	const descId = `${id}card-desc`;

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
	const bottom = $derived(placement === 'bottom');

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
		'dialog sheet open-column sized pop radius-lg',
		`at-${placement}`,
		sideEnter(placement),
		bottom && 'motion touch-none select-none',
		surface,
		className
	]}
	aria-labelledby={title ? titleId : undefined}
	aria-describedby={description ? descId : undefined}
	{@attach dialogSync(() => open, setOpen, { modal, dismissible })}
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
				<h2 id={titleId} class={['weight-600 lh12 ls-tight-bs', textSize]}>{@render text(title)}</h2>
			{/if}
			{#if description}
				<p id={descId} class={['lh15', childTextSize, childTextColor]}>{@render text(description)}</p>
			{/if}
		</header>
	{/if}
	{#if children}
		<div class={['px-lg lh15 grow min0 scroll-y scroll-thin', bodyTextSize, childTextColor, !(title || description) && !bottom && 'pt-lg', !footer && 'pb-lg']}>
			{@render children(content)}
		</div>
	{/if}
	{#if footer}
		<footer class="row xright ycenter wrap gap-sm px-lg py-bs mt-sm bt-sub shrink-0">
			{@render footer(content)}
		</footer>
	{/if}
	{#if closeButton}
		<Button
			variant="ghost"
			size="h-sm"
			textColor="text-muted"
			icon={luX}
			aria-label="Close"
			onclick={close}
			{...closeButtonProps}
			class={['btn-icon pin-tr', closeButtonProps?.class]}
		/>
	{/if}
</dialog>
