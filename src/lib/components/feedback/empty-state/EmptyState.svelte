<!-- @component A centred placeholder for a view that has nothing to show yet, with an optional next step. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import type {  IconData  } from '@fractaldesign/icons';
	import { type AlignContent, type ChildTextColor, type Gap, type Measure, type Pad, type Size, type TextColor, type TextSize } from '../../../internal/tokens.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
		icon?: IconData;
		title?: string;
		description?: string;
		size?: Size;
		pad?: Pad;
		gap?: Gap;
		alignContent?: AlignContent;
		measure?: Measure;
		textSize?: TextSize;
		textColor?: TextColor;
		childTextColor?: ChildTextColor;
		frame?: 'none' | 'bordered' | 'dashed';
		actions?: Snippet;
		children?: Snippet;
	}

	let {
		icon,
		title,
		description,
		size = 'h-lg',
		pad = 'pad-lg',
		gap = 'gap-md',
		alignContent = 'xcenter',
		measure = 'measure-sm',
		textSize,
		textColor = 'text-muted',
		childTextColor = 'text-secondary',
		frame = 'none',
		actions,
		children,
		class: className,
		...rest
	}: Props = $props();

	const iconScale: Record<Size, string> = {
		'h-xs': 'text-bs',
		'h-sm': 'text-lg',
		'h-md': 'text-xl',
		'h-bs': 'text-2xl',
		'h-lg': 'text-3xl',
		'h-xl': 'text-4xl',
		'h-2xl': 'text-4xl',
		'h-3xl': 'text-4xl'
	};

	const bodySize = $derived(textSize ?? 'text-sm');

	const frameClass = $derived(
		frame === 'bordered' ? 'border modern' : frame === 'dashed' ? 'border-dashed modern' : ''
	);
</script>

<div
	class={['box ta-c', alignContent, gap, pad, textSize, frameClass, className]}
	{...rest}
>
	{#if icon}
		<span class={['lh14', textColor, iconScale[size]]}>
			<Icon icon={icon} />
		</span>
	{/if}
	<div class={['box xcenter gap-xs', measure]}>
		{#if title}
			<p class="weight-600 lh14">{title}</p>
		{/if}
		{#if description}
			<p class={['lh15', bodySize, childTextColor]}>{description}</p>
		{/if}
		{#if children}
			<div class={['lh15', bodySize, childTextColor]}>{@render children()}</div>
		{/if}
	</div>
	{#if actions}
		<div class="row ycenter wrap gap-sm">{@render actions()}</div>
	{/if}
</div>
