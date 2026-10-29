<!-- @component Text that scrambles through random characters before settling. -->

<script lang="ts">
	import { untrack } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		text: string;
		characters?: string;
		/** ms per frame */
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

	let display = $state('');
	let running = $state(false);
	let timer: ReturnType<typeof setTimeout> | null = null;

	/** Runs the scramble; text content changes each frame, nothing else. */
	export function scramble() {
		if (running) return;
		running = true;
		const target = text;
		let iteration = 0;
		const max = target.length * 3;
		const step = () => {
			display = Array.from(target, (ch, i) =>
				ch === ' ' || iteration > i * 2 ? ch : characters[Math.floor(Math.random() * characters.length)]
			).join('');
			iteration++;
			if (iteration <= max) timer = setTimeout(step, speed);
			else {
				display = target;
				running = false;
				timer = null;
			}
		};
		step();
	}

	$effect(() => {
		const target = text;
		const auto = trigger === 'mount' || trigger === 'both';
		// scramble() reads and writes `running`; untracked so it cannot re-trigger this effect.
		untrack(() => {
			display = target;
			if (auto) scramble();
		});
		return () => {
			if (timer !== null) clearTimeout(timer);
			running = false;
		};
	});
</script>

<span
	class="mono {className}"
	onpointerenter={() => (trigger === 'hover' || trigger === 'both') && scramble()}
	{...restProps}
>
	{display}
</span>
