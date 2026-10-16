<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { Icon } from 'fractalicons';
	import { luX } from 'fractalicons/lucide';
	import type { FsSize } from '../types';
	import IconButton from './IconButton.svelte';

	interface Props extends Omit<HTMLButtonAttributes, 'type'> {
		label?: string;
		size?: FsSize;
		class?: string;
		onclick?: (event: MouseEvent) => void;
	}

	let { label = 'Close', size = 'md', class: className = '', onclick, ...restProps }: Props = $props();
</script>

<IconButton {label} variant="ghost" {size} shape="modern" class="text-muted {className}" {onclick} {...restProps}>
	<Icon icon={luX} />
</IconButton>
