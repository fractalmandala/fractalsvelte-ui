<!-- @component One named menu in the bar: a trigger and a popover of item parts. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { anchor, floating, popoverSync, roving } from '../../../internal/helpers.js';
	import {type OverlayTrigger} from '../dialog/dialog.js';
	import { menuRoving, setMenu } from '../dropdown-menu/menu.js';
	import type { Pad, Shape, Size, TextSize, Surface } from '../../../internal/tokens.js';
	import { getMenubar, type MenubarIntent } from './menubar.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		value: string;
		label?: string;
		trigger?: Snippet<[OverlayTrigger]>;
		surface?: Surface;
		size?: Size;
		textSize?: TextSize;
		shape?: Shape;
		disabled?: boolean;
		children?: Snippet;
	}

	let {
		value,
		label = '',
		trigger,
		surface,
		size = 'h-bs',
		textSize = 'text-sm',
		shape = 'modern',
		disabled = false,
		children,
		class: className,
		...rest
	}: Props = $props();

	const bar = getMenubar();
	const uid = $props.id();
	const fill = $derived(surface ?? bar.surface);
	const open = $derived(bar.value() === value);

	let triggerEl = $state<HTMLElement>();
	let panel = $state<HTMLDivElement>();

	function focusItem(which: 'first' | 'last') {
		if (!panel) return;
		const items = Array.from(panel.querySelectorAll<HTMLElement>(menuRoving.selector)).filter(
			(el) => el.getAttribute('aria-disabled') !== 'true'
		);
		const target = which === 'last' ? items.at(-1) : items[0];
		target?.focus();
	}

	function setOpen(next: boolean, intent: MenubarIntent = 'first') {
		if (disabled) return;
		if (next) bar.setValue(value, intent);
		else if (bar.value() === value) {
			bar.setValue(null);
			if (panel?.contains(document.activeElement) || document.activeElement === document.body) {
				focusTrigger();
			}
		}
	}

	function focusTrigger() {
		const node =
			triggerEl?.querySelector<HTMLElement>('[data-menubar-trigger]') ?? triggerEl;
		node?.focus();
	}

	function close() {
		if (bar.value() !== value) return;
		bar.setValue(null);
		focusTrigger();
	}

	const show = () => setOpen(true, 'first');
	const hide = () => setOpen(false);
	const toggle = () => setOpen(!open, 'first');

	function onTriggerPointerEnter() {
		if (disabled) return;
		if (bar.value() !== null && bar.value() !== value) bar.setValue(value, 'first');
	}

	function onTriggerKeydown(event: KeyboardEvent) {
		if (disabled) return;
		if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			setOpen(true, 'first');
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			setOpen(true, 'last');
		}
	}

	function onPanelKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowRight') {
			event.preventDefault();
			event.stopPropagation();
			bar.move(value, 1, 'first');
		} else if (event.key === 'ArrowLeft') {
			event.preventDefault();
			event.stopPropagation();
			bar.move(value, -1, 'first');
		} else if (event.key === 'Escape') {
			event.preventDefault();
			close();
		}
	}

	$effect(() => {
		if (open) {
			const which = bar.intent();
			queueMicrotask(() => focusItem(which));
		}
	});

	const api = $derived<OverlayTrigger>({
		props: {
			type: 'button',
			role: 'menuitem',
			'data-menubar-trigger': '',
			'data-menubar-value': value,
			'aria-haspopup': 'menu',
			'aria-expanded': open,
			'aria-controls': uid,
			'aria-disabled': disabled || undefined,
			tabindex: -1,
			onclick: toggle,
			onkeydown: onTriggerKeydown,
			onpointerenter: onTriggerPointerEnter
		},
		isOpen: open,
		open: show,
		close: hide,
		toggle
	});

	setMenu({
		uid,
		close
	});
</script>

<div class="inline-flex" data-menubar-menu>
	<span class="anchor inline-flex" bind:this={triggerEl} {@attach anchor(uid)}>
		{#if trigger}
			{@render trigger(api)}
		{:else}
			<button
				type="button"
				role="menuitem"
				data-menubar-trigger
				data-menubar-value={value}
				tabindex="-1"
				aria-haspopup="menu"
				aria-expanded={open}
				aria-controls={uid}
				aria-disabled={disabled || undefined}
				class={['button ghost no-scaling inline-flex px-md weight-500', size, textSize, shape, disabled && 'disabled']}
				disabled={disabled || undefined}
				onclick={toggle}
				onkeydown={onTriggerKeydown}
			>
				{label}
			</button>
		{/if}
	</span>

	<div
		bind:this={panel}
		id={uid}
		popover="auto"
		role="menu"
		tabindex="-1"
		class={[
			'floating at-bottom-start pop enter-down spring-snappy radius-lg wmin-xs box gap-xs focus-none',
			'pad-xs',
			[fill],
			className
		]}
		{@attach floating(uid, 'var(--space-sm)')}
		{@attach popoverSync(() => open, (next) => setOpen(next))}
		{@attach roving(menuRoving)}
		onkeydown={onPanelKeydown}
		{...rest}
	>
		{@render children?.()}
	</div>
</div>
