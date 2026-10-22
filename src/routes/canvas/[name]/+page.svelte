<script lang="ts">
	import DynamicPreview from '../../components/[name]/DynamicPreview.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.component.name} — Canvas</title>
</svelte:head>

<div class="f-canvas-surface">
	<div class="f-canvas-artboard">
		<DynamicPreview name={data.component.name} category={data.component.category} />
	</div>
</div>

<style>
	:global(html, body) {
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
		background: transparent;
		overflow: auto;
	}

	.f-canvas-surface {
		min-height: 100vh;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 3rem;
		box-sizing: border-box;
		background: transparent;
	}

	.f-canvas-artboard {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		max-width: 100%;
	}

	:global(.f-canvas-artboard .f-live-stage) {
		background: transparent !important;
		border: none !important;
		padding: 0 !important;
		box-shadow: none !important;
	}
</style>
