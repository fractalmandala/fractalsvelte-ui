<!-- @component The tab list: hosts the sliding indicator and the roving keyboard focus. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { animate } from '../../../motion/index.js';
	import { roving } from '../../../internal/helpers.js';
	import { getTabs } from './tabs.svelte.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		label?: string;
		children?: Snippet;
	}

	let { label, class: className, children, ...rest }: Props = $props();

	const tabs = getTabs();

	let root = $state<HTMLElement>();
	let indicator = $state<HTMLElement>();
	let placed = false;

	function place(instant = false) {
		const group = root;
		const mark = indicator;
		if (!group || !mark) return;
		const active = group.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
		if (!active) {
			animate(mark, { '--ix': 0, '--iy': 0, '--iw': 0, '--ih': 0 }, { instant: true });
			return;
		}
		const g = group.getBoundingClientRect();
		const b = active.getBoundingClientRect();
		const vertical = tabs.orientation === 'vertical';
		const rule = tabs.grouping === 'flush';
		animate(
			mark,
			{
				'--ix': rule && vertical ? 0 : b.left - g.left,
				'--iy': rule && !vertical ? 0 : b.top - g.top,
				'--iw': b.width,
				'--ih': b.height
			},
			{ instant: instant || !placed, spring: 'snappy' }
		);
		placed = true;
	}

	$effect(() => {
		tabs.value();
		tabs.orientation;
		tabs.grouping;
		tabs.surface;
		tabs.size;
		const frame = requestAnimationFrame(() => place());
		const group = root;
		if (!group || typeof ResizeObserver === 'undefined') {
			return () => cancelAnimationFrame(frame);
		}
		const ro = new ResizeObserver(() => place(true));
		ro.observe(group);
		return () => {
			cancelAnimationFrame(frame);
			ro.disconnect();
		};
	});

	function onNavigate(item: HTMLElement) {
		if (tabs.activation !== 'automatic') return;
		const next = item.dataset.value;
		if (next) tabs.select(next);
	}

	const listClass = $derived.by(() => {
		const vertical = tabs.orientation === 'vertical';
		const grouping = tabs.grouping;
		return [
			'relative',
			vertical ? 'column' : 'row',
			grouping === 'contained' && ['pad-xs', tabs.surface],
			grouping === 'separated' && 'gap-xs',
			grouping === 'flush' && (vertical ? 'bl' : 'bb'),
			className
		];
	});

	const indicatorClass = $derived(
		tabs.grouping === 'flush'
			? 'indicator rule'
			: ['indicator', tabs.surface]
	);
</script>

<div
	bind:this={root}
	role="tablist"
	aria-label={label}
	aria-orientation={tabs.orientation}
	class={listClass}
	{@attach roving({
		selector: '[role="tab"]',
		orientation: tabs.orientation,
		loop: true,
		tabindex: true,
		onNavigate
	})}
	{...rest}
>
	<div bind:this={indicator} class={indicatorClass} aria-hidden="true"></div>
	{@render children?.()}
</div>
