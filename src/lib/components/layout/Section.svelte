<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { ContainerSize } from './Container.svelte';

	export type SectionSpacing = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
	export type SectionAlign = 'left' | 'center' | 'right';

	interface Props extends HTMLAttributes<HTMLElement> {
		/** Primary section heading */
		title?: string;
		/** Descriptive section subtitle */
		subtitle?: string;
		/** Small uppercase kicker tag above the title */
		eyebrow?: string;
		/** Constrain inner content with a centered container */
		contained?: boolean;
		/** Container width tier when contained */
		containerSize?: ContainerSize;
		/** Vertical padding spacing tier */
		spacing?: SectionSpacing;
		/** Text alignment of the section header */
		align?: SectionAlign;
		/** Additional CSS classes */
		class?: string;
		/** Action button or control slot next to the header */
		action?: Snippet;
		/** Custom full header replacement slot */
		header?: Snippet;
		/** Section content body */
		children?: Snippet;
	}

	let {
		title,
		subtitle,
		eyebrow,
		contained = true,
		containerSize = 'lg',
		spacing = 'xl',
		align = 'left',
		class: className = '',
		action,
		header,
		children,
		...restProps
	}: Props = $props();

	const hasHeader = $derived(Boolean(header || title || subtitle || eyebrow || action));
</script>

<section
	class="f-section {className}"
	data-spacing={spacing}
	data-align={align}
	{...restProps}
>
	<div
		class="f-section-wrapper"
		data-contained={contained ? 'true' : 'false'}
		data-container-size={containerSize}
	>
		{#if hasHeader}
			<div class="f-section-header">
				{#if header}
					{@render header()}
				{:else}
					<div class="f-section-headings">
						{#if eyebrow}
							<span class="f-section-eyebrow">{eyebrow}</span>
						{/if}
						{#if title}
							<h2 class="f-section-title">{title}</h2>
						{/if}
						{#if subtitle}
							<p class="f-section-subtitle">{subtitle}</p>
						{/if}
					</div>
					{#if action}
						<div class="f-section-action">
							{@render action()}
						</div>
					{/if}
				{/if}
			</div>
		{/if}

		{#if children}
			<div class="f-section-content">
				{@render children()}
			</div>
		{/if}
	</div>
</section>

<style>
	@layer fractalsvelte-ui.components {
		.f-section {
			position: relative;
			width: 100%;
			box-sizing: border-box;
		}

		/* Vertical spacing scale */
		.f-section[data-spacing='none'] {
			padding-block: 0;
		}
		.f-section[data-spacing='sm'] {
			padding-block: var(--f-space-sm);
		}
		.f-section[data-spacing='md'] {
			padding-block: var(--f-space-md);
		}
		.f-section[data-spacing='lg'] {
			padding-block: var(--f-space-lg);
		}
		.f-section[data-spacing='xl'] {
			padding-block: var(--f-space-2xl);
		}
		.f-section[data-spacing='2xl'] {
			padding-block: var(--f-space-3xl);
		}

		.f-section-wrapper {
			width: 100%;
			box-sizing: border-box;
			padding-inline: var(--f-space-lg);
		}

		.f-section-wrapper[data-contained='true'] {
			margin-inline: auto;
		}

		/* Container sizing */
		.f-section-wrapper[data-contained='true'][data-container-size='sm'] {
			max-width: 640px;
		}
		.f-section-wrapper[data-contained='true'][data-container-size='md'] {
			max-width: 768px;
		}
		.f-section-wrapper[data-contained='true'][data-container-size='lg'] {
			max-width: 1024px;
		}
		.f-section-wrapper[data-contained='true'][data-container-size='xl'] {
			max-width: 1280px;
		}
		.f-section-wrapper[data-contained='true'][data-container-size='fluid'] {
			max-width: 100%;
		}

		.f-section-header {
			display: flex;
			align-items: flex-end;
			justify-content: space-between;
			gap: var(--f-space-lg);
			margin-bottom: var(--f-space-xl);
			flex-wrap: wrap;
		}

		.f-section[data-align='center'] .f-section-header {
			flex-direction: column;
			align-items: center;
			text-align: center;
		}

		.f-section[data-align='right'] .f-section-header {
			align-items: flex-end;
			text-align: right;
		}

		.f-section-headings {
			display: flex;
			flex-direction: column;
			gap: var(--f-space-2xs);
			flex: 1;
			min-width: 240px;
		}

		.f-section-eyebrow {
			font-size: var(--f-text-xs);
			font-weight: 700;
			text-transform: uppercase;
			letter-spacing: 0.08em;
			color: var(--f-primary);
		}

		.f-section-title {
			margin: 0;
			font-size: var(--f-text-2xl);
			font-weight: 700;
			color: var(--f-text);
			line-height: 1.25;
		}

		.f-section-subtitle {
			margin: 0;
			font-size: var(--f-text-base);
			color: var(--f-text-muted);
			line-height: 1.5;
		}

		.f-section-action {
			display: inline-flex;
			align-items: center;
			gap: var(--f-space-sm);
			flex-shrink: 0;
		}

		.f-section-content {
			width: 100%;
		}
	}
</style>
