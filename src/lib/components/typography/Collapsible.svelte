<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		open?: boolean;
		disabled?: boolean;
		title?: string;
		class?: string;
		header?: Snippet<[{ isOpen: boolean; toggle: () => void }]>;
		children?: Snippet;
	}

	let {
		open = $bindable(false),
		disabled = false,
		title = '',
		class: className = '',
		header,
		children,
		...restProps
	}: Props = $props();

	function toggle() {
		if (!disabled) {
			open = !open;
		}
	}
</script>

<div
	class="f-collapsible {className}"
	data-open={open ? '' : undefined}
	data-disabled={disabled ? '' : undefined}
	{...restProps}
>
	{#if header}
		{@render header({ isOpen: open, toggle })}
	{:else}
		<button
			type="button"
			class="f-collapsible-trigger"
			aria-expanded={open}
			{disabled}
			onclick={toggle}
		>
			<span class="f-collapsible-title">{title}</span>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="f-collapsible-chevron"
				aria-hidden="true"
			>
				<polyline points="6 9 12 15 18 9" />
			</svg>
		</button>
	{/if}

	<div
		class="f-collapsible-content-wrapper"
		data-open={open ? '' : undefined}
	>
		<div class="f-collapsible-content-inner">
			{#if children}
				<div class="f-collapsible-body">
					{@render children()}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-collapsible {
			width: 100%;
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-md);
			background: var(--f-surface);
			overflow: hidden;
			box-sizing: border-box;
			font-family: inherit;
		}

		.f-collapsible-trigger {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: var(--f-space-md);
			padding: var(--f-space-sm) var(--f-space-md);
			background: transparent;
			border: none;
			font-family: inherit;
			font-size: var(--f-text-base);
			font-weight: 500;
			color: var(--f-text);
			text-align: left;
			cursor: pointer;
			user-select: none;
			transition: background var(--f-duration-fast) var(--f-ease);
		}

		.f-collapsible-trigger:hover:not(:disabled) {
			background: var(--f-hover);
		}

		.f-collapsible-trigger:focus-visible {
			outline: 2px solid var(--f-ring);
			outline-offset: -2px;
		}

		.f-collapsible-trigger:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}

		.f-collapsible-chevron {
			color: var(--f-text-muted);
			flex-shrink: 0;
			transition: transform var(--f-duration-normal) var(--f-ease),
				color var(--f-duration-fast) var(--f-ease);
		}

		.f-collapsible[data-open] .f-collapsible-chevron {
			transform: rotate(180deg);
			color: var(--f-primary);
		}

		.f-collapsible-content-wrapper {
			display: grid;
			grid-template-rows: 0fr;
			transition: grid-template-rows var(--f-duration-normal) var(--f-ease);
		}

		.f-collapsible-content-wrapper[data-open] {
			grid-template-rows: 1fr;
		}

		.f-collapsible-content-inner {
			overflow: hidden;
		}

		.f-collapsible-body {
			padding: var(--f-space-sm) var(--f-space-md) var(--f-space-md) var(--f-space-md);
			font-size: var(--f-text-sm);
			color: var(--f-text-muted);
			line-height: 1.6;
			border-top: 1px solid var(--f-border-subtle);
		}
	}
</style>
