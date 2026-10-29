<!-- @component A checkbox with label, description and error text, supporting an indeterminate state. -->

<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { Icon as Iconbox } from '@fractaldesign/icons';
	import { luCheck, luMinus } from '@fractaldesign/icons/lucide';

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

<div class="box gap-xs {className}">
	<label class="row {description ? 'ytop' : 'ycenter'} gap-sm text-sm" for={checkboxId}>
		<span class="checkbox-box">
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
		{#if indeterminate}<Iconbox icon={luMinus} />{:else if checked}<Iconbox icon={luCheck} />{/if}
		</span>
		{#if label || description}
			<div class="box gap-xs">
				{#if label}<span class="weight-500 {disabled ? 'text-muted' : ''}">{label}</span>{/if}
				{#if description}<div id="{checkboxId}-desc" class="text-body-sm text-muted">{description}</div>{/if}
			</div>
		{/if}
	</label>
	{#if typeof error === 'string'}
		<p class="text-body-sm text-danger" role="alert">{error}</p>
	{/if}
</div>
