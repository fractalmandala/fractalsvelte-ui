<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		size?: number; // beam width px
		duration?: number; // loop duration seconds
		colorFrom?: string;
		colorTo?: string;
		borderWidth?: number;
		class?: string;
	}

	let {
		size = 200,
		duration = 10,
		colorFrom = 'var(--f-primary)',
		colorTo = 'var(--f-accent, #6366f1)',
		borderWidth = 1.5,
		class: className = '',
		...restProps
	}: Props = $props();
</script>

<div
	class="f-border-beam {className}"
	style="--beam-size: {size}px; --beam-duration: {duration}s; --beam-from: {colorFrom}; --beam-to: {colorTo}; --beam-width: {borderWidth}px;"
	aria-hidden="true"
	{...restProps}
></div>

<style>
	@layer fractalsvelte-ui.components {
		.f-border-beam {
			position: absolute;
			inset: 0;
			border-radius: inherit;
			pointer-events: none;
			border: var(--beam-width) solid transparent;
			mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
			-webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
			mask-composite: exclude;
			-webkit-mask-composite: xor;
		}

		.f-border-beam::after {
			content: '';
			position: absolute;
			aspect-ratio: 1;
			width: var(--beam-size);
			background: linear-gradient(to left, var(--beam-from), var(--beam-to), transparent);
			offset-path: rect(0 auto auto 0 round var(--f-radius-lg));
			animation: f-beam-travel var(--beam-duration) infinite linear;
		}

		@keyframes f-beam-travel {
			to {
				offset-distance: 100%;
			}
		}
	}
</style>
