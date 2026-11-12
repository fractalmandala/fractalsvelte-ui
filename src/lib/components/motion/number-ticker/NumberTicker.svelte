<!-- @component A number that springs from zero to its value, as a count or as rolling digit columns. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { inView, SpringValue, vars } from '../../../motion/index.js';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		/** The number to display. The spring retargets whenever it changes. */
		value: number;
		/** Intl.NumberFormat options used to render the value (and the accessible name). */
		format?: Intl.NumberFormatOptions;
		/** Locale passed to Intl.NumberFormat, such as `"en-GB"` or `"de-DE"`. */
		locale?: string;
		/** `count` writes the formatted number; `slot` rolls each digit in its own column. */
		variant?: 'count' | 'slot';
		/** Text rendered immediately before the number, such as a currency symbol the formatter does not supply. */
		prefix?: string;
		/** Text rendered immediately after the number, such as a unit. */
		suffix?: string;
		/** Waits until the ticker is in view before springing from zero to `value`. */
		startOnView?: boolean;
	}

	let {
		value,
		format,
		locale,
		variant = 'count',
		prefix = '',
		suffix = '',
		startOnView = false,
		class: klass,
		...rest
	}: Props = $props();

	const spring = new SpringValue(0);
	let entered = $state(false);
	const started = $derived(!startOnView || entered);

	const formatter = $derived(new Intl.NumberFormat(locale, format));
	const name = $derived(`${prefix}${formatter.format(value)}${suffix}`);
	const display = $derived(`${prefix}${formatter.format(spring.current)}${suffix}`);
	const chars = $derived([...display]);

	const startWhenVisible = inView({
		once: true,
		onEnter() {
			entered = true;
		}
	});

	$effect(() => {
		if (started) void spring.set(value);
	});
</script>

<span
	class={['tabular-nums', klass]}
	aria-label={name}
	{@attach startOnView ? startWhenVisible : undefined}
	{...rest}
>
	{#if variant === 'slot'}
		<span aria-hidden="true">
			{#each chars as ch, i (i)}
				{#if ch >= '0' && ch <= '9'}
					<span class="slot" {@attach vars({ digit: Number(ch) })}>
						<span class="slot-reel spring">
							{#each '0123456789' as digit (digit)}
								<span>{digit}</span>
							{/each}
						</span>
					</span>
				{:else}
					<span>{ch}</span>
				{/if}
			{/each}
		</span>
	{:else}
		<span aria-hidden="true">{display}</span>
	{/if}
</span>
