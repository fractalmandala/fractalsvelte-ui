<!-- @component The draggable, focusable separator between two panes. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luGripHorizontal, luGripVertical } from '@fractaldesign/icons/lucide';
	import { getResizable } from './resizable.svelte.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Draws a small grip on the handle so it reads as draggable. */
		withGrip?: boolean;
	}

	let { withGrip = false, class: klass, ...rest }: Props = $props();

	const group = getResizable();
	const ordinal = group.nextHandle();
	let el: HTMLElement | undefined = $state();
	let active = $state(false);

	/** Handle n sits after pane n — read from the DOM once mounted, so late panes keep it right. */
	const index = $derived.by(() => {
		const panes = group.panes;
		if (!el) return ordinal;
		let before = 0;
		for (const p of panes) {
			if (p.el && p.el.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) before++;
		}
		return Math.max(0, before - 1);
	});

	const horizontal = $derived(group.orientation === 'horizontal');
	const info = $derived(group.describe(index));

	let drag: { from: number; base: number[]; span: number } | null = null;

	function down(event: PointerEvent): void {
		if (event.button !== 0 || !el) return;
		event.preventDefault();
		el.setPointerCapture(event.pointerId);
		el.focus({ preventScroll: true });
		drag = { from: horizontal ? event.clientX : event.clientY, base: group.sizes.slice(), span: group.available() };
		group.dragging = true;
		active = true;
	}

	function move(event: PointerEvent): void {
		if (!drag) return;
		const delta = (((horizontal ? event.clientX : event.clientY) - drag.from) / drag.span) * 100;
		group.apply(group.move(drag.base, index, delta));
	}

	function up(event: PointerEvent): void {
		if (!drag) return;
		if (el?.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
		drag = null;
		group.dragging = false;
		active = false;
	}

	function key(event: KeyboardEvent): void {
		const back = horizontal ? 'ArrowLeft' : 'ArrowUp';
		const forward = horizontal ? 'ArrowRight' : 'ArrowDown';
		const step = event.shiftKey ? 20 : 5;
		if (event.key === back) group.resizeBy(index, -step);
		else if (event.key === forward) group.resizeBy(index, step);
		else if (event.key === 'Home') group.jump(index, 'min');
		else if (event.key === 'End') group.jump(index, 'max');
		else if (event.key === 'Enter') group.toggleAt(index);
		else return;
		event.preventDefault();
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -- a window splitter (role=separator with aria-valuenow) is focusable -->
<div
	aria-label="Resize panels"
	{...rest}
	bind:this={el}
	class={['splitter touch-none select-none', active && 'active', klass]}
	role="separator"
	tabindex="0"
	aria-orientation={horizontal ? 'vertical' : 'horizontal'}
	aria-controls={info.id}
	aria-valuenow={Math.round(info.now)}
	aria-valuemin={Math.round(info.min)}
	aria-valuemax={Math.round(info.max)}
	onpointerdown={down}
	onpointermove={move}
	onpointerup={up}
	onpointercancel={up}
	onkeydown={key}
	ondblclick={() => group.reset(index)}
>
	{#if withGrip}
		<span class="grid center bg-surface border radius-sm shad-xs shrink-0 pointer-none z-raised h-sm square text-muted">
			<Icon icon={horizontal ? luGripVertical : luGripHorizontal} />
		</span>
	{/if}
</div>
