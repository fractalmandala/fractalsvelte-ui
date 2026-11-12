<script lang="ts">

	import type { Snippet } from 'svelte';
	import { type ControlAlignment } from '../../lib/internal/tokens.js';
	import type { HTMLAttributes } from 'svelte/elements';
	
	interface Props extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
		children: Snippet;
		controlAlignment?: ControlAlignment;
		controlClamp?: string;
		gap?: string;
	}

	let { children, controlAlignment = 'xcenter', controlClamp = 'content-section narrow-wide', gap = 'gap-2xl', class: className, ...rest }:Props = $props()

</script>

<section class="page-section box ycenter {gap} {controlClamp} {controlAlignment} {className}" {...rest}>
	{@render children()}
</section>