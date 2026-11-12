<!-- @component One toggle in the group. Its `value` joins the group value while it is on. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { IconData } from '@fractaldesign/icons';
	import Toggle from '../toggle/Toggle.svelte';
	import { getToggleGroup } from './toggle-group.js';

	interface Props extends Omit<HTMLButtonAttributes, 'value' | 'children'> {
		/** The value this item contributes to the group's `value` while it is on. */
		value: string;
		/** An icon drawn before the label. With no label, set `aria-label`. */
		icon?: IconData;
		/** The label. Omit it for an icon-only item. */
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
	shape={group.shape}
	disabled={disabled || group.disabled}
	data-roving=""
	{...rest}
/>
