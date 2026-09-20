<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.guide.title} — Fractalsvelte UI</title>
	<meta name="description" content={`Fractalsvelte UI guide: ${data.guide.title}`} />
</svelte:head>

<article class="content-section narrow-full box gap-md">
	<a class="button ghost sm" href="/guides">← All guides</a>
	<div class="prose">
		{@html data.guide.html}
	</div>
</article>
