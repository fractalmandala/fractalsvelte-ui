<script lang="ts">
	import { getContext } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface RadioGroupContext {
		name?: () => string | undefined;
		value?: () => string | number | undefined;
		disabled?: () => boolean | undefined;
		select?: (val: string | number) => void;
	}

	interface Props extends Omit<HTMLInputAttributes, 'size'> {
		value: string | number;
		checked?: boolean;
		group?: string | number;
		name?: string;
		label?: string;
		description?: string;
		disabled?: boolean;
		id?: string;
		class?: string;
	}

	let {
		value,
		checked = $bindable(false),
		group = $bindable(undefined),
		name,
		label,
		description,
		disabled = false,
		id,
		class: className = '',
		...restProps
	}: Props = $props();

	const groupCtx = getContext<RadioGroupContext | undefined>('fs-radio-group');
	const effectiveName = $derived(name ?? groupCtx?.name?.());
	const effectiveDisabled = $derived(disabled || Boolean(groupCtx?.disabled?.()));
	const isChecked = $derived.by(() => {
		if (groupCtx?.value) return groupCtx.value() === value;
		if (group !== undefined) return group === value;
		return checked;
	});

	const uid = $props.id();
	const radioId = $derived(id || uid);

	function handleChange() {
		if (effectiveDisabled) return;
		checked = true;
		if (group !== undefined) group = value;
		groupCtx?.select?.(value);
	}
</script>

<label class="checkbox-wrapper {description ? 'row ytop' : ''} {className}" for={radioId}>
	<input
		id={radioId}
		type="radio"
		name={effectiveName}
		value={String(value)}
		checked={isChecked}
		disabled={effectiveDisabled}
		onchange={handleChange}
		aria-describedby={description ? `${radioId}-desc` : undefined}
		{...restProps}
	/>
	{#if label || description}
		<div class="box gap-xs">
			{#if label}<span class={effectiveDisabled ? 'text-muted' : ''}>{label}</span>{/if}
			{#if description}<div id="{radioId}-desc" class="text-body-sm text-muted">{description}</div>{/if}
		</div>
	{/if}
</label>
