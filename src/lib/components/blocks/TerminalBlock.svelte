<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface TerminalLineItem {
		command?: string;
		output?: string;
		delay?: number;
	}

	interface Props extends HTMLAttributes<HTMLDivElement> {
		title?: string;
		lines?: (TerminalLineItem | string)[];
		prompt?: string;
		showControls?: boolean;
		allowCopy?: boolean;
		animated?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		title = 'bash',
		lines = [],
		prompt = '$ ',
		showControls = true,
		allowCopy = true,
		animated = false,
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	let copied = $state(false);

	const normalizedLines = $derived(
		lines.map((l) => (typeof l === 'string' ? { command: l } : l))
	);

	const allText = $derived(
		normalizedLines
			.map((l) => (l.command ? `${prompt}${l.command}` : '') + (l.output ? `\n${l.output}` : ''))
			.filter(Boolean)
			.join('\n')
	);

	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(allText);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch {}
	}
</script>

<div
	class="f-terminal-block {className}"
	data-animated={animated ? 'true' : undefined}
	{...restProps}
>
	<header class="f-terminal-header">
		{#if showControls}
			<div class="f-terminal-dots" aria-hidden="true">
				<span class="f-dot f-dot-close"></span>
				<span class="f-dot f-dot-min"></span>
				<span class="f-dot f-dot-max"></span>
			</div>
		{/if}

		<div class="f-terminal-title">{title}</div>

		{#if allowCopy}
			<button
				type="button"
				class="f-copy-btn"
				onclick={copyToClipboard}
				title="Copy terminal contents"
				aria-label="Copy terminal contents"
			>
				{#if copied}
					<svg class="f-copy-icon" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
					</svg>
					<span class="f-copy-label">Copied</span>
				{:else}
					<svg class="f-copy-icon" viewBox="0 0 20 20" fill="currentColor">
						<path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12a1.5 1.5 0 01.439 1.061V16.5A1.5 1.5 0 0115.5 18h-7A1.5 1.5 0 017 16.5v-13z" />
						<path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-1H7.5A2.5 2.5 0 015 13V6h-.5z" />
					</svg>
					<span class="f-copy-label">Copy</span>
				{/if}
			</button>
		{/if}
	</header>

	<div class="f-terminal-body">
		{#if normalizedLines.length > 0}
			<div class="f-terminal-lines">
				{#each normalizedLines as line}
					{#if line.command}
						<div class="f-line f-line-command">
							<span class="f-prompt">{prompt}</span>
							<span class="f-cmd-text">{line.command}</span>
						</div>
					{/if}
					{#if line.output}
						<pre class="f-line f-line-output">{line.output}</pre>
					{/if}
				{/each}
				<div class="f-line f-line-cursor">
					<span class="f-prompt">{prompt}</span>
					<span class="f-cursor"></span>
				</div>
			</div>
		{/if}

		{#if children}
			{@render children()}
		{/if}
	</div>
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-terminal-block {
			display: flex;
			flex-direction: column;
			width: 100%;
			border-radius: var(--f-radius-lg);
			background: #09090b;
			border: 1px solid var(--f-border);
			box-shadow: var(--f-shadow-xl);
			overflow: hidden;
			font-family: var(--f-font-mono);
			color: #f4f4f5;
		}

		.f-terminal-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0.6rem var(--f-space-md);
			background: #141417;
			border-bottom: 1px solid #27272a;
		}

		.f-terminal-dots {
			display: flex;
			align-items: center;
			gap: 0.4rem;
		}

		.f-dot {
			width: 0.7rem;
			height: 0.7rem;
			border-radius: var(--f-radius-full);
		}

		.f-dot-close {
			background: #ef4444;
		}

		.f-dot-min {
			background: #f59e0b;
		}

		.f-dot-max {
			background: #10b981;
		}

		.f-terminal-title {
			font-size: var(--f-text-xs);
			color: #94a3b8;
			font-weight: 500;
			letter-spacing: 0.02em;
		}

		.f-copy-btn {
			display: inline-flex;
			align-items: center;
			gap: 0.35rem;
			padding: 0.2rem 0.5rem;
			background: transparent;
			border: 1px solid transparent;
			border-radius: var(--f-radius-sm);
			color: #94a3b8;
			font-family: inherit;
			font-size: var(--f-text-xs);
			cursor: pointer;
			transition: all var(--f-duration-fast) var(--f-ease);
		}

		.f-copy-btn:hover {
			background: #27272a;
			color: #f4f4f5;
		}

		.f-copy-icon {
			width: 0.85rem;
			height: 0.85rem;
		}

		.f-terminal-body {
			padding: var(--f-space-lg);
			font-size: var(--f-text-sm);
			line-height: 1.5;
			overflow-x: auto;
		}

		.f-terminal-lines {
			display: flex;
			flex-direction: column;
			gap: 0.35rem;
		}

		.f-line {
			display: flex;
			align-items: baseline;
			margin: 0;
		}

		.f-prompt {
			color: var(--f-primary);
			margin-right: 0.5rem;
			user-select: none;
			font-weight: 600;
		}

		.f-cmd-text {
			color: #f4f4f5;
		}

		.f-line-output {
			font-family: inherit;
			color: #94a3b8;
			white-space: pre-wrap;
			padding-left: 1.25rem;
		}

		.f-cursor {
			display: inline-block;
			width: 0.5rem;
			height: 1em;
			background: var(--f-primary);
			vertical-align: middle;
			animation: f-blink 1s step-end infinite;
		}

		@keyframes f-blink {
			0%, 100% { opacity: 1; }
			50% { opacity: 0; }
		}
	}
</style>
