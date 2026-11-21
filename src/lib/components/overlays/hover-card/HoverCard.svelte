<!-- @component A rich preview card on hover or focus of a link, with time to travel from the trigger to the card. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { anchor, floating, popoverSync } from '../../../internal/helpers.js';
	import { type Placement } from '../../../internal/tokens.js';
	import {type OverlayContent} from '../dialog/dialog.js';
	import type { Pad, Surface } from '../../../internal/tokens.js';
	import { enterFrom } from './hover-card.js';

	interface HoverTrigger {
		props: HTMLAttributes<HTMLElement>;
		isOpen: boolean;
		open: () => void;
		close: () => void;
		toggle: () => void;
	}

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		placement?: Placement;
		openDelay?: number;
		closeDelay?: number;
		surface?: Surface;
		trigger?: Snippet<[HoverTrigger]>;
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
		class: className,
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
		'floating pop spring-snappy radius-lg max-w-sm wmin-xs',
		'pad-bs',
		surface,
		`at-${`placement`}`,
		enterFrom[placement],
		className
	]}
	{@attach floating(uid, 'var(--space-sm)')}
	{@attach popoverSync(() => open, setOpen)}
	onpointerenter={scheduleOpen}
	onpointerleave={scheduleClose}
	{...rest}
>
	{@render children?.(content)}
</div>
