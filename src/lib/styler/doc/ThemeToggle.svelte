<!-- @component A button that switches between light and dark mode. -->

<script lang="ts">
	import { Icon } from '@fractaldesign/icons';
	import { luSun, luMoon } from '@fractaldesign/icons/lucide';
	import type { Icon as IconVariant, Size } from '../types';
	import { modeState } from '../mode.svelte';
	import IconButton from '../actions/IconButton.svelte';

	interface Props {
		variant?: IconVariant;
		size?: Size;
		class?: string;
	}

	let { variant = 'ghost', size = 'h-lg', class: className = '' }: Props = $props();

	$effect(() => modeState.init());

	const label = $derived(`Switch to ${modeState.current === 'dark' ? 'light' : 'dark'} mode`);
</script>

<!-- Flips data-mode on <html>, which is all fractalstyler needs to swap token sets. -->
<IconButton {label} icon={variant} {size} shape="modern" class={className} onclick={() => modeState.toggle()}>
	<Icon icon={modeState.current === 'dark' ? luSun : luMoon} />
</IconButton>
