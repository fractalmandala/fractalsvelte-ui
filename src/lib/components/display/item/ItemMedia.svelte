<!-- @component Leading media — an icon, an avatar, or any custom content. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import type {  IconData  } from '@fractaldesign/icons';
	import type { AlignContent, TextColor } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		icon?: IconData;
		textColor?: TextColor;
		alignContent?: AlignContent;
		children?: Snippet;
	}

	let { icon, textColor = 'text-secondary', alignContent = 'xcenter', class: className, children, ...rest }: Props = $props();
</script>

<div class={['shrink-0 row ycenter', alignContent, textColor, className]} {...rest}>
	{#if children}
		{@render children()}
	{:else if icon}
		<Icon {icon} />
	{/if}
</div>
