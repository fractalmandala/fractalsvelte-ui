<!-- @component A block of code with filename, line numbers and a copy button. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Surface, Border, Shape, Shadow } from '../types';
	import CopyButton from '../actions/CopyButton.svelte';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		code: string;
		language?: string;
		filename?: string;
		showLineNumbers?: boolean;
		copyable?: boolean;
		surface?: Surface;
		border?: Border;
		shape?: Shape;
		shadow?: Shadow;
		class?: string;
	}

	let {
		code,
		language,
		filename,
		showLineNumbers = false,
		copyable = true,
		surface = 'bg-sunken',
		border = 'border',
		shape = 'curved',
		shadow = 'shad-none',
		class: className = '',
		...restProps
	}: Props = $props();

	const lines = $derived(code.split('\n'));

</script>

<div class="box el-shape {surface} {border} {shape} {shadow} {className}" {...restProps}>
	{#if filename || language || copyable}
		<div class="row ycenter xbetween gap-sm px-sm py-xs bb">
			<div class="row ycenter gap-sm min0">
				<svg viewBox="0 0 34 10" width="2.6em" height="0.75em" aria-hidden="true" class="shrink-0">
					<circle cx="5" cy="5" r="4" class="text-danger" fill="currentColor" />
					<circle cx="17" cy="5" r="4" class="text-warning" fill="currentColor" />
					<circle cx="29" cy="5" r="4" class="text-success" fill="currentColor" />
				</svg>
				{#if filename}<span class="text-sm text-secondary truncate">{filename}</span>{/if}
				{#if language}<span class="chip bg-raised text-muted tt-u">{language}</span>{/if}
			</div>
			{#if copyable}
				<CopyButton text={code} variant="ghost" size="h-sm" />
			{/if}
		</div>
	{/if}
	<div class="row scroll-x">
		{#if showLineNumbers}
			<div class="box py-md px-sm br tabular-nums text-sm lh16 ta-r text-muted shrink-0" aria-hidden="true">
				{#each lines as _, i (i)}<span>{i + 1}</span>{/each}
			</div>
		{/if}
		<pre class="pad-md mono text-sm lh16 text-primary grow"><code>{code}</code></pre>
	</div>
</div>
