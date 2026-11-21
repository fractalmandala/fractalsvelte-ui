<!-- @component A menu that opens at the pointer on right-click, long-press or Shift+F10, using the same item parts as the dropdown menu. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { anchor, floating, popoverSync, roving } from '../../../internal/helpers.js';
	import type { Pad, Surface } from '../../../internal/tokens.js';
	import { vars } from '../../../motion/index.js';
		import { menuRoving, setMenu } from '../dropdown-menu/menu.js';

	interface ContextTrigger {
		props: HTMLAttributes<HTMLElement>;
		isOpen: boolean;
		open: () => void;
		close: () => void;
		toggle: () => void;
	}

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		surface?: Surface;
		trigger?: Snippet<[ContextTrigger]>;
		children?: Snippet;
	}

	let {
		open = $bindable(false),
		onOpenChange,
		surface = 'glass',
		trigger,
		children,
		class: className,
		...rest
	}: Props = $props();

	const uid = $props.id();
	let panel: HTMLDivElement | undefined;
	let restore: HTMLElement | null = null;
	let px = $state(0);
	let py = $state(0);
	let pressTimer: ReturnType<typeof setTimeout> | undefined;

	function setOpen(next: boolean) {
		if (open === next) return;
		if (next && typeof document !== 'undefined') {
			restore = document.activeElement as HTMLElement | null;
		}
		open = next;
		onOpenChange?.(next);
		if (next) {
			queueMicrotask(() => {
				const items = panel?.querySelectorAll<HTMLElement>(menuRoving.selector);
				items?.[0]?.focus();
			});
		} else if (restore) {
			restore.focus();
			restore = null;
		}
	}

	function openAt(x: number, y: number) {
		px = x;
		py = y;
		setOpen(true);
	}

	function onContextMenu(event: MouseEvent) {
		event.preventDefault();
		openAt(event.clientX, event.clientY);
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'ContextMenu' || (event.key === 'F10' && event.shiftKey)) {
			event.preventDefault();
			const node = event.currentTarget as HTMLElement | null;
			const box = node?.getBoundingClientRect();
			if (box) openAt(box.left + box.width / 2, box.bottom);
		}
	}

	function onTouchStart(event: TouchEvent) {
		const touch = event.touches[0];
		if (!touch) return;
		clearTimeout(pressTimer);
		pressTimer = setTimeout(() => openAt(touch.clientX, touch.clientY), 500);
	}

	function onTouchEnd() {
		clearTimeout(pressTimer);
	}

	const show = () => setOpen(true);
	const hide = () => setOpen(false);
	const toggle = () => setOpen(!open);

	const api = $derived<ContextTrigger>({
		props: {
			'aria-haspopup': 'menu',
			'aria-expanded': open,
			'aria-controls': uid,
			oncontextmenu: onContextMenu,
			onkeydown: onKeydown,
			ontouchstart: onTouchStart,
			ontouchend: onTouchEnd,
			ontouchmove: onTouchEnd,
			ontouchcancel: onTouchEnd
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

	$effect(() => {
		return () => clearTimeout(pressTimer);
	});
</script>

{@render trigger?.(api)}

<div class="at-pointer" {@attach anchor(uid)} {@attach vars({ px, py })}></div>

<div
	bind:this={panel}
	id={uid}
	popover="auto"
	role="menu"
	tabindex="-1"
	class={[
		'floating pop enter-scale spring-snappy radius-lg wmin-xs box gap-xs focus-none',
		'pad-xs',
		surface,
		className
	]}
	{@attach floating(uid, 'var(--space-sm)')}
	{@attach popoverSync(() => open, setOpen)}
	{@attach roving(menuRoving)}
	{...rest}
>
	{@render children?.()}
</div>
