<script lang="ts" module>
	export interface TerminalLineItem {
		command?: string;
		output?: string;
		/** ms before this line appears when animated */
		delay?: number;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from 'fractalicons';
	import { luCopy, luCheck } from 'fractalicons/lucide';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		title?: string;
		lines?: (TerminalLineItem | string)[];
		prompt?: string;
		showControls?: boolean;
		allowCopy?: boolean;
		/** Reveal lines one at a time */
		animated?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		title = 'bash',
		lines = [],
		prompt = '$ ',
		showControls = true,
		allowCopy = true,
		animated = false,
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	let copied = $state(false);
	const normalized = $derived(lines.map((l) => (typeof l === 'string' ? { command: l } : l)));
	const allText = $derived(
		normalized
			.map((l) => (l.command ? `${prompt}${l.command}` : '') + (l.output ? `\n${l.output}` : ''))
			.filter(Boolean)
			.join('\n')
	);

	let shown = $state(0);
	$effect(() => {
		const list = normalized;
		if (!animated) {
			shown = list.length;
			return;
		}
		shown = 0;
		let t: ReturnType<typeof setTimeout>;
		const next = (i: number) => {
			if (i >= list.length) return;
			t = setTimeout(() => {
				shown = i + 1;
				next(i + 1);
			}, list[i].delay ?? 400);
		};
		next(0);
		return () => clearTimeout(t);
	});

	async function copy() {
		try {
			await navigator.clipboard.writeText(allText);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch {
			// clipboard blocked; nothing to do
		}
	}
</script>

<!-- data-mode="dark" scopes fractalstyler's dark tokens to this subtree, so the
     terminal stays dark on a light page with no colour of its own. -->
<div data-mode="dark" class="box bg-main text-primary border-strong radius-md shadow-lg {className}" {...restProps}>
	<header class="row ycenter xbetween gap-sm px-sm py-xs bb">
		<div class="row ycenter gap-sm min0">
			{#if showControls}
				<svg viewBox="0 0 34 10" width="2.6em" height="0.75em" aria-hidden="true" class="shrink-0">
					<circle cx="5" cy="5" r="4" class="text-danger" fill="currentColor" />
					<circle cx="17" cy="5" r="4" class="text-warning" fill="currentColor" />
					<circle cx="29" cy="5" r="4" class="text-success" fill="currentColor" />
				</svg>
			{/if}
			<span class="text-sm mono text-muted truncate">{title}</span>
		</div>
		{#if allowCopy}
			<button type="button" data-variant="ghost" data-size="md" class="gap-xs px-sm" aria-label="Copy terminal contents" aria-live="polite" onclick={copy}>
				{#if copied}<Icon icon={luCheck} class="text-success" /> Copied{:else}<Icon icon={luCopy} /> Copy{/if}
			</button>
		{/if}
	</header>
	<div class="box gap-xs pad-md mono text-sm lh16 scroll-x">
		{#each normalized.slice(0, shown) as line, i (i)}
			{#if line.command}
				<div class="row gap-xs"><span class="text-theme shrink-0">{prompt}</span><span>{line.command}</span></div>
			{/if}
			{#if line.output}<pre class="text-secondary">{line.output}</pre>{/if}
		{/each}
		<div class="row ycenter gap-xs" aria-hidden="true">
			<span class="text-theme">{prompt}</span>
			<svg viewBox="0 0 6 12" width="0.5em" height="1em" class="text-primary">
				<rect width="6" height="12" fill="currentColor">
					<animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.5;0.5;1" dur="1s" repeatCount="indefinite" />
				</rect>
			</svg>
		</div>
		{@render children?.()}
	</div>
</div>
