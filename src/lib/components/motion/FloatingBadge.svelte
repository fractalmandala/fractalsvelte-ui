<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Variant, Size } from '../../types';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		variant?: Variant;
		size?: Size;
		duration?: number;
		amplitude?: number;
		dot?: boolean;
		pulse?: boolean;
		class?: string;
		children?: Snippet;
		leading?: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		duration = 3,
		amplitude = 4,
		dot = true,
		pulse = true,
		class: className = '',
		children,
		leading,
		...restProps
	}: Props = $props();
</script>

<span
	class="f-floating-badge {className}"
	data-variant={variant}
	data-size={size}
	style="--float-duration: {duration}s; --float-amplitude: {amplitude}px;"
	{...restProps}
>
	{#if dot}
		<span class="f-badge-dot" data-pulse={pulse ? 'true' : undefined} aria-hidden="true">
			{#if pulse}
				<span class="f-badge-dot-ping"></span>
			{/if}
			<span class="f-badge-dot-core"></span>
		</span>
	{/if}

	{#if leading}
		<span class="f-badge-leading">{@render leading()}</span>
	{/if}

	{#if children}
		<span class="f-badge-content">{@render children()}</span>
	{/if}
</span>

<style>
	@layer fractalsvelte-ui.components {
		.f-floating-badge {
			position: relative;
			display: inline-flex;
			align-items: center;
			gap: var(--f-space-xs);
			font-family: var(--f-font-sans);
			font-weight: 500;
			line-height: 1;
			white-space: nowrap;
			border-radius: var(--f-radius-full);
			border: 1px solid transparent;
			box-sizing: border-box;
			animation: f-float-anim var(--float-duration) ease-in-out infinite alternate;
			box-shadow: var(--f-shadow-sm);
		}

		/* Sizes */
		.f-floating-badge[data-size='xs'] {
			padding: 0.2rem 0.5rem;
			font-size: var(--f-text-xs);
		}

		.f-floating-badge[data-size='sm'] {
			padding: 0.25rem 0.625rem;
			font-size: var(--f-text-xs);
		}

		.f-floating-badge[data-size='md'] {
			padding: 0.375rem 0.875rem;
			font-size: var(--f-text-sm);
		}

		.f-floating-badge[data-size='lg'] {
			padding: 0.5rem 1rem;
			font-size: var(--f-text-base);
		}

		.f-floating-badge[data-size='xl'] {
			padding: 0.625rem 1.25rem;
			font-size: var(--f-text-lg);
		}

		/* Variants */
		.f-floating-badge[data-variant='primary'] {
			background: var(--f-primary-subtle);
			color: var(--f-primary);
			border-color: rgba(16, 185, 129, 0.3);
		}

		.f-floating-badge[data-variant='secondary'] {
			background: var(--f-panel);
			color: var(--f-text);
			border-color: var(--f-border);
		}

		.f-floating-badge[data-variant='soft'] {
			background: var(--f-hover);
			color: var(--f-text);
			border-color: transparent;
		}

		.f-floating-badge[data-variant='outline'] {
			background: transparent;
			color: var(--f-text);
			border-color: var(--f-border-strong);
		}

		.f-floating-badge[data-variant='ghost'] {
			background: transparent;
			color: var(--f-text-muted);
			border-color: transparent;
			box-shadow: none;
		}

		.f-floating-badge[data-variant='destructive'] {
			background: var(--f-danger-bg);
			color: var(--f-danger);
			border-color: rgba(239, 68, 68, 0.3);
		}

		.f-floating-badge[data-variant='surface'] {
			background: var(--f-surface);
			color: var(--f-text);
			border-color: var(--f-border);
		}

		/* Float Keyframe */
		@keyframes f-float-anim {
			0% {
				transform: translateY(0);
			}
			100% {
				transform: translateY(calc(-1 * var(--float-amplitude)));
			}
		}

		/* Dot */
		.f-badge-dot {
			position: relative;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 0.5rem;
			height: 0.5rem;
		}

		.f-badge-dot-core {
			position: relative;
			width: 100%;
			height: 100%;
			border-radius: var(--f-radius-full);
			background: currentColor;
		}

		.f-badge-dot-ping {
			position: absolute;
			inset: -2px;
			border-radius: var(--f-radius-full);
			background: currentColor;
			opacity: 0.6;
			animation: f-ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite;
		}

		@keyframes f-ping {
			75%, 100% {
				transform: scale(2.4);
				opacity: 0;
			}
		}

		.f-badge-leading,
		.f-badge-content {
			display: inline-flex;
			align-items: center;
		}
	}
</style>
