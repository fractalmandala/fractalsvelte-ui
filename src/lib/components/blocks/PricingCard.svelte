<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Variant } from '../../types';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		tier: string;
		price: string | number;
		interval?: string;
		description?: string;
		features: string[];
		ctaText?: string;
		ctaHref?: string;
		popular?: boolean;
		popularLabel?: string;
		variant?: Variant;
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
		ctaText = 'Get Started',
		ctaHref,
		popular = false,
		popularLabel = 'Most Popular',
		variant = 'surface',
		disabled = false,
		class: className = '',
		header,
		cta,
		children,
		...restProps
	}: Props = $props();
</script>

<div
	class="f-pricing-card {className}"
	data-variant={variant}
	data-popular={popular ? 'true' : undefined}
	data-disabled={disabled ? 'true' : undefined}
	{...restProps}
>
	{#if popular}
		<div class="f-popular-badge">
			{popularLabel}
		</div>
	{/if}

	{#if header}
		<div class="f-pricing-header-slot">
			{@render header()}
		</div>
	{:else}
		<div class="f-pricing-header">
			<h3 class="f-tier-name">{tier}</h3>
			{#if description}
				<p class="f-tier-desc">{description}</p>
			{/if}
			<div class="f-price-row">
				<span class="f-price-val">{price}</span>
				{#if interval}
					<span class="f-price-interval">{interval}</span>
				{/if}
			</div>
		</div>
	{/if}

	<div class="f-pricing-features">
		<ul class="f-features-list">
			{#each features as feature}
				<li class="f-feature-item">
					<svg class="f-check-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
						<path
							fill-rule="evenodd"
							d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
							clip-rule="evenodd"
						/>
					</svg>
					<span class="f-feature-text">{feature}</span>
				</li>
			{/each}
		</ul>
	</div>

	{#if children}
		<div class="f-pricing-extra">
			{@render children()}
		</div>
	{/if}

	<div class="f-pricing-cta">
		{#if cta}
			{@render cta()}
		{:else if ctaHref}
			<a
				href={ctaHref}
				class="f-cta-btn"
				data-variant={popular ? 'primary' : 'outline'}
			>
				{ctaText}
			</a>
		{:else}
			<button
				type="button"
				class="f-cta-btn"
				data-variant={popular ? 'primary' : 'outline'}
				{disabled}
			>
				{ctaText}
			</button>
		{/if}
	</div>
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-pricing-card {
			position: relative;
			display: flex;
			flex-direction: column;
			padding: var(--f-space-2xl) var(--f-space-xl);
			border-radius: var(--f-radius-xl);
			background: var(--f-surface);
			border: 1px solid var(--f-border);
			box-shadow: var(--f-shadow-sm);
			font-family: var(--f-font-sans);
			transition:
				transform var(--f-duration-normal) var(--f-ease-spring),
				box-shadow var(--f-duration-normal) var(--f-ease),
				border-color var(--f-duration-normal) var(--f-ease);
		}

		.f-pricing-card:hover {
			transform: translateY(-4px);
			box-shadow: var(--f-shadow-xl);
			border-color: var(--f-border-strong);
		}

		.f-pricing-card[data-popular='true'] {
			border-color: var(--f-primary);
			box-shadow: var(--f-shadow-lg), 0 0 20px var(--f-primary-subtle);
		}

		.f-pricing-card[data-disabled='true'] {
			opacity: 0.6;
			pointer-events: none;
		}

		.f-popular-badge {
			position: absolute;
			top: -0.75rem;
			left: 50%;
			transform: translateX(-50%);
			background: var(--f-primary);
			color: var(--f-primary-text);
			padding: 0.25rem 0.85rem;
			border-radius: var(--f-radius-full);
			font-size: var(--f-text-xs);
			font-weight: 600;
			letter-spacing: 0.03em;
			box-shadow: var(--f-shadow-sm);
		}

		.f-pricing-header {
			margin-bottom: var(--f-space-xl);
		}

		.f-tier-name {
			margin: 0 0 var(--f-space-xs) 0;
			font-size: var(--f-text-lg);
			font-weight: 700;
			color: var(--f-text);
		}

		.f-tier-desc {
			margin: 0 0 var(--f-space-md) 0;
			font-size: var(--f-text-sm);
			color: var(--f-text-muted);
			line-height: 1.4;
		}

		.f-price-row {
			display: flex;
			align-items: baseline;
			gap: 0.25rem;
		}

		.f-price-val {
			font-size: var(--f-text-3xl);
			font-weight: 800;
			letter-spacing: -0.02em;
			color: var(--f-text);
		}

		.f-price-interval {
			font-size: var(--f-text-sm);
			color: var(--f-text-muted);
		}

		.f-pricing-features {
			flex: 1 1 auto;
			margin-bottom: var(--f-space-2xl);
		}

		.f-features-list {
			list-style: none;
			margin: 0;
			padding: 0;
			display: flex;
			flex-direction: column;
			gap: var(--f-space-sm);
		}

		.f-feature-item {
			display: flex;
			align-items: center;
			gap: var(--f-space-sm);
			font-size: var(--f-text-sm);
			color: var(--f-text);
		}

		.f-check-icon {
			width: 1.125rem;
			height: 1.125rem;
			color: var(--f-primary);
			flex-shrink: 0;
		}

		.f-pricing-extra {
			margin-bottom: var(--f-space-lg);
		}

		.f-pricing-cta {
			margin-top: auto;
		}

		.f-cta-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			padding: var(--f-space-sm) var(--f-space-lg);
			border-radius: var(--f-radius-md);
			font-family: inherit;
			font-size: var(--f-text-sm);
			font-weight: 600;
			text-decoration: none;
			cursor: pointer;
			border: 1px solid transparent;
			box-sizing: border-box;
			transition: all var(--f-duration-fast) var(--f-ease);
		}

		.f-cta-btn[data-variant='primary'] {
			background: var(--f-primary);
			color: var(--f-primary-text);
		}

		.f-cta-btn[data-variant='primary']:hover {
			background: var(--f-primary-hover);
			box-shadow: var(--f-shadow-md), var(--f-shadow-glow);
		}

		.f-cta-btn[data-variant='outline'] {
			background: transparent;
			color: var(--f-text);
			border-color: var(--f-border-strong);
		}

		.f-cta-btn[data-variant='outline']:hover {
			background: var(--f-hover);
			border-color: var(--f-primary);
			color: var(--f-primary);
		}
	}
</style>
