<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { FsTone } from '../types';
	import { TEXT_SIZE, TONE_TEXT, type FsTextSize } from '../classes';

	interface Props extends HTMLButtonAttributes {
		checked?: boolean;
		label?: string;
		description?: string;
		/** Ink of the "on" track */
		tone?: FsTone;
		/** The switch is drawn in em, so it scales with this text size. */
		size?: FsTextSize;
		disabled?: boolean;
		id?: string;
		class?: string;
	}

	let {
		checked = $bindable(false),
		label,
		description,
		tone = 'theme',
		size = 'bs',
		disabled = false,
		id,
		class: className = '',
		...restProps
	}: Props = $props();

	const uid = $props.id();
	const switchId = $derived(id || uid);

</script>

<!-- fractalstyler ships no switch: track and thumb are SVG geometry inked by
     text-* classes, so toggling moves a cx, not a CSS transform. -->
<div class="row ytop gap-sm {className}">
	<button
		id={switchId}
		type="button"
		role="switch"
		aria-checked={checked}
		aria-labelledby={label ? `${switchId}-label` : undefined}
		aria-describedby={description ? `${switchId}-desc` : undefined}
		{disabled}
		class="px-xs shrink-0 {TEXT_SIZE[size]}"
		data-variant="ghost"
		data-shape="round"
		onclick={() => (checked = !checked)}
		{...restProps}
	>
		<svg viewBox="0 0 36 20" width="1.8em" height="1em" aria-hidden="true">
			<rect width="36" height="20" rx="10" class={checked ? TONE_TEXT[tone] : 'text-muted'} fill="currentColor" opacity={checked ? 1 : 0.45} />
			<circle cx={checked ? 26 : 10} cy="10" r="7" class="text-white" fill="currentColor" />
		</svg>
	</button>
	{#if label || description}
		<label class="box gap-xs" for={switchId}>
			{#if label}<span id="{switchId}-label" class="text-sm weight-500 {disabled ? 'text-muted' : 'text-primary'}">{label}</span>{/if}
			{#if description}<span id="{switchId}-desc" class="text-body-sm text-muted">{description}</span>{/if}
		</label>
	{/if}
</div>
