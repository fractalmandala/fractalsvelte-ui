<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		code: string;
		language?: string;
		filename?: string;
		showLineNumbers?: boolean;
		copyable?: boolean;
		maxHeight?: string;
		class?: string;
	}

	let {
		code,
		language,
		filename,
		showLineNumbers = false,
		copyable = true,
		maxHeight,
		class: className = '',
		...restProps
	}: Props = $props();

	let copied = $state(false);

	async function handleCopy() {
		try {
			await navigator.clipboard.writeText(code);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy code to clipboard', err);
		}
	}

	const lines = $derived(code.split('\n'));
</script>

<div
	class="f-code-block {className}"
	{...restProps}
>
	{#if filename || language || copyable}
		<div class="f-code-header">
			<div class="f-code-header-left">
				<span class="f-code-dots" aria-hidden="true">
					<span class="f-code-dot"></span>
					<span class="f-code-dot"></span>
					<span class="f-code-dot"></span>
				</span>
				{#if filename}
					<span class="f-code-filename">{filename}</span>
				{/if}
				{#if language}
					<span class="f-code-lang">{language}</span>
				{/if}
			</div>

			{#if copyable}
				<button
					type="button"
					class="f-code-copy"
					onclick={handleCopy}
					aria-label={copied ? 'Copied code' : 'Copy code to clipboard'}
					title={copied ? 'Copied' : 'Copy code'}
				>
					{#if copied}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="var(--f-success)"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<polyline points="20 6 9 17 4 12" />
						</svg>
						<span class="f-code-copy-text">Copied</span>
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
							<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
						</svg>
						<span class="f-code-copy-text">Copy</span>
					{/if}
				</button>
			{/if}
		</div>
	{/if}

	<div
		class="f-code-body"
		style:max-height={maxHeight}
	>
		{#if showLineNumbers}
			<div class="f-code-lines" aria-hidden="true">
				{#each lines as _, i}
					<span>{i + 1}</span>
				{/each}
			</div>
		{/if}
		<pre class="f-code-pre"><code>{code}</code></pre>
	</div>
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-code-block {
			background: var(--f-sunken);
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-lg);
			overflow: hidden;
			box-sizing: border-box;
			font-family: var(--f-font-mono);
			position: relative;
		}

		.f-code-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: var(--f-space-xs) var(--f-space-md);
			background: var(--f-surface);
			border-bottom: 1px solid var(--f-border);
			font-family: var(--f-font-sans);
			font-size: var(--f-text-xs);
		}

		.f-code-header-left {
			display: flex;
			align-items: center;
			gap: var(--f-space-sm);
		}

		.f-code-dots {
			display: inline-flex;
			align-items: center;
			gap: 5px;
		}

		.f-code-dot {
			width: 8px;
			height: 8px;
			border-radius: 50%;
			background-color: var(--f-border-strong);
		}

		.f-code-filename {
			font-weight: 500;
			color: var(--f-text);
		}

		.f-code-lang {
			text-transform: uppercase;
			font-size: 10px;
			font-weight: 600;
			padding: 1px 5px;
			background: var(--f-hover);
			color: var(--f-text-muted);
			border-radius: var(--f-radius-xs);
			letter-spacing: 0.05em;
		}

		.f-code-copy {
			display: inline-flex;
			align-items: center;
			gap: 4px;
			padding: 3px 8px;
			background: transparent;
			border: 1px solid transparent;
			border-radius: var(--f-radius-sm);
			color: var(--f-text-muted);
			font-size: var(--f-text-xs);
			font-family: var(--f-font-sans);
			cursor: pointer;
			transition: background var(--f-duration-fast) var(--f-ease),
				color var(--f-duration-fast) var(--f-ease),
				border-color var(--f-duration-fast) var(--f-ease);
		}

		.f-code-copy:hover {
			background: var(--f-hover);
			color: var(--f-text);
			border-color: var(--f-border);
		}

		.f-code-copy:focus-visible {
			outline: 2px solid var(--f-ring);
			outline-offset: 1px;
		}

		.f-code-copy-text {
			font-weight: 500;
		}

		.f-code-body {
			display: flex;
			overflow-x: auto;
			padding: var(--f-space-md);
			font-size: var(--f-text-sm);
			line-height: 1.5;
		}

		.f-code-lines {
			display: flex;
			flex-direction: column;
			padding-right: var(--f-space-md);
			margin-right: var(--f-space-md);
			border-right: 1px solid var(--f-border-subtle);
			color: var(--f-text-subtle);
			user-select: none;
			text-align: right;
		}

		.f-code-pre {
			margin: 0;
			padding: 0;
			background: transparent;
			overflow-x: auto;
			flex: 1 1 auto;
			color: var(--f-text);
		}

		.f-code-pre code {
			font-family: inherit;
			font-size: inherit;
		}
	}
</style>
