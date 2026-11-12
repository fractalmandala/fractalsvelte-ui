<!-- @component A rich preview card on hover or focus of a link, with time to travel from the trigger to the card. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { anchor, floating, popoverSync } from '../../../internal/floating.js';
	import { placementClass, type Placement } from '../../../internal/tokens.js';
	import { surfaceClass, type OverlayContent, type OverlaySurface } from '../dialog/dialog.js';
	import { enterFrom } from './hover-card.js';

	interface HoverTrigger {
		/** Spread onto the trigger element: ARIA wiring and the hover and focus handlers. */
		props: HTMLAttributes<HTMLElement>;
		/** Whether the card is open. */
		isOpen: boolean;
		/** Opens the card. */
		open: () => void;
		/** Closes the card. */
		close: () => void;
		/** Opens it if closed, closes it if open. */
		toggle: () => void;
	}

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/** Whether the card is open. Bind it, or let hover and focus drive it. */
		open?: boolean;
		/** Called whenever the card opens or closes. */
		onOpenChange?: (open: boolean) => void;
		/** Where the card sits relative to the trigger. */
		placement?: Placement;
		/** How long to wait, in milliseconds, before opening on hover or focus. */
		openDelay?: number;
		/** How long to wait, in milliseconds, before closing after the pointer or focus leaves — long enough to travel onto the card. */
		closeDelay?: number;
		/** The card fill: frosted glass, or opaque. */
		surface?: OverlaySurface;
		/** The link or control that opens the card. Spread `props` onto your own element. */
		trigger?: Snippet<[HoverTrigger]>;
		/** The card contents. Receives `close`. */
		children?: Snippet<[OverlayContent]>;
	}

	let {
		open = $bindable(false),
		onOpenChange,
		placement = 'bottom',
		openDelay = 300,
		closeDelay = 200,
		surface = 'glass',
		trigger,
		children,
		class: klass,
		...rest
	}: Props = $props();

	const uid = $props.id();

	let openTimer: ReturnType<typeof setTimeout> | undefined;
	let closeTimer: ReturnType<typeof setTimeout> | undefined;

	function clearTimers() {
		clearTimeout(openTimer);
		clearTimeout(closeTimer);
	}

	function setOpen(next: boolean) {
		if (open === next) return;
		open = next;
		onOpenChange?.(next);
	}

	function scheduleOpen() {
		clearTimers();
		if (openDelay <= 0) setOpen(true);
		else openTimer = setTimeout(() => setOpen(true), openDelay);
	}

	function scheduleClose() {
		clearTimers();
		closeTimer = setTimeout(() => setOpen(false), closeDelay);
	}

	const api = $derived<HoverTrigger>({
		props: {
			'aria-expanded': open,
			'aria-controls': uid,
			onpointerenter: scheduleOpen,
			onpointerleave: scheduleClose,
			onfocus: scheduleOpen,
			onblur: scheduleClose
		},
		isOpen: open,
		open: () => {
			clearTimers();
			setOpen(true);
		},
		close: () => {
			clearTimers();
			setOpen(false);
		},
		toggle: () => {
			clearTimers();
			setOpen(!open);
		}
	});

	const content: OverlayContent = {
		close: () => {
			clearTimers();
			setOpen(false);
		}
	};

	$effect(() => {
		return () => clearTimers();
	});
</script>

<span class="anchor inline-flex" {@attach anchor(uid)}>
	{@render trigger?.(api)}
</span>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	id={uid}
	popover="manual"
	role="dialog"
	class={[
		'floating pop spring-snappy border rim shad-lg radius-lg pad-bs max-w-sm wmin-xs',
		surfaceClass[surface],
		placementClass[placement],
		enterFrom[placement],
		klass
	]}
	{@attach floating(uid, 'var(--space-sm)')}
	{@attach popoverSync(() => open, setOpen)}
	onpointerenter={scheduleOpen}
	onpointerleave={scheduleClose}
	{...rest}
>
	{@render children?.(content)}
</div>
