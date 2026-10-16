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
</script>

<span
	class="chip row ycenter gap-xs mono bg-sunken border text-secondary shrink-0 {className}"
	role="status"
	aria-live="polite"
	{...restProps}
>
	{#if led}
		<svg width="0.6em" height="0.6em" viewBox="0 0 8 8" class="text-success shrink-0" aria-hidden="true">
			<circle cx="4" cy="4" r="4" fill="currentColor" />
		</svg>
	{/if}
	{#if copied}
		<span class="text-theme weight-600">COPIED</span>
		<span class="text-muted" aria-hidden="true">·</span>
		<span class="text-primary">{copied}</span>
		<span class="text-muted" aria-hidden="true">·</span>
	{/if}
	{#if count && count > 1}
		<span>{count} items</span>
		<span class="text-muted" aria-hidden="true">·</span>
	{/if}
	{#if label}
		<span>{label}</span>
		<span class="text-muted" aria-hidden="true">·</span>
	{/if}
	<span class="row ycenter gap-xs">
		<span class="text-primary">{Math.round(width)}</span>
		<span class="text-muted">×</span>
		<span class="text-primary">{Math.round(height)}</span>
		{#if unit}<span class="text-muted">{unit}</span>{/if}
	</span>
</span>
