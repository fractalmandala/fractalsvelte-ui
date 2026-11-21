<!-- @component A decorative background layer drawn from pure CSS gradients: grid, dots, lines or a cross. -->

<script lang="ts">
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { vars } from '../../../motion/index.js';
	import { type Tone } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		form?: 'grid' | 'dots' | 'lines' | 'cross';
		tile?: string;
		fade?: 'none' | 'radial' | 'top' | 'bottom' | 'edges';
		tone?: Tone;
	}

	let {
		form = 'grid',
		tile = '1.25rem',
		fade = 'none',
		tone = 'neutral',
		class: className,
		...rest
	}: Props = $props();

	const formClass = {
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
	class={['pattern', 'pointer-none', formClass[form], fade !== 'none' && fadeClass[fade], className]}
	aria-hidden="true"
	{@attach vars({
		'pattern-size': tile,
		'pattern-tone': `color-mix(in oklab, ${toneInk[tone]} 35%, transparent)`
	})}
	{...rest}
></div>
