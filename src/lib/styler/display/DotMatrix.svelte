<!-- @component Text drawn as an LED-style dot-matrix display. -->

<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';
	import type { MessageText } from '../types';

	// 5×7 dot-matrix font: 7 rows of 5 bits each.
	const FONT_5X7: Record<string, number[]> = {
		' ': [0, 0, 0, 0, 0, 0, 0],
		'0': [14, 17, 19, 21, 25, 17, 14],
		'1': [4, 12, 4, 4, 4, 4, 14],
		'2': [14, 17, 1, 2, 4, 8, 31],
		'3': [31, 2, 4, 2, 1, 17, 14],
		'4': [2, 6, 10, 18, 31, 2, 2],
		'5': [31, 16, 30, 1, 1, 17, 14],
		'6': [14, 17, 16, 30, 17, 17, 14],
		'7': [31, 1, 2, 4, 8, 8, 8],
		'8': [14, 17, 17, 14, 17, 17, 14],
		'9': [14, 17, 17, 15, 1, 17, 14],
		A: [14, 17, 17, 31, 17, 17, 17],
		B: [30, 17, 17, 30, 17, 17, 30],
		C: [14, 17, 16, 16, 16, 17, 14],
		D: [28, 18, 17, 17, 17, 18, 28],
		E: [31, 16, 16, 30, 16, 16, 31],
		F: [31, 16, 16, 30, 16, 16, 16],
		G: [14, 17, 16, 23, 17, 17, 14],
		H: [17, 17, 17, 31, 17, 17, 17],
		I: [14, 4, 4, 4, 4, 4, 14],
		J: [7, 2, 2, 2, 2, 18, 12],
		K: [17, 18, 20, 24, 20, 18, 17],
		L: [16, 16, 16, 16, 16, 16, 31],
		M: [17, 27, 21, 21, 17, 17, 17],
		N: [17, 25, 21, 19, 17, 17, 17],
		O: [14, 17, 17, 17, 17, 17, 14],
		P: [30, 17, 17, 30, 16, 16, 16],
		Q: [14, 17, 17, 17, 21, 18, 13],
		R: [30, 17, 17, 30, 20, 18, 17],
		S: [14, 17, 16, 14, 1, 17, 14],
		T: [31, 4, 4, 4, 4, 4, 4],
		U: [17, 17, 17, 17, 17, 17, 14],
		V: [17, 17, 17, 17, 17, 10, 4],
		W: [17, 17, 17, 21, 21, 27, 17],
		X: [17, 17, 10, 4, 10, 17, 17],
		Y: [17, 17, 10, 4, 4, 4, 4],
		Z: [31, 1, 2, 4, 8, 16, 31],
		':': [0, 12, 12, 0, 12, 12, 0],
		'-': [0, 0, 0, 31, 0, 0, 0],
		'.': [0, 0, 0, 0, 0, 12, 12],
		'!': [4, 4, 4, 4, 4, 0, 4]
	};

	interface Props extends SVGAttributes<SVGSVGElement> {
		text?: string;
		tone?: MessageText;
		glow?: boolean;
		/** Height of the display in em; width follows the character count. */
		height?: number;
		class?: string;
	}

	let {
		text = 'ONLINE',
		tone = 'text-success',
		glow = true,
		height = 1.5,
		class: className = '',
		...restProps
	}: Props = $props();

	const uid = $props.id();
	const chars = $derived((text || '').toUpperCase().split(''));
	// Each glyph is 5 dots + 1 gap wide; dots sit on a 1-unit grid.
	const cols = $derived(Math.max(1, chars.length * 6 - 1));

	const dots = $derived.by(() => {
		const out: { x: number; y: number; lit: boolean }[] = [];
		chars.forEach((ch, ci) => {
			const bitmap = FONT_5X7[ch] ?? FONT_5X7[' '];
			bitmap.forEach((row, ri) => {
				[16, 8, 4, 2, 1].forEach((mask, bi) => {
					out.push({ x: ci * 6 + bi + 0.5, y: ri + 0.5, lit: (row & mask) !== 0 });
				});
			});
		});
		return out;
	});
</script>

<svg
	viewBox="0 0 {cols} 7"
	height="{height}em"
	width="{(height * cols) / 7}em"
	role="img"
	aria-label={text}
	class="shrink-0 {tone} {className}"
	{...restProps}
>
	{#if glow}
		<defs>
			<filter id="{uid}-glow" x="-20%" y="-20%" width="140%" height="140%">
				<feGaussianBlur stdDeviation="0.35" result="blur" />
				<feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
			</filter>
		</defs>
	{/if}
	<g fill="currentColor">
		{#each dots as d, i (i)}
			{#if !d.lit}<circle cx={d.x} cy={d.y} r="0.36" opacity="0.12" />{/if}
		{/each}
	</g>
	<g fill="currentColor" filter={glow ? `url(#${uid}-glow)` : undefined}>
		{#each dots as d, i (i)}
			{#if d.lit}<circle cx={d.x} cy={d.y} r="0.4" />{/if}
		{/each}
	</g>
</svg>
