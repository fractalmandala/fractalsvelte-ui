<!-- @component A macOS-style dock whose items magnify by pointer proximity, driven by springs. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { animate, reducedMotion } from '../../../motion/index.js';
	import { roving } from '../../../internal/roving.js';
	import type { Orientation } from '../../../internal/tokens.js';
	import type { DockItem } from './items.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		/** The items, in order. */
		items: DockItem[];
		/** The current item's value, used to set `aria-current`. */
		current?: string;
		/** Lays the dock out along the bottom or along the start edge. */
		orientation?: Orientation;
		/** Accessible name of the navigation. */
		label?: string;
	}

	let {
		items,
		current,
		orientation = 'horizontal',
		label = 'Dock',
		class: klass,
		...rest
	}: Props = $props();

	const vertical = $derived(orientation === 'vertical');
	const origin = $derived(vertical ? 'origin-left' : 'origin-bot');
	const hint = $derived(vertical ? 'hint hint-right' : 'hint hint-top');

	let root = $state<HTMLElement>();
	const MAG = 0.55;
	const RANGE = 72;

	function nodes(): HTMLElement[] {
		if (!root) return [];
		return Array.from(root.querySelectorAll<HTMLElement>('[data-dock-item]'));
	}

	function magnify(clientX: number, clientY: number) {
		if (reducedMotion.current) {
			for (const node of nodes()) animate(node, { scale: 1 }, { instant: true });
			return;
		}
		for (const node of nodes()) {
			const r = node.getBoundingClientRect();
			const dx = clientX - (r.left + r.width / 2);
			const dy = clientY - (r.top + r.height / 2);
			const dist = Math.hypot(dx, dy);
			const t = Math.max(0, 1 - dist / RANGE);
			animate(node, { scale: 1 + MAG * t * t }, { spring: 'stiff' });
		}
	}

	function release() {
		for (const node of nodes()) {
			animate(node, { scale: 1 }, { spring: 'snappy', instant: reducedMotion.current });
		}
	}

	function onPointerMove(event: PointerEvent) {
		if (event.pointerType === 'touch') return;
		magnify(event.clientX, event.clientY);
	}

	function onFocusIn(event: FocusEvent) {
		const item = (event.target as HTMLElement).closest<HTMLElement>('[data-dock-item]');
		if (!item) return;
		const r = item.getBoundingClientRect();
		magnify(r.left + r.width / 2, r.top + r.height / 2);
	}
</script>

<nav
	bind:this={root}
	aria-label={label}
	class={[
		'row ycenter xcenter gap-sm pad-sm bg-surface glass border rim shad-lg modern',
		vertical && 'column',
		klass
	]}
	{@attach roving({
		selector: '[data-dock-item]',
		orientation,
		loop: true,
		tabindex: true
	})}
	onpointermove={onPointerMove}
	onpointerleave={release}
	onfocusin={onFocusIn}
	onfocusout={(event) => {
		if (!root?.contains(event.relatedTarget as Node)) release();
	}}
	{...rest}
>
	{#each items as item (item.value)}
		{@const active = item.value === current}
		{@const classes = [
			'bare relative motion',
			origin,
			'inline-flex xcenter ycenter square h-xl modern',
			active ? 'text-primary' : 'text-secondary',
			item.disabled && 'disabled'
		]}
		{#if item.href && !item.disabled}
			<a
				class={classes}
				href={item.href}
				data-dock-item
				data-value={item.value}
				aria-label={item.label}
				aria-current={active ? 'page' : undefined}
			>
				<Icon icon={item.icon} />
				<span class={hint}>{item.label}</span>
			</a>
		{:else}
			<button
				type="button"
				class={classes}
				data-dock-item
				data-value={item.value}
				aria-label={item.label}
				aria-current={active ? 'page' : undefined}
				disabled={item.disabled}
				onclick={() => !item.disabled && item.onSelect?.()}
			>
				<Icon icon={item.icon} />
				<span class={hint}>{item.label}</span>
			</button>
		{/if}
	{/each}
</nav>
