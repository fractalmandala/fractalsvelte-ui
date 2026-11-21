<!-- @component One toggle in the group. Its `value` joins the group value while it is on. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLButtonAttributes  } from 'svelte/elements';
	import type {  IconData  } from '@fractaldesign/icons';
	import Toggle from '../toggle/Toggle.svelte';
	import { getToggleGroup } from './toggle-group.js';

	interface Props extends Omit<HTMLButtonAttributes, 'value' | 'children'> {
		value: string;
		icon?: IconData;
		children?: Snippet;
	}

	let { value, icon, disabled = false, children, ...rest }: Props = $props();

	const group = getToggleGroup();
</script>

<Toggle
	{icon}
	{children}
	pressed={group.isPressed(value)}
	onPressedChange={() => group.toggle(value)}
	variant={group.variant}
	size={group.size}
	textSize={group.textSize}
	textColor={group.textColor}
	shape={group.shape}
	disabled={disabled || group.disabled}
	data-roving=""
	{...rest}
/>
