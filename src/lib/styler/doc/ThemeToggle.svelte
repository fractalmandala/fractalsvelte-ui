<script lang="ts">
	import { Icon } from 'fractalicons';
	import { luSun, luMoon } from 'fractalicons/lucide';
	import type { FsSize, FsVariant } from '../types';
	import { modeState } from '../mode.svelte';

	interface Props {
		variant?: FsVariant | 'iconbox';
		size?: FsSize;
		class?: string;
	}

	let { variant = 'ghost', size = 'lg', class: className = '' }: Props = $props();

	$effect(() => modeState.init());
</script>

<!-- Flips data-mode on <html>, which is all fractalstyler needs to swap token
     sets. The original's theme-style pills are gone: fractalstyler compiles a
     single palette, with no per-style hooks to switch. -->
<button
	type="button"
	class="frame-1-1 px-xs {className}"
	data-variant={variant}
	data-size={size}
	data-shape="modern"
	aria-label="Switch to {modeState.current === 'dark' ? 'light' : 'dark'} mode"
	title="Switch to {modeState.current === 'dark' ? 'light' : 'dark'} mode"
	onclick={() => modeState.toggle()}
>
	<Icon icon={modeState.current === 'dark' ? luSun : luMoon} />
</button>
