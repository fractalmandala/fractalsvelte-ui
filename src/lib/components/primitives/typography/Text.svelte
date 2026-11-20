<!-- @component Body, lead, muted, large or small text, rendered as a p, span, div or similar via as. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLElement> {
		/** `body` is running copy, `lead` is the opening paragraph, `muted` is secondary, `large` and `small` change the scale. */
		look?: 'body' | 'lead' | 'muted' | 'large' | 'small';
		/** The element to render. @default 'p' */
		as?: 'p' | 'span' | 'div' | 'small' | 'strong' | 'em' | 'label';
		/** The text. */
		children?: Snippet;
	}

	let { look = 'body', as = 'p', class: className, children, ...rest }: Props = $props();

	const lookClass = {
		body: 'text-body',
		lead: 'page-desc text-secondary',
		muted: 'text-sm text-muted',
		large: 'text-lg weight-600',
		small: 'text-sm weight-500'
	} as const;
</script>

<svelte:element this={as} class={[lookClass[look], className]} {...rest}>
	{@render children?.()}
</svelte:element>
