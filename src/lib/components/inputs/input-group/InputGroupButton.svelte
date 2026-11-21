<!-- @component A compact ghost button sized to the group, for an action such as Copy. -->

<script lang="ts">
	import type {  Snippet, ComponentProps  } from 'svelte';
	import type {  HTMLButtonAttributes  } from 'svelte/elements';
	import { Button } from '../../actions/button/index.js';
	import { getInputGroupContext } from './context.js';

	interface Props extends Omit<HTMLButtonAttributes, 'children'> {
		children?: Snippet;
		buttonProps?: ComponentProps<typeof Button>;
	}

	let { type = 'button', disabled, class: className, children, buttonProps, ...rest }: Props = $props();

	const group = getInputGroupContext();
</script>

<Button
	variant="ghost"
	size={group.size}
	textSize={group.textSize}
	shape="modern"
	{type}
	disabled={disabled ?? group.disabled}
	class={['shrink-0', className, buttonProps?.class]}
	{...rest}
	{...buttonProps}
>
	{@render children?.()}
</Button>
