<!-- @component Draws keyboard keys as key caps, with mod resolved to ⌘ or Ctrl by platform. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import { type Size, type TextColor, type TextSize } from '../../../internal/tokens.js';
	import type {  HTMLAttributes  } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		keys?: string[];
		separator?: string;
		size?: Size;
		textSize?: TextSize;
		textColor?: TextColor;
		children?: Snippet;
	}

	let { keys, separator = '+', size = 'h-md', textSize, textColor = 'text-muted', class: className, children, ...rest }: Props = $props();

	// Platform is detected after mount only, so the server render never claims a platform it cannot know.
	let apple = $state(false);
	$effect(() => {
		apple = /Macintosh|iPhone|iPad|iPod/.test(navigator.userAgent);
	});

	function keyLabel(key: string): string {
		if (key === 'mod') return apple ? '⌘' : 'Ctrl';
		return key;
	}


	const classes = $derived(['inline-flex xcenter gap-xs', className]);
	const capClasses = $derived(['kbd', size, textSize]);
</script>

<span class={classes} {...rest}>
	{#if keys?.length}
		{#each keys as key, i (i)}
			{#if i > 0}
				<span class={textColor} aria-hidden="true">{separator}</span>
			{/if}
			<kbd class={capClasses}>{keyLabel(key)}</kbd>
		{/each}
	{:else}
		<kbd class={capClasses}>{@render children?.()}</kbd>
	{/if}
</span>
