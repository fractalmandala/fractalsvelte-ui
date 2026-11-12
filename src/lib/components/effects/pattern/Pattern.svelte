<!-- @component A decorative background layer drawn from pure CSS gradients: grid, dots, lines or a cross. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { vars } from '../../../motion/index.js';
	import { type Tone } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** The repeating motif, drawn with CSS gradients. */
		variant?: 'grid' | 'dots' | 'lines' | 'cross';
		/** Tile size of the pattern, as a CSS length. */
		size?: string;
		/** A mask that fades the pattern out. */
		fade?: 'none' | 'radial' | 'top' | 'bottom' | 'edges';
		/** Colour of the pattern, taken from the shared tone axis. */
		tone?: Tone;
	}

	let {
		variant = 'grid',
		size = '1.25rem',
		fade = 'none',
		tone = 'neutral',
		class: klass,
		...rest
	}: Props = $props();

	const variantClass = {
		grid: 'pattern-grid',
		dots: 'pattern-dots',
		lines: 'pattern-lines',
		cross: 'pattern-cross'
	};
	const fadeClass = {
		none: '',
		radial: 'mask-radial',
		top: 'mask-top',
		bottom: 'mask-bottom',
		edges: 'mask-edges'
	};
	const toneInk: Record<Tone, string> = {
		neutral: 'var(--text-secondary)',
		info: 'var(--info)',
		success: 'var(--success)',
		warning: 'var(--warning)',
		danger: 'var(--danger)'
	};
</script>

<div
	class={['pattern', 'pointer-none', variantClass[variant], fade !== 'none' && fadeClass[fade], klass]}
	aria-hidden="true"
	{@attach vars({
		'pattern-size': size,
		'pattern-tone': `color-mix(in oklab, ${toneInk[tone]} 35%, transparent)`
	})}
	{...rest}
></div>
