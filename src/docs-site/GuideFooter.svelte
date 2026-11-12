<script lang="ts">
	import { Icon } from '@fractaldesign/icons';
	import { luArrowLeft, luArrowRight } from '@fractaldesign/icons/lucide';
	import { guides } from './nav.js';

	interface Props {
		/** The current guide's href. */
		href: string;
	}

	let { href }: Props = $props();

	const i = $derived(guides.findIndex((g) => g.href === href));
	const prev = $derived(i > 0 ? guides[i - 1] : null);
	const next = $derived(i >= 0 && i < guides.length - 1 ? guides[i + 1] : { href: '/components', title: 'Components', slug: 'components', summary: '' });
</script>

<nav class="grid-2 gap-md pt-xl bt-sub" aria-label="More guides">
	{#if prev}
		<a href={prev.href} class="link-parent box gap-xs border radius-bs pad-bs lift">
			<span class="row ycenter gap-xs text-sm text-muted"><Icon icon={luArrowLeft} /> Previous</span>
			<span class="link-title text-md weight-600">{prev.title}</span>
		</a>
	{:else}
		<span></span>
	{/if}
	{#if next}
		<a href={next.href} class="link-parent box xright gap-xs border radius-bs pad-bs lift">
			<span class="row ycenter gap-xs text-sm text-muted">Next <Icon icon={luArrowRight} /></span>
			<span class="link-title text-md weight-600">{next.title}</span>
		</a>
	{/if}
</nav>
