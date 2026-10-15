<script lang="ts">
	import { themeState, type ThemeStyle } from '../../theme.svelte';

	interface Props {
		class?: string;
		showStyleSelector?: boolean;
	}

	let { class: className = '', showStyleSelector = true }: Props = $props();

	const styles: { id: ThemeStyle; label: string; dot: string }[] = [
		{ id: 'fractal', label: 'Fractal', dot: '#10b981' },
		{ id: 'pro', label: 'Pro UI', dot: '#6366f1' },
		{ id: 'beui', label: 'BeUI', dot: '#8b5cf6' },
		{ id: 'halaska', label: 'Halaska', dot: '#d97706' },
		{ id: 'cyber', label: 'Cyber', dot: '#06b6d4' }
	];
</script>

<div class="f-theme-cluster {className}">
	{#if showStyleSelector}
		<div class="f-theme-style-group" role="radiogroup" aria-label="Select theme design aesthetic">
			{#each styles as s}
				<button
					type="button"
					class="f-style-pill"
					class:is-active={themeState.style === s.id}
					onclick={() => themeState.setStyle(s.id)}
					title="{s.label} Theme"
				>
					<span class="f-style-dot" style="background: {s.dot};"></span>
					<span class="f-style-name">{s.label}</span>
				</button>
			{/each}
		</div>
	{/if}

	<button
		type="button"
		class="f-theme-toggle"
		onclick={() => themeState.toggle()}
		aria-label="Toggle theme mode"
		title="Switch between light and dark theme ({themeState.current} mode)"
	>
		{#if themeState.current === 'dark'}
			<!-- Sun icon -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<circle cx="12" cy="12" r="4" />
				<path d="M12 2v2" />
				<path d="M12 20v2" />
				<path d="m4.93 4.93 1.41 1.41" />
				<path d="m17.66 17.66 1.41 1.41" />
				<path d="M2 12h2" />
				<path d="M20 12h2" />
				<path d="m6.34 17.66-1.41 1.41" />
				<path d="m19.07 4.93-1.41 1.41" />
			</svg>
		{:else}
			<!-- Moon icon -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
			</svg>
		{/if}
	</button>
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-theme-cluster {
			display: inline-flex;
			align-items: center;
			gap: 0.5rem;
		}

		.f-theme-style-group {
			display: inline-flex;
			align-items: center;
			gap: 0.25rem;
			padding: 0.2rem;
			background: var(--f-sunken);
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-full);
		}

		.f-style-pill {
			display: inline-flex;
			align-items: center;
			gap: 0.35rem;
			padding: 0.25rem 0.6rem;
			font-size: var(--f-text-xs);
			font-weight: 500;
			color: var(--f-text-muted);
			background: transparent;
			border: none;
			border-radius: var(--f-radius-full);
			cursor: pointer;
			transition: all var(--f-duration-fast) var(--f-ease);
		}

		.f-style-pill:hover {
			color: var(--f-text);
			background: var(--f-hover);
		}

		.f-style-pill.is-active {
			color: var(--f-text);
			background: var(--f-surface);
			box-shadow: var(--f-shadow-xs);
			font-weight: 600;
		}

		.f-style-dot {
			width: 7px;
			height: 7px;
			border-radius: 50%;
			flex-shrink: 0;
		}

		.f-style-name {
			line-height: 1;
		}

		.f-theme-toggle {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 32px;
			height: 32px;
			padding: 0;
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-full);
			background: var(--f-surface);
			color: var(--f-text);
			cursor: pointer;
			transition: background var(--f-duration-fast) var(--f-ease),
				border-color var(--f-duration-fast) var(--f-ease),
				color var(--f-duration-fast) var(--f-ease);
			flex-shrink: 0;
		}

		.f-theme-toggle:hover {
			background: var(--f-hover);
			border-color: var(--f-border-strong);
			color: var(--f-primary);
		}

		.f-theme-toggle:focus-visible {
			outline: 2px solid var(--f-primary);
			outline-offset: 2px;
		}

		@media (max-width: 640px) {
			.f-style-name {
				display: none;
			}
			.f-style-pill {
				padding: 0.25rem;
			}
		}
	}
</style>
