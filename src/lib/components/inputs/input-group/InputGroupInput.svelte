<!-- @component The bare text input inside the frame. -->

<script lang="ts">
	import type {  HTMLInputAttributes  } from 'svelte/elements';
	import { getInputGroupContext } from './context.js';

	interface Props extends Omit<HTMLInputAttributes, 'size' | 'value' | 'children'> {
		value?: string;
		onValueChange?: (value: string) => void;
		ref?: HTMLInputElement | null;
	}

	let {
		value = $bindable(''),
		onValueChange,
		ref = $bindable(null),
		id,
		type = 'text',
		required,
		disabled,
		class: className,
		oninput,
		'aria-describedby': describedby,
		...rest
	}: Props = $props();

	const group = getInputGroupContext();

	function set(next: string): void {
		value = next;
		onValueChange?.(next);
	}

	function handleInput(event: Event & { currentTarget: EventTarget & HTMLInputElement }): void {
		set(event.currentTarget.value);
		oninput?.(event);
	}
</script>

<input
	bind:this={ref}
	class={['bare grow wmin0 hfull', className]}
	id={id ?? (group.id || undefined)}
	{type}
	{value}
	disabled={disabled ?? group.disabled}
	required={required ?? group.required}
	aria-invalid={group.invalid || undefined}
	aria-describedby={describedby ?? group.describedby}
	oninput={handleInput}
	{...rest}
/>
