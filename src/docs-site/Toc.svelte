<script lang="ts" module>
	export interface TocItem {
		id: string;
		label: string;
		/** 0 = section, 1 = subsection. */
		depth?: number;
	}
</script>

<script lang="ts">
	interface Props {
		/** The headings of the page, in order. */
		items: TocItem[];
	}

	let { items }: Props = $props();

	let active = $state<string | null>(null);

	$effect(() => {
		const ids = items.map((i) => i.id);
		const elements = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
		if (!elements.length) return;
		const visible = new Set<string>();
		const observer = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.isIntersecting) visible.add(e.target.id);
					else visible.delete(e.target.id);
				}
				const first = ids.find((id) => visible.has(id));
				if (first) active = first;
			},
			{ rootMargin: '-72px 0px -60% 0px' }
		);
		for (const el of elements) observer.observe(el);
		return () => observer.disconnect();
	});
</script>

{#if items.length}
	<nav class="toc-section gap-xs pt-2xl pb-xl pr-lg" aria-label="On this page">
		<p class="nav-header text-muted pl-md">On this page</p>
		<ul class="box">
			{#each items as item (item.id)}
				<li>
					<a
						href="#{item.id}"
						class={['toc-link', item.depth ? 'pl-xl text-xs' : '', active === item.id && 'active']}
						aria-current={active === item.id ? 'location' : undefined}>{item.label}</a
					>
				</li>
			{/each}
		</ul>
	</nav>
{/if}
