<script lang="ts">
	import { page } from '$app/state';
	import { guides } from './nav.js';
	import { kitGroups } from './registry.js';

	interface Props {
		/** Called when a link is followed (closes the mobile drawer). */
		onnavigate?: () => void;
	}

	let { onnavigate }: Props = $props();

	const groups = kitGroups().filter((g) => g.components.length > 0);
	const path = $derived(page.url.pathname.replace(/\/$/, '') || '/');
</script>

<nav class="box gap-lg pt-xl pb-2xl px-md scroll-thin" aria-label="Documentation">
	<section class="nav-section gap-xs">
		<p class="nav-header text-muted px-sm">Getting started</p>
		<ul class="box gap-xs">
			{#each guides as g (g.href)}
				<li>
					<a class="item text-sm" href={g.href} aria-current={path === g.href ? 'page' : undefined} onclick={() => onnavigate?.()}>{g.title}</a>
				</li>
			{/each}
		</ul>
	</section>

	<section class="nav-section gap-xs">
		<p class="nav-header text-muted px-sm">Components</p>
		<ul class="box gap-xs">
			<li>
				<a class="item text-sm" href="/components" aria-current={path === '/components' ? 'page' : undefined} onclick={() => onnavigate?.()}>All components</a>
			</li>
		</ul>
	</section>

	{#each groups as g (g.kit.id)}
		<section class="nav-section gap-xs">
			<p class="nav-header text-muted px-sm row xbetween ycenter">
				<span>{g.kit.title}</span>
				<span class="text-xs tabular-nums">{g.components.length}</span>
			</p>
			<ul class="box gap-xs">
				{#each g.components as c (c.href)}
					<li>
						<a class="item text-sm" href={c.href} aria-current={path === c.href ? 'page' : undefined} onclick={() => onnavigate?.()}>{c.name}</a>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</nav>
