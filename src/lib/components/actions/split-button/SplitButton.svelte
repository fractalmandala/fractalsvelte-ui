<!-- @component A primary action with an attached menu of related alternatives. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import type { IconData } from '@fractaldesign/icons';
	import { luChevronDown } from '@fractaldesign/icons/lucide';
	import { anchor, floating } from '../../../internal/floating.js';
	import { roving } from '../../../internal/roving.js';
	import { placementClass, type Shape, type Size, type Variant } from '../../../internal/tokens.js';
	import Button from '../button/Button.svelte';
	import IconButton from '../icon-button/IconButton.svelte';
	import type { SplitButtonItem, SplitButtonPlacement } from './split-button.js';

	interface Props extends Omit<HTMLButtonAttributes, 'children'> {
		/** The menu rows shown when the chevron is pressed. */
		items: SplitButtonItem[];
		/** The visual style of both halves. */
		variant?: Variant;
		/** The control height. Text follows this unless `textSize` is set. */
		size?: Size;
		/** The text scale, independent of the control height. Follows `size` when omitted. */
		textSize?: Size;
		/** The corner shape of the outer corners. */
		shape?: Shape;
		/** An icon drawn before the primary label. */
		icon?: IconData;
		/** Where the menu opens relative to the whole control. */
		placement?: SplitButtonPlacement;
		/** The accessible name of the chevron button. */
		menuLabel?: string;
		/** Shows a spinner on the primary action and blocks it. The menu stays available. */
		loading?: boolean;
		/** The primary action's label. */
		children?: Snippet;
	}

	let {
		items,
		variant = 'primary',
		size = 'md',
		textSize,
		shape = 'modern',
		icon,
		placement = 'bottom-end',
		menuLabel = 'More actions',
		loading = false,
		disabled,
		class: klass,
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

<div role="group" class={['split-button anchor', shape, klass]} {@attach anchor(id)}>
	<Button {variant} {size} {textSize} {shape} {icon} {loading} {disabled} {...rest}>
		{@render children?.()}
	</Button>
	<IconButton
		icon={luChevronDown}
		label={menuLabel}
		{variant}
		{size}
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
		'floating match-anchor pop glass rim shad-lg border-subtle radius-bs pad-xs box gap-xs',
		placementClass[placement]
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
			class={['item', item.danger && 'text-danger']}
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
