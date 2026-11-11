<!-- @component An on/off toggle switch with label and description. -->

<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { Size, TextSize } from '$lib/types.js';

	interface Props extends Omit<HTMLInputAttributes, 'size' | 'type'> {
		checked?: boolean;
		label?: string;
		description?: string;
		/** Switch height follows the control height scale. */
		size?: Size;
		error?: boolean;
		disabled?: boolean;
		id?: string;
		textsize?: TextSize;
		class?: string;
	}

	let {
		checked = $bindable(false),
		label,
		description,
		size = 'h-md',
		error = false,
		disabled = false,
		id,
		textsize = 'text-md',
		class: className = '',
		...restProps
	}: Props = $props();

	// The switch is drawn in em, so its size is a text size.
	const SWITCH_TEXT: Record<Size, TextSize> = {
		'h-xs': 'text-xs',
		'h-sm': 'text-sm',
		'h-md': 'text-md',
		'h-bs': 'text-bs',
		'h-lg': 'text-lg',
		'h-xl': 'text-xl'
	};

	const uid = $props.id();
	const switchId = $derived(id || uid);
</script>

<div class="row ytop gap-sm {textsize} {className}">
	<span class="switch-box {SWITCH_TEXT[size]}">
		<input
			id={switchId}
			type="checkbox"
			role="switch"
			bind:checked
			aria-checked={checked}
			aria-invalid={error || undefined}
			aria-describedby={description ? `${switchId}-desc` : undefined}
			{disabled}
			{...restProps}
		/>
	</span>
	{#if label || description}
		<label class="box gap-xs {disabled ? '' : 'pointer'}" for={switchId}>
			{#if label}<span class="{textsize} weight-500 {disabled ? 'text-muted' : 'text-primary'}">{label}</span>{/if}
			{#if description}<span id="{switchId}-desc" class="text-body-sm text-muted">{description}</span>{/if}
		</label>
	{/if}
</div>
