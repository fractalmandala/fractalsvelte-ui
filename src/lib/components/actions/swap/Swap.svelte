<!-- @component Two-state toggle button that animates between active and inactive content. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLButtonAttributes  } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luCheck, luPlus } from '@fractaldesign/icons/lucide';
	import { press } from '../../../motion/index.js';
	import type {  AlignContent, Shape, Size, TextColor, TextSize, Variant  } from '../../../internal/tokens.js';

	interface Props extends Omit<HTMLButtonAttributes, 'children' | 'disabled'> {
		active?: boolean;
		onActiveChange?: (active: boolean) => void;
		effect?: 'rotate' | 'flip' | 'fade';
		variant?: Variant;
		size?: Size;
		textSize?: TextSize;
		textColor?: TextColor;
		alignContent?: AlignContent;
		shape?: Shape;
		disabled?: boolean;
		label?: string;
		on?: Snippet;
		off?: Snippet;
	}

	let {
		active = $bindable(false),
		onActiveChange,
		effect = 'rotate',
		variant = 'ghost',
		size = 'h-lg',
		textSize,
		textColor,
		alignContent = 'xcenter',
		shape = 'modern',
		disabled = false,
		label = 'Toggle state',
		on,
		off,
		class: className,
		onclick,
		...rest
	}: Props = $props();


	function toggle(event: MouseEvent & { currentTarget: HTMLButtonElement }) {
		if (disabled) return;
		active = !active;
		onActiveChange?.(active);
		onclick?.(event);
	}
</script>

<button
	type="button"
	aria-label={label}
	aria-pressed={active}
	{disabled}
	class={['button btn-icon row ycenter', alignContent, variant, size, textSize, shape, className]}
	{@attach press()}
	onclick={toggle}
	{...rest}
>
	<span class={['swap', effect !== 'rotate' && effect]} aria-hidden="true">
		<span class={active ? 'selected inline-flex xcenter ycenter' : 'inline-flex xcenter ycenter'}>
			{#if on}
				{@render on()}
			{:else}
				<Icon icon={luCheck} />
			{/if}
		</span>
		<span class={!active ? 'selected inline-flex xcenter ycenter' : 'inline-flex xcenter ycenter'}>
			{#if off}
				{@render off()}
			{:else}
				<Icon icon={luPlus} />
			{/if}
		</span>
	</span>
</button>
