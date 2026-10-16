<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Size } from '../../types';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		title: string;
		description?: string;
		size?: Size;
		class?: string;
		icon?: Snippet;
		action?: Snippet;
		children?: Snippet;
	}

	let {
		title,
		description,
		size = 'md',
		class: className = '',
		icon,
		action,
		children,
		...restProps
	}: Props = $props();
</script>

<div
	class="f-empty-state {className}"
	data-size={size}
	{...restProps}
>
	<div class="f-empty-icon" aria-hidden="true">
		{#if icon}
			{@render icon()}
		{:else}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="48"
				height="48"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
				<path d="m3.3 7 8.7 5 8.7-5" />
				<path d="M12 22V12" />
			</svg>
		{/if}
	</div>

	<h3 class="f-empty-title">{title}</h3>

	{#if description}
		<p class="f-empty-desc">{description}</p>
	{/if}

	{#if children}
		<div class="f-empty-body">
			{@render children()}
		</div>
	{/if}

	{#if action}
		<div class="f-empty-action">
			{@render action()}
		</div>
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-empty-state {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			text-align: center;
			box-sizing: border-box;
			font-family: inherit;
			margin: 0 auto;
		}

		.f-empty-icon {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			color: var(--f-text-subtle);
			background: var(--f-sunken);
			border: 1px dashed var(--f-border-strong);
			border-radius: var(--f-radius-full);
			box-sizing: border-box;
			margin-bottom: var(--f-space-md);
		}

		.f-empty-title {
			margin: 0;
			color: var(--f-text);
			font-weight: 600;
			line-height: 1.3;
		}

		.f-empty-desc {
			margin: var(--f-space-2xs) 0 0 0;
			color: var(--f-text-muted);
			line-height: 1.5;
			max-width: 420px;
		}

		.f-empty-body {
			margin-top: var(--f-space-sm);
		}

		.f-empty-action {
			margin-top: var(--f-space-lg);
			display: flex;
			align-items: center;
			gap: var(--f-space-sm);
		}

		/* Sizes */
		.f-empty-state[data-size='sm'] {
			padding: var(--f-space-lg);
		}
		.f-empty-state[data-size='sm'] .f-empty-icon {
			width: 48px;
			height: 48px;
		}
		.f-empty-state[data-size='sm'] .f-empty-icon :global(svg) {
			width: 24px;
			height: 24px;
		}
		.f-empty-state[data-size='sm'] .f-empty-title {
			font-size: var(--f-text-base);
		}
		.f-empty-state[data-size='sm'] .f-empty-desc {
			font-size: var(--f-text-xs);
		}

		.f-empty-state[data-size='md'] {
			padding: var(--f-space-2xl) var(--f-space-lg);
		}
		.f-empty-state[data-size='md'] .f-empty-icon {
			width: 64px;
			height: 64px;
		}
		.f-empty-state[data-size='md'] .f-empty-icon :global(svg) {
			width: 32px;
			height: 32px;
		}
		.f-empty-state[data-size='md'] .f-empty-title {
			font-size: var(--f-text-lg);
		}
		.f-empty-state[data-size='md'] .f-empty-desc {
			font-size: var(--f-text-sm);
		}

		.f-empty-state[data-size='lg'] {
			padding: var(--f-space-3xl) var(--f-space-xl);
		}
		.f-empty-state[data-size='lg'] .f-empty-icon {
			width: 80px;
			height: 80px;
		}
		.f-empty-state[data-size='lg'] .f-empty-icon :global(svg) {
			width: 40px;
			height: 40px;
		}
		.f-empty-state[data-size='lg'] .f-empty-title {
			font-size: var(--f-text-xl);
		}
		.f-empty-state[data-size='lg'] .f-empty-desc {
			font-size: var(--f-text-base);
		}
	}
</style>
