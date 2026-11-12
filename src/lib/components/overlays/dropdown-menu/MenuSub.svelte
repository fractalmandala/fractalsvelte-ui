<!-- @component A nested submenu that opens to the side, with arrow-key open and close. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon, type IconData } from '@fractaldesign/icons';
	import { luChevronRight } from '@fractaldesign/icons/lucide';
	import { anchor, floating, popoverSync } from '../../../internal/floating.js';
	import { roving } from '../../../internal/roving.js';
	import { surfaceClass, type OverlaySurface } from '../dialog/dialog.js';
	import { menuRoving } from './menu.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/** Whether the submenu is open. Bind it, or let hover and arrow keys drive it. */
		open?: boolean;
		/** Called whenever the submenu opens or closes. */
		onOpenChange?: (open: boolean) => void;
		/** An icon drawn before the label. */
		icon?: IconData;
		/** The row's label. */
		label?: string;
		/** Disables the submenu trigger. */
		disabled?: boolean;
		/** The submenu fill: frosted glass, or opaque. */
		surface?: OverlaySurface;
		/** The items of the submenu. */
		children?: Snippet;
	}

	let {
		open = $bindable(false),
		onOpenChange,
		icon,
		label,
		disabled = false,
		surface = 'glass',
		children,
		class: klass,
		...rest
	}: Props = $props();

	const uid = $props.id();
	let panel: HTMLDivElement | undefined;
	let closeTimer: ReturnType<typeof setTimeout> | undefined;

	function setOpen(next: boolean) {
		if (disabled && next) return;
		if (open === next) return;
		open = next;
		onOpenChange?.(next);
		if (next) {
			queueMicrotask(() => {
				const items = panel?.querySelectorAll<HTMLElement>(menuRoving.selector);
				items?.[0]?.focus();
			});
		}
	}

	function scheduleOpen() {
		if (disabled) return;
		clearTimeout(closeTimer);
		setOpen(true);
	}

	function scheduleClose() {
		clearTimeout(closeTimer);
		closeTimer = setTimeout(() => setOpen(false), 160);
	}

	function onTriggerKeydown(event: KeyboardEvent) {
		if (disabled) return;
		if (event.key === 'ArrowRight' || event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			event.stopPropagation();
			setOpen(true);
		}
	}

	function onPanelKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft' || event.key === 'Escape') {
			event.preventDefault();
			event.stopPropagation();
			setOpen(false);
			const trigger = (event.currentTarget as HTMLElement).parentElement?.querySelector<HTMLElement>('[data-menu-item]');
			trigger?.focus();
		}
	}

	$effect(() => {
		return () => clearTimeout(closeTimer);
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	data-menu-sub
	class={klass}
	onpointerenter={scheduleOpen}
	onpointerleave={scheduleClose}
	{...rest}
>
	<div
		role="menuitem"
		data-menu-item
		tabindex="-1"
		aria-haspopup="menu"
		aria-expanded={open}
		aria-controls={uid}
		aria-disabled={disabled || undefined}
		class={['item', disabled && 'disabled']}
		{@attach anchor(uid)}
		onkeydown={onTriggerKeydown}
	>
		{#if icon}
			<Icon {icon} class="text-secondary shrink-0" />
		{/if}
		<span class="grow truncate">{label}</span>
		<Icon icon={luChevronRight} class="text-muted shrink-0" />
	</div>

	<div
		bind:this={panel}
		id={uid}
		popover="manual"
		role="menu"
		tabindex="-1"
		class={[
			'floating at-right-start pop enter-right spring-snappy border rim shad-lg radius-lg pad-xs wmin-xs box gap-xs focus-none',
			surfaceClass[surface]
		]}
		{@attach floating(uid, 'var(--space-xs)')}
		{@attach popoverSync(() => open, setOpen)}
		{@attach roving(menuRoving)}
		onkeydown={onPanelKeydown}
	>
		{@render children?.()}
	</div>
</div>
