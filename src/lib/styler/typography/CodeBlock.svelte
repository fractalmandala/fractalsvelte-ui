<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from 'fractalicons';
	import { luCopy, luCheck } from 'fractalicons/lucide';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		code: string;
		language?: string;
		filename?: string;
		showLineNumbers?: boolean;
		copyable?: boolean;
		class?: string;
	}

	let {
		code,
		language,
		filename,
		showLineNumbers = false,
		copyable = true,
		class: className = '',
		...restProps
	}: Props = $props();

	let copied = $state(false);
	const lines = $derived(code.split('\n'));

	async function copy() {
		try {
			await navigator.clipboard.writeText(code);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch (err) {
			console.error('Failed to copy code to clipboard', err);
		}
	}
</script>

<div class="box border radius-md bg-sunken {className}" {...restProps}>
	{#if filename || language || copyable}
		<div class="row ycenter xbetween gap-sm px-sm py-xs bb">
			<div class="row ycenter gap-sm min0">
				<svg viewBox="0 0 34 10" width="2.6em" height="0.75em" aria-hidden="true" class="shrink-0">
					<circle cx="5" cy="5" r="4" class="text-danger" fill="currentColor" />
					<circle cx="17" cy="5" r="4" class="text-warning" fill="currentColor" />
					<circle cx="29" cy="5" r="4" class="text-success" fill="currentColor" />
				</svg>
				{#if filename}<span class="text-sm mono text-secondary truncate">{filename}</span>{/if}
				{#if language}<span class="chip bg-raised text-muted tt-u">{language}</span>{/if}
			</div>
			{#if copyable}
				<button
					type="button"
					data-variant="ghost"
					data-size="md"
					class="gap-xs px-sm"
					aria-label={copied ? 'Copied code' : 'Copy code to clipboard'}
					aria-live="polite"
					onclick={copy}
				>
					{#if copied}<Icon icon={luCheck} class="text-success" /> Copied{:else}<Icon icon={luCopy} /> Copy{/if}
				</button>
			{/if}
		</div>
	{/if}
	<div class="row scroll-x">
		{#if showLineNumbers}
			<div class="box py-md px-sm br mono text-sm lh16 ta-r text-muted shrink-0" aria-hidden="true">
				{#each lines as _, i (i)}<span>{i + 1}</span>{/each}
			</div>
		{/if}
		<pre class="pad-md mono text-sm lh16 text-primary grow"><code>{code}</code></pre>
	</div>
</div>
