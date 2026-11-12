<!-- @component Leading media — an icon, an avatar, or any custom content. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import type { IconData } from '@fractaldesign/icons';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** An icon drawn as the leading media. Ignored when `children` are provided. */
		icon?: IconData;
		/** Custom media — an Avatar, an image, or anything else that leads the row. */
		children?: Snippet;
	}

	let { icon, class: klass, children, ...rest }: Props = $props();
</script>

<div class={['shrink-0 row ycenter xcenter text-secondary', klass]} {...rest}>
	{#if children}
		{@render children()}
	{:else if icon}
		<Icon {icon} />
	{/if}
</div>
