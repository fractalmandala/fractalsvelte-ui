<!-- @component A hairline rule that separates content, optionally labelled, horizontal or vertical. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Orientation, Size } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		/** The direction of the rule. A vertical divider sits in a row and stretches to the row's height. */
		orientation?: Orientation;
		/** The line style: solid, dashed, a faint hairline or a strong rule. */
		look?: 'solid' | 'dashed' | 'subtle' | 'strong';
		/** The space on either side of the rule, from the shared size ladder. */
		spacing?: Size;
		/** Text centred in a horizontal rule. Not drawn on a vertical divider. */
		children?: Snippet;
	}

	let {
		orientation = 'horizontal',
		look = 'solid',
		spacing = 'h-md',
		class: className,
		children,
		...rest
	}: Props = $props();

	const horizontalLine = { solid: 'bt', dashed: 'bt-dash', subtle: 'bt-sub', strong: 'bt-str' };
	const verticalLine = { solid: 'bl', dashed: 'bl-dash', subtle: 'bl-sub', strong: 'bl-str' };
	const horizontalSpace = {
		'h-xs': 'my-xs',
		'h-sm': 'my-sm',
		'h-md': 'my-md',
		'h-bs': 'my-bs',
		'h-lg': 'my-lg',
		'h-xl': 'my-xl',
		'h-2xl': 'my-2xl',
		'h-3xl': 'my-3xl'
	};
	const verticalSpace = {
		'h-xs': 'mx-xs',
		'h-sm': 'mx-sm',
		'h-md': 'mx-md',
		'h-bs': 'mx-bs',
		'h-lg': 'mx-lg',
		'h-xl': 'mx-xl',
		'h-2xl': 'mx-2xl',
		'h-3xl': 'mx-3xl'
	};

	const line = $derived(orientation === 'vertical' ? verticalLine[look] : horizontalLine[look]);
	const space = $derived(orientation === 'vertical' ? verticalSpace[spacing] : horizontalSpace[spacing]);
</script>

{#if orientation === 'horizontal' && !children}
	<hr class={['border-none', line, space, className]} {...rest} />
{:else if orientation === 'horizontal'}
	<div class={['row xcenter gap-sm wfull', space, className]} {...rest}>
		<span class={['grow', line]} aria-hidden="true"></span>
		<span class="shrink-0 text-xs text-muted tt-u ls-wide-bs">{@render children?.()}</span>
		<span class={['grow', line]} aria-hidden="true"></span>
	</div>
{:else}
	<div role="separator" aria-orientation="vertical" class={['inline-block', line, space, className]} {...rest}></div>
{/if}
