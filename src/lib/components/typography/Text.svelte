<!-- @component Polymorphic typography primitive supporting semantic tags, tone colors, weights, and truncation. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { TextSize, Weight } from '$lib/types.js';

	type TextTone =
		| 'default'
		| 'secondary'
		| 'muted'
		| 'themed'
		| 'info'
		| 'success'
		| 'warning'
		| 'danger';

	interface Props extends HTMLAttributes<HTMLElement> {
		/** HTML tag to render. Defaults to 'p'. */
		as?: 'p' | 'span' | 'div' | 'small' | 'strong' | 'em' | 'label';
		/** Semantic text tone color. */
		tone?: TextTone;
		textsize?: TextSize;
		weight?: Weight;
		/** Monospace code font family. */
		mono?: boolean;
		/** Single-line text truncation with ellipsis. */
		truncate?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		as = 'p',
		tone = 'default',
		textsize = 'text-md',
		weight,
		mono = false,
		truncate = false,
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	const toneMap: Record<TextTone, string> = {
		default: 'text-primary',
		secondary: 'text-secondary',
		muted: 'text-muted',
		themed: 'text-theme',
		info: 'text-info',
		success: 'text-success',
		warning: 'text-warning',
		danger: 'text-danger'
	};
</script>

<svelte:element
	this={as}
	class="text-element {toneMap[tone]} {textsize} {weight ?? ''} {mono ? 'font-mono' : ''} {truncate ? 'truncate' : ''} {className}"
	{...restProps}
>
	{@render children?.()}
</svelte:element>

<style>
	.text-element {
		margin: 0;
		line-height: 1.6;
	}

	.font-mono {
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
	}

	.truncate {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
