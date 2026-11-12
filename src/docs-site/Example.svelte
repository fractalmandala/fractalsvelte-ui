<script lang="ts">
	import { Icon } from '@fractaldesign/icons';
	import { luCode, luEye, luTriangleAlert } from '@fractaldesign/icons/lucide';
	import CodeBlock from './CodeBlock.svelte';
	import Rich from './Rich.svelte';
	import { displaySource, type LoadedExample } from './registry.js';

	interface Props {
		/** The loaded example: its component and its source. */
		example: LoadedExample;
		/** The heading id, for the table of contents. */
		id: string;
	}

	let { example, id }: Props = $props();

	let view = $state<'preview' | 'code'>('preview');
	const source = $derived(displaySource(example.source));
	const Demo = $derived(example.component);
	// Previews render in the browser only: example links point at realistic,
	// non-existent pages, which the prerender crawler must not follow.
	let mounted = $state(false);
	$effect(() => {
		mounted = true;
	});
</script>

<section class="box gap-md" aria-labelledby={id}>
	<div class="box gap-xs">
		<h3 {id} class="page-heading-bs anchored">{example.title}</h3>
		{#if example.description}
			<p class="text-md text-secondary"><Rich text={example.description} /></p>
		{/if}
	</div>

	<div class="border radius-bs bg-surface overflow-hidden rim shad-sm">
		<div class="row xbetween ycenter gap-sm px-sm py-xs bb-sub">
			<div class="row ycenter gap-xs" role="group" aria-label="View">
				<button
					type="button"
					class={['ghost h-bs px-md mincurved text-sm gap-xs', view === 'preview' ? 'selected text-primary' : 'text-muted']}
					aria-pressed={view === 'preview'}
					onclick={() => (view = 'preview')}
				>
					<Icon icon={luEye} /> Preview
				</button>
				<button
					type="button"
					class={['ghost h-bs px-md mincurved text-sm gap-xs', view === 'code' ? 'selected text-primary' : 'text-muted']}
					aria-pressed={view === 'code'}
					onclick={() => (view = 'code')}
				>
					<Icon icon={luCode} /> Code
				</button>
			</div>
			<span class="text-xs font-mono text-muted truncate">{example.file}</span>
		</div>

		{#if view === 'preview'}
			<div class="stage box xcenter ycenter gap-md pad-xl">
				{#if example.error}
					<p class="row ycenter gap-sm text-sm text-danger"><Icon icon={luTriangleAlert} /> This example failed to load: {example.error}</p>
				{:else if Demo && mounted}
					<svelte:boundary>
						<Demo />
						{#snippet failed(error)}
							<p class="row ycenter gap-sm text-sm text-danger">
								<Icon icon={luTriangleAlert} /> This example threw: {error instanceof Error ? error.message : String(error)}
							</p>
						{/snippet}
					</svelte:boundary>
				{:else}
					<div class="h-lg wfull measure-xs radius-sm anim-shimmer" aria-hidden="true"></div>
				{/if}
			</div>
		{:else}
			<CodeBlock code={source} lang="svelte" bare tall />
		{/if}
	</div>
</section>
