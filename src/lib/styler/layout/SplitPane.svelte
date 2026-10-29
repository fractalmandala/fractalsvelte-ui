<!-- @component Two panes side by side or stacked, where either can be collapsed. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luGripVertical } from '@fractaldesign/icons/lucide';
	import type { Surface, Border, Shape, Shadow } from '../types';

	/**
	 * Which pane is collapsed. fractalstyler has no width utilities beyond
	 * .grow, so the split snaps between three states instead of a free
	 * percentage: both panes sharing the space, or one of them collapsed.
	 */
	export type SplitCollapse = 'a' | 'b' | null;

	interface Props extends HTMLAttributes<HTMLDivElement> {
		direction?: 'horizontal' | 'vertical';
		surface?: Surface;
		border?: Border;
		shape?: Shape;
		shadow?: Shadow;
		collapsed?: SplitCollapse;
		/** Drag distance in px that snaps a pane closed */
		snapDistance?: number;
		class?: string;
		paneA?: Snippet;
		paneB?: Snippet;
	}

	let {
		direction = 'horizontal',
		surface = 'bg-panel',
		border = 'border',
		shape = 'curved',
		shadow = 'shad-none',
		collapsed = $bindable(null),
		snapDistance = 48,
		class: className = '',
		paneA,
		paneB,
		...restProps
	}: Props = $props();

	const horizontal = $derived(direction === 'horizontal');
	let start: number | null = null;

	function shift(dir: -1 | 1) {
		// -1 moves the divider toward pane A (collapsing A), +1 toward pane B.
		if (dir < 0) collapsed = collapsed === 'b' ? null : 'a';
		else collapsed = collapsed === 'a' ? null : 'b';
	}

	function onpointerdown(e: PointerEvent) {
		start = horizontal ? e.clientX : e.clientY;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function onpointermove(e: PointerEvent) {
		if (start === null) return;
		const delta = (horizontal ? e.clientX : e.clientY) - start;
		if (Math.abs(delta) >= snapDistance) {
			shift(delta < 0 ? -1 : 1);
			start = horizontal ? e.clientX : e.clientY;
		}
	}

	function onkeydown(e: KeyboardEvent) {
		const back = horizontal ? 'ArrowLeft' : 'ArrowUp';
		const fwd = horizontal ? 'ArrowRight' : 'ArrowDown';
		if (e.key === back || e.key === fwd) {
			e.preventDefault();
			shift(e.key === back ? -1 : 1);
		} else if (e.key === 'Home' || e.key === 'End') {
			e.preventDefault();
			collapsed = e.key === 'Home' ? 'a' : 'b';
		} else if (e.key === 'Enter') {
			e.preventDefault();
			collapsed = null;
		}
	}
</script>

<div class="{horizontal ? 'row' : 'box'} wfull hfull min0 el-shape {surface} {border} {shape} {shadow} {className}" style:overflow="hidden" {...restProps}>
	<div class="grow min0 scroll-y" hidden={collapsed === 'a'}>
		{@render paneA?.()}
	</div>
	<!-- A focusable separator is the ARIA window-splitter pattern: arrows snap,
	     Home/End collapse, Enter restores. -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
	<div
		role="separator"
		aria-orientation={horizontal ? 'vertical' : 'horizontal'}
		aria-valuemin={0}
		aria-valuemax={100}
		aria-valuenow={collapsed === 'a' ? 0 : collapsed === 'b' ? 100 : 50}
		aria-label="Resize panes"
		tabindex="0"
		class="{horizontal ? 'box bl br px-xs' : 'row bt bb py-xs'} ycenter xcenter shrink-0 bg-sunken text-muted"
		{onpointerdown}
		{onpointermove}
		onpointerup={() => (start = null)}
		onpointercancel={() => (start = null)}
		ondblclick={() => (collapsed = null)}
		{onkeydown}
	>
		<Icon icon={luGripVertical} />
	</div>
	<div class="grow min0 scroll-y" hidden={collapsed === 'b'}>
		{@render paneB?.()}
	</div>
</div>
