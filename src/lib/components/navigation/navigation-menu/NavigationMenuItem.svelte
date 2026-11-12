<!-- @component A trigger that opens a flyout panel, identified by a value. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { OverlayTrigger } from '../../overlays/dialog/dialog.js';
	import { getNavigationMenu, setNavigationMenuItem } from './navigation-menu.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/** The value this item contributes to the menu when its panel is open. */
		value: string;
		/** The default trigger label. Ignored when `trigger` is provided. */
		label?: string;
		/** The button that opens the panel. Spread `props` onto your own button. */
		trigger?: Snippet<[OverlayTrigger]>;
		/** Disables the trigger and prevents the panel from opening. */
		disabled?: boolean;
		/** The `NavigationMenuContent` for this item. */
		children?: Snippet;
	}

	let {
		value,
		label = '',
		trigger,
		disabled = false,
		children,
		class: klass,
		...rest
	}: Props = $props();

	const nav = getNavigationMenu();
	const contentId = $derived(`${nav.uid}-${value}-content`);
	const open = $derived(nav.value() === value);

	function setOpen(next: boolean) {
		if (disabled) return;
		nav.setValue(next ? value : nav.value() === value ? null : nav.value());
	}

	function onClick() {
		if (disabled) return;
		setOpen(!open);
	}

	function onPointerEnter() {
		if (disabled) return;
		nav.scheduleOpen(value);
	}

	function onPointerLeave() {
		nav.scheduleClose();
	}

	function onKeydown(event: KeyboardEvent) {
		if (disabled) return;
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			setOpen(!open);
		}
	}

	const api = $derived<OverlayTrigger>({
		props: {
			type: 'button',
			'data-nav-trigger': '',
			'data-value': value,
			'aria-expanded': open,
			'aria-controls': contentId,
			'aria-haspopup': 'true',
			'aria-disabled': disabled || undefined,
			disabled: disabled || undefined,
			onclick: onClick,
			onkeydown: onKeydown,
			onpointerenter: onPointerEnter,
			onpointerleave: onPointerLeave
		},
		isOpen: open,
		open: () => setOpen(true),
		close: () => setOpen(false),
		toggle: () => setOpen(!open)
	});

	setNavigationMenuItem({
		get value() {
			return value;
		},
		get contentId() {
			return contentId;
		},
		get disabled() {
			return disabled;
		}
	});
</script>

<div class={['inline-flex', klass]} {...rest}>
	{#if trigger}
		{@render trigger(api)}
	{:else}
		<button
			type="button"
			data-nav-trigger
			data-value={value}
			tabindex="-1"
			aria-expanded={open}
			aria-controls={contentId}
			aria-haspopup="true"
			aria-disabled={disabled || undefined}
			disabled={disabled || undefined}
			class={[
				'bare relative z-raised row ycenter gap-sm px-md h-lg weight-500 focus-ring select-none',
				open ? 'text-primary' : 'text-secondary'
			]}
			onclick={onClick}
			onkeydown={onKeydown}
			onpointerenter={onPointerEnter}
			onpointerleave={onPointerLeave}
		>
			{label}
		</button>
	{/if}
	{@render children?.()}
</div>
