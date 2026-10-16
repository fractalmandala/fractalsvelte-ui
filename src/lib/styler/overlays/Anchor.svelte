<script lang="ts" module>
	export type Placement =
		| 'top'
		| 'top-start'
		| 'top-end'
		| 'bottom'
		| 'bottom-start'
		| 'bottom-end'
		| 'left'
		| 'left-start'
		| 'left-end'
		| 'right'
		| 'right-start'
		| 'right-end';
</script>

<script lang="ts">
	/*
	 * Places a floating panel next to its trigger with no offset utilities.
	 *
	 * fractalstyler has .absolute but no top/left/inset classes. An absolutely
	 * positioned child of a flex container, given no offsets, sits at its static
	 * position — and the flexbox spec places it there as if it were the sole
	 * flex item, honouring the container's justify/align. So a zero-size flex
	 * "anchor" on one side of the trigger, aligned with fractalstyler's own
	 * .row/.box modifiers, parks the panel on that side and edge:
	 *
	 *   top:    anchor above the trigger, .row.ybot   → panel grows upward
	 *   bottom: anchor below the trigger, .row.ytop   → panel grows downward
	 *   left:   anchor before the trigger, .box.xright → panel grows leftward
	 *   right:  anchor after the trigger,  .box.xleft  → panel grows rightward
	 *
	 * and -start / centre / -end pick the cross-axis modifier.
	 */
	import type { Snippet } from 'svelte';

	interface Props {
		placement?: Placement;
		open?: boolean;
		class?: string;
		trigger: Snippet;
		panel: Snippet;
	}

	let { placement = 'bottom', open = false, class: className = '', trigger, panel }: Props = $props();

	const side = $derived(placement.split('-')[0] as 'top' | 'bottom' | 'left' | 'right');
	const edge = $derived((placement.split('-')[1] ?? 'center') as 'start' | 'center' | 'end');
	const vertical = $derived(side === 'top' || side === 'bottom');

	// Anchor alignment per side and edge. Each string carries its own base.
	const ANCHOR_CLASSES: Record<string, string> = {
		'top-start': 'row ybot xleft',
		'top-center': 'row ybot xcenter',
		'top-end': 'row ybot xright',
		'bottom-start': 'row ytop xleft',
		'bottom-center': 'row ytop xcenter',
		'bottom-end': 'row ytop xright',
		'left-start': 'box xright ytop',
		'left-center': 'box xright ycenter',
		'left-end': 'box xright ybot',
		'right-start': 'box xleft ytop',
		'right-center': 'box xleft ycenter',
		'right-end': 'box xleft ybot'
	};

	// The gap between trigger and panel is a margin on the panel's near side.
	const GAP_CLASSES: Record<string, string> = {
		top: 'mb-xs',
		bottom: 'mt-xs',
		left: 'mr-xs',
		right: 'ml-xs'
	};
</script>

{#snippet anchor()}
	<div class={ANCHOR_CLASSES[`${side}-${edge}`]}>
		<div class="absolute {GAP_CLASSES[side]}">
			{@render panel()}
		</div>
	</div>
{/snippet}

<!-- The outer .row makes the inner group shrink to the trigger. It is not
     positioned on purpose: fractalstyler has no z-index utilities, and any
     positioned wrapper later in the page paints over earlier panels, so the
     anchor adds no positioned layers of its own. -->
<div class="row {className}">
	<div class={vertical ? 'box' : 'row'}>
		{#if open && (side === 'top' || side === 'left')}{@render anchor()}{/if}
		{@render trigger()}
		{#if open && (side === 'bottom' || side === 'right')}{@render anchor()}{/if}
	</div>
</div>
