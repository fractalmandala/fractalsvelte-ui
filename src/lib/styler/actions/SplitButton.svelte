<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from 'fractalicons';
	import { luChevronDown } from 'fractalicons/lucide';
	import type { FsVariant, FsSize } from '../types';
	import Button from './Button.svelte';
	import IconButton from './IconButton.svelte';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onclick'> {
		variant?: FsVariant;
		size?: FsSize;
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
		size = 'md',
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

<!-- .split-button squares the inner corners and overlaps the shared border. -->
<div class="split-button {className}" role="group" {...restProps}>
	<Button {variant} {size} {disabled} {loading} {onclick}>
		{@render children?.()}
	</Button>
	<IconButton
		label={dropdownLabel}
		{variant}
		{size}
		{disabled}
		aria-haspopup="menu"
		aria-expanded={expanded}
		onclick={ondropdown}
	>
		<Icon icon={luChevronDown} />
	</IconButton>
</div>
