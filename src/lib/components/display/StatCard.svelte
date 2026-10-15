<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type StatDeltaType = 'increase' | 'decrease' | 'neutral';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		title: string;
		value: string | number;
		delta?: string | number;
		deltaType?: StatDeltaType;
		timeframe?: string;
		class?: string;
		icon?: Snippet;
		sparkline?: Snippet;
		footer?: Snippet;
	}

	let {
		title,
		value,
		delta,
		deltaType,
		timeframe,
		class: className = '',
		icon,
		sparkline,
		footer,
		...restProps
	}: Props = $props();

	const computedDeltaType = $derived.by<StatDeltaType>(() => {
		if (deltaType) return deltaType;
		if (delta === undefined || delta === null) return 'neutral';
		const str = String(delta).trim();
		if (str.startsWith('+')) return 'increase';
		if (str.startsWith('-')) return 'decrease';
		const num = Number(delta);
		if (!isNaN(num)) {
			if (num > 0) return 'increase';
			if (num < 0) return 'decrease';
		}
		return 'neutral';
	});
</script>

<div
	class="f-stat-card {className}"
	{...restProps}
>
	<div class="f-stat-header">
		<span class="f-stat-title">{title}</span>
		{#if icon}
			<span class="f-stat-icon" aria-hidden="true">
				{@render icon()}
			</span>
		{/if}
	</div>

	<div class="f-stat-main">
		<div class="f-stat-info">
			<div class="f-stat-value">{value}</div>

			{#if delta !== undefined || timeframe}
				<div class="f-stat-meta">
					{#if delta !== undefined}
						<span
							class="f-stat-delta"
							data-type={computedDeltaType}
						>
							{#if computedDeltaType === 'increase'}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2.5"
									stroke-linecap="round"
									stroke-linejoin="round"
									aria-hidden="true"
								>
									<polyline points="18 15 12 9 6 15" />
								</svg>
							{:else if computedDeltaType === 'decrease'}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2.5"
									stroke-linecap="round"
									stroke-linejoin="round"
									aria-hidden="true"
								>
									<polyline points="6 9 12 15 18 9" />
								</svg>
							{/if}
							<span>{delta}</span>
						</span>
					{/if}

					{#if timeframe}
						<span class="f-stat-timeframe">{timeframe}</span>
					{/if}
				</div>
			{/if}
		</div>

		{#if sparkline}
			<div class="f-stat-sparkline" aria-hidden="true">
				{@render sparkline()}
			</div>
		{/if}
	</div>

	{#if footer}
		<div class="f-stat-footer">
			{@render footer()}
		</div>
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-stat-card {
			background: var(--f-surface);
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-lg);
			box-shadow: var(--f-shadow-xs);
			padding: var(--f-space-lg);
			box-sizing: border-box;
			font-family: inherit;
			display: flex;
			flex-direction: column;
			gap: var(--f-space-sm);
			transition: border-color var(--f-duration-fast) var(--f-ease),
				box-shadow var(--f-duration-fast) var(--f-ease);
		}

		.f-stat-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: var(--f-space-sm);
		}

		.f-stat-title {
			font-size: var(--f-text-sm);
			font-weight: 500;
			color: var(--f-text-muted);
		}

		.f-stat-icon {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			color: var(--f-text-subtle);
		}

		.f-stat-main {
			display: flex;
			align-items: flex-end;
			justify-content: space-between;
			gap: var(--f-space-md);
		}

		.f-stat-info {
			display: flex;
			flex-direction: column;
			gap: var(--f-space-2xs);
		}

		.f-stat-value {
			font-size: var(--f-text-3xl);
			font-weight: 700;
			line-height: 1.1;
			color: var(--f-text);
			letter-spacing: -0.02em;
		}

		.f-stat-meta {
			display: flex;
			align-items: center;
			gap: var(--f-space-xs);
			flex-wrap: wrap;
		}

		.f-stat-delta {
			display: inline-flex;
			align-items: center;
			gap: 2px;
			font-size: var(--f-text-xs);
			font-weight: 600;
			line-height: 1;
			padding: 2px 6px;
			border-radius: var(--f-radius-full);
		}

		.f-stat-delta[data-type='increase'] {
			background: var(--f-success-bg);
			color: var(--f-success-text);
		}

		.f-stat-delta[data-type='decrease'] {
			background: var(--f-danger-bg);
			color: var(--f-danger-text);
		}

		.f-stat-delta[data-type='neutral'] {
			background: var(--f-sunken);
			color: var(--f-text-muted);
		}

		.f-stat-timeframe {
			font-size: var(--f-text-xs);
			color: var(--f-text-subtle);
		}

		.f-stat-sparkline {
			flex-shrink: 0;
			max-width: 120px;
		}

		.f-stat-footer {
			margin-top: var(--f-space-xs);
			padding-top: var(--f-space-xs);
			border-top: 1px solid var(--f-border-subtle);
			font-size: var(--f-text-xs);
			color: var(--f-text-muted);
		}
	}
</style>
