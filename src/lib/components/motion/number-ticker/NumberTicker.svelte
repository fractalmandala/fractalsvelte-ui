<!-- @component A number that springs from zero to its value, as a count or as rolling digit columns. -->

<script lang="ts">
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { inView, SpringValue, vars } from '../../../motion/index.js';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		value: number;
		format?: Intl.NumberFormatOptions;
		locale?: string;
		form?: 'count' | 'slot';
		prefix?: string;
		suffix?: string;
		startOnView?: boolean;
	}

	let {
		value,
		format,
		locale,
		form = 'count',
		prefix = '',
		suffix = '',
		startOnView = false,
		class: className,
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
	class={['tabular-nums', className]}
	aria-label={name}
	{@attach startOnView ? startWhenVisible : undefined}
	{...rest}
>
	{#if form === 'slot'}
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
