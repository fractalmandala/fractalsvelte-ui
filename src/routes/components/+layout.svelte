<script lang="ts">

	import { Icon } from '@fractaldesign/icons'
	import IconTextButton from '#lib/styler/actions/IconTextButton.svelte'
	import { reMarkdownLine, reFileCopyLine, reRobot2Line } from '@fractaldesign/icons/remix'
	import { onMount } from 'svelte'
	import { page } from '$app/state'
	import { htmlToMarkdown } from '#lib/utils/htmlToMarkdown'
	let { children, data } = $props()
	let query = $state('');
	const needle = $derived(query.trim().toLowerCase());
	const match = (name: string) => !needle || name.toLowerCase().includes(needle);
	const groups = $derived(
		data.groups
			.map((group) => ({ ...group, items: group.items.filter((item) => match(item.name)) }))
			.filter((group) => group.items.length)
	);

	// ---- On this page: built from the h2/h3 headings inside the content section ----
	let content: HTMLElement;
	let toc = $state<{ id: string; text: string; level: number }[]>([]);
	const slugify = (t: string) => t.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

	function buildToc() {
		if (!content) return;
		const used = new Set<string>();
		toc = Array.from(content.querySelectorAll<HTMLElement>('h2, h3')).map((h) => {
			const text = (h.innerText || h.textContent || '').trim();
			let id = h.id || slugify(text) || 'section';
			while (used.has(id)) id += '-x';
			used.add(id);
			h.id = id;
			return { id, text, level: h.tagName === 'H2' ? 2 : 3 };
		});
	}

	onMount(() => {
		// headings arrive with each navigation and with lazily loaded demos, so watch the DOM
		let raf = 0;
		const obs = new MutationObserver(() => {
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(buildToc);
		});
		obs.observe(content, { childList: true, subtree: true });
		buildToc();
		return () => {
			obs.disconnect();
			cancelAnimationFrame(raf);
		};
	});

	// ---- page actions ----
	let copied = $state(false);
	const markdown = () => htmlToMarkdown(content);

	async function copyPage() {
		await navigator.clipboard.writeText(markdown());
		copied = true;
		setTimeout(() => (copied = false), 1600);
	}

	function openMarkdown() {
		const url = URL.createObjectURL(new Blob([markdown()], { type: 'text/plain;charset=utf-8' }));
		window.open(url, '_blank');
		setTimeout(() => URL.revokeObjectURL(url), 60_000);
	}

	// The link builds itself from the current URL; on localhost it falls back to the live site.
	const SITE = 'https://www.fractalsvelte.com';
	function sendToAI() {
		const origin = /localhost|127\.0\.0\.1/.test(page.url.hostname) ? SITE : page.url.origin;
		const link = origin + page.url.pathname;
		const prompt = `I'm looking at this fractalsvelte documentation: ${link}\nPlease help me understand how to use it. Give examples.`;
		window.open(`https://chatgpt.com/?q=${encodeURIComponent(prompt)}`, '_blank', 'noopener');
	}
</script>

<aside class="sidebar-left px-lg py-lg">
	<nav class="box gap-xl">
			{#each groups as group (group.category)}
		<div class="nav-section">
			<p class="tt-u text-primary weight-600 text-xs pl-sm">{group.category}</p>
			<div class="box gap-">
				{#each group.items as item (item.slug)}
				<a class="nav-link" href={item.slug}>{item.name}</a>
				{/each}
			</div>
		</div>
	{/each}
	</nav>
</aside>
<section class="main-section py-lg">
	<section class="content-section narrow-full" bind:this={content}>
		{@render children()}
	</section>
</section>
<aside class="sidebar-right px-lg py-lg">
	
	<div class="box gap-md">
			<IconTextButton label={copied ? 'Copied' : 'Copy this Page'} shape="min" icon="secondary" size="h-md" onclick={copyPage}>
		<Icon icon={reFileCopyLine}/>
	</IconTextButton>
	<IconTextButton label="Open as Markdown" shape="min" icon="secondary" size="h-md" onclick={openMarkdown}>
		<Icon icon={reMarkdownLine}/>
	</IconTextButton>
	<IconTextButton label="Send to AI" shape="min" icon="secondary" size="h-md" onclick={sendToAI}>
		<Icon icon={reRobot2Line}/>
	</IconTextButton>
	</div>
</aside>