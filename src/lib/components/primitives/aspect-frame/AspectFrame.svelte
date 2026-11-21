<!-- @component A box of fixed proportion that holds media and clips it to its shape. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import type {  Shape  } from '../../../internal/tokens.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		ratio?: '16-9' | '9-16' | '4-3' | '3-4' | '3-2' | '2-3' | '1-1';
		fit?: 'cover' | 'contain' | 'fill' | 'scale-down';
		shape?: Shape;
		children?: Snippet<[string]>;
	}

	let {
		ratio = '16-9',
		fit = 'cover',
		shape = 'modern',
		class: className,
		children,
		...rest
	}: Props = $props();

	const ratioClasses = {
		'16-9': 'frame-16-9',
		'9-16': 'frame-9-16',
		'4-3': 'frame-4-3',
		'3-4': 'frame-3-4',
		'3-2': 'frame-3-2',
		'2-3': 'frame-2-3',
		'1-1': 'frame-1-1'
	};

	const fitClasses = {
		cover: 'fit-cover',
		contain: 'fit-contain',
		fill: 'fit-fill',
		'scale-down': 'fit-scale-down'
	};

	const classes = $derived(['bg-panel', ratioClasses[ratio], shape, className]);
	const mediaClass = $derived(['full', fitClasses[fit]].join(' '));
</script>

<div class={classes} {...rest}>
	{@render children?.(mediaClass)}
</div>
