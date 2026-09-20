<script lang="ts">
	import type { Snippet } from 'svelte';
	import { highlight } from '#lib/docs/highlight.ts';
	import Copy from '#lib/icons/copy.svelte';
	import Copied from '#lib/icons/copied.svelte';
	import SegmentedControl, { type SegmentOption } from './SegmentedControl.svelte';

	export type DemoOption<T extends string = string> = {
		value: T;
		label: string;
		code?: string;
	};

	type Props = {
		title: string;
		description?: string;
		code?: string;
		options?: Array<DemoOption | string>;
		selected?: string;
		onSelect?: (value: string) => void;
		children?: Snippet<[selected: string]>;
		class?: string;
	};

	let {
		title,
		description,
		code = '',
		options,
		selected = $bindable(''),
		onSelect,
		children,
		class: className = ''
	}: Props = $props();

	const rootClass = $derived(['demo-card', className].filter(Boolean).join(' '));

	const normalizedOptions = $derived<SegmentOption[]>(
		(options ?? []).map((opt) =>
			typeof opt === 'string'
				? { value: opt, label: opt.charAt(0).toUpperCase() + opt.slice(1) }
				: { value: opt.value, label: opt.label }
		)
	);

	let internalSelected = $state<string>('');

	const currentSelected = $derived(
		internalSelected || selected || (options && options.length > 0 ? (typeof options[0] === 'string' ? options[0] : options[0].value) : '')
	);

	const activeCode = $derived.by(() => {
		if (options && options.length > 0) {
			const match = options.find((opt) => (typeof opt === 'string' ? opt : opt.value) === currentSelected);
			if (match && typeof match !== 'string' && match.code) {
				return match.code;
			}
		}
		return code;
	});

	let copied = $state(false);
	let resetTimer: ReturnType<typeof setTimeout> | undefined;
	let highlightedHtml = $state<string>('');

	$effect(() => {
		let active = true;
		highlight(activeCode, 'svelte').then((res) => {
			if (active) highlightedHtml = res;
		});
		return () => {
			active = false;
		};
	});

	async function copyCode() {
		try {
			await navigator.clipboard.writeText(activeCode);
			copied = true;
			clearTimeout(resetTimer);
			resetTimer = setTimeout(() => (copied = false), 2000);
		} catch {
			// Clipboard unavailable — nothing further to do.
		}
	}

	function handleSelect(val: string) {
		internalSelected = val;
		selected = val;
		onSelect?.(val);
	}
</script>

<figure class={rootClass}>
	<figcaption class="demo-card-header">
		<div class="box gap-3xs grow">
			<h3 class="demo-card-title text-lg weight-600">{title}</h3>
			{#if description}
				<p class="text-muted text-sm">{description}</p>
			{/if}
		</div>
		{#if normalizedOptions.length > 0}
			<div class="demo-card-selector shrink-0">
				<SegmentedControl
					options={normalizedOptions}
					value={currentSelected}
					onValueChange={handleSelect}
					label="{title} variation selector"
				/>
			</div>
		{/if}
	</figcaption>
	<div class="demo-card-preview">
		{@render children?.(currentSelected)}
	</div>
	<div class="playground-code-block">
		<div class="playground-code-header">
			<span>Svelte</span>
			<button
				type="button"
				class="is-icon"
				data-copied={copied || undefined}
				onclick={copyCode}
				aria-label="Copy {title} recipe code"
			>
				{#if copied}
					<Copied />
				{:else}
					<Copy />
				{/if}
			</button>
		</div>
		<div class="playground-code-content">
			{#if highlightedHtml}
				{@html highlightedHtml}
			{:else}
				<pre><code>{activeCode}</code></pre>
			{/if}
		</div>
	</div>
</figure>

<style lang="sass">
.demo-card
	display: flex
	flex-direction: column
	overflow: hidden
	gap: var(--space-md)

	&-header
		display: flex
		align-items: center
		justify-content: space-between
		flex-wrap: wrap
		gap: var(--space-sm)

	&-selector
		display: flex
		align-items: center

	&-title
		font-size: var(--text-lg)
		font-weight: 600

	&-preview
		display: grid
		place-items: center
		min-height: 80px
		padding: var(--space-bs)
		border: 1px solid var(--border-subtle)
		border-radius: var(--radius-md)
		background: var(--bg-sunken)
		gap: var(--space-md)

	.playground-code-block
		display: flex
		flex-direction: column
		border: 1px solid var(--border-subtle)
		border-radius: var(--radius-md)
		overflow: hidden
		width: 100%

	.playground-code-header
		display: flex
		align-items: center
		justify-content: space-between
		padding-inline: var(--space-sm)
		font-weight: 600
		font-size: var(--text-xs)
		text-transform: capitalize
		letter-spacing: -0.02em
		height: 32px
		border-bottom: 1px solid var(--border-subtle)
		background: var(--bg-raised)
		color: var(--text-primary)

		button[data-copied]
			color: var(--success)

	.playground-code-content
		margin: 0
		overflow-x: auto
		pre
			margin: 0
			padding: var(--space-lg)
			overflow-x: auto
		code
			font-family: var(--font-mono)
			font-size: var(--text-xs)
			line-height: 1.6
</style>
