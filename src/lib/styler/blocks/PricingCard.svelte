<!-- @component A pricing plan card with price, features and a call to action. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Size, Shape, Surface, Border, Shadow, Pad } from '../types';
	import { Icon } from '@fractaldesign/icons';
	import { luCheck } from '@fractaldesign/icons/lucide';
	import Card from '../layout/Card.svelte';
	import Button from '../actions/Button.svelte';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
		tier: string;
		price: string | number;
		interval?: string;
		description?: string;
		features: string[];
		ctaText?: string;
		ctaHref?: string;
		/** Highlights the plan with a badge and a primary CTA */
		popular?: boolean;
		popularLabel?: string;
		disabled?: boolean;
		size?: Size;
		/** Card corners; cards take no pill shape. */
		shape?: Exclude<Shape, 'round'>;
		surface?: Surface;
		border?: Border;
		shadow?: Shadow;
		padding?: Pad;
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
		size = 'h-md',
		shape = 'curved',
		surface = 'bg-panel',
		border = 'border',
		shadow = 'shad-none',
		padding = 'pad-lg',
		class: className = '',
		header: customHeader,
		cta,
		children,
		...restProps
	}: Props = $props();
</script>

<Card {size} {shape} {surface} {border} {shadow} {padding} class="{disabled ? 'text-muted' : ''} {className}" {...restProps}>
	{#snippet header()}
		{#if customHeader}
			{@render customHeader()}
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
	{/snippet}
	<div role="list" class="box gap-sm">
		{#each features as feature (feature)}
			<div role="listitem" class="row ytop gap-sm text-sm">
				<Icon icon={luCheck} class="text-success shrink-0" />
				<span>{feature}</span>
			</div>
		{/each}
	</div>
	{@render children?.()}
	{#snippet footer()}
		{#if cta}
			{@render cta()}
		{:else}
			<Button href={ctaHref} variant={popular ? 'primary' : 'outline'} size="h-lg" class="wfull" {disabled}>{ctaText}</Button>
		{/if}
	{/snippet}
</Card>
