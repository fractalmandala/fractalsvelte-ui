<!-- @component Arranges children in a vertical or horizontal flex stack with spacing, alignment and optional hairlines. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { type Align, type Gap } from '../../../internal/tokens.js';
import { gapValue } from '../../../internal/helpers.js';
	import { vars } from '../../../motion/index.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Stack axis: vertical column or horizontal row. */
		direction?: 'vertical' | 'horizontal';
		/** Space between items on the shared gap ladder. */
		gap?: Gap;
		/** Cross-axis alignment. */
		align?: 'start' | 'center' | 'end' | 'stretch';
		/** Main-axis distribution. */
		justify?: Align;
		/** Wrap children onto multiple lines when stacking horizontally. */
		wrap?: boolean;
		/** Draw hairline borders between adjacent stack children. */
		dividers?: boolean;
		/** Stack children. */
		children?: Snippet;
	}

	let {
		direction = 'vertical',
		gap = 'gap-bs',
		align = 'stretch',
		justify = 'left',
		wrap = false,
		dividers = false,
		class: className,
		children,
		...rest
	}: Props = $props();

	const colAlign: Record<'start' | 'center' | 'end' | 'stretch', string | undefined> = {
		start: 'xleft',
		center: 'xcenter',
		end: 'xright',
		stretch: undefined
	};
	const colJustify: Record<Align, string | undefined> = {
		left: 'ytop',
		center: 'ycenter',
		right: 'ybot',
		between: 'ybetween'
	};
	const rowAlign: Record<'start' | 'center' | 'end' | 'stretch', string | undefined> = {
		start: 'ytop',
		center: 'ycenter',
		end: 'ybot',
		stretch: undefined
	};
	const rowJustify: Record<Align, string> = {
		left: 'xleft',
		center: 'xcenter',
		right: 'xright',
		between: 'xbetween'
	};

	const horizontal = $derived(direction === 'horizontal');
	const classes = $derived([
		horizontal ? 'row' : 'column',
		gap,
		wrap && 'wrap',
		horizontal ? rowAlign[align] : colAlign[align],
		horizontal ? rowJustify[justify] : colJustify[justify],
		dividers && 'stack-divided',
		className
	]);
</script>

<div class={classes} {@attach vars(dividers ? { gap: gapValue(gap) } : {})} {...rest}>
	{@render children?.()}
</div>
