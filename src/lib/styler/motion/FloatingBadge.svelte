<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { FsTone } from '../types';
	import { TONE_TEXT } from '../classes';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		tone?: FsTone;
		/** Status dot */
		dot?: boolean;
		/** Radar ping around the dot */
		pulse?: boolean;
		/** Seconds per ping */
		duration?: number;
		class?: string;
		children?: Snippet;
		leading?: Snippet;
	}

	let {
		tone = 'success',
		dot = true,
		pulse = true,
		duration = 1.6,
		class: className = '',
		children,
		leading,
		...restProps
	}: Props = $props();
</script>

<!-- The original also bobs up and down with a CSS keyframe; fractalstyler has
     none, so the motion lives in the SVG ping around the dot. -->
<span class="chip row ycenter gap-xs bg-raised border-subtle shadow-sm shrink-0 {className}" {...restProps}>
	{#if dot}
		<svg viewBox="0 0 16 16" width="1em" height="1em" class="shrink-0 {TONE_TEXT[tone]}" aria-hidden="true">
			{#if pulse}
				<circle cx="8" cy="8" r="3" fill="currentColor" opacity="0.5">
					<animate attributeName="r" values="3;8" dur="{duration}s" repeatCount="indefinite" />
					<animate attributeName="opacity" values="0.5;0" dur="{duration}s" repeatCount="indefinite" />
				</circle>
			{/if}
			<circle cx="8" cy="8" r="3" fill="currentColor" />
		</svg>
	{/if}
	{#if leading}<span class="row ycenter">{@render leading()}</span>{/if}
	<span class="text-primary">{@render children?.()}</span>
</span>
