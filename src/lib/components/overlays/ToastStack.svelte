<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import Toast from './Toast.svelte';
	import type { Intent } from '../../types';

	export interface ToastItem {
		id: string;
		title?: string;
		message?: string;
		intent?: Intent;
		duration?: number;
	}

	interface Props extends HTMLAttributes<HTMLDivElement> {
		position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'top-center' | 'bottom-center';
		toasts?: ToastItem[];
		class?: string;
		ondismiss?: (id: string) => void;
		children?: Snippet;
	}

	let {
		position = 'bottom-right',
		toasts = $bindable([]),
		class: className = '',
		ondismiss,
		children,
		...restProps
	}: Props = $props();

	function handleRemove(id: string) {
		toasts = toasts.filter((t) => t.id !== id);
		ondismiss?.(id);
	}
</script>

<div
	class="f-toast-stack {className}"
	data-position={position}
	aria-live="assertive"
	{...restProps}
>
	{#each toasts as t (t.id)}
		<Toast
			id={t.id}
			title={t.title}
			message={t.message}
			intent={t.intent}
			duration={t.duration}
			onclose={() => handleRemove(t.id)}
		/>
	{/each}

	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-toast-stack {
			position: fixed;
			z-index: var(--f-z-toast, 1600);
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			pointer-events: none;
			box-sizing: border-box;
			padding: 1.25rem;
			max-width: 420px;
			width: 100%;
		}

		.f-toast-stack > :global(*) {
			pointer-events: auto;
		}

		.f-toast-stack[data-position='bottom-right'] {
			bottom: 0;
			right: 0;
			align-items: flex-end;
		}

		.f-toast-stack[data-position='bottom-left'] {
			bottom: 0;
			left: 0;
			align-items: flex-start;
		}

		.f-toast-stack[data-position='top-right'] {
			top: 0;
			right: 0;
			align-items: flex-end;
		}

		.f-toast-stack[data-position='top-left'] {
			top: 0;
			left: 0;
			align-items: flex-start;
		}

		.f-toast-stack[data-position='top-center'] {
			top: 0;
			left: 50%;
			transform: translateX(-50%);
			align-items: center;
		}

		.f-toast-stack[data-position='bottom-center'] {
			bottom: 0;
			left: 50%;
			transform: translateX(-50%);
			align-items: center;
		}
	}
</style>
