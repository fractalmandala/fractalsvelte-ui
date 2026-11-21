<!-- @component A vertical list of events on a rail, with staggered spring reveals. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import type {  IconData  } from '@fractaldesign/icons';
	import { stagger } from '../../../motion/index.js';
	import type {  Tone, TextAlign  } from '../../../internal/tokens.js';

	import TimelineItem from './TimelineItem.svelte';

	interface TimelineEvent {
		title: string;
		description?: string;
		time?: string;
		icon?: IconData;
		tone?: Tone;
	}

	interface Props extends HTMLAttributes<HTMLOListElement> {
		items?: TimelineEvent[];
		align?: TextAlign;
		alternate?: boolean;
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
