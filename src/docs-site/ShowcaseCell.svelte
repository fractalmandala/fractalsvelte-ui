<script lang="ts">
	import { Icon } from '@fractaldesign/icons';
	import { luArrowRight } from '@fractaldesign/icons/lucide';
	import { loadExample, type Entry, type LoadedExample } from './registry.js';

	interface Props {
		/** The component to show (its first example). */
		entry: Entry;
	}

	let { entry }: Props = $props();

	let loaded = $state<LoadedExample | null>(null);
	let host = $state<HTMLElement>();

	$effect(() => {
		const el = host;
		const first = entry.examples[0];
		if (!el || !first) return;
		const io = new IntersectionObserver(
			(entries) => {
				if (!entries.some((e) => e.isIntersecting)) return;
				io.disconnect();
				void loadExample(first).then((ex) => (loaded = ex));
			},
			{ rootMargin: '200px' }
		);
		io.observe(el);
		return () => io.disconnect();
	});

	const Demo = $derived(loaded?.component ?? null);
</script>

<article bind:this={host} class="box border radius-bs bg-surface overflow-hidden rim shad-sm lift">
	<div class="stage box xcenter ycenter gap-md pad-lg grow">
		{#if Demo}
			<svelte:boundary>
				<Demo />
				{#snippet failed()}
					<p class="text-sm text-muted">Preview unavailable.</p>
				{/snippet}
			</svelte:boundary>
		{:else}
			<div class="h-lg wfull measure-xs radius-sm anim-shimmer" aria-hidden="true"></div>
		{/if}
	</div>
	<a href={entry.href} class="link-parent row xbetween ycenter gap-sm px-bs py-md bt-sub">
		<span class="box gap-xs min0">
			<span class="link-title text-md weight-500">{entry.name}</span>
			<span class="text-sm text-muted truncate">{entry.summary}</span>
		</span>
		<Icon icon={luArrowRight} class="text-muted shrink-0" />
	</a>
</article>
