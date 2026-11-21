<!-- @component Interactive countdown or stopwatch timer with start, pause, and reset controls. -->

<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { luPause, luPlay, luRotateCcw } from '@fractaldesign/icons/lucide';
	import { Button } from '../../actions/button/index.js';
	import { IconButton } from '../../actions/icon-button/index.js';
	import { type Gap, type Size } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		mode?: 'countdown' | 'stopwatch';
		duration?: number;
		autoStart?: boolean;
		interval?: number;
		showHours?: boolean;
		showControls?: boolean;
		size?: Size;
		gap?: Gap;
		onComplete?: () => void;
		onTick?: (ms: number) => void;
		startButtonProps?: Partial<ComponentProps<typeof Button>>;
		pauseButtonProps?: Partial<ComponentProps<typeof Button>>;
		resetButtonProps?: Partial<ComponentProps<typeof IconButton>>;
	}

	let {
		startButtonProps,
		pauseButtonProps,
		resetButtonProps,
		mode = 'countdown',
		duration = 60_000,
		autoStart = false,
		interval = 200,
		showHours = false,
		showControls = true,
		size = 'h-xl',
		gap = 'gap-md',
		onComplete,
		onTick,
		class: className,
		...rest
	}: Props = $props();

	let currentMs = $state(0);
	let running = $state(false);
	let completed = $state(false);

	$effect.pre(() => {
		currentMs = mode === 'countdown' ? duration : 0;
		running = autoStart;
		completed = false;
	});

	$effect(() => {
		if (!running) return;
		let last = Date.now();
		const id = setInterval(() => {
			const now = Date.now();
			const delta = now - last;
			last = now;
			if (mode === 'countdown') {
				const next = Math.max(0, currentMs - delta);
				currentMs = next;
				onTick?.(next);
				if (next === 0 && !completed) {
					completed = true;
					running = false;
					onComplete?.();
				}
			} else {
				const next = currentMs + delta;
				currentMs = next;
				onTick?.(next);
			}
		}, Math.max(50, interval));
		return () => clearInterval(id);
	});

	function start() {
		if (mode === 'countdown' && currentMs <= 0) {
			currentMs = duration;
			completed = false;
		}
		running = true;
	}

	function pause() {
		running = false;
	}

	function reset() {
		running = false;
		completed = false;
		currentMs = mode === 'countdown' ? duration : 0;
	}

	const parts = $derived.by(() => {
		const totalSeconds = Math.max(0, Math.ceil(currentMs / 1000));
		const hrs = Math.floor(totalSeconds / 3600);
		const mins = Math.floor((totalSeconds % 3600) / 60);
		const secs = totalSeconds % 60;
		const p = (n: number) => String(n).padStart(2, '0');
		return showHours || hrs > 0 ? `${p(hrs)}:${p(mins)}:${p(secs)}` : `${p(mins)}:${p(secs)}`;
	});
</script>

<div class={['inline-flex row ycenter', gap, className]} {...rest}>
	<span
		role="timer"
		aria-live="off"
		class={['font-mono tabular-nums weight-600', size]}
	>
		{parts}
	</span>
	{#if showControls}
		<div class="row ycenter gap-xs">
			{#if running}
				<Button variant="outline" size="h-sm" icon={luPause} onclick={pause} {...pauseButtonProps}>Pause</Button>
			{:else}
				<Button variant="secondary" size="h-sm" icon={luPlay} onclick={start} {...startButtonProps}>
					{completed ? 'Restart' : 'Start'}
				</Button>
			{/if}
			<IconButton variant="ghost" size="h-sm" icon={luRotateCcw} label="Reset timer" onclick={reset} {...resetButtonProps} />
		</div>
	{/if}
</div>
