<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLElement> {
		badge?: string;
		title: string;
		description?: string;
		align?: 'center' | 'left';
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
		class: className = '',
		badgeSnippet,
		actions,
		visual,
		children,
		...restProps
	}: Props = $props();
</script>

<section
	class="f-hero-block {className}"
	data-align={align}
	{...restProps}
>
	<div class="f-hero-container">
		<div class="f-hero-content">
			{#if badgeSnippet}
				<div class="f-hero-badge-wrap">
					{@render badgeSnippet()}
				</div>
			{:else if badge}
				<div class="f-hero-badge-wrap">
					<span class="f-hero-badge">{badge}</span>
				</div>
			{/if}

			<h1 class="f-hero-title">{title}</h1>

			{#if description}
				<p class="f-hero-description">{description}</p>
			{/if}

			{#if actions}
				<div class="f-hero-actions">
					{@render actions()}
				</div>
			{/if}

			{#if children}
				<div class="f-hero-extra">
					{@render children()}
				</div>
			{/if}
		</div>

		{#if visual}
			<div class="f-hero-visual">
				<div class="f-hero-visual-glow" aria-hidden="true"></div>
				<div class="f-hero-visual-inner">
					{@render visual()}
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	@layer fractalsvelte-ui.components {
		.f-hero-block {
			position: relative;
			width: 100%;
			padding: var(--f-space-3xl) var(--f-space-xl);
			box-sizing: border-box;
			overflow: hidden;
			font-family: var(--f-font-sans);
		}

		.f-hero-container {
			max-width: 72rem;
			margin: 0 auto;
			display: flex;
			flex-direction: column;
			gap: var(--f-space-2xl);
		}

		.f-hero-block[data-align='center'] .f-hero-content {
			text-align: center;
			align-items: center;
			margin: 0 auto;
			max-width: 48rem;
		}

		.f-hero-block[data-align='center'] .f-hero-actions {
			justify-content: center;
		}

		.f-hero-block[data-align='left'] .f-hero-content {
			text-align: left;
			align-items: flex-start;
			max-width: 44rem;
		}

		.f-hero-content {
			display: flex;
			flex-direction: column;
			gap: var(--f-space-lg);
		}

		.f-hero-badge-wrap {
			display: inline-flex;
		}

		.f-hero-badge {
			display: inline-flex;
			align-items: center;
			padding: 0.35rem 0.85rem;
			border-radius: var(--f-radius-full);
			font-size: var(--f-text-xs);
			font-weight: 600;
			background: var(--f-primary-subtle);
			color: var(--f-primary);
			border: 1px solid rgba(16, 185, 129, 0.25);
		}

		.f-hero-title {
			margin: 0;
			font-size: clamp(2rem, 5vw, 3.5rem);
			font-weight: 800;
			line-height: 1.1;
			letter-spacing: -0.03em;
			color: var(--f-text);
		}

		.f-hero-description {
			margin: 0;
			font-size: clamp(1rem, 2vw, 1.25rem);
			line-height: 1.6;
			color: var(--f-text-muted);
			max-width: 42rem;
		}

		.f-hero-actions {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			gap: var(--f-space-md);
			margin-top: var(--f-space-sm);
		}

		.f-hero-extra {
			margin-top: var(--f-space-md);
		}

		.f-hero-visual {
			position: relative;
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.f-hero-visual-glow {
			position: absolute;
			width: 70%;
			height: 70%;
			border-radius: var(--f-radius-full);
			background: radial-gradient(circle, var(--f-primary-subtle) 0%, transparent 70%);
			filter: blur(40px);
			pointer-events: none;
			z-index: 0;
		}

		.f-hero-visual-inner {
			position: relative;
			z-index: 1;
			width: 100%;
		}
	}
</style>
