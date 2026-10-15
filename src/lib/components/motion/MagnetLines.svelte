<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		rows?: number;
		columns?: number;
		lineColor?: string;
		lineWidth?: number;
		lineHeight?: number;
		class?: string;
	}

	let {
		rows = 7,
		columns = 7,
		lineColor = 'var(--f-primary, #6366f1)',
		lineWidth = 2,
		lineHeight = 22,
		class: className = '',
		...restProps
	}: Props = $props();

	let containerEl: HTMLDivElement | undefined = $state();
	const total = $derived(rows * columns);

	function handlePointerMove(e: PointerEvent) {
		if (!containerEl) return;
		const lines = containerEl.querySelectorAll<HTMLSpanElement>('.f-magnet-line');
		lines.forEach((line) => {
			const rect = line.getBoundingClientRect();
			const cx = rect.left + rect.width / 2;
			const cy = rect.top + rect.height / 2;
			const dx = e.clientX - cx;
			const dy = e.clientY - cy;
			const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
			line.style.transform = `rotate(${angle}deg)`;
		});
	}
</script>

<div
	bind:this={containerEl}
	class="f-magnet-lines {className}"
	style="
		grid-template-rows: repeat({rows}, 1fr);
		grid-template-columns: repeat({columns}, 1fr);
	"
	onpointermove={handlePointerMove}
	role="img"
	aria-label="Magnetic field visualization"
	{...restProps}
>
	{#each Array(total) as _, i (i)}
		<div class="f-magnet-cell">
			<span
				class="f-magnet-line"
				style="
					width: {lineHeight}px;
					height: {lineWidth}px;
					background: {lineColor};
				"
			></span>
		</div>
	{/each}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-magnet-lines {
			display: grid;
			gap: 12px;
			padding: 1.5rem;
			background: var(--f-sunken, #101015);
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-xl);
			box-sizing: border-box;
			user-select: none;
		}

		.f-magnet-cell {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 32px;
			height: 32px;
		}

		.f-magnet-line {
			display: inline-block;
			border-radius: 9999px;
			transform-origin: center center;
			transition: transform 0.08s linear;
			pointer-events: none;
			box-shadow: 0 0 6px rgba(99, 102, 241, 0.4);
		}
	}
</style>
