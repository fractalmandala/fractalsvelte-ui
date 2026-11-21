<!-- @component A list whose items spring in, out and into their new positions as the data changes. -->

<script lang="ts" generics="T">
	import { tick, type Snippet } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import type {  Gap  } from '../../../internal/tokens.js';
	import { createFlip, springFly } from '../../../motion/index.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		items: T[];
		key: (item: T) => string;
		max?: number;
		reverse?: boolean;
		gap?: Gap;
		children?: Snippet<[T]>;
	}

	let { items, key: keyOf, max, reverse = false, gap = 'gap-sm', class: className, children, ...rest }: Props = $props();

	const flip = createFlip({ spring: 'snappy' });

	const visible = $derived.by(() => {
		let list = items;
		if (typeof max === 'number' && max >= 0 && list.length > max) {
			list = reverse ? list.slice(list.length - max) : list.slice(0, max);
		}
		return reverse ? [...list].reverse() : list;
	});

	$effect.pre(() => {
		void visible;
		flip.read();
	});

	$effect(() => {
		void visible;
		void tick().then(() => flip.play());
	});

	function leave(event: Event) {
		const el = event.currentTarget as HTMLElement;
		const parent = el.offsetParent as HTMLElement | null;
		const box = el.getBoundingClientRect();
		const frame = parent?.getBoundingClientRect();
		el.style.setProperty('--ox', String(box.left - (frame?.left ?? 0)));
		el.style.setProperty('--oy', String(box.top - (frame?.top ?? 0)));
		el.style.setProperty('--ow', String(box.width));
		el.classList.add('leaving');
	}
</script>

<div class={['relative box', gap, className]} role="list" {@attach flip.attach} {...rest}>
	{#each visible as item (keyOf(item))}
		<div
			class="motion"
			data-flip-id={keyOf(item)}
			role="listitem"
			in:springFly={{ y: 12, spring: 'snappy' }}
			out:springFly={{ y: -8, spring: 'snappy' }}
			onoutrostart={leave}
		>
			{@render children?.(item)}
		</div>
	{/each}
</div>
