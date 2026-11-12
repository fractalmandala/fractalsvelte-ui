<!-- @component Draws keyboard keys as key caps, with mod resolved to ⌘ or Ctrl by platform. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		/** The keys to draw, in order. `mod` is drawn as ⌘ on Apple platforms and as Ctrl elsewhere. */
		keys?: string[];
		/** The text drawn between two keys. */
		separator?: string;
		/** The key cap height. Text follows this unless `textSize` is set. */
		size?: 'sm' | 'md' | 'lg';
		/** The text scale, independent of the cap height. Follows `size` when omitted. */
		textSize?: 'sm' | 'md' | 'lg';
		/** The key label, used when `keys` is not given. */
		children?: Snippet;
	}

	let { keys, separator = '+', size = 'md', textSize, class: klass, children, ...rest }: Props = $props();

	// Platform is detected after mount only, so the server render never claims a platform it cannot know.
	let apple = $state(false);
	$effect(() => {
		apple = /Macintosh|iPhone|iPad|iPod/.test(navigator.userAgent);
	});

	function keyLabel(key: string): string {
		if (key === 'mod') return apple ? '⌘' : 'Ctrl';
		return key;
	}

	const heightClasses = {
		sm: 'h-md',
		md: 'h-bs',
		lg: 'h-lg'
	};
	const textClasses = {
		sm: 'text-xs',
		md: 'text-sm',
		lg: 'text-md'
	};

	const classes = $derived(['inline-flex xcenter gap-xs', klass]);
	const capClasses = $derived(['kbd', heightClasses[size], textClasses[textSize ?? size]]);
</script>

<span class={classes} {...rest}>
	{#if keys?.length}
		{#each keys as key, i (i)}
			{#if i > 0}
				<span class="text-muted" aria-hidden="true">{separator}</span>
			{/if}
			<kbd class={capClasses}>{keyLabel(key)}</kbd>
		{/each}
	{:else}
		<kbd class={capClasses}>{@render children?.()}</kbd>
	{/if}
</span>
