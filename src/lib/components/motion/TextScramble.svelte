<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		text: string;
		characters?: string;
		speed?: number;
		trigger?: 'mount' | 'hover' | 'both' | 'manual';
		class?: string;
	}

	let {
		text,
		characters = '!<>-_\\/[]{}—=+*^?#________',
		speed = 30,
		trigger = 'mount',
		class: className = '',
		...restProps
	}: Props = $props();

	let displayText = $state('');
	let isScrambling = $state(false);
	let frameRequest: number | null = null;

	export function scramble() {
		if (isScrambling) return;
		isScrambling = true;

		const target = text;
		const length = target.length;
		let iteration = 0;
		const maxIterations = length * 3;

		function step() {
			let output = '';
			for (let i = 0; i < length; i++) {
				if (target[i] === ' ') {
					output += ' ';
					continue;
				}
				if (iteration > (i * 2)) {
					output += target[i];
				} else {
					output += characters[Math.floor(Math.random() * characters.length)];
				}
			}

			displayText = output;
			iteration++;

			if (iteration <= maxIterations) {
				frameRequest = window.setTimeout(step, speed);
			} else {
				displayText = target;
				isScrambling = false;
				frameRequest = null;
			}
		}

		step();
	}

	$effect(() => {
		displayText = text;
		if (trigger === 'mount' || trigger === 'both') {
			scramble();
		}
		return () => {
			if (frameRequest !== null) {
				clearTimeout(frameRequest);
			}
		};
	});

	function handlePointerEnter() {
		if (trigger === 'hover' || trigger === 'both') {
			scramble();
		}
	}
</script>

<span
	class="f-text-scramble {className}"
	data-scrambling={isScrambling ? 'true' : undefined}
	onpointerenter={handlePointerEnter}
	{...restProps}
>
	{displayText}
</span>

<style>
	@layer fractalsvelte-ui.components {
		.f-text-scramble {
			display: inline-block;
			font-family: var(--f-font-mono);
			font-variant-numeric: tabular-nums;
			letter-spacing: 0.02em;
			transition: color var(--f-duration-fast) var(--f-ease);
		}

		.f-text-scramble[data-scrambling='true'] {
			color: var(--f-primary);
		}
	}
</style>
