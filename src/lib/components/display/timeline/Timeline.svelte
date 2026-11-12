<!-- @component A vertical list of events on a rail, with staggered spring reveals. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { IconData } from '@fractaldesign/icons';
	import { stagger } from '../../../motion/index.js';
	import type { Tone } from '../../../internal/tokens.js';

	import TimelineItem from './TimelineItem.svelte';

	type TimelineAlign = 'left' | 'alternate';

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
		/** `left` keeps every body to the right of the rail; `alternate` swings them to both sides. */
		align?: TimelineAlign;
		/** Custom items, used when `items` is omitted. */
		children?: Snippet;
	}

	let { items, align = 'left', class: klass, children, ...rest }: Props = $props();

	const classes = $derived(['timeline', align === 'alternate' && 'alternate', klass]);
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
