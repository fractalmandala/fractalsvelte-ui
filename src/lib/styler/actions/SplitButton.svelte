<!-- @component A main action button joined to an arrow button that opens a dropdown. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luChevronDown } from '@fractaldesign/icons/lucide';
	import type { Variant, Size, Shape } from '../types';
	import Button from './Button.svelte';
	import IconButton from './IconButton.svelte';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onclick'> {
		variant?: Variant;
		size?: Size;
		/** Rounds only the outer corners; the join between the two halves stays straight. */
		shape?: Shape;
		disabled?: boolean;
		loading?: boolean;
		dropdownLabel?: string;
		/** Whether the attached menu is open; reflected on the arrow's aria-expanded. */
		expanded?: boolean;
		class?: string;
		children?: Snippet;
		onclick?: (event: MouseEvent) => void;
		ondropdown?: (event: MouseEvent) => void;
	}

	let {
		variant = 'primary',
		size = 'h-md',
		shape = 'min',
		disabled = false,
		loading = false,
		dropdownLabel = 'More options',
		expanded,
		class: className = '',
		children,
		onclick,
		ondropdown,
		...restProps
	}: Props = $props();
</script>

<!-- .split-button (globals.sass) squares the inner corners; the shape class on the group sets the outer radius. -->
<div class="split-button row {shape} {className}" role="group" {...restProps}>
	<Button {variant} {size} {shape} {disabled} {loading} {onclick}>
		{@render children?.()}
	</Button>
	<IconButton
		label={dropdownLabel}
		icon={variant}
		{size}
		{shape}
		{disabled}
		aria-haspopup="menu"
		aria-expanded={expanded}
		onclick={ondropdown}
	>
		<Icon icon={luChevronDown} />
	</IconButton>
</div>
