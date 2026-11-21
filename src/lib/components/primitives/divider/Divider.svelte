<!-- @component A hairline rule that separates content, optionally labelled, horizontal or vertical. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import type {  Orientation, Size, TextColor, TextSize  } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		orientation?: Orientation;
		line?: 'solid' | 'dashed' | 'subtle' | 'strong';
		spacing?: Size;
		textSize?: TextSize;
		textColor?: TextColor;
		children?: Snippet;
	}

	let {
		orientation = 'horizontal',
		line = 'solid',
		spacing = 'h-md',
		textSize = 'text-xs',
		textColor = 'text-muted',
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

	const lineClass = $derived(orientation === 'vertical' ? verticalLine[line] : horizontalLine[line]);
	const space = $derived(orientation === 'vertical' ? verticalSpace[spacing] : horizontalSpace[spacing]);
</script>

{#if orientation === 'horizontal' && !children}
	<hr class={['border-none', lineClass, space, className]} {...rest} />
{:else if orientation === 'horizontal'}
	<div class={['row xcenter gap-sm wfull', space, className]} {...rest}>
		<span class={['grow', lineClass]} aria-hidden="true"></span>
		<span class={['shrink-0 tt-u ls-wide-bs', textSize, textColor]}>{@render children?.()}</span>
		<span class={['grow', lineClass]} aria-hidden="true"></span>
	</div>
{:else}
	<div role="separator" aria-orientation="vertical" class={['inline-block', lineClass, space, className]} {...rest}></div>
{/if}
