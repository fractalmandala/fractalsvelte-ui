<script lang="ts" module>
	export interface RadioOption {
		value: string | number;
		label: string;
		description?: string;
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Orientation } from '../types';
	import Radio from './Radio.svelte';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		value?: string | number;
		name?: string;
		label?: string;
		description?: string;
		helperText?: string;
		error?: boolean | string;
		orientation?: Orientation;
		options?: RadioOption[];
		disabled?: boolean;
		children?: Snippet;
		class?: string;
	}

	let {
		value = $bindable(undefined),
		name,
		label,
		description,
		helperText,
		error,
		orientation = 'vertical',
		options = [],
		disabled = false,
		children,
		class: className = '',
		...restProps
	}: Props = $props();

	const uid = $props.id();
	const groupName = $derived(name || uid);
	const errorMessage = $derived(typeof error === 'string' ? error : undefined);

	// Native radios sharing a name already give arrow-key roving and a single
	// tab stop, so the group only has to own the value.
	setContext('fs-radio-group', {
		name: () => groupName,
		value: () => value,
		disabled: () => disabled,
		select: (val: string | number) => (value = val)
	});
</script>

<!-- A bare fieldset carries the browser's groove border and fractalstyler has
     no reset for it, so the group is a div with role="radiogroup". -->
<div
	class="box gap-sm {className}"
	role="radiogroup"
	aria-labelledby={label ? `${uid}-label` : undefined}
	aria-describedby={description ? `${uid}-desc` : undefined}
	aria-invalid={error ? true : undefined}
	{...restProps}
>
	{#if label || description}
		<div class="box gap-xs">
			{#if label}<span id="{uid}-label" class="text-sm weight-500 text-primary">{label}</span>{/if}
			{#if description}<span id="{uid}-desc" class="text-body-sm text-muted">{description}</span>{/if}
		</div>
	{/if}
	<div class="{orientation === 'horizontal' ? 'row wrap gap-md' : 'box gap-sm'}">
		{#each options as opt (opt.value)}
			<Radio value={opt.value} label={opt.label} description={opt.description} disabled={opt.disabled} />
		{/each}
		{@render children?.()}
	</div>
	{#if errorMessage}
		<p class="text-body-sm text-danger" role="alert">{errorMessage}</p>
	{:else if helperText}
		<p class="text-body-sm text-muted">{helperText}</p>
	{/if}
</div>
