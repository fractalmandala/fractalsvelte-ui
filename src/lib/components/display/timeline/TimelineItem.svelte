<!-- @component One event on the rail: a marker, a title, and optional description, time and icon. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import type {  IconData  } from '@fractaldesign/icons';
	import { inView } from '../../../motion/index.js';
	import { type ChildTextColor, type Pad, type Shape, type TextColor, type TextSize, type Tone } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLLIElement> {
		title: string;
		description?: string;
		time?: string;
		icon?: IconData;
		tone?: Tone;
		textSize?: TextSize;
		textColor?: TextColor;
		childTextColor?: ChildTextColor;
		shape?: Shape;
		children?: Snippet;
	}

	let {
		title,
		description,
		time,
		icon,
		tone,
		textSize = 'text-sm',
		textColor = 'text-secondary',
		childTextColor = 'text-muted',
		shape = 'round',
		class: className,
		children,
		...rest
	}: Props = $props();

	const classes = $derived(['timeline-item', 'motion', 'reveal', className]);
	const markerTone = $derived(tone ? `text-${`tone`}` : 'text-muted');
</script>

<li class={classes} {@attach inView()} {...rest}>
	<div class="timeline-rail">
		{#if icon}
			<span class={['state-selected', shape, 'pad-xs', textSize, tone, markerTone]}>
				<Icon {icon} />
			</span>
		{:else}
			<span class={['dot', markerTone]}></span>
		{/if}
	</div>
	<div class="timeline-body box gap-xs">
		<div class="row ycenter xbetween wrap gap-sm">
			<span class="weight-500">{title}</span>
			{#if time}
				<time class={['tabular-nums', textSize, childTextColor]}>{time}</time>
			{/if}
		</div>
		{#if description}
			<p class={[textSize, textColor]}>{description}</p>
		{/if}
		{@render children?.()}
	</div>
</li>
