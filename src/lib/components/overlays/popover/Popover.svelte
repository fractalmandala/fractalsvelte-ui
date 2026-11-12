<!-- @component An anchored non-modal panel on the Popover API, placed with CSS anchor positioning. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { anchor, floating, popoverSync } from '../../../internal/floating.js';
	import { placementClass, type Placement } from '../../../internal/tokens.js';
	import { surfaceClass, type OverlayContent, type OverlaySurface, type OverlayTrigger } from '../dialog/dialog.js';
	import { enterFrom, type PopoverTrigger } from './popover.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/** Whether the popover is open. Bind it, or let the trigger mode drive it. */
		open?: boolean;
		/** Called whenever the popover opens or closes. */
		onOpenChange?: (open: boolean) => void;
		/** Where the panel sits relative to the trigger. */
		placement?: Placement;
		/** The gap between the trigger and the panel, as a CSS length. */
		offset?: string;
		/** `click` toggles on press and light-dismisses; `hover` opens on hover or focus; `manual` is driven only by `open`. */
		trigger?: PopoverTrigger;
		/** Stretch the panel to the trigger's width. */
		matchWidth?: boolean;
		/** The panel fill: frosted glass, or opaque. */
		surface?: OverlaySurface;
		/** The element that opens the popover. Spread `props` onto your own button. Named `target` because `trigger` is the open mode. */
		target?: Snippet<[OverlayTrigger]>;
		/** The panel contents. Receives `close`. */
		children?: Snippet<[OverlayContent]>;
	}

	let {
		open = $bindable(false),
		onOpenChange,
		placement = 'bottom',
		offset = 'var(--space-sm)',
		trigger = 'click',
		matchWidth = false,
		surface = 'glass',
		target,
		children,
		class: klass,
		...rest
	}: Props = $props();

	const uid = $props.id();

	let panel: HTMLDivElement | undefined;
	let restore: HTMLElement | null = null;
	let closeTimer: ReturnType<typeof setTimeout> | undefined;

	function setOpen(next: boolean) {
		if (open === next) return;
		if (next) {
			restore = (typeof document !== 'undefined' ? (document.activeElement as HTMLElement | null) : null);
		}
		open = next;
		onOpenChange?.(next);
		if (next && trigger === 'click') {
			queueMicrotask(() => panel?.focus());
		}
		if (!next && restore && trigger === 'click') {
			restore.focus();
			restore = null;
		}
	}

	const show = () => setOpen(true);
	const hide = () => setOpen(false);
	const toggle = () => setOpen(!open);

	const api = $derived<OverlayTrigger>({
		props: {
			type: 'button',
			'aria-haspopup': trigger === 'hover' ? undefined : 'dialog',
			'aria-expanded': open,
			'aria-controls': uid,
			onclick: trigger === 'click' ? toggle : undefined
		},
		isOpen: open,
		open: show,
		close: hide,
		toggle
	});

	const content: OverlayContent = { close: hide };

	function onHoverEnter() {
		if (trigger !== 'hover') return;
		clearTimeout(closeTimer);
		show();
	}
	function onHoverLeave() {
		if (trigger !== 'hover') return;
		clearTimeout(closeTimer);
		closeTimer = setTimeout(hide, 120);
	}

	$effect(() => {
		return () => clearTimeout(closeTimer);
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
	class="anchor inline-flex"
	{@attach anchor(uid)}
	onpointerenter={onHoverEnter}
	onpointerleave={onHoverLeave}
	onfocusin={onHoverEnter}
	onfocusout={onHoverLeave}
>
	{@render target?.(api)}
</span>

<div
	bind:this={panel}
	id={uid}
	popover={trigger === 'click' ? 'auto' : 'manual'}
	role="dialog"
	tabindex="-1"
	class={[
		'floating pop spring-snappy border rim shad-lg radius-lg pad-bs max-w-sm focus-none',
		surfaceClass[surface],
		placementClass[placement],
		enterFrom[placement],
		matchWidth && 'match-anchor',
		klass
	]}
	{@attach floating(uid, offset)}
	{@attach popoverSync(() => open, setOpen)}
	onpointerenter={onHoverEnter}
	onpointerleave={onHoverLeave}
	{...rest}
>
	{@render children?.(content)}
</div>
