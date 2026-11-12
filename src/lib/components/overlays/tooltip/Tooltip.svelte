<!-- @component A short hint on hover or focus, using popover="hint" and a shared warm group. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { anchor, floating, popoverSync } from '../../../internal/floating.js';
	import { placementClass, type Placement } from '../../../internal/tokens.js';
	import type { OverlayTrigger } from '../dialog/dialog.js';
	import { enterFrom, hintPopover, markWarm, openDelay } from './tooltip.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/** The hint. A string, or a snippet for richer content. */
		content?: string | Snippet;
		/** Where the hint sits relative to the trigger. */
		placement?: Placement;
		/** How long to wait, in milliseconds, before opening on hover or focus. Adjacent tooltips skip this while the group is warm. */
		delay?: number;
		/** How long to wait, in milliseconds, before closing after hover or focus leaves. */
		closeDelay?: number;
		/** The element the hint describes. Spread `props` onto your own control. */
		trigger?: Snippet<[OverlayTrigger]>;
	}

	let {
		content,
		placement = 'top',
		delay = 300,
		closeDelay = 100,
		trigger,
		class: klass,
		...rest
	}: Props = $props();

	const uid = $props.id();

	let open = $state(false);
	let openTimer: ReturnType<typeof setTimeout> | undefined;
	let closeTimer: ReturnType<typeof setTimeout> | undefined;

	function clearTimers() {
		clearTimeout(openTimer);
		clearTimeout(closeTimer);
	}

	function setOpen(next: boolean) {
		if (open === next) return;
		open = next;
		if (!next) markWarm();
	}

	function scheduleOpen() {
		clearTimers();
		const wait = openDelay(delay);
		if (wait <= 0) setOpen(true);
		else openTimer = setTimeout(() => setOpen(true), wait);
	}

	function scheduleClose() {
		clearTimers();
		closeTimer = setTimeout(() => setOpen(false), closeDelay);
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && open) {
			event.stopPropagation();
			clearTimers();
			setOpen(false);
		}
	}

	const api = $derived<OverlayTrigger>({
		props: {
			'aria-describedby': open ? uid : undefined,
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

	$effect(() => {
		return () => clearTimers();
	});
</script>

<svelte:window onkeydown={onKeydown} />

<span class="anchor inline-flex" {@attach anchor(uid)}>
	{@render trigger?.(api)}
</span>

<div
	id={uid}
	role="tooltip"
	class={[
		'floating pop spring-snappy glass border rim shad-md radius-md px-sm py-xs max-w-xs pointer-none text-sm lh15 text-primary',
		placementClass[placement],
		enterFrom[placement],
		klass
	]}
	{@attach floating(uid, 'var(--space-sm)')}
	{@attach hintPopover()}
	{@attach popoverSync(() => open, setOpen)}
	{...rest}
>
	{#if typeof content === 'string'}{content}{:else if content}{@render content()}{/if}
</div>
