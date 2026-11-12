<!-- @component A menu button with roving focus, typeahead and nested submenus, on the Popover API. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { anchor, floating, popoverSync } from '../../../internal/floating.js';
	import { placementClass, type Placement } from '../../../internal/tokens.js';
	import { roving } from '../../../internal/roving.js';
	import { surfaceClass, type OverlaySurface, type OverlayTrigger } from '../dialog/dialog.js';
	import { enterFrom } from '../popover/popover.js';
	import { menuRoving, setMenu } from './menu.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/** Whether the menu is open. Bind it, or let the trigger drive it. */
		open?: boolean;
		/** Called whenever the menu opens or closes. */
		onOpenChange?: (open: boolean) => void;
		/** Where the menu sits relative to the trigger. */
		placement?: Placement;
		/** The menu fill: frosted glass, or opaque. */
		surface?: OverlaySurface;
		/** The button that opens the menu. Spread `props` onto your own button. */
		trigger?: Snippet<[OverlayTrigger]>;
		/** The items, labels, separators and submenus. */
		children?: Snippet;
	}

	let {
		open = $bindable(false),
		onOpenChange,
		placement = 'bottom-start',
		surface = 'glass',
		trigger,
		children,
		class: klass,
		...rest
	}: Props = $props();

	const uid = $props.id();
	let panel: HTMLDivElement | undefined;
	let restore: HTMLElement | null = null;

	function setOpen(next: boolean) {
		if (open === next) return;
		if (next && typeof document !== 'undefined') {
			restore = document.activeElement as HTMLElement | null;
		}
		open = next;
		onOpenChange?.(next);
		if (next) {
			queueMicrotask(() => focusItem(next ? 'first' : null));
		} else if (restore) {
			restore.focus();
			restore = null;
		}
	}

	function focusItem(which: 'first' | 'last' | null) {
		if (!panel || !which) return;
		const items = Array.from(
			panel.querySelectorAll<HTMLElement>(menuRoving.selector)
		).filter((el) => el.getAttribute('aria-disabled') !== 'true');
		const target = which === 'last' ? items.at(-1) : items[0];
		target?.focus();
	}

	const show = () => setOpen(true);
	const hide = () => setOpen(false);
	const toggle = () => setOpen(!open);

	function onTriggerKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			setOpen(true);
			queueMicrotask(() => focusItem('first'));
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			setOpen(true);
			queueMicrotask(() => focusItem('last'));
		}
	}

	const api = $derived<OverlayTrigger>({
		props: {
			type: 'button',
			'aria-haspopup': 'menu',
			'aria-expanded': open,
			'aria-controls': uid,
			onclick: toggle,
			onkeydown: onTriggerKeydown
		},
		isOpen: open,
		open: show,
		close: hide,
		toggle
	});

	setMenu({
		uid,
		close: hide
	});
</script>

<span class="anchor inline-flex" {@attach anchor(uid)}>
	{@render trigger?.(api)}
</span>

<div
	bind:this={panel}
	id={uid}
	popover="auto"
	role="menu"
	tabindex="-1"
	class={[
		'floating pop spring-snappy border rim shad-lg radius-lg pad-xs wmin-xs box gap-xs focus-none',
		surfaceClass[surface],
		placementClass[placement],
		enterFrom[placement],
		klass
	]}
	{@attach floating(uid, 'var(--space-sm)')}
	{@attach popoverSync(() => open, setOpen)}
	{@attach roving(menuRoving)}
	{...rest}
>
	{@render children?.()}
</div>
