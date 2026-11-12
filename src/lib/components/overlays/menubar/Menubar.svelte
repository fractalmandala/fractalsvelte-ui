<!-- @component A persistent application menu bar with the WAI-ARIA menubar pattern, on the Popover API. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { roving } from '../../../internal/roving.js';
	import type { OverlaySurface } from '../dialog/dialog.js';
	import { menubarRoving, setMenubar, type MenubarIntent } from './menubar.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/** The open menu's value, or `null` when every menu is closed. Bindable. */
		value?: string | null;
		/** Called whenever the open menu changes. */
		onValueChange?: (value: string | null) => void;
		/** Whether arrow keys wrap from the last trigger to the first. */
		loop?: boolean;
		/** The fill of every menu panel, unless a menu overrides it. */
		surface?: OverlaySurface;
		/** The accessible name of the menubar. */
		label?: string;
		/** The `MenubarMenu` children. */
		children?: Snippet;
	}

	let {
		value = $bindable(null),
		onValueChange,
		loop = true,
		surface = 'glass',
		label = 'Application',
		class: klass,
		children,
		...rest
	}: Props = $props();

	const uid = $props.id();
	let root = $state<HTMLDivElement>();
	let intent = $state<MenubarIntent>('first');

	function triggers() {
		if (!root) return [];
		return Array.from(root.querySelectorAll<HTMLElement>('[data-menubar-trigger]')).filter(
			(el) => el.getAttribute('aria-disabled') !== 'true' && !el.hasAttribute('disabled')
		);
	}

	function setValue(next: string | null, nextIntent: MenubarIntent = 'first') {
		intent = nextIntent;
		if (value === next) return;
		value = next;
		onValueChange?.(next);
	}

	function move(from: string, direction: 1 | -1, nextIntent: MenubarIntent = 'first') {
		const all = triggers();
		const index = all.findIndex((el) => el.dataset.menubarValue === from);
		if (index < 0 || all.length === 0) return;
		let target = index + direction;
		if (loop) target = (target + all.length) % all.length;
		else if (target < 0 || target >= all.length) return;
		const next = all[target]?.dataset.menubarValue;
		if (next) setValue(next, nextIntent);
	}

	function onNavigate(item: HTMLElement) {
		if (value === null) return;
		const next = item.dataset.menubarValue;
		if (next && next !== value) setValue(next, 'first');
	}

	setMenubar({
		uid,
		value: () => value,
		setValue,
		intent: () => intent,
		get loop() {
			return loop;
		},
		get surface() {
			return surface;
		},
		move
	});
</script>

<div
	bind:this={root}
	role="menubar"
	aria-label={label}
	aria-orientation="horizontal"
	class={['row gap-xs', klass]}
	{@attach roving({ ...menubarRoving, loop, onNavigate })}
	{...rest}
>
	{@render children?.()}
</div>
