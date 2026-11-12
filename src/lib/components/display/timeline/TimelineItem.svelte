<!-- @component One event on the rail: a marker, a title, and optional description, time and icon. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import type { IconData } from '@fractaldesign/icons';
	import { inView } from '../../../motion/index.js';
	import { toneText, type Tone } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLLIElement> {
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
		/** Extra content under the description. */
		children?: Snippet;
	}

	let { title, description, time, icon, tone, class: klass, children, ...rest }: Props = $props();

	const classes = $derived(['timeline-item', 'motion', 'reveal', klass]);
	const markerTone = $derived(tone ? toneText[tone] : 'text-muted');
</script>

<li class={classes} {@attach inView()} {...rest}>
	<div class="timeline-rail">
		{#if icon}
			<span class={['soft', 'round', 'pad-xs', 'text-sm', tone, markerTone]}>
				<Icon {icon} />
			</span>
		{:else}
			<span class={['dot', markerTone]}></span>
		{/if}
	</div>
	<div class="timeline-body box gap-xs">
		<div class="row ycenter xbetween wrap gap-sm">
			<span class="weight-500 text-primary">{title}</span>
			{#if time}
				<time class="text-sm text-muted tabular-nums">{time}</time>
			{/if}
		</div>
		{#if description}
			<p class="text-sm text-secondary">{description}</p>
		{/if}
		{@render children?.()}
	</div>
</li>
