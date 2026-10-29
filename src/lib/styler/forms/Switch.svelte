<!-- @component An on/off toggle switch with label and description. -->

<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { Size } from '../types';

	interface Props extends Omit<HTMLInputAttributes, 'size' | 'type'> {
		checked?: boolean;
		label?: string;
		description?: string;
		/** Switch height follows the control height scale. */
		size?: Size;
		error?: boolean;
		disabled?: boolean;
		id?: string;
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
		class: className = '',
		...restProps
	}: Props = $props();

	const uid = $props.id();
	const switchId = $derived(id || uid);
</script>

<div class="row ytop gap-sm {className}">
	<span class="switch-box" style:font-size="calc(var(--height-{size.slice(2)}) * 0.75)">
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
		<label class="box gap-xs" for={switchId}>
			{#if label}<span class="text-sm weight-500 {disabled ? 'text-muted' : 'text-primary'}">{label}</span>{/if}
			{#if description}<span id="{switchId}-desc" class="text-body-sm text-muted">{description}</span>{/if}
		</label>
	{/if}
</div>
