<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLInputAttributes, 'size'> {
		checked?: boolean;
		indeterminate?: boolean;
		label?: string;
		description?: string;
		error?: boolean | string;
		disabled?: boolean;
		value?: string;
		name?: string;
		id?: string;
		class?: string;
	}

	let {
		checked = $bindable(false),
		indeterminate = $bindable(false),
		label,
		description,
		error,
		disabled = false,
		value,
		name,
		id,
		class: className = '',
		...restProps
	}: Props = $props();

	const uid = $props.id();
	const checkboxId = $derived(id || uid);
</script>

<!-- fractalstyler's checkbox is the native control inside .checkbox-wrapper;
     its span children pick up the wrapper's sm/500 label type. -->
<div class="box gap-xs {className}">
	<label class="checkbox-wrapper {description ? 'row ytop' : ''}" for={checkboxId}>
		<input
			id={checkboxId}
			type="checkbox"
			{name}
			{value}
			{disabled}
			bind:checked
			bind:indeterminate
			aria-invalid={error ? true : undefined}
			aria-describedby={description ? `${checkboxId}-desc` : undefined}
			{...restProps}
		/>
		{#if label || description}
			<div class="box gap-xs">
				{#if label}<span class={disabled ? 'text-muted' : ''}>{label}</span>{/if}
				{#if description}<div id="{checkboxId}-desc" class="text-body-sm text-muted">{description}</div>{/if}
			</div>
		{/if}
	</label>
	{#if typeof error === 'string'}
		<p class="text-body-sm text-danger" role="alert">{error}</p>
	{/if}
</div>
