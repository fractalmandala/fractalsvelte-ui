<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
	export type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div';
	export type HeadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
	export type HeadingTracking = 'tight' | 'normal' | 'wide';
	export type HeadingWeight = 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';

	interface Props extends HTMLAttributes<HTMLHeadingElement> {
		level?: HeadingLevel;
		as?: HeadingTag;
		size?: HeadingSize;
		tracking?: HeadingTracking;
		weight?: HeadingWeight;
		gradient?: boolean | string;
		class?: string;
		children?: Snippet;
	}

	let {
		level = 1,
		as,
		size,
		tracking = 'tight',
		weight,
		gradient = false,
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	const tag = $derived<HeadingTag>(as ?? (`h${level}` as HeadingTag));

	const computedSize = $derived.by<HeadingSize>(() => {
		if (size) return size;
		switch (level) {
			case 1:
				return '3xl';
			case 2:
				return '2xl';
			case 3:
				return 'xl';
			case 4:
				return 'lg';
			case 5:
				return 'md';
			case 6:
			default:
				return 'sm';
		}
	});

	const customGradient = $derived(
		typeof gradient === 'string' ? gradient : undefined
	);
</script>

<svelte:element
	this={tag}
	class="f-heading {className}"
	data-size={computedSize}
	data-tracking={tracking}
	data-weight={weight}
	data-gradient={gradient ? '' : undefined}
	style:background-image={customGradient}
	{...restProps}
>
	{#if children}
		{@render children()}
	{/if}
</svelte:element>

<style>
	@layer fractalsvelte-ui.components {
		.f-heading {
			margin: 0;
			font-family: inherit;
			color: var(--f-text);
			line-height: 1.25;
			box-sizing: border-box;
		}

		/* Sizes */
		.f-heading[data-size='3xl'] {
			font-size: var(--f-text-3xl);
			line-height: 1.2;
			font-weight: 700;
		}

		.f-heading[data-size='2xl'] {
			font-size: var(--f-text-2xl);
			line-height: 1.25;
			font-weight: 700;
		}

		.f-heading[data-size='xl'] {
			font-size: var(--f-text-xl);
			line-height: 1.3;
			font-weight: 600;
		}

		.f-heading[data-size='lg'] {
			font-size: var(--f-text-lg);
			line-height: 1.35;
			font-weight: 600;
		}

		.f-heading[data-size='md'] {
			font-size: var(--f-text-base);
			line-height: 1.4;
			font-weight: 600;
		}

		.f-heading[data-size='sm'] {
			font-size: var(--f-text-sm);
			line-height: 1.4;
			font-weight: 600;
		}

		.f-heading[data-size='xs'] {
			font-size: var(--f-text-xs);
			line-height: 1.4;
			font-weight: 600;
		}

		/* Tracking */
		.f-heading[data-tracking='tight'] {
			letter-spacing: -0.025em;
		}

		.f-heading[data-tracking='normal'] {
			letter-spacing: 0;
		}

		.f-heading[data-tracking='wide'] {
			letter-spacing: 0.05em;
		}

		/* Explicit Weights */
		.f-heading[data-weight='normal'] {
			font-weight: 400;
		}
		.f-heading[data-weight='medium'] {
			font-weight: 500;
		}
		.f-heading[data-weight='semibold'] {
			font-weight: 600;
		}
		.f-heading[data-weight='bold'] {
			font-weight: 700;
		}
		.f-heading[data-weight='extrabold'] {
			font-weight: 800;
		}

		/* Gradient Text */
		.f-heading[data-gradient] {
			background: linear-gradient(135deg, var(--f-primary) 0%, var(--f-accent) 100%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			background-clip: text;
			display: inline-block;
		}
	}
</style>
