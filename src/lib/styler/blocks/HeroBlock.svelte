<!-- @component A page hero with badge, title, description, actions and visual. -->

<script lang="ts">
	import type { Snippet, ComponentProps } from 'svelte';
	import Card from '../layout/Card.svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLElement> {
		badge?: string;
		title: string;
		description?: string;
		/** mleft is centred on desktop and left-aligned on small screens. */
		align?: 'center' | 'left' | 'mleft';
		/** Use the oversized .hero-name display type for the title */
		display?: boolean;
		class?: string;
		badgeSnippet?: Snippet;
		actions?: Snippet;
		visual?: Snippet;
		/** Wrap children in a Card */
		card?: boolean;
		/** Props for that Card (surface, border, shape, padding, shadow...) */
		cardProps?: Omit<ComponentProps<typeof Card>, 'children'>;
		children?: Snippet;
	}

	let {
		badge,
		title,
		description,
		align = 'center',
		display = false,
		class: className = '',
		badgeSnippet,
		actions,
		visual,
		card = false,
		cardProps = {},
		children,
		...restProps
	}: Props = $props();

	// mleft: centred on desktop, left-aligned at ≤1024px (fractalstyler's .ta-c.mleft).
	const centered = $derived(align !== 'left');
</script>

<section class="py-3xl wfull {className}" {...restProps}>
	<div class="{visual && !centered ? 'grid-2 ycenter' : 'box'} gap-2xl">
		<div class="box gap-md {centered ? 'xcenter ta-c' : 'xleft ta-l'} {align === 'mleft' ? 'mleft' : ''}">
			{#if badgeSnippet}
				{@render badgeSnippet()}
			{:else if badge}
				<span class="badge el-vss scale-text">{badge}</span>
			{/if}
			<h1 class={display ? 'hero-title' : 'scale-text'}>{title}</h1>
			{#if description}<p class="page-desc text-secondary">{description}</p>{/if}
			{#if actions}<div class="row ycenter gap-bs wrap {centered ? 'xcenter' : ''}">{@render actions()}</div>{/if}
			{#if children}
				{#if card}<Card {...cardProps}>{@render children()}</Card>{:else}<div class="box gap-bs">{@render children()}</div>{/if}
			{/if}
		</div>
		{#if visual}
			<div class="el-shadow el-vss">
				{@render visual()}
			</div>
		{/if}
	</div>
</section>
