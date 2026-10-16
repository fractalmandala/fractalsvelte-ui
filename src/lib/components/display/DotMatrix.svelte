<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	// 5x7 dot-matrix font definition for common alphanumeric characters
	// Each number is 7 rows, 5 bits each (0b00000 to 0b11111)
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
		'A': [14, 17, 17, 31, 17, 17, 17],
		'B': [30, 17, 17, 30, 17, 17, 30],
		'C': [14, 17, 16, 16, 16, 17, 14],
		'D': [28, 18, 17, 17, 17, 18, 28],
		'E': [31, 16, 16, 30, 16, 16, 31],
		'F': [31, 16, 16, 30, 16, 16, 16],
		'G': [14, 17, 16, 23, 17, 17, 14],
		'H': [17, 17, 17, 31, 17, 17, 17],
		'I': [14, 4, 4, 4, 4, 4, 14],
		'J': [7, 2, 2, 2, 2, 18, 12],
		'K': [17, 18, 20, 24, 20, 18, 17],
		'L': [16, 16, 16, 16, 16, 16, 31],
		'M': [17, 27, 21, 21, 17, 17, 17],
		'N': [17, 25, 21, 19, 17, 17, 17],
		'O': [14, 17, 17, 17, 17, 17, 14],
		'P': [30, 17, 17, 30, 16, 16, 16],
		'Q': [14, 17, 17, 17, 21, 18, 13],
		'R': [30, 17, 17, 30, 20, 18, 17],
		'S': [14, 17, 16, 14, 1, 17, 14],
		'T': [31, 4, 4, 4, 4, 4, 4],
		'U': [17, 17, 17, 17, 17, 17, 14],
		'V': [17, 17, 17, 17, 17, 10, 4],
		'W': [17, 17, 17, 21, 21, 27, 17],
		'X': [17, 17, 10, 4, 10, 17, 17],
		'Y': [17, 17, 10, 4, 4, 4, 4],
		'Z': [31, 1, 2, 4, 8, 16, 31],
		':': [0, 12, 12, 0, 12, 12, 0],
		'-': [0, 0, 0, 31, 0, 0, 0],
		'.': [0, 0, 0, 0, 0, 12, 12],
		'!': [4, 4, 4, 4, 4, 0, 4]
	};

	interface Props extends HTMLAttributes<HTMLDivElement> {
		text?: string;
		color?: 'green' | 'amber' | 'red' | 'cyan' | 'primary';
		glow?: boolean;
		dotSize?: number;
		class?: string;
	}

	let {
		text = 'ONLINE',
		color = 'green',
		glow = true,
		dotSize = 3,
		class: className = '',
		...restProps
	}: Props = $props();

	const chars = $derived((text || '').toUpperCase().split(''));
</script>

<div
	class="f-dot-matrix-display {className}"
	data-color={color}
	data-glow={glow ? '' : undefined}
	role="img"
	aria-label={text}
	{...restProps}
>
	{#each chars as char, charIdx (charIdx)}
		{@const bitmap = FONT_5X7[char] || FONT_5X7[' ']}
		<div class="f-dot-matrix-char">
			{#each bitmap as row, rowIdx (rowIdx)}
				<div class="f-dot-matrix-row">
					{#each [16, 8, 4, 2, 1] as bitMask, colIdx (colIdx)}
						{@const isLit = (row & bitMask) !== 0}
						<span
							class="f-dot"
							class:lit={isLit}
							style="width: {dotSize}px; height: {dotSize}px;"
						></span>
					{/each}
				</div>
			{/each}
		</div>
	{/each}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-dot-matrix-display {
			display: inline-flex;
			align-items: center;
			gap: 6px;
			background: #090a0d;
			padding: 10px 14px;
			border-radius: var(--f-radius-md);
			border: 1px solid rgba(255, 255, 255, 0.1);
			box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.8);
			user-select: none;
		}

		.f-dot-matrix-char {
			display: flex;
			flex-direction: column;
			gap: 2px;
		}

		.f-dot-matrix-row {
			display: flex;
			gap: 2px;
		}

		.f-dot {
			display: inline-block;
			border-radius: 50%;
			background: rgba(255, 255, 255, 0.05);
			transition: background 0.1s ease;
		}

		/* Phosphor Colors */
		.f-dot-matrix-display[data-color='green'] .f-dot.lit {
			background: #10b981;
		}
		.f-dot-matrix-display[data-color='green'][data-glow] .f-dot.lit {
			box-shadow: 0 0 6px #10b981;
		}

		.f-dot-matrix-display[data-color='amber'] .f-dot.lit {
			background: #f59e0b;
		}
		.f-dot-matrix-display[data-color='amber'][data-glow] .f-dot.lit {
			box-shadow: 0 0 6px #f59e0b;
		}

		.f-dot-matrix-display[data-color='red'] .f-dot.lit {
			background: #ef4444;
		}
		.f-dot-matrix-display[data-color='red'][data-glow] .f-dot.lit {
			box-shadow: 0 0 6px #ef4444;
		}

		.f-dot-matrix-display[data-color='cyan'] .f-dot.lit {
			background: #06b6d4;
		}
		.f-dot-matrix-display[data-color='cyan'][data-glow] .f-dot.lit {
			box-shadow: 0 0 6px #06b6d4;
		}

		.f-dot-matrix-display[data-color='primary'] .f-dot.lit {
			background: var(--f-primary);
		}
		.f-dot-matrix-display[data-color='primary'][data-glow] .f-dot.lit {
			box-shadow: 0 0 6px var(--f-primary);
		}
	}
</style>
