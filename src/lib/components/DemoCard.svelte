<script lang="ts">
	import type { Snippet } from 'svelte';
	import { highlight } from '#lib/docs/highlight.ts';

	type Props = {
		title: string;
		description?: string;
		code: string;
		children?: Snippet;
	};

	let { title, description, code, children }: Props = $props();

	let copied = $state(false);
	let resetTimer: ReturnType<typeof setTimeout> | undefined;
	let highlightedHtml = $state<string>('');

	$effect(() => {
		let active = true;
		highlight(code, 'svelte').then((res) => {
			if (active) highlightedHtml = res;
		});
		return () => {
			active = false;
		};
	});

	async function copyCode() {
		try {
			await navigator.clipboard.writeText(code);
			copied = true;
			clearTimeout(resetTimer);
			resetTimer = setTimeout(() => (copied = false), 2000);
		} catch {
			// Clipboard unavailable — nothing further to do.
		}
	}
</script>

<figure class="demo-card">
	<figcaption class="demo-card__meta">
		<div class="demo-card__info">
			<strong class="demo-card__title">{title}</strong>
			{#if description}
				<p class="text-muted text-sm">{description}</p>
			{/if}
		</div>
		<button type="button" class="playground__copy-btn" class:copied onclick={copyCode}>
			{#if copied}✓ Copied!{:else}📋 Copy{/if}
		</button>
	</figcaption>
	<div class="demo-card__preview">
		{@render children?.()}
	</div>
	<div class="playground__code-content">
		{#if highlightedHtml}
			{@html highlightedHtml}
		{:else}
			<pre><code>{code}</code></pre>
		{/if}
	</div>
</figure>

