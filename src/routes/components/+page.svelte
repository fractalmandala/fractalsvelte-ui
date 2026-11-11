<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Components — fractalsvelte ui</title>
</svelte:head>

<header class="page-header">
	<h1 class="page-title">Components</h1>
	<p class="page-desc text-secondary lh16">
		All components in fractalsvelte-ui, grouped as they are in the library.
	</p>
</header>

<article class="compdocs">
	{#each data.groups as group (group.category)}
		<section class="page-section">
			<h2 class="page-heading-xl">{group.label}</h2>
			<div class="grid-3 gap-bs">
				{#each group.items as item (item.slug)}
					<a href={item.slug} class="card bg-surface pad-bs modern box gap-sm">
						<span class="card-title weight-600 text-primary">{item.name}</span>
						{#if item.description}
							<span class="card-desc text-body-sm text-secondary">{item.description}</span>
						{/if}
					</a>
				{/each}
			</div>
		</section>
	{/each}
</article>
