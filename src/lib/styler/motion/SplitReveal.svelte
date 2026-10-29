<!-- @component Shutters that part to reveal hidden content. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Orientation } from '../types';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		revealed?: boolean;
		orientation?: Orientation;
		hoverToReveal?: boolean;
		label?: string;
		/** ms for the shutters to part */
		duration?: number;
		class?: string;
		revealedContent?: Snippet;
		children?: Snippet;
	}

	let {
		revealed = $bindable(false),
		orientation = 'horizontal',
		hoverToReveal = true,
		label = 'Hover or click to reveal',
		duration = 450,
		class: className = '',
		revealedContent,
		children,
		...restProps
	}: Props = $props();

	let w = $state(0);
	let h = $state(0);
	const horizontal = $derived(orientation === 'horizontal');
	// Shutter geometry, in the SVG's pixel box: each covers half when closed.
	const half = $derived(horizontal ? w / 2 : h / 2);
</script>

<!-- Two SVG shutters slide apart over the content. Their size and position are
     SVG attributes, so the reveal is geometry, not a CSS transform. -->
<div
	bind:clientWidth={w}
	bind:clientHeight={h}
	class="relative box radius-md border {className}"
	role="button"
	tabindex="0"
	aria-expanded={revealed}
	aria-label={revealed ? undefined : label}
	onpointerenter={() => hoverToReveal && (revealed = true)}
	onpointerleave={() => hoverToReveal && (revealed = false)}
	onclick={() => (revealed = !revealed)}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			revealed = !revealed;
		}
	}}
	{...restProps}
>
	<div class="relative box pad-lg" inert={!revealed}>
		{#if revealedContent}{@render revealedContent()}{:else}{@render children?.()}{/if}
	</div>
	{#if w > 0 && h > 0}
		{#key revealed}
			<!-- A fresh <svg> per state restarts its SMIL timeline at begin="0s". -->
			<svg class="absolute full" viewBox="0 0 {w} {h}" pointer-events="none" aria-hidden="true">
				<g class="text-muted">
					{#if horizontal}
						<rect y="0" height={h} fill="currentColor" x="0" width={revealed ? 0 : half}>
							<animate attributeName="width" from={revealed ? half : 0} to={revealed ? 0 : half} dur="{duration}ms" fill="freeze" />
						</rect>
						<rect y="0" height={h} fill="currentColor" x={revealed ? w : half} width={revealed ? 0 : half}>
							<animate attributeName="x" from={revealed ? half : w} to={revealed ? w : half} dur="{duration}ms" fill="freeze" />
							<animate attributeName="width" from={revealed ? half : 0} to={revealed ? 0 : half} dur="{duration}ms" fill="freeze" />
						</rect>
					{:else}
						<rect x="0" width={w} fill="currentColor" y="0" height={revealed ? 0 : half}>
							<animate attributeName="height" from={revealed ? half : 0} to={revealed ? 0 : half} dur="{duration}ms" fill="freeze" />
						</rect>
						<rect x="0" width={w} fill="currentColor" y={revealed ? h : half} height={revealed ? 0 : half}>
							<animate attributeName="y" from={revealed ? half : h} to={revealed ? h : half} dur="{duration}ms" fill="freeze" />
							<animate attributeName="height" from={revealed ? half : 0} to={revealed ? 0 : half} dur="{duration}ms" fill="freeze" />
						</rect>
					{/if}
				</g>
				{#if !revealed && label}
					<text x={w / 2} y={h / 2} text-anchor="middle" dominant-baseline="central" class="text-inverse" fill="currentColor" font-size="12" font-weight="600" letter-spacing="1.5">{label.toUpperCase()}</text>
				{/if}
			</svg>
		{/key}
	{/if}
</div>
