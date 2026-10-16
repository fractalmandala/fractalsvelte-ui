<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLElement> {
		badge?: string;
		title: string;
		description?: string;
		align?: 'center' | 'left';
		/** Use the oversized .hero-name display type for the title */
		display?: boolean;
		class?: string;
		badgeSnippet?: Snippet;
		actions?: Snippet;
		visual?: Snippet;
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
		children,
		...restProps
	}: Props = $props();

	const centered = $derived(align === 'center');
</script>

<section class="py-3xl {className}" {...restProps}>
	<div class="{visual && !centered ? 'grid-2 ycenter' : 'box'} gap-2xl">
		<div class="box gap-md {centered ? 'xcenter' : 'xleft'}">
			{#if badgeSnippet}
				{@render badgeSnippet()}
			{:else if badge}
				<span class="chip bg-raised text-theme border-subtle">{badge}</span>
			{/if}
			<h1 class={display ? 'hero-name lh11' : 'page-title'}>{title}</h1>
			{#if description}<p class="page-desc text-secondary">{description}</p>{/if}
			{#if actions}<div class="row ycenter gap-sm wrap {centered ? 'xcenter' : ''}">{@render actions()}</div>{/if}
			{#if children}<div class="box gap-sm">{@render children()}</div>{/if}
		</div>
		{#if visual}
			<div class="card box shadow-xl" data-variant="primary" data-shape="curved" data-pad="sm">
				{@render visual()}
			</div>
		{/if}
	</div>
</section>
