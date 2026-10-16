<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		revealed?: boolean;
		orientation?: 'horizontal' | 'vertical';
		hoverToReveal?: boolean;
		label?: string;
		class?: string;
		revealedContent?: Snippet;
		coverContent?: Snippet;
		children?: Snippet;
	}

	let {
		revealed = $bindable(false),
		orientation = 'horizontal',
		hoverToReveal = true,
		label = 'HOVER OR CLICK TO REVEAL',
		class: className = '',
		revealedContent,
		coverContent,
		children,
		...restProps
	}: Props = $props();

	function handleMouseEnter() {
		if (hoverToReveal) revealed = true;
	}

	function handleMouseLeave() {
		if (hoverToReveal) revealed = false;
	}

	function handleClick() {
		revealed = !revealed;
	}
</script>

<div
	class="f-split-reveal {className}"
	data-orientation={orientation}
	data-revealed={revealed ? '' : undefined}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	onclick={handleClick}
	role="button"
	tabindex="0"
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			revealed = !revealed;
		}
	}}
	aria-expanded={revealed}
	{...restProps}
>
	<!-- Underneath revealed content -->
	<div class="f-split-under">
		{#if revealedContent}
			{@render revealedContent()}
		{:else if children}
			{@render children()}
		{/if}
	</div>

	<!-- Shutter Panel 1 -->
	<div class="f-shutter f-shutter-1">
		{#if coverContent}
			{@render coverContent()}
		{:else if label}
			<span class="f-shutter-label">{label}</span>
		{/if}
	</div>

	<!-- Shutter Panel 2 -->
	<div class="f-shutter f-shutter-2">
		{#if coverContent}
			{@render coverContent()}
		{:else if label}
			<span class="f-shutter-label">{label}</span>
		{/if}
	</div>
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-split-reveal {
			position: relative;
			width: 100%;
			height: 220px;
			border-radius: var(--f-radius-xl);
			overflow: hidden;
			border: 1px solid var(--f-border);
			background: var(--f-surface, #18181f);
			box-sizing: border-box;
			cursor: pointer;
			user-select: none;
		}

		.f-split-under {
			position: absolute;
			inset: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 1.5rem;
			background: var(--f-surface-raised, #20202a);
			z-index: 1;
		}

		.f-shutter {
			position: absolute;
			background: var(--f-surface, #14141a);
			z-index: 2;
			display: flex;
			align-items: center;
			justify-content: center;
			transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
			overflow: hidden;
		}

		.f-shutter-label {
			font-family: var(--f-font-mono, monospace);
			font-size: var(--f-text-xs);
			font-weight: 700;
			letter-spacing: 0.1em;
			color: var(--f-text-muted);
		}

		/* Horizontal split (left & right shutters) */
		.f-split-reveal[data-orientation='horizontal'] .f-shutter-1 {
			top: 0;
			bottom: 0;
			left: 0;
			width: 50%;
			border-right: 1px solid var(--f-border);
		}

		.f-split-reveal[data-orientation='horizontal'] .f-shutter-2 {
			top: 0;
			bottom: 0;
			right: 0;
			width: 50%;
		}

		.f-split-reveal[data-orientation='horizontal'][data-revealed] .f-shutter-1 {
			transform: translateX(-100%);
		}

		.f-split-reveal[data-orientation='horizontal'][data-revealed] .f-shutter-2 {
			transform: translateX(100%);
		}

		/* Vertical split (top & bottom shutters) */
		.f-split-reveal[data-orientation='vertical'] .f-shutter-1 {
			left: 0;
			right: 0;
			top: 0;
			height: 50%;
			border-bottom: 1px solid var(--f-border);
		}

		.f-split-reveal[data-orientation='vertical'] .f-shutter-2 {
			left: 0;
			right: 0;
			bottom: 0;
			height: 50%;
		}

		.f-split-reveal[data-orientation='vertical'][data-revealed] .f-shutter-1 {
			transform: translateY(-100%);
		}

		.f-split-reveal[data-orientation='vertical'][data-revealed] .f-shutter-2 {
			transform: translateY(100%);
		}
	}
</style>
