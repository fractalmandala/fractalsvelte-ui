<!-- @component A nested submenu that opens to the side, with arrow-key open and close. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { Icon, type IconData } from '@fractaldesign/icons';
	import { luChevronRight } from '@fractaldesign/icons/lucide';
	import { anchor, floating, popoverSync, roving } from '../../../internal/helpers.js';
		import type { ChildTextColor, Pad, TextColor, Surface } from '../../../internal/tokens.js';
	import { menuRoving } from './menu.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		icon?: IconData;
		label?: string;
		disabled?: boolean;
		textColor?: TextColor;
		childTextColor?: ChildTextColor;
		surface?: Surface;
		children?: Snippet;
	}

	let {
		open = $bindable(false),
		onOpenChange,
		icon,
		label,
		disabled = false,
		textColor = 'text-secondary',
		childTextColor = 'text-muted',
		surface = 'glass',
		children,
		class: className,
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
	class={className}
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
			<Icon {icon} class={['shrink-0', textColor]} />
		{/if}
		<span class="grow truncate">{label}</span>
		<Icon icon={luChevronRight} class={['shrink-0', childTextColor]} />
	</div>

	<div
		bind:this={panel}
		id={uid}
		popover="manual"
		role="menu"
		tabindex="-1"
		class={[
			'floating at-right-start pop enter-right spring-snappy radius-lg wmin-xs box gap-xs focus-none',
			'pad-xs',
			surface
		]}
		{@attach floating(uid, 'var(--space-xs)')}
		{@attach popoverSync(() => open, setOpen)}
		{@attach roving(menuRoving)}
		onkeydown={onPanelKeydown}
	>
		{@render children?.()}
	</div>
</div>
