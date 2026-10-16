<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Intent } from '../../types';

	export interface TimelineItem {
		id?: string;
		title: string;
		time?: string;
		description?: string;
		intent?: Intent;
		active?: boolean;
	}

	interface Props extends HTMLAttributes<HTMLDivElement> {
		items?: TimelineItem[];
		align?: 'left' | 'alternate';
		class?: string;
		children?: Snippet;
	}

	let {
		items = [],
		align = 'left',
		class: className = '',
		children,
		...restProps
	}: Props = $props();
</script>

<div
	class="f-timeline {className}"
	data-align={align}
	{...restProps}
>
	{#if items.length > 0}
		<div class="f-timeline-track">
			{#each items as item, index}
				<div
					class="f-timeline-entry"
					data-intent={item.intent}
					data-active={item.active ? 'true' : undefined}
					data-side={align === 'alternate' ? (index % 2 === 0 ? 'left' : 'right') : 'right'}
				>
					<div class="f-timeline-marker">
						<span class="f-marker-dot"></span>
						{#if item.active}
							<span class="f-marker-pulse"></span>
						{/if}
					</div>

					<div class="f-timeline-card">
						<header class="f-card-header">
							<h4 class="f-entry-title">{item.title}</h4>
							{#if item.time}
								<time class="f-entry-time">{item.time}</time>
							{/if}
						</header>

						{#if item.description}
							<p class="f-entry-desc">{item.description}</p>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}

	{#if children}
		<div class="f-timeline-custom">
			{@render children()}
		</div>
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-timeline {
			position: relative;
			width: 100%;
			font-family: var(--f-font-sans);
			box-sizing: border-box;
		}

		.f-timeline-track {
			position: relative;
			display: flex;
			flex-direction: column;
			gap: var(--f-space-xl);
		}

		/* Spine line */
		.f-timeline[data-align='left'] .f-timeline-track::before {
			content: '';
			position: absolute;
			top: 0.5rem;
			bottom: 0.5rem;
			left: 0.75rem;
			width: 2px;
			background: var(--f-border);
			transform: translateX(-50%);
		}

		.f-timeline[data-align='alternate'] .f-timeline-track::before {
			content: '';
			position: absolute;
			top: 0.5rem;
			bottom: 0.5rem;
			left: 50%;
			width: 2px;
			background: var(--f-border);
			transform: translateX(-50%);
		}

		.f-timeline-entry {
			position: relative;
			display: flex;
			align-items: flex-start;
			gap: var(--f-space-lg);
		}

		.f-timeline[data-align='left'] .f-timeline-entry {
			padding-left: 2rem;
		}

		.f-timeline[data-align='alternate'] .f-timeline-entry[data-side='left'] {
			width: calc(50% - 1.5rem);
			align-self: flex-start;
			flex-direction: row-reverse;
			text-align: right;
		}

		.f-timeline[data-align='alternate'] .f-timeline-entry[data-side='right'] {
			width: calc(50% - 1.5rem);
			align-self: flex-end;
			margin-left: auto;
			text-align: left;
		}

		/* Marker */
		.f-timeline-marker {
			position: absolute;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 1rem;
			height: 1rem;
			border-radius: var(--f-radius-full);
			background: var(--f-surface);
			z-index: 2;
		}

		.f-timeline[data-align='left'] .f-timeline-marker {
			left: 0.75rem;
			top: 0.35rem;
			transform: translateX(-50%);
		}

		.f-timeline[data-align='alternate'] .f-timeline-entry[data-side='left'] .f-timeline-marker {
			right: -2rem;
			top: 0.35rem;
			transform: translateX(50%);
		}

		.f-timeline[data-align='alternate'] .f-timeline-entry[data-side='right'] .f-timeline-marker {
			left: -2rem;
			top: 0.35rem;
			transform: translateX(-50%);
		}

		.f-marker-dot {
			width: 0.625rem;
			height: 0.625rem;
			border-radius: var(--f-radius-full);
			background: var(--f-primary);
			transition: background-color var(--f-duration-fast) var(--f-ease);
		}

		.f-timeline-entry[data-intent='info'] .f-marker-dot {
			background: var(--f-info);
		}

		.f-timeline-entry[data-intent='success'] .f-marker-dot {
			background: var(--f-success);
		}

		.f-timeline-entry[data-intent='warning'] .f-marker-dot {
			background: var(--f-warning);
		}

		.f-timeline-entry[data-intent='danger'] .f-marker-dot {
			background: var(--f-danger);
		}

		.f-marker-pulse {
			position: absolute;
			inset: -3px;
			border-radius: var(--f-radius-full);
			background: var(--f-primary);
			opacity: 0.4;
			animation: f-marker-ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite;
		}

		@keyframes f-marker-ping {
			75%, 100% {
				transform: scale(2.2);
				opacity: 0;
			}
		}

		/* Card */
		.f-timeline-card {
			flex: 1 1 auto;
			display: flex;
			flex-direction: column;
			gap: 0.25rem;
			background: var(--f-surface);
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-md);
			padding: var(--f-space-md) var(--f-space-lg);
			box-shadow: var(--f-shadow-xs);
		}

		.f-card-header {
			display: flex;
			align-items: baseline;
			justify-content: space-between;
			gap: var(--f-space-sm);
		}

		.f-entry-title {
			margin: 0;
			font-size: var(--f-text-sm);
			font-weight: 600;
			color: var(--f-text);
		}

		.f-entry-time {
			font-size: var(--f-text-xs);
			color: var(--f-text-muted);
			white-space: nowrap;
		}

		.f-entry-desc {
			margin: 0;
			font-size: var(--f-text-sm);
			color: var(--f-text-muted);
			line-height: 1.5;
		}

		.f-timeline-custom {
			margin-top: var(--f-space-lg);
		}
	}
</style>
