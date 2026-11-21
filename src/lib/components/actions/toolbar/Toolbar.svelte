<!-- @component A group of controls with one tab stop and arrow-key movement, following the WAI-ARIA toolbar pattern. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { roving } from '../../../internal/helpers.js';
import type {  Gap, Orientation  } from '../../../internal/tokens.js';
	import { setToolbar, toolbarRoving } from './toolbar.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		orientation?: Orientation;
		gap?: Gap;
		label?: string;
		loop?: boolean;
		children?: Snippet;
	}

	let {
		orientation = 'horizontal',
		gap = 'gap-xs',
		label = 'Toolbar',
		loop = true,
		class: className,
		children,
		...rest
	}: Props = $props();

	const vertical = $derived(orientation === 'vertical');

	setToolbar({
		get orientation() {
			return orientation;
		}
	});
</script>

<div
	role="toolbar"
	aria-label={label}
	aria-orientation={orientation}
	class={[vertical ? 'box' : 'row', gap, className]}
	{@attach roving({ ...toolbarRoving, orientation, loop })}
	{...rest}
>
	{@render children?.()}
</div>
