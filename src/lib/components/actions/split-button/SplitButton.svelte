<!-- @component A primary action with an attached menu of related alternatives. -->

<script lang="ts">
	import { anchor, floating, roving } from '../../../internal/helpers.js';
	import type {  Snippet  } from 'svelte';
	import type {  HTMLButtonAttributes  } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import type {  IconData  } from '@fractaldesign/icons';
	import { luChevronDown } from '@fractaldesign/icons/lucide';
	import { type Placement, type Shape, type Size, type Surface, type TextColor, type TextSize, type Variant } from '../../../internal/tokens.js';
import Button from '../button/Button.svelte';
	import IconButton from '../icon-button/IconButton.svelte';
	import type {  SplitButtonItem  } from './split-button.js';

	interface Props extends Omit<HTMLButtonAttributes, 'children' | 'disabled'> {
		items: SplitButtonItem[];
		variant?: Variant;
		size?: Size;
		textSize?: TextSize;
		textColor?: TextColor;
		shape?: Shape;
		surface?: Surface;
		icon?: IconData;
		placement?: Placement;
		menuLabel?: string;
		loading?: boolean;
		children?: Snippet;
			disabled?: boolean | null;
}

	let {
		items,
		variant = 'primary',
		size = 'h-lg',
		textSize,
		textColor,
		shape = 'modern',
		surface = 'glass',
		icon,
		placement = 'bottom-end',
		menuLabel = 'More actions',
		loading = false,
		disabled,
		class: className,
		children,
		...rest
	}: Props = $props();

	const id = $props.id();
	let menu = $state<HTMLElement>();
	let open = $state(false);

	function onToggle(event: Event) {
		open = (event as ToggleEvent).newState === 'open';
		if (open) menu?.querySelector<HTMLElement>('[role="menuitem"]:not(:disabled)')?.focus();
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Tab') menu?.hidePopover();
	}

	function onTriggerKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown' && !open) {
			event.preventDefault();
			menu?.showPopover();
		}
	}

	function choose(item: SplitButtonItem) {
		menu?.hidePopover();
		item.onSelect();
	}
</script>

<div role="group" class={['split-button anchor', shape, className]} {@attach anchor(id)}>
	<Button {variant} {size} {textSize} {shape} {icon} {loading} {disabled} {...rest}>
		{@render children?.()}
	</Button>
	<IconButton
		icon={luChevronDown}
		label={menuLabel}
		{variant}
		{size}
		{textSize}
		{shape}
		{disabled}
		popovertarget="{id}-menu"
		aria-haspopup="menu"
		aria-expanded={open}
		aria-controls="{id}-menu"
		onkeydown={onTriggerKeydown}
	/>
</div>

<div
	id="{id}-menu"
	popover="auto"
	role="menu"
	aria-label={menuLabel}
	tabindex="-1"
	class={[
		'floating match-anchor pop radius-bs box gap-xs',
		surface,
		'pad-xs',
		`at-${`placement`}`
	]}
	bind:this={menu}
	ontoggle={onToggle}
	onkeydown={onKeydown}
	{@attach floating(id)}
	{@attach roving({ selector: '[role="menuitem"]', typeahead: true })}
>
	{#each items as item (item.label)}
		<button
			type="button"
			role="menuitem"
			class={['item', item.danger && 'tone-danger text-theme']}
			disabled={item.disabled}
			onclick={() => choose(item)}
		>
			{#if item.icon}
				<Icon icon={item.icon} />
			{/if}
			{item.label}
		</button>
	{/each}
</div>
