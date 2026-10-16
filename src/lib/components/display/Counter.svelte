<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Size } from '../../types.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		value: number;
		prefix?: string;
		suffix?: string;
		decimals?: number;
		size?: Size;
		class?: string;
	}

	let {
		value = 0,
		prefix = '',
		suffix = '',
		decimals = 0,
		size = 'md',
		class: className = '',
		...restProps
	}: Props = $props();

	const formattedChars = $derived.by(() => {
		const str = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
		return str.split('');
	});
</script>

<div
	class="f-counter {className}"
	data-size={size}
	role="status"
	aria-live="polite"
	aria-label="{prefix}{value}{suffix}"
	{...restProps}
>
	{#if prefix}
		<span class="f-counter-affix">{prefix}</span>
	{/if}

	<div class="f-counter-digits">
		{#each formattedChars as char, idx (idx)}
			{#if char >= '0' && char <= '9'}
				{@const num = parseInt(char, 10)}
				<div class="f-digit-column">
					<div
						class="f-digit-ribbon"
						style="transform: translateY(-{num * 10}%);"
					>
						{#each Array(10) as _, digit (digit)}
							<span class="f-digit">{digit}</span>
						{/each}
					</div>
				</div>
			{:else}
				<span class="f-counter-symbol">{char}</span>
			{/if}
		{/each}
	</div>

	{#if suffix}
		<span class="f-counter-affix">{suffix}</span>
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-counter {
			display: inline-flex;
			align-items: baseline;
			font-family: var(--f-font-mono, monospace);
			font-weight: 700;
			color: var(--f-text);
			user-select: none;
			box-sizing: border-box;
		}

		.f-counter-digits {
			display: inline-flex;
			align-items: center;
			overflow: hidden;
			height: 1.2em;
		}

		.f-digit-column {
			position: relative;
			width: 0.65em;
			height: 1.2em;
			overflow: hidden;
			display: inline-block;
		}

		.f-digit-ribbon {
			display: flex;
			flex-direction: column;
			transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
		}

		.f-digit {
			height: 1.2em;
			display: flex;
			align-items: center;
			justify-content: center;
			line-height: 1;
		}

		.f-counter-symbol,
		.f-counter-affix {
			line-height: 1;
		}

		.f-counter-affix {
			color: var(--f-text-muted);
			font-size: 0.8em;
			margin: 0 0.15em;
		}

		/* Sizes */
		.f-counter[data-size='sm'] { font-size: var(--f-text-sm); }
		.f-counter[data-size='md'] { font-size: var(--f-text-xl); }
		.f-counter[data-size='lg'] { font-size: 2.25rem; }
		.f-counter[data-size='xl'] { font-size: 3.5rem; }
	}
</style>
