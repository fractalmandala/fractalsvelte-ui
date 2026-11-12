<!-- @component A compact ghost button sized to the group, for an action such as Copy. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { Button } from '../../actions/button/index.js';
	import { getInputGroupContext } from './context.js';

	interface Props extends Omit<HTMLButtonAttributes, 'children'> {
		/** The button label, or an icon. */
		children?: Snippet;
	}

	let { type = 'button', disabled, class: klass, children, ...rest }: Props = $props();

	const group = getInputGroupContext();
</script>

<Button
	variant="ghost"
	size={group.size}
	textSize={group.textSize}
	shape="modern"
	{type}
	disabled={disabled ?? group.disabled}
	class={['shrink-0', klass]}
	{...rest}
>
	{@render children?.()}
</Button>
