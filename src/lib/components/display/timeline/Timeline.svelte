<!-- @component A vertical list of events on a rail, with staggered spring reveals. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { IconData } from '@fractaldesign/icons';
	import { stagger } from '../../../motion/index.js';
	import type { Tone } from '../../../internal/tokens.js';

	import TimelineItem from './TimelineItem.svelte';

	interface TimelineEvent {
		/** The heading for this event. */
		title: string;
		/** Optional supporting copy. */
		description?: string;
		/** When the event happened, shown as a quiet timestamp. */
		time?: string;
		/** An icon drawn in the rail instead of the default dot. */
		icon?: IconData;
		/** Colour of the rail marker. */
		tone?: Tone;
	}

	interface Props extends HTMLAttributes<HTMLOListElement> {
		/** The events to render. When omitted, `children` (usually `TimelineItem`s) are used. */
		items?: TimelineEvent[];
		/** Which side of the rail the bodies sit on. */
		align?: 'left' | 'right';
		/** Swings the bodies to both sides of the rail, alternating item by item. */
		alternate?: boolean;
		/** Custom items, used when `items` is omitted. */
		children?: Snippet;
	}

	let { items, align = 'left', alternate = false, class: className, children, ...rest }: Props = $props();

	const classes = $derived(['timeline', align === 'right' && 'right', alternate && 'alternate', className]);
</script>

<ol class={classes} {@attach stagger({ step: 70 })} {...rest}>
	{#if items}
		{#each items as event, i (event.title + String(i))}
			<TimelineItem
				title={event.title}
				description={event.description}
				time={event.time}
				icon={event.icon}
				tone={event.tone}
			/>
		{/each}
	{:else}
		{@render children?.()}
	{/if}
</ol>
