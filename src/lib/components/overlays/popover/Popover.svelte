<!-- @component An anchored non-modal panel on the Popover API, placed with CSS anchor positioning. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { anchor, floating, popoverSync } from '../../../internal/helpers.js';
	import { type Placement } from '../../../internal/tokens.js';
	import {type OverlayContent, type OverlayTrigger} from '../dialog/dialog.js';
	import type { Pad, Surface } from '../../../internal/tokens.js';
	import { enterFrom, type PopoverTrigger } from './popover.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		placement?: Placement;
		offset?: string;
		trigger?: PopoverTrigger;
		matchWidth?: boolean;
		surface?: Surface;
		target?: Snippet<[OverlayTrigger]>;
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
		class: className,
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
		'floating pop spring-snappy radius-lg max-w-sm focus-none',
		'pad-bs',
		surface,
		`at-${`placement`}`,
		enterFrom[placement],
		matchWidth && 'match-anchor',
		className
	]}
	{@attach floating(uid, offset)}
	{@attach popoverSync(() => open, setOpen)}
	onpointerenter={onHoverEnter}
	onpointerleave={onHoverLeave}
	{...rest}
>
	{@render children?.(content)}
</div>
