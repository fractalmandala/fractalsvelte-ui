<!-- @component A compact status dot indicator with optional pulsing animation and status variants. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Variant, Message, TextSize } from '$lib/types.js';

	export type DotSize = 'sm' | 'md' | 'lg';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		variant?: Variant | Message;
		size?: DotSize;
		/** Whether the dot pulsates with an animated outer ping ring */
		animated?: boolean;
		textsize?: TextSize;
		class?: string;
	}

	let {
		variant = 'primary',
		size = 'md',
		animated = false,
		textsize = 'text-md',
		class: className = '',
		...restProps
	}: Props = $props();

	const sizeClasses: Record<DotSize, string> = {
		sm: 'w-[6px] h-[6px]',
		md: 'w-[8px] h-[8px]',
		lg: 'w-[12px] h-[12px]'
	};
</script>

<span
	class="dot-indicator relative inline-flex shrink-0 items-center justify-center {textsize} {className}"
	aria-hidden="true"
	{...restProps}
>
	{#if animated}
		<span
			class="absolute inset-0 rounded-full animate-ping opacity-75 {variant}"
			style="animation-duration: 1.5s;"
		></span>
	{/if}
	<span
		class="relative rounded-full aspect-square {sizeClasses[size]} {variant}"
		style="display: inline-block; border-radius: 9999px;"
	></span>
</span>

<style>
	.dot-indicator .primary {
		background-color: var(--bg-button);
	}
	.dot-indicator .secondary {
		background-color: var(--bg-button-secondary);
	}
	.dot-indicator .themed {
		background-color: var(--theme-color);
	}
	.dot-indicator .outline {
		background-color: transparent;
		box-shadow: inset 0 0 0 1.5px currentColor;
	}
	.dot-indicator .ghost {
		background-color: var(--text-muted);
	}
	.dot-indicator .link {
		background-color: var(--info);
	}
	.dot-indicator .success {
		background-color: var(--success);
	}
	.dot-indicator .warning {
		background-color: var(--warning);
	}
	.dot-indicator .danger {
		background-color: var(--danger);
	}
	.dot-indicator .info {
		background-color: var(--info);
	}
</style>
