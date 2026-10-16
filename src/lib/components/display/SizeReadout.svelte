<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		width?: number;
		height?: number;
		count?: number;
		unit?: string;
		led?: boolean;
		copied?: string;
		label?: string;
		class?: string;
	}

	let {
		width = 320,
		height = 240,
		count,
		unit = 'px',
		led = true,
		copied,
		label,
		class: className = '',
		...restProps
	}: Props = $props();

	const roundedW = $derived(Math.round(width));
	const roundedH = $derived(Math.round(height));
</script>

<span
	class="f-size-readout {className}"
	role="status"
	aria-live="polite"
	{...restProps}
>
	{#if led}
		<span class="f-readout-led" aria-hidden="true"></span>
	{/if}

	{#if copied}
		<span class="f-readout-highlight">COPIED</span>
		<span class="f-readout-dot">·</span>
		<span class="f-readout-val">{copied}</span>
		<span class="f-readout-dot">·</span>
	{/if}

	{#if count && count > 1}
		<span class="f-readout-count">{count} items</span>
		<span class="f-readout-dot">·</span>
	{/if}

	{#if label}
		<span class="f-readout-label">{label}</span>
		<span class="f-readout-dot">·</span>
	{/if}

	<span class="f-readout-dim">
		<span class="f-readout-val">{roundedW}</span>
		<span class="f-readout-mult">×</span>
		<span class="f-readout-val">{roundedH}</span>
		{#if unit}
			<span class="f-readout-unit">{unit}</span>
		{/if}
	</span>
</span>

<style>
	@layer fractalsvelte-ui.components {
		.f-size-readout {
			display: inline-flex;
			align-items: center;
			gap: 6px;
			height: 26px;
			padding: 0 10px;
			border-radius: 9999px;
			background: var(--f-surface, #18181f);
			border: 1px solid var(--f-border);
			box-shadow: var(--f-shadow-sm);
			font-family: var(--f-font-mono, monospace);
			font-size: var(--f-text-xs);
			line-height: 1;
			color: var(--f-text);
			white-space: nowrap;
			user-select: none;
			box-sizing: border-box;
			transition: opacity var(--f-duration-fast) var(--f-ease);
		}

		.f-readout-led {
			width: 6px;
			height: 6px;
			border-radius: 50%;
			background: var(--f-success, #10b981);
			box-shadow: 0 0 6px var(--f-success, #10b981);
			display: inline-block;
		}

		.f-readout-highlight {
			font-weight: 700;
			color: var(--f-primary);
			letter-spacing: 0.05em;
		}

		.f-readout-count,
		.f-readout-label {
			color: var(--f-text-muted);
		}

		.f-readout-dot {
			color: var(--f-border-subtle, rgba(255, 255, 255, 0.2));
		}

		.f-readout-dim {
			display: inline-flex;
			align-items: center;
			gap: 3px;
		}

		.f-readout-val {
			font-weight: 600;
			color: var(--f-text);
		}

		.f-readout-mult {
			color: var(--f-text-muted);
			font-size: 10px;
		}

		.f-readout-unit {
			font-size: 10px;
			color: var(--f-text-muted);
		}
	}
</style>
