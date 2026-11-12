<!-- @component A group of controls with one tab stop and arrow-key movement, following the WAI-ARIA toolbar pattern. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { roving } from '../../../internal/roving.js';
	import type { Orientation } from '../../../internal/tokens.js';
	import { setToolbar, toolbarRoving } from './toolbar.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/** The direction the controls run in, and which arrow keys move focus. */
		orientation?: Orientation;
		/** The accessible name of the toolbar. */
		label?: string;
		/** Whether arrow keys wrap from the last control to the first. */
		loop?: boolean;
		/** The buttons, toggles, links, groups and separators. */
		children?: Snippet;
	}

	let {
		orientation = 'horizontal',
		label = 'Toolbar',
		loop = true,
		class: klass,
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
	class={[vertical ? 'box gap-xs' : 'row gap-xs', klass]}
	{@attach roving({ ...toolbarRoving, orientation, loop })}
	{...rest}
>
	{@render children?.()}
</div>
