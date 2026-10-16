<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from 'fractalicons';
	import { luCheck } from 'fractalicons/lucide';
	import Button from '../actions/Button.svelte';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		tier: string;
		price: string | number;
		interval?: string;
		description?: string;
		features: string[];
		ctaText?: string;
		ctaHref?: string;
		/** Highlights the plan: stronger card paint, a badge and a primary CTA */
		popular?: boolean;
		popularLabel?: string;
		disabled?: boolean;
		class?: string;
		header?: Snippet;
		cta?: Snippet;
		children?: Snippet;
	}

	let {
		tier,
		price,
		interval = '/month',
		description,
		features = [],
		ctaText = 'Get started',
		ctaHref,
		popular = false,
		popularLabel = 'Most popular',
		disabled = false,
		class: className = '',
		header,
		cta,
		children,
		...restProps
	}: Props = $props();
</script>

<!-- .card pushes its <footer> to the bottom, so CTAs line up across a row of plans. -->
<div
	class="card box gap-lg {popular ? 'shadow-xl' : ''} {disabled ? 'text-muted' : ''} {className}"
	data-variant={popular ? 'secondary' : 'primary'}
	data-shape="curved"
	data-pad="lg"
	{...restProps}
>
	{#if header}
		{@render header()}
	{:else}
		<div class="box gap-sm">
			<div class="row ycenter xbetween gap-sm">
				<h3 class="card-title">{tier}</h3>
				{#if popular}<span class="chip bg-raised text-theme border-subtle">{popularLabel}</span>{/if}
			</div>
			{#if description}<p class="text-body-sm text-secondary">{description}</p>{/if}
			<div class="row ybot gap-xs">
				<span class="text-4xl weight-700 lh11 ls-tight-xl">{price}</span>
				{#if interval}<span class="text-sm text-muted pb-xs">{interval}</span>{/if}
			</div>
		</div>
	{/if}
	<div role="list" class="box gap-sm">
		{#each features as feature (feature)}
			<div role="listitem" class="row ytop gap-sm text-sm">
				<Icon icon={luCheck} class="text-success shrink-0" />
				<span>{feature}</span>
			</div>
		{/each}
	</div>
	{@render children?.()}
	<footer class="box">
		{#if cta}
			{@render cta()}
		{:else}
			<Button href={ctaHref} variant={popular ? 'primary' : 'outline'} size="lg" class="wfull" {disabled}>{ctaText}</Button>
		{/if}
	</footer>
</div>
