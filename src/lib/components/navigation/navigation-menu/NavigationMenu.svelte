<!-- @component A site navigation with delayed flyout panels, a sliding indicator, and a viewport that springs between sizes. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { anchor, floating, popoverSync } from '../../../internal/floating.js';
	import { roving } from '../../../internal/roving.js';
	import type { Orientation } from '../../../internal/tokens.js';
	import { animate } from '../../../motion/index.js';
	import { surfaceClass, type OverlaySurface } from '../../overlays/dialog/dialog.js';
	import { navigationMenuRoving, setNavigationMenu } from './navigation-menu.js';

	interface Props extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
		/** The open item's value, or `null` when every panel is closed. Bindable. */
		value?: string | null;
		/** Called whenever the open item changes. */
		onValueChange?: (value: string | null) => void;
		/** How long to wait, in milliseconds, before opening a panel on hover. */
		delayDuration?: number;
		/** How long, in milliseconds, the menu stays warm after a panel opens, so the next trigger opens instantly. */
		skipDelayDuration?: number;
		/** Lays the list out in a row or a column, and places the viewport beside it. */
		orientation?: Orientation;
		/** The fill of the shared viewport. */
		surface?: OverlaySurface;
		/** The accessible name of the navigation. */
		label?: string;
		/** The items and top-level links. */
		children?: Snippet;
	}

	let {
		value = $bindable(null),
		onValueChange,
		delayDuration = 200,
		skipDelayDuration = 300,
		orientation = 'horizontal',
		surface = 'glass',
		label = 'Main',
		class: klass,
		children,
		...rest
	}: Props = $props();

	const uid = $props.id();
	const viewportId = $derived(`${uid}-viewport`);
	const vertical = $derived(orientation === 'vertical');

	let root = $state<HTMLElement>();
	let list = $state<HTMLElement>();
	let indicator = $state<HTMLElement>();
	let viewportEl = $state<HTMLElement>();
	let generation = $state(0);
	let placed = false;
	let openTimer: ReturnType<typeof setTimeout> | undefined;
	let closeTimer: ReturnType<typeof setTimeout> | undefined;
	let warmUntil = 0;

	function cancelTimers() {
		clearTimeout(openTimer);
		clearTimeout(closeTimer);
		openTimer = undefined;
		closeTimer = undefined;
	}

	function setValue(next: string | null) {
		cancelTimers();
		if (next) warmUntil = Date.now() + skipDelayDuration;
		if (value === next) return;
		value = next;
		onValueChange?.(next);
	}

	function scheduleOpen(next: string) {
		cancelTimers();
		const wait = Date.now() < warmUntil ? 0 : delayDuration;
		if (wait === 0) setValue(next);
		else openTimer = setTimeout(() => setValue(next), wait);
	}

	function scheduleClose() {
		cancelTimers();
		closeTimer = setTimeout(() => setValue(null), delayDuration);
	}

	function registerPanel() {
		generation += 1;
		return () => {
			generation += 1;
		};
	}

	function placeIndicator(instant = false) {
		const group = list;
		const mark = indicator;
		if (!group || !mark) return;
		const active = value
			? group.querySelector<HTMLElement>(`[data-nav-trigger][data-value="${CSS.escape(value)}"]`)
			: null;
		if (!active) {
			animate(mark, { '--ix': 0, '--iy': 0, '--iw': 0, '--ih': 0 }, { instant: true });
			return;
		}
		const g = group.getBoundingClientRect();
		const b = active.getBoundingClientRect();
		animate(
			mark,
			{
				'--ix': vertical ? 0 : b.left - g.left,
				'--iy': vertical ? b.top - g.top : 0,
				'--iw': b.width,
				'--ih': b.height
			},
			{ instant: instant || !placed, spring: 'snappy' }
		);
	}

	function placeViewport(instant = false) {
		const frame = viewportEl;
		if (!frame) return;
		if (!value) {
			animate(frame, { '--vw': 0, '--vh': 0 }, { instant: true });
			placed = false;
			return;
		}
		const panel = frame.querySelector<HTMLElement>(`[data-content="${CSS.escape(value)}"]`);
		if (!panel) return;
		animate(
			frame,
			{ '--vw': panel.offsetWidth, '--vh': panel.offsetHeight },
			{ instant: instant || !placed, spring: 'snappy' }
		);
		placed = true;
	}

	$effect(() => {
		value;
		orientation;
		generation;
		const frame = requestAnimationFrame(() => {
			placeIndicator();
			placeViewport();
		});
		const group = list;
		const frameEl = viewportEl;
		if (typeof ResizeObserver === 'undefined') {
			return () => cancelAnimationFrame(frame);
		}
		const ro = new ResizeObserver(() => {
			placeIndicator(true);
			placeViewport(true);
		});
		if (group) ro.observe(group);
		if (frameEl) ro.observe(frameEl);
		const active = frameEl?.querySelector(`[data-active]`);
		if (active) ro.observe(active);
		return () => {
			cancelAnimationFrame(frame);
			ro.disconnect();
		};
	});

	$effect(() => {
		if (value === null) return;
		const onDown = (event: PointerEvent) => {
			const target = event.target as Node | null;
			if (target && root?.contains(target)) return;
			setValue(null);
		};
		document.addEventListener('pointerdown', onDown);
		return () => document.removeEventListener('pointerdown', onDown);
	});

	$effect(() => {
		return () => cancelTimers();
	});

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && value !== null) {
			event.preventDefault();
			const current = value;
			setValue(null);
			const trigger = list?.querySelector<HTMLElement>(
				`[data-nav-trigger][data-value="${current ? CSS.escape(current) : ''}"]`
			);
			trigger?.focus();
		}
	}

	setNavigationMenu({
		uid,
		value: () => value,
		setValue,
		scheduleOpen,
		scheduleClose,
		cancelTimers,
		get orientation() {
			return orientation;
		},
		get surface() {
			return surface;
		},
		viewport: () => viewportEl,
		registerPanel
	});
</script>

<nav
	bind:this={root}
	aria-label={label}
	class={['relative', vertical ? 'row gap-xs' : 'box gap-xs', klass]}
	onkeydown={onKeydown}
	{...rest}
>
	<div
		bind:this={viewportEl}
		id={viewportId}
		popover="manual"
		role="region"
		aria-label="Navigation panel"
		class={[
			'floating viewport pop spring-snappy border rim shad-lg radius-lg',
			vertical ? 'at-right-start enter-right' : 'at-bottom-start enter-down',
			surfaceClass[surface]
		]}
		{@attach floating(uid, 'var(--space-sm)')}
		{@attach popoverSync(
			() => value !== null,
			(open) => {
				if (!open) setValue(null);
			}
		)}
		onpointerenter={cancelTimers}
		onpointerleave={scheduleClose}
	></div>

	<div
		bind:this={list}
		class={['relative', vertical ? 'column' : 'row', 'gap-xs']}
		{@attach anchor(uid)}
		{@attach roving({ ...navigationMenuRoving, orientation })}
	>
		<div bind:this={indicator} class="indicator rule" aria-hidden="true"></div>
		{@render children?.()}
	</div>
</nav>
